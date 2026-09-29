# -*- coding: utf-8 -*-
import sys
import io
import urllib.request
import json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

test_sentences = [
    ("Sentence #8", "जंगल से सूखी लकड़ियाँ चुनकर लाना कोई आसान काम नहीं है।"),
    ("Sentence #9", "शाम होते ही सारे पक्षी अपने-अपने घोंसलों की ओर लौट आए।"),
    ("Sentence #10", "गाँव के मेले में दूर-दूर से लोग अपनी कलाकृतियाँ बेचने आते हैं।")
]

for tag, s in test_sentences:
    req = urllib.request.Request(
        'http://127.0.0.1:5000/api/translate',
        data=json.dumps({'text': s, 'src_lang': 'hin_Deva', 'tgt_lang': 'sat_Olck'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"=== {tag} ===")
        print(f"INPUT: {s}")
        print(f"  -> Ol Chiki: {data.get('translated_text')}")
        print(f"  -> Odia:     {data.get('transliterations', {}).get('sat_Orya')}")
        print(f"  -> Deva:     {data.get('transliterations', {}).get('sat_Deva')}")
        print(f"  -> Latn:     {data.get('transliterations', {}).get('sat_Latn')}")
        print(f"  -> Latency:  {data.get('latency_ms', 0)}ms")
        print()
