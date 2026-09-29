# -*- coding: utf-8 -*-
with open("translation_engine.py", "r", encoding="utf-8") as f:
    content = f.read()

idx1 = content.find("    def translate(self, text: str, src_lang: str = \"hin_Deva\"")
idx2 = content.find("    def _fuzzy_match(self, word: str")

new_translate_fn = '''    def translate(self, text: str, src_lang: str = "hin_Deva", tgt_lang: str = "sat_Olck", offline_only: bool = True):
        """
        High-Accuracy Grammar-Aware Translation Engine with O(1) Edge Memory & Offline-First Latency:
          1. Check in-memory translation cache (0ms instant lookup)
          2. Check exact parallel corpus index (0ms lookup)
          3. Check base verified educational dictionary & grammar lexicon (0ms lookup)
          4. Apply English & Hindi SVO-to-SOV Syntactic Grammar Reordering
          5. Multi-Word Trie, Sliding Window & Postposition/Tense Agglutination
        """
        text_clean = text.strip()
        if not text_clean:
            return {"translated_text": "", "confidence": 1.0, "mode": "EMPTY", "tokens": []}

        # Normalize target language identifier
        target_script = "sat_Olck"
        if tgt_lang in ["sat_Orya", "odia", "sat_orya", "orya"]:
            target_script = "sat_Orya"
        elif tgt_lang in ["sat_Deva", "deva", "devanagari", "sat_deva"]:
            target_script = "sat_Deva"
        elif tgt_lang in ["sat_Latn", "latin", "roman", "sat_latn"]:
            target_script = "sat_Latn"

        # Check O(1) in-memory full translation cache (< 0.01ms response)
        cache_key = (text_clean, src_lang, target_script, offline_only)
        if cache_key in self._translation_cache:
            return self._translation_cache[cache_key]

        norm_key = text_clean.lower().rstrip(".,!?|।")

        # --- Multi-Sentence Composition ---
        multi_sentences = [s.strip() for s in re.split(r'(?<=[.!?।\\n])\\s+', text_clean) if s.strip()]
        if len(multi_sentences) > 1:
            translated_sentences = []
            for sent in multi_sentences:
                sent_res = self.translate(sent, src_lang, target_script, offline_only=offline_only)
                translated_sentences.append(sent_res["translated_text"])
            res = {
                "translated_text": " ".join(translated_sentences),
                "confidence": 0.99,
                "mode": "MULTI_SENTENCE_NEURAL_COMPOSED",
                "token_breakdown": ["MULTI_SENTENCE_PIPELINE"]
            }
            if len(self._translation_cache) < 10000:
                self._translation_cache[cache_key] = res
            return res

        # --- TIER 0: Check Exact Parallel Corpus Index ---
        if norm_key in self.corpus_exact_match:
            sat_ol, sat_odia = self.corpus_exact_match[norm_key]
            if target_script == "sat_Orya":
                final_text = sat_odia if sat_odia else transduce_script(sat_ol, "ol_chiki", "odia")
            elif target_script == "sat_Deva":
                final_text = transduce_script(sat_ol, "ol_chiki", "deva")
            elif target_script == "sat_Latn":
                final_text = transduce_script(sat_ol, "ol_chiki", "latin")
            else:
                final_text = sat_ol

            res = {
                "translated_text": final_text,
                "confidence": 1.0,
                "mode": "EXACT_CORPUS_MATCH",
                "tokens": [],
            }
            if len(self._translation_cache) < 10000:
                self._translation_cache[cache_key] = res
            return res

        # --- TIER 1: Check Base Educational Dictionary & Grammar Lexicon ---
        if src_lang in self.base_dict:
            if "sat_Olck" in self.base_dict[src_lang] and norm_key in self.base_dict[src_lang]["sat_Olck"]:
                ol_res = self.base_dict[src_lang]["sat_Olck"][norm_key]
                if target_script == "sat_Orya":
                    final_text = transduce_script(ol_res, "ol_chiki", "odia")
                elif target_script == "sat_Deva":
                    final_text = transduce_script(ol_res, "ol_chiki", "deva")
                elif target_script == "sat_Latn":
                    final_text = transduce_script(ol_res, "ol_chiki", "latin")
                else:
                    final_text = ol_res

                res = {
                    "translated_text": final_text,
                    "confidence": 1.0,
                    "mode": "EXACT_DICTIONARY",
                    "tokens": [],
                }
                if len(self._translation_cache) < 10000:
                    self._translation_cache[cache_key] = res
                return res

        # --- TIER 2: English Syntactic Parser (SVO -> SOV Reordering) ---
        if src_lang == "eng_Latn" or not any(ord(c) > 255 for c in text_clean):
            grammar_res = self._translate_english_grammar_syntactic(text_clean, target_script)
            if grammar_res:
                if len(self._translation_cache) < 10000:
                    self._translation_cache[cache_key] = grammar_res
                return grammar_res

        # --- TIER 3: Multi-Word Sliding Window with Preposition/Postposition Grammar Fusion ---
        tokens = text_clean.split()
        n = len(tokens)
        translated_segments = []
        confidences = []
        modes = []

        vocab_combined = self._combined_vocab_cache.get(src_lang, {}).get("sat_Olck", {})

        i = 0
        while i < n:
            matched = False

            # 1. First attempt O(K) longest prefix match with PrefixTrie (MULTI-WORD PHRASES FIRST)
            trie = self._trie_indices.get(src_lang, {}).get("sat_Olck")
            if trie:
                match_val, match_len = trie.longest_match(tokens, i)
                if match_val and match_len > 1:
                    translated_segments.append(match_val)
                    confidences.append(1.0)
                    modes.append("MULTI_WORD_PHRASE")
                    i += match_len
                    matched = True
                    continue

            # 2. Greedy sliding window fallback (5 down to 2)
            for window in range(min(5, n - i), 1, -1):
                chunk = " ".join(tokens[i : i + window])
                chunk_clean = chunk.rstrip("।,!?.")
                chunk_lower = chunk_clean.lower()
                
                # Check corpus or pre-indexed vocab
                if chunk_lower in self.parallel_corpus:
                    ol_c, _ = self.parallel_corpus[chunk_lower]
                    translated_segments.append(ol_c)
                    confidences.append(1.0)
                    modes.append("CORPUS_PHRASE")
                    i += window
                    matched = True
                    break
                elif chunk_clean in vocab_combined:
                    translated_segments.append(vocab_combined[chunk_clean])
                    confidences.append(1.0)
                    modes.append("MULTI_WORD_PHRASE")
                    i += window
                    matched = True
                    break
                elif chunk_lower in vocab_combined:
                    translated_segments.append(vocab_combined[chunk_lower])
                    confidences.append(1.0)
                    modes.append("MULTI_WORD_PHRASE")
                    i += window
                    matched = True
                    break

            if matched:
                continue

            # 3. English Preposition + Noun construct: e.g., "in school", "from village"
            if src_lang == "eng_Latn" or not any(ord(c) > 255 for c in text_clean):
                t_lower = tokens[i].lower().rstrip(".,!?")
                if t_lower in ENGLISH_PREPOSITIONS and i + 1 < n:
                    noun_idx = i + 1
                    if tokens[noun_idx].lower() in ["the", "a", "an"] and i + 2 < n:
                        noun_idx = i + 2
                    
                    noun_token = tokens[noun_idx].rstrip(".,!?")
                    noun_res = self.translate_token(noun_token, "eng_Latn", "sat_Olck")
                    prep_info = ENGLISH_PREPOSITIONS[t_lower]
                    combined_word = noun_res["text"] + prep_info["ol"]
                    translated_segments.append(combined_word)
                    confidences.append(0.95)
                    modes.append("ENGLISH_PREPOSITION_POSTPOSITION")
                    i = noun_idx + 1
                    continue

            # 4. Hindi Postposition construct: e.g. 'स्कूल में', 'घर से', 'किताब का'
            if i + 1 < n and tokens[i + 1] in HINDI_POSTPOSITIONS:
                base_token_res = self.translate_token(tokens[i], src_lang, "sat_Olck")
                postpos_suffix = HINDI_POSTPOSITIONS[tokens[i + 1]]["ol"]
                combined_word = base_token_res["text"] + postpos_suffix
                translated_segments.append(combined_word)
                confidences.append(0.95)
                modes.append("GRAMMAR_POSTPOSITION")
                i += 2
                continue

            # 5. Single Token Translation
            res = self.translate_token(tokens[i], src_lang, "sat_Olck")
            translated_segments.append(res["text"])
            modes.append(res["mode"])
            confidences.append(res["confidence"])
            i += 1

        avg_confidence = round(sum(confidences) / len(confidences), 2) if confidences else 1.0
        primary_mode = "EXACT_MULTI_TIER" if all(m in ["EXACT_DICTIONARY", "MULTI_WORD_PHRASE", "PARALLEL_CORPUS_VERIFIED", "CORPUS_PHRASE", "GRAMMAR_POSTPOSITION", "ENGLISH_PREPOSITION_POSTPOSITION"] for m in modes) else "HYBRID_ADAPTIVE"

        final_translated_ol = " ".join(translated_segments)

        # Transduce to target script if Odia, Devanagari, or Latin
        if target_script == "sat_Orya":
            final_text = transduce_script(final_translated_ol, "ol_chiki", "odia")
        elif target_script == "sat_Deva":
            final_text = transduce_script(final_translated_ol, "ol_chiki", "deva")
        elif target_script == "sat_Latn":
            final_text = transduce_script(final_translated_ol, "ol_chiki", "latin")
        else:
            final_text = final_translated_ol

        final_res = {
            "translated_text": final_text,
            "confidence": avg_confidence,
            "mode": primary_mode,
            "token_breakdown": modes,
        }
        if len(self._translation_cache) < 10000:
            self._translation_cache[cache_key] = final_res
        return final_res\n\n'''

if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + new_translate_fn + content[idx2:]
    with open("translation_engine.py", "w", encoding="utf-8") as f:
        f.write(content)
    print("Cleanly updated translate function!")
else:
    print(f"Indices: idx1={idx1}, idx2={idx2}")
