# -*- coding: utf-8 -*-
with open('src/engine/nlpEngine.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "const isWordEnd = (idx: number): boolean => {" in line:
        new_lines.append(line)
        new_lines.append("    if (idx >= n) return true;\n")
        new_lines.append("    return /[\s.,!?|।॥;:()[\\]{}\\-–—\"'’‘]/.test(text[idx]);\n")
        new_lines.append("  };\n")
        skip = True
    elif skip:
        if "};" in line:
            skip = False
    else:
        new_lines.append(line)

with open('src/engine/nlpEngine.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed nlpEngine.ts successfully!")
