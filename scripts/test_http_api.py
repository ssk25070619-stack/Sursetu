# -*- coding: utf-8 -*-
import sys
import io
import urllib.request
import json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

test_sentences = [
    'हमारे गाँव के चारों ओर हरे-भरे पहाड़ और घने जंगल हैं।',
    'किसान सुबह सूरज उगने से पहले ही खेतों में काम करने चले गए।',
    'नदी का पानी इतना साफ़ था कि नीचे के पत्थर साफ़ दिखाई दे रहे थे।',
    'इस बार अच्छी बारिश होने के कारण धान की फ़सल बहुत अच्छी हुई है।',
    'आँगन में लगे महुआ के पेड़ के नीचे बच्चे खेल रहे हैं।',
    'बाज़ार से लौटते समय अचानक तेज़ आंधी और बारिश शुरू हो गई।'
]

for s in test_sentences:
    req = urllib.request.Request(
        'http://127.0.0.1:5000/api/translate',
        data=json.dumps({'text': s, 'src_lang': 'hin_Deva', 'tgt_lang': 'sat_Olck'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"INPUT: {s}")
        print(f"  -> Ol Chiki: {data.get('translated_text')}")
        print(f"  -> Odia:     {data.get('transliterations', {}).get('sat_Orya')}")
        print(f"  -> Deva:     {data.get('transliterations', {}).get('sat_Deva')}")
        print(f"  -> Latn:     {data.get('transliterations', {}).get('sat_Latn')}")
        print(f"  -> Mode:     {data.get('mode')}")
        print()
