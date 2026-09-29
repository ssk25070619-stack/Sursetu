"""
Comprehensive Universal Coverage Test Suite for SurSetu
Testing:
1. Animacy & Genitive Agreement (Animate vs Inanimate)
2. Causative Verbs (-वाना, -लाना, -सुलाना)
3. Participles (-कर -> ᱠᱟᱛᱮ, -ते हुए -> ᱛᱩᱞᱩᱡ)
4. Modals (चाहिए -> ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ, सकता है -> ᱫᱟᱲᱮᱭᱟᱜᱼᱟ)
5. Prepositions / Postpositions (बिना -> ᱵᱮᱜᱚᱨ)
6. Idioms & Proverbs
7. Homonyms & Disambiguation
8. Multi-domain Sentences
"""
import sys
import os
import json
import urllib.request

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import translation_engine

TEST_CASES = [
    ("Homonym: सोना (Gold vs Sleep)", "इतना महंगा सोना खरीदकर भी वह रात को चैन से सोना भूल गया।"),
    ("Homonym: आम (Common vs Mango)", "यह कोई आम बात नहीं है कि इस मौसम में इतने मीठे आम मिल रहे हैं।"),
    ("Homonym: फल (Reward vs Fruit)", "मेहनत का फल हमेशा मीठा होता है।"),
    ("Homonym: हार (Defeat vs Garland)", "उसने खेल में हार मानी और उसे फूलों का हार पहनाया गया।"),
    ("Homonym: पत्र (Letter vs Leaf)", "उसने मुझे पत्र लिखा कि पेड़ के सारे पत्र झड़ चुके हैं।"),
    ("Homonym: उत्तर (North vs Answer)", "उसने उत्तर दिशा की ओर देखकर प्रश्न का सही उत्तर दिया।"),
    ("Syntax: बिना + Noun", "बिना चीनी की चाय अच्छी नहीं लगती।"),
    ("Idiom: नौ दो ग्यारह", "पुलिस को देखते ही चोर नौ दो ग्यारह हो गए।"),
    ("Idiom: बाएँ हाथ का खेल", "यह काम मेरे लिए बाएँ हाथ का खेल है।"),
    ("Idiom: बंदर अदरक", "बंदर क्या जाने अदरक का स्वाद।"),
    ("Idiom: पेट में चूहे", "मेरे पेट में चूहे कूद रहे हैं।"),
    ("Domain: Agriculture & Nature", "किसान सुबह सूरज उगने से पहले ही खेतों में काम करने चले गए।"),
    ("Domain: Health & Hospital", "कृपया सबसे नज़दीकी अस्पताल का रास्ता बताइए।"),
    ("Domain: Technology & AI", "कृत्रिम बुद्धिमत्ता स्वास्थ्य, कृषि और शिक्षा में क्रांति ला रही है।"),
    ("Domain: Public Announcement", "यात्रीगण कृपया ध्यान दें, ट्रेन निर्धारित समय से दो घंटे देरी से चल रही है।")
]

def run():
    print("=" * 80)
    print("  🌟 UNIVERSAL SANTALI TRANSLATION ENGINE - COMPREHENSIVE TEST")
    print("=" * 80)
    
    engine = translation_engine.UnsupervisedSantaliTranslator()
    
    for category, text in TEST_CASES:
        res = engine.translate(text, "hin_Deva", "sat_Olck")
        odia_res = engine.translate(text, "hin_Deva", "sat_Orya")
        latin_res = engine.translate(text, "hin_Deva", "sat_Latn")
        
        print(f"\n[{category}]")
        print(f"  HI:  {text}")
        print(f"  OL:  {res['translated_text']}")
        print(f"  OR:  {odia_res['translated_text']}")
        print(f"  RO:  {latin_res['translated_text']}")
        print(f"  Mode: {res['mode']} | Conf: {res['confidence']}")

if __name__ == "__main__":
    run()
