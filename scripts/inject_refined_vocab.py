# -*- coding: utf-8 -*-
from refine_vocab_particles import additional_vocab

with open("translation_engine.py", "r", encoding="utf-8") as f:
    code = f.read()

lines = []
for k, v in additional_vocab.items():
    lines.append(f'    "{k}": {{"ol": "{v}", "odia": "", "deva": ""}},')

snippet = "\n".join(lines) + "\n"

target = "GRAMMAR_LEXICON = {\n"
if target in code:
    code = code.replace(target, target + snippet, 1)
    with open("translation_engine.py", "w", encoding="utf-8") as f:
        f.write(code)
    print("Injected additional vocab into GRAMMAR_LEXICON successfully!")
