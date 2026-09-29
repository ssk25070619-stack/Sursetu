# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from master_50_knowledge_base import IDIOMS_AND_PROVERBS, MASTER_VOCABULARY

with open("src/data/corpus.ts", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.rfind("};")
if idx != -1:
    entries = []
    for k, v in IDIOMS_AND_PROVERBS.items():
        clean_k = k.lower().replace("'", "\\'")
        clean_v = v.replace("'", "\\'")
        entries.append(f"  '{clean_k}': {{\n    sat_Olck: '{clean_v}',\n    sat_Orya: '',\n    sat_Deva: '',\n    sat_Latn: ''\n  }},")
    
    for k, v in MASTER_VOCABULARY.items():
        clean_k = k.lower().replace("'", "\\'")
        clean_v = v.replace("'", "\\'")
        entries.append(f"  '{clean_k}': {{\n    sat_Olck: '{clean_v}',\n    sat_Orya: '',\n    sat_Deva: '',\n    sat_Latn: ''\n  }},")

    addition = "\n" + "\n".join(entries) + "\n};\n"
    new_content = content[:idx].rstrip() + addition
    with open("src/data/corpus.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Synced Master 50 Knowledge Base into src/data/corpus.ts!")
