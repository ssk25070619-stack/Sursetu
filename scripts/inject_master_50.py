# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from master_50_knowledge_base import IDIOMS_AND_PROVERBS, MASTER_VOCABULARY

with open("translation_engine.py", "r", encoding="utf-8") as f:
    code = f.read()

lines = []
for k, v in IDIOMS_AND_PROVERBS.items():
    lines.append(f'    "{k}": {{"ol": "{v}", "odia": "", "deva": ""}},')

for k, v in MASTER_VOCABULARY.items():
    lines.append(f'    "{k}": {{"ol": "{v}", "odia": "", "deva": ""}},')

snippet = "\n".join(lines) + "\n"

target = "GRAMMAR_LEXICON = {\n"
if target in code:
    code = code.replace(target, target + snippet, 1)
    with open("translation_engine.py", "w", encoding="utf-8") as f:
        f.write(code)
    print("Injected Master 50 Knowledge Base into GRAMMAR_LEXICON successfully!")
else:
    print("Could not find GRAMMAR_LEXICON target")
