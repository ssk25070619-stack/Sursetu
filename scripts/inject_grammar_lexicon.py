# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_section1_animacy import NEW_LEXICON

with open("translation_engine.py", "r", encoding="utf-8") as f:
    code = f.read()

lines = []
for k, v in NEW_LEXICON.items():
    ol = v["ol"]
    odia = v.get("odia", "")
    lines.append(f'    "{k}": {{"ol": "{ol}", "odia": "{odia}", "deva": ""}},')

snippet = "\n".join(lines) + "\n"

target = "GRAMMAR_LEXICON = {\n"
if target in code:
    code = code.replace(target, target + snippet, 1)
    with open("translation_engine.py", "w", encoding="utf-8") as f:
        f.write(code)
    print("Injected into GRAMMAR_LEXICON in translation_engine.py successfully!")
else:
    print("Could not find GRAMMAR_LEXICON target")
