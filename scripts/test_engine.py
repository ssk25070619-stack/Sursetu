# -*- coding: utf-8 -*-
import sys
import os
import io

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from translation_engine import UnsupervisedSantaliTranslator

engine = UnsupervisedSantaliTranslator()
test_sentences = [
    ("Sentence #13", "इतना महंगा सोना खरीदकर भी वह रात को चैन से सोना भूल गया।"),
    ("Sentence #14", "यह कोई आम बात नहीं है कि इस मौसम में इतने मीठे आम मिल रहे हैं।")
]

for tag, s in test_sentences:
    res_ol = engine.translate(s, "hin_Deva", "sat_Olck")
    res_odia = engine.translate(s, "hin_Deva", "sat_Orya")
    res_deva = engine.translate(s, "hin_Deva", "sat_Deva")
    res_latn = engine.translate(s, "hin_Deva", "sat_Latn")
    print(f"=== {tag} ===")
    print(f"INPUT: {s}")
    print(f"  -> Ol Chiki: {res_ol['translated_text']}")
    print(f"  -> Odia:     {res_odia['translated_text']}")
    print(f"  -> Deva:     {res_deva['translated_text']}")
    print(f"  -> Latn:     {res_latn['translated_text']}")
    print(f"  -> Mode:     {res_ol['mode']}")
    print()
