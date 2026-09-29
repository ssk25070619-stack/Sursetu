# -*- coding: utf-8 -*-
import sys
import os
import io

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from translation_engine import UnsupervisedSantaliTranslator

engine = UnsupervisedSantaliTranslator()

benchmark_suite = [
    ("Homonym #13 (सोना)", "इतना महंगा सोना खरीदकर भी वह रात को चैन से सोना भूल गया।"),
    ("Homonym #14 (आम)", "यह कोई आम बात नहीं है कि इस मौसम में इतने मीठे आम मिल रहे हैं।"),
    ("Homonym #15 (फल)", "मेहनत का फल हमेशा मीठा होता है।"),
    ("Homonym #16 (हार)", "उसने खेल में हार मानी और उसे फूलों का हार पहनाया गया।"),
    ("Homonym #17 (पत्र)", "उसने मुझे पत्र लिखा कि पेड़ के सारे पत्र झड़ चुके हैं।"),
    ("Homonym #18 (उत्तर)", "उसने उत्तर दिशा की ओर देखकर प्रश्न का सही उत्तर दिया।"),
    ("Idiom #31 (नौ दो ग्यारह)", "पुलिस को देखते ही चोर नौ दो ग्यारह हो गए।"),
    ("Idiom #32 (बाएँ हाथ का खेल)", "यह काम मेरे लिए बाएँ हाथ का खेल है।"),
    ("Idiom #37 (बंदर अदरक)", "बंदर क्या जाने अदरक का स्वाद।"),
    ("Idiom #39 (पेट में चूहे)", "मेरे पेट में चूहे कूद रहे हैं।"),
    ("Syntax #25 (बिना)", "बिना चीनी की चाय अच्छी नहीं लगती।")
]

print("=" * 80)
print("  🚀 MASTER 50 SUITE VERIFICATION REPORT")
print("=" * 80)

for tag, s in benchmark_suite:
    res_ol = engine.translate(s, "hin_Deva", "sat_Olck")
    res_latn = engine.translate(s, "hin_Deva", "sat_Latn")
    print(f"[{tag}]")
    print(f"  HI: {s}")
    print(f"  OL: {res_ol['translated_text']}")
    print(f"  RO: {res_latn['translated_text']}")
    print()
