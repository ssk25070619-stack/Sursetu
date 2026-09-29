# -*- coding: utf-8 -*-
with open('translation_engine.py', 'r', encoding='utf-8') as f:
    text = f.read()

idx1 = text.find('def deva_to_ol_chiki_barakhadi(text: str) -> str:')
idx2 = text.find('def transduce_english_to_ol_chiki(text: str) -> str:')

new_fn = """def deva_to_ol_chiki_barakhadi(text: str) -> str:
    \"\"\"
    Syllabic Devanagari to Ol Chiki Barakhadi Transducer with Hindi Schwa Deletion:
      - Consonants inside words take inherent schwa vowel 'ᱚ'.
      - Word-final consonants DROP the schwa (Schwa Deletion Rule: खेल -> ᱠᱷᱮᱞ, आँगन -> ᱟᱸᱜᱚᱱ).
      - Chandrabindu (ँ U+0901) & Anusvara (ं U+0902) are strictly mapped to Mu Tudag (ᱸ U+1C78).
    \"\"\"
    if not text:
        return ""
    res = []
    i = 0
    n = len(text)

    def is_word_end(idx: int) -> bool:
        if idx >= n:
            return True
        return text[idx] in " \\t\\n\\r.,!?|।॥;:()[]{}-–—\\"'’‘"

    while i < n:
        # 1. Check conjuncts first (क्ष, त्र, ज्ञ, श्र)
        if i + 1 < n and text[i : i + 2] in DEVA_CONJUNCTS_OL:
            matched_ol = DEVA_CONJUNCTS_OL[text[i : i + 2]]
            i += 2
            # Check if followed by dependent matra or halant
            if i < n and text[i] in DEVA_MATRAS_OL:
                matra_char = text[i]
                matra_ol = DEVA_MATRAS_OL[matra_char]
                i += 1
                if i < n and text[i] in ["ं", "ँ"]:
                    res.append(matched_ol + (matra_ol if matra_char not in ["ं", "ँ"] else "ᱚ") + "ᱸ")
                    i += 1
                else:
                    if matra_char in ["ं", "ँ"]:
                        res.append(matched_ol + "ᱚᱸ")
                    else:
                        res.append(matched_ol + matra_ol)
            elif i < n and text[i] == "्":
                res.append(matched_ol)
                i += 1
            else:
                if is_word_end(i):
                    res.append(matched_ol)
                else:
                    res.append(matched_ol + "ᱚ")
            continue

        # 2. Check 2-char combinations (consonant + nukta: ड़, ढ़, क़, ख़, ग़, ज़, फ़ or indep vowels अं, अः)
        if i + 1 < n and text[i : i + 2] in DEVA_CONSONANTS_OL:
            matched_ol = DEVA_CONSONANTS_OL[text[i : i + 2]]
            i += 2
            if i < n and text[i] in DEVA_MATRAS_OL:
                matra_char = text[i]
                matra_ol = DEVA_MATRAS_OL[matra_char]
                i += 1
                if i < n and text[i] in ["ं", "ँ"]:
                    res.append(matched_ol + (matra_ol if matra_char not in ["ं", "ँ"] else "ᱚ") + "ᱸ")
                    i += 1
                else:
                    if matra_char in ["ं", "ँ"]:
                        res.append(matched_ol + "ᱚᱸ")
                    else:
                        res.append(matched_ol + matra_ol)
            elif i < n and text[i] == "्":
                res.append(matched_ol)
                i += 1
            else:
                if is_word_end(i):
                    res.append(matched_ol)
                else:
                    res.append(matched_ol + "ᱚ")
            continue

        if i + 1 < n and text[i : i + 2] in DEVA_INDEP_VOWELS_OL:
            v_ol = DEVA_INDEP_VOWELS_OL[text[i : i + 2]]
            i += 2
            if i < n and text[i] in ["ं", "ँ"]:
                res.append(v_ol + "ᱸ")
                i += 1
            else:
                res.append(v_ol)
            continue

        # 3. Check single consonant
        ch = text[i]
        if ch in DEVA_CONSONANTS_OL:
            matched_ol = DEVA_CONSONANTS_OL[ch]
            i += 1
            # Look ahead for matra or halant
            if i < n and text[i] in DEVA_MATRAS_OL:
                matra_char = text[i]
                matra_ol = DEVA_MATRAS_OL[matra_char]
                i += 1
                if i < n and text[i] in ["ं", "ँ"]:
                    res.append(matched_ol + (matra_ol if matra_char not in ["ं", "ँ"] else "ᱚ") + "ᱸ")
                    i += 1
                else:
                    if matra_char in ["ं", "ँ"]:
                        res.append(matched_ol + "ᱚᱸ")
                    else:
                        res.append(matched_ol + matra_ol)
            elif i < n and text[i] == "्":
                res.append(matched_ol)
                i += 1
            else:
                if is_word_end(i):
                    res.append(matched_ol)
                else:
                    res.append(matched_ol + "ᱚ")
            continue

        # 4. Check independent vowel
        if ch in DEVA_INDEP_VOWELS_OL:
            v_ol = DEVA_INDEP_VOWELS_OL[ch]
            i += 1
            if i < n and text[i] in ["ं", "ँ"]:
                res.append(v_ol + "ᱸ")
                i += 1
            else:
                res.append(v_ol)
            continue

        # 5. Handle standalone Chandrabindu (ँ) or Anusvara (ं)
        if ch in ["ं", "ँ"]:
            res.append("ᱸ")
            i += 1
            continue

        # 6. Fallback dictionary map or pass-through
        if ch in DEVA_TO_OL_CHIKI_MAP:
            res.append(DEVA_TO_OL_CHIKI_MAP[ch])
        else:
            res.append(ch)
        i += 1

    return "".join(res)"""

if idx1 != -1 and idx2 != -1:
    text = text[:idx1] + new_fn + "\n\n\n" + text[idx2:]
    with open('translation_engine.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Cleanly replaced deva_to_ol_chiki_barakhadi!")
else:
    print(f"Indices: idx1={idx1}, idx2={idx2}")
