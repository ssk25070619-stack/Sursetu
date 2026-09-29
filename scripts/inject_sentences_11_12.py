# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_sentences_11_12 import SENTENCES_VOCAB

with open("translation_engine.py", "r", encoding="utf-8") as f:
    code = f.read()

lines = []
for k, v in SENTENCES_VOCAB.items():
    ol = v["ol"]
    odia = v.get("odia", "")
    lines.append(f'    "{k}": {{"ol": "{ol}", "odia": "{odia}", "deva": ""}},')

snippet = "\n".join(lines) + "\n"

target = "GRAMMAR_LEXICON = {\n"
if target in code:
    code = code.replace(target, target + snippet, 1)
    with open("translation_engine.py", "w", encoding="utf-8") as f:
        f.write(code)
    print("Injected sentences 11 & 12 into GRAMMAR_LEXICON successfully!")
else:
    print("Could not find GRAMMAR_LEXICON target")
