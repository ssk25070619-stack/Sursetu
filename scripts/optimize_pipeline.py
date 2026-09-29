# -*- coding: utf-8 -*-
"""
Pipeline optimizer:
1. Clean _load_memory to reject any entries with non-Indic/non-Olchiki characters (like Arabic/Urdu).
2. Move Multi-Word Trie and Sliding Window parsing directly in translate() before any raw memory sentence dump.
"""
import re

def optimize():
    with open("translation_engine.py", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update _load_memory
    old_load_mem = '''        if os.path.exists(MEMORY_FILE_PATH):
            try:
                with open(MEMORY_FILE_PATH, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {"hin_Deva": {"sat_Olck": {}, "sat_Orya": {}}, "eng_Latn": {"sat_Olck": {}, "sat_Orya": {}}}'''

    new_load_mem = '''        if os.path.exists(MEMORY_FILE_PATH):
            try:
                with open(MEMORY_FILE_PATH, "r", encoding="utf-8") as f:
                    raw_data = json.load(f)
                    cleaned = {"hin_Deva": {"sat_Olck": {}, "sat_Orya": {}}, "eng_Latn": {"sat_Olck": {}, "sat_Orya": {}}}
                    for lang, tgt_map in raw_data.items():
                        if lang not in cleaned:
                            cleaned[lang] = {}
                        for t_lang, words in tgt_map.items():
                            if t_lang not in cleaned[lang]:
                                cleaned[lang][t_lang] = {}
                            for k, v in words.items():
                                # Reject noisy entries containing Arabic/Urdu or broken tokens
                                if isinstance(v, str) and not re.search(r"[\\u0600-\\u06FF]", v) and len(v.strip()) > 0:
                                    cleaned[lang][t_lang][k] = v
                    return cleaned
            except Exception:
                pass
        return {"hin_Deva": {"sat_Olck": {}, "sat_Orya": {}}, "eng_Latn": {"sat_Olck": {}, "sat_Orya": {}}}'''

    content = content.replace(old_load_mem, new_load_mem)

    # 2. In translate(), remove raw memory full-sentence dump so multi-word sliding window does authentic translation
    old_mem_check = '''        if src_lang in self.memory:
            if "sat_Olck" in self.memory[src_lang] and norm_key in self.memory[src_lang]["sat_Olck"]:
                ol_res = self.memory[src_lang]["sat_Olck"][norm_key]
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
                    "confidence": 0.99,
                    "mode": "LEARNED_MEMORY",
                    "tokens": [],
                }
                if len(self._translation_cache) < 10000:
                    self._translation_cache[cache_key] = res
                return res'''

    new_mem_check = '''        # (Verified base dictionary checked above. Multi-word & syntactic pipeline runs next.)'''

    content = content.replace(old_mem_check, new_mem_check)

    with open("translation_engine.py", "w", encoding="utf-8") as f:
        f.write(content)

    print("Pipeline successfully optimized!")

if __name__ == "__main__":
    optimize()
