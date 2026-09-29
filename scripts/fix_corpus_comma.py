# -*- coding: utf-8 -*-
with open("src/data/corpus.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "'नौ दो ग्यारह हो गए': {" in lines[i]:
        if i > 0 and not lines[i-1].strip().endswith(","):
            lines[i-1] = lines[i-1].rstrip() + ",\n"
        break

with open("src/data/corpus.ts", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Fixed comma in src/data/corpus.ts!")
