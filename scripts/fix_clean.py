# -*- coding: utf-8 -*-
with open('translation_engine.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = '    return "".join(res)matra_ol)'
idx1 = text.find(target)
if idx1 != -1:
    idx2 = text.find('def transduce_english_to_ol_chiki', idx1)
    if idx2 != -1:
        text = text[:idx1] + '    return "".join(res)\n\n\n' + text[idx2:]
        with open('translation_engine.py', 'w', encoding='utf-8') as f:
            f.write(text)
        print('Fixed duplicate block successfully!')
    else:
        print('Could not find idx2')
else:
    print('Could not find target')
