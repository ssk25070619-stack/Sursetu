"""
SurSetu - Comprehensive NIPUN Bharat FLN Study Material & Worksheet Generator
---------------------------------------------------------------------------------
Module: Auto-Generated Offline Primary-School Worksheets & Curriculum Resources
Supports:
  - Santali (Ol Chiki ᱚᱞ ᱪᱤᱠᱤ, Odia Script ଓଡ଼ିଆ, Devanagari संताली, Latin)
  - Ho (Devanagari & Warang Chiti ᱦᱳ / हो)
  - Mundari (Devanagari & Mundari Bani ᱢᱩᱱᱰᱟᱨᱤ / मुंडारी)
  - Hindi (हिन्दी) & English

NIPUN Bharat FLN Study Material Types:
  1. Counting & Number Recognition (Ol Chiki ᱐-᱙, Odia ୦-୯, Devanagari ०-९)
  2. Word & Picture Matching (Randomized Pairings + Teacher Key)
  3. Visual Bilingual Flashcards (with illustrations, scripts, phonetics)
  4. Alphabet & Script Tracing Sheets (Ol Chiki letters ᱚ, ᱛ, ᱜ, ᱝ, ᱞ...)
  5. Fill-in-the-Blanks / Sentence Practice (Grade 1-3 FLN)
  6. Teacher Bilingual Lesson Scripts (Morning circle, Attendance, Activity)
  7. Bilingual Tribal Children's Folk Rhymes & Song Cards
  8. NIPUN Bharat Diagnostic Assessment Prompts & Rubrics
"""

import argparse
import json
import os
import random
import sys

# Reconfigure stdout for Windows terminal UTF-8 rendering
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

try:
    from translation_engine import transduce_script
except ImportError:
    transduce_script = None

MEMORY_FILE = os.path.join(PROJECT_ROOT, "datasets", "learned_memory.json")
DICT_FILE = os.path.join(PROJECT_ROOT, "datasets", "santali_dictionary.json")

# Numerals across scripts
DIGITS_MAP = {
    "sat_Olck": ["᱐", "᱑", "᱒", "᱓", "᱔", "᱕", "᱖", "᱗", "᱘", "᱙"],
    "sat_Orya": ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"],
    "sat_Deva": ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    "hoc_Deva": ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    "unr_Deva": ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    "hin_Deva": ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    "eng_Latn": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
}

# Rich Multi-Category Educational Lexicon
EXPANDED_VOCAB_BANK = [
    # --- Category: School & Education ---
    {"hin": "शिक्षक", "sat_olck": "ᱢᱟᱪᱮᱛ", "sat_orya": "ମାଚେତ", "sat_deva": "माचेत", "hoc_deva": "माचेत", "unr_deva": "माचेत", "eng": "Teacher", "phonetic": "Machet", "icon": "👨‍🏫", "category": "School"},
    {"hin": "शिक्षिका", "sat_olck": "ᱢᱟᱪᱮᱛᱟᱹᱱᱤ", "sat_orya": "ମାଚେତନି", "sat_deva": "माचेतअ‍ॅनी", "hoc_deva": "माचेतअ‍ॅनी", "unr_deva": "माचेतअ‍ॅनी", "eng": "Teacher (F)", "phonetic": "Machet-ani", "icon": "👩‍🏫", "category": "School"},
    {"hin": "छात्र", "sat_olck": "ᱪᱮᱛᱮᱫᱤᱭᱟᱹ", "sat_orya": "ଚେତେଦିୟା", "sat_deva": "चेतेदियअ‍ॅ", "hoc_deva": "चेतेदया", "unr_deva": "इतुनको", "eng": "Student", "phonetic": "Chetediya", "icon": "🧑‍🎓", "category": "School"},
    {"hin": "स्कूल", "sat_olck": "ᱤᱛᱩᱱ ᱟᱥᱲᱟ", "sat_orya": "ଇତୁନ ଆସଡ଼ା", "sat_deva": "इतुन आसड़ा", "hoc_deva": "इतुन आथड़ा", "unr_deva": "इतुन ओड़ाः", "eng": "School", "phonetic": "Itun Asra", "icon": "🏫", "category": "School"},
    {"hin": "किताब", "sat_olck": "ᱯᱩᱛᱷᱤ", "sat_orya": "ପୁଥି", "sat_deva": "पुथी", "hoc_deva": "पुथी", "unr_deva": "पुथी", "eng": "Book", "phonetic": "Puthi", "icon": "📖", "category": "School"},
    {"hin": "कलम", "sat_olck": "ᱠᱚᱞᱚᱢ", "sat_orya": "କଲମ", "sat_deva": "कोलोम", "hoc_deva": "कोलोम", "unr_deva": "कोलोम", "eng": "Pen", "phonetic": "Kolom", "icon": "🖊️", "category": "School"},
    {"hin": "कापी", "sat_olck": "ᱚᱞ ᱯᱩᱛᱷᱤ", "sat_orya": "ଅଲ ପୁଥି", "sat_deva": "ओल पुथी", "hoc_deva": "ओल पुथी", "unr_deva": "ओल पुथी", "eng": "Notebook", "phonetic": "Ol Puthi", "icon": "📓", "category": "School"},
    {"hin": "पेंसिल", "sat_olck": "ᱯᱮᱱᱥᱤᱞ", "sat_orya": "ପେନସିଲ", "sat_deva": "पेन्सिल", "hoc_deva": "पेन्सिल", "unr_deva": "पेन्सिल", "eng": "Pencil", "phonetic": "Pensil", "icon": "✏️", "category": "School"},
    {"hin": "गणित", "sat_olck": "ᱞᱮᱠᱷᱟ", "sat_orya": "ଲେଖା", "sat_deva": "लेखा", "hoc_deva": "लेखा", "unr_deva": "लेखा", "eng": "Math", "phonetic": "Lekha", "icon": "📐", "category": "School"},
    {"hin": "भाषा", "sat_olck": "ᱯᱟᱹᱨᱥᱤ", "sat_orya": "ପାର୍ସି", "sat_deva": "पारसी", "hoc_deva": "पारसी", "unr_deva": "काजी", "eng": "Language", "phonetic": "Parsi", "icon": "🗣️", "category": "School"},

    # --- Category: Animals & Birds ---
    {"hin": "हाथी", "sat_olck": "ᱦᱟᱹᱛᱤ", "sat_orya": "ହାତି", "sat_deva": "हाती", "hoc_deva": "हाती", "unr_deva": "हाती", "eng": "Elephant", "phonetic": "Hati", "icon": "🐘", "category": "Animals"},
    {"hin": "बाघ", "sat_olck": "ᱛᱟᱹᱨᱩᱵ", "sat_orya": "ତାରୁବ", "sat_deva": "तारुब", "hoc_deva": "कुला", "unr_deva": "कुला", "eng": "Tiger", "phonetic": "Tarub", "icon": "🐅", "category": "Animals"},
    {"hin": "गाय", "sat_olck": "ᱜᱟᱹᱭ", "sat_orya": "ଗାୟ", "sat_deva": "गई", "hoc_deva": "गाई", "unr_deva": "उरीः", "eng": "Cow", "phonetic": "Gayi", "icon": "🐄", "category": "Animals"},
    {"hin": "बैल", "sat_olck": "ᱰᱟᱝᱜᱽᱨᱟ", "sat_orya": "ଡାଙ୍ଗରା", "sat_deva": "डांगरा", "hoc_deva": "डांग्रा", "unr_deva": "उरीः", "eng": "Ox/Bull", "phonetic": "Dangra", "icon": "🐂", "category": "Animals"},
    {"hin": "कुत्ता", "sat_olck": "ᱥᱮᱛᱟ", "sat_orya": "ସେତା", "sat_deva": "सेता", "hoc_deva": "सेता", "unr_deva": "सेता", "eng": "Dog", "phonetic": "Seta", "icon": "🐕", "category": "Animals"},
    {"hin": "बिल्ली", "sat_olck": "ᱯᱩᱥᱤ", "sat_orya": "ପୁସି", "sat_deva": "पुसी", "hoc_deva": "पुसी", "unr_deva": "पुसी", "eng": "Cat", "phonetic": "Pusi", "icon": "🐈", "category": "Animals"},
    {"hin": "चिड़िया", "sat_olck": "ᱪᱮᱬᱮ", "sat_orya": "ଚେଣେ", "sat_deva": "चेणे", "hoc_deva": "चेड़े", "unr_deva": "चेणें", "eng": "Bird", "phonetic": "Chene", "icon": "🐦", "category": "Animals"},
    {"hin": "मुर्गी", "sat_olck": "ᱥᱤᱢ", "sat_orya": "ସିମ", "sat_deva": "सीम", "hoc_deva": "सीम", "unr_deva": "सीम", "eng": "Hen/Chicken", "phonetic": "Sim", "icon": "🐔", "category": "Animals"},
    {"hin": "मछली", "sat_olck": "ᱦᱟᱹᱠᱩ", "sat_orya": "ହାକୁ", "sat_deva": "हाकु", "hoc_deva": "हाकू", "unr_deva": "हाइ", "eng": "Fish", "phonetic": "Haku", "icon": "🐟", "category": "Animals"},
    {"hin": "बकरी", "sat_olck": "ᱢᱮᱨᱚᱢ", "sat_orya": "ମେରମ", "sat_deva": "मेरम", "hoc_deva": "मेरम", "unr_deva": "मेरम", "eng": "Goat", "phonetic": "Merom", "icon": "🐐", "category": "Animals"},

    # --- Category: Nature & Environment ---
    {"hin": "सूरज", "sat_olck": "ᱥᱤᱝ ᱪᱟᱸᱫᱚ", "sat_orya": "ସିଂ ଚାନ୍ଦୋ", "sat_deva": "सिंग चांदो", "hoc_deva": "सिंगी", "unr_deva": "सिंगी", "eng": "Sun", "phonetic": "Sing Chando", "icon": "☀️", "category": "Nature"},
    {"hin": "चांद", "sat_olck": "ᱧᱤᱸᱫᱟᱹ ᱪᱟᱸᱫᱚ", "sat_orya": "ଞିନ୍ଦା ଚାନ୍ଦୋ", "sat_deva": "निंदा चांदो", "hoc_deva": "चांदू", "unr_deva": "चांदू", "eng": "Moon", "phonetic": "Nyinda Chando", "icon": "🌙", "category": "Nature"},
    {"hin": "पेड़", "sat_olck": "ᱫᱟᱨᱮ", "sat_orya": "ଦାରେ", "sat_deva": "दारे", "hoc_deva": "दारु", "unr_deva": "दारु", "eng": "Tree", "phonetic": "Dare", "icon": "🌳", "category": "Nature"},
    {"hin": "फूल", "sat_olck": "ᱵᱟᱦᱟ", "sat_orya": "ବାହା", "sat_deva": "बाहा", "hoc_deva": "बाहा", "unr_deva": "बा", "eng": "Flower", "phonetic": "Baha", "icon": "🌸", "category": "Nature"},
    {"hin": "फल", "sat_olck": "ᱡᱚ", "sat_orya": "ଜୋ", "sat_deva": "जो", "hoc_deva": "जो", "unr_deva": "जो", "eng": "Fruit", "phonetic": "Jo", "icon": "🍎", "category": "Nature"},
    {"hin": "पानी", "sat_olck": "ᱫᱟᱜ", "sat_orya": "ଦାଗ", "sat_deva": "दाग", "hoc_deva": "दाः", "unr_deva": "दाः", "eng": "Water", "phonetic": "Daag", "icon": "💧", "category": "Nature"},
    {"hin": "नदी", "sat_olck": "ᱜᱟᱰᱟ", "sat_orya": "ଗାଡା", "sat_deva": "गाडा", "hoc_deva": "गाड़ा", "unr_deva": "गाड़ा", "eng": "River", "phonetic": "Gada", "icon": "🌊", "category": "Nature"},
    {"hin": "पहाड़", "sat_olck": "ᱵᱩᱨᱩ", "sat_orya": "ବୁରୁ", "sat_deva": "बुरु", "hoc_deva": "बुरु", "unr_deva": "बुरु", "eng": "Mountain/Hill", "phonetic": "Buru", "icon": "⛰️", "category": "Nature"},
    {"hin": "बारिश", "sat_olck": "ᱫᱟᱜ ᱡᱟᱹᱲᱤ", "sat_orya": "ଦାଗ ଜାଡ଼ି", "sat_deva": "दाग जाड़ी", "hoc_deva": "गामा", "unr_deva": "गामा", "eng": "Rain", "phonetic": "Daag Jari", "icon": "🌧️", "category": "Nature"},
    {"hin": "हवा", "sat_olck": "ᱦᱚᱭ", "sat_orya": "ହୟ", "sat_deva": "होय", "hoc_deva": "होय", "unr_deva": "होयो", "eng": "Wind/Air", "phonetic": "Hoy", "icon": "💨", "category": "Nature"},

    # --- Category: Body Parts & Health ---
    {"hin": "आंख", "sat_olck": "ᱢᱮᱫ", "sat_orya": "ମେଦ", "sat_deva": "मेद", "hoc_deva": "मेद", "unr_deva": "मेद", "eng": "Eye", "phonetic": "Med", "icon": "👁️", "category": "Body"},
    {"hin": "कान", "sat_olck": "ᱞᱩᱛᱩᱨ", "sat_orya": "ଲୁତୁର", "sat_deva": "लुतुर", "hoc_deva": "लुतुर", "unr_deva": "लुतुर", "eng": "Ear", "phonetic": "Lutur", "icon": "👂", "category": "Body"},
    {"hin": "नाक", "sat_olck": "ᱢᱩᱸ", "sat_orya": "ମୁଁ", "sat_deva": "मूँ", "hoc_deva": "मुं", "unr_deva": "मुं", "eng": "Nose", "phonetic": "Mu", "icon": "👃", "category": "Body"},
    {"hin": "मुंह", "sat_olck": "ᱢᱚᱪᱟ", "sat_orya": "ମଚା", "sat_deva": "मोचा", "hoc_deva": "मोचा", "unr_deva": "मोचा", "eng": "Mouth", "phonetic": "Mocha", "icon": "👄", "category": "Body"},
    {"hin": "हाथ", "sat_olck": "ᱛᱤ", "sat_orya": "ତୀ", "sat_deva": "ती", "hoc_deva": "ती", "unr_deva": "ती", "eng": "Hand", "phonetic": "Ti", "icon": "✋", "category": "Body"},
    {"hin": "पैर", "sat_olck": "ᱡᱟᱝᱜᱟ", "sat_orya": "ଜାଙ୍ଗା", "sat_deva": "जांगा", "hoc_deva": "काता", "unr_deva": "काता", "eng": "Leg/Foot", "phonetic": "Janga", "icon": "🦶", "category": "Body"},
    {"hin": "सिर", "sat_olck": "ᱵᱚᱦᱚᱜ", "sat_orya": "ବହଗ", "sat_deva": "बोहोग", "hoc_deva": "बोः", "unr_deva": "बोः", "eng": "Head", "phonetic": "Bohog", "icon": "🗣️", "category": "Body"},
    {"hin": "दांत", "sat_olck": "ᱰᱟᱴᱟ", "sat_orya": "ଡାଟା", "sat_deva": "डाटा", "hoc_deva": "डाटा", "unr_deva": "डाटा", "eng": "Teeth", "phonetic": "Data", "icon": "🦷", "category": "Body"},

    # --- Category: Family & Community ---
    {"hin": "मां", "sat_olck": "ᱟᱭᱳ", "sat_orya": "ଆୟୋ", "sat_deva": "आयो", "hoc_deva": "एगा", "unr_deva": "एंगा", "eng": "Mother", "phonetic": "Ayo", "icon": "👩", "category": "Family"},
    {"hin": "पिता", "sat_olck": "ᱵᱟᱵᱟ", "sat_orya": "ବାବା", "sat_deva": "बाबा", "hoc_deva": "अपु", "unr_deva": "आपु", "eng": "Father", "phonetic": "Baba", "icon": "👨", "category": "Family"},
    {"hin": "भाई", "sat_olck": "ᱵᱚᱭᱦᱟ", "sat_orya": "ବୟହା", "sat_deva": "बोयहा", "hoc_deva": "बोयहा", "unr_deva": "हागा", "eng": "Brother", "phonetic": "Boyha", "icon": "👦", "category": "Family"},
    {"hin": "बहन", "sat_olck": "ᱢᱤᱥᱤ", "sat_orya": "ମିସି", "sat_deva": "मिसी", "hoc_deva": "मिसि", "unr_deva": "मिसि", "eng": "Sister", "phonetic": "Misi", "icon": "👧", "category": "Family"},
    {"hin": "बच्चा", "sat_olck": "ᱜᱤᱫᱽᱨᱟᱹ", "sat_orya": "ଗିଦ୍ରା", "sat_deva": "गिदरा", "hoc_deva": "होन", "unr_deva": "होन", "eng": "Child", "phonetic": "Gidra", "icon": "👶", "category": "Family"},
    {"hin": "दोस्त", "sat_olck": "ᱜᱟᱛᱮ", "sat_orya": "ଗାତେ", "sat_deva": "गाते", "hoc_deva": "जोड़ी", "unr_deva": "गाते", "eng": "Friend", "phonetic": "Gate", "icon": "🤝", "category": "Family"},
    {"hin": "घर", "sat_olck": "ᱚᱲᱟᱜ", "sat_orya": "ଅଡ଼ାଗ", "sat_deva": "ओड़ाग", "hoc_deva": "ओवाः", "unr_deva": "ओड़ाः", "eng": "Home/House", "phonetic": "Ora'g", "icon": "🏠", "category": "Family"},
    {"hin": "गांव", "sat_olck": "ᱟᱹᱛᱩ", "sat_orya": "ଆତୁ", "sat_deva": "आतु", "hoc_deva": "हातू", "unr_deva": "हातू", "eng": "Village", "phonetic": "Atu", "icon": "🏡", "category": "Family"},

    # --- Category: Daily Actions & Classroom Commands ---
    {"hin": "पढ़ना", "sat_olck": "ᱯᱟᱲᱦᱟᱣ", "sat_orya": "ପାଡ଼ହାୱ", "sat_deva": "पाड़हाव", "hoc_deva": "पड़ाव", "unr_deva": "पड़ाव", "eng": "Read/Study", "phonetic": "Parhaw", "icon": "📖", "category": "Actions"},
    {"hin": "लिखना", "sat_olck": "ᱚᱞ", "sat_orya": "ଅଲ", "sat_deva": "ओल", "hoc_deva": "ओल", "unr_deva": "ओल", "eng": "Write", "phonetic": "Ol", "icon": "✍️", "category": "Actions"},
    {"hin": "बैठना", "sat_olck": "ᱫᱩᱲᱩᱵ", "sat_orya": "ଦୁଡ଼ୁବ", "sat_deva": "दुड़ुब", "hoc_deva": "दुबु", "unr_deva": "दुबु", "eng": "Sit", "phonetic": "Durub", "icon": "🪑", "category": "Actions"},
    {"hin": "खड़े होना", "sat_olck": "ᱛᱤᱸᱜᱩᱱ", "sat_orya": "ତିଙ୍ଗୁନ", "sat_deva": "तिंगुन", "hoc_deva": "तिंगु", "unr_deva": "तिंगु", "eng": "Stand Up", "phonetic": "Tingun", "icon": "🧍", "category": "Actions"},
    {"hin": "खाना", "sat_olck": "ᱡᱚᱢ", "sat_orya": "ଜମ", "sat_deva": "जोम", "hoc_deva": "जोम", "unr_deva": "जोम", "eng": "Eat", "phonetic": "Jom", "icon": "🍲", "category": "Actions"},
    {"hin": "पानी पीना", "sat_olck": "ᱫᱟᱜ ᱧᱩ", "sat_orya": "ଦାଗ ଞୁ", "sat_deva": "दाग न्यु", "hoc_deva": "दाः नू", "unr_deva": "दाः नू", "eng": "Drink Water", "phonetic": "Daag Nyu", "icon": "🥛", "category": "Actions"},
    {"hin": "खेलना", "sat_olck": "ᱮᱱᱮᱡ", "sat_orya": "ଏନେଜ", "sat_deva": "एनेज", "hoc_deva": "एनेः", "unr_deva": "इनेः", "eng": "Play", "phonetic": "Enej", "icon": "⚽", "category": "Actions"},
    {"hin": "गाना", "sat_olck": "ᱥᱮᱨᱮᱧ", "sat_orya": "ସେରେଞ", "sat_deva": "सेरेंज", "hoc_deva": "दुरंग", "unr_deva": "दुरंग", "eng": "Sing/Song", "phonetic": "Sereny", "icon": "🎵", "category": "Actions"},
]

# Ol Chiki Alphabet Tracing Bank
OL_CHIKI_ALPHABETS = [
    {"char": "ᱚ", "name": "LA", "ipa": "/ɔ/", "meaning": "Earth (Hasasa)", "icon": "🌍"},
    {"char": "ᱛ", "name": "AT", "ipa": "/t/", "meaning": "Tree (Dare)", "icon": "🌳"},
    {"char": "ᱜ", "name": "AG", "ipa": "/k'/", "meaning": "Bow (Aa)", "icon": "🏹"},
    {"char": "ᱝ", "name": "ANG", "ipa": "/ŋ/", "meaning": "Horn (Diring)", "icon": "📯"},
    {"char": "ᱞ", "name": "AL", "ipa": "/l/", "meaning": "Plough (Nahel)", "icon": "🌾"},
    {"char": "ᱟ", "name": "LAA", "ipa": "/a/", "meaning": "Spade (Kudi)", "icon": "⛏️"},
    {"char": "ᱠ", "name": "AAK", "ipa": "/k/", "meaning": "Crow (Kahu)", "icon": "🐦"},
    {"char": "ᱡ", "name": "AAJ", "ipa": "/c'/", "meaning": "Fruit (Jo)", "icon": "🍎"},
    {"char": "ᱢ", "name": "AAM", "ipa": "/m/", "meaning": "Moon (Chando)", "icon": "🌙"},
    {"char": "ᱣ", "name": "AAW", "ipa": "/w/", "meaning": "Home (Orag)", "icon": "🏠"},
    {"char": "ᱤ", "name": "LI", "ipa": "/i/", "meaning": "Fish (Haku)", "icon": "🐟"},
    {"char": "ᱥ", "name": "IS", "ipa": "/s/", "meaning": "Broom (Janor)", "icon": "🧹"},
    {"char": "ᱦ", "name": "IH", "ipa": "/h/", "meaning": "Hand (Ti)", "icon": "✋"},
    {"char": "ᱧ", "name": "INY", "ipa": "/ɲ/", "meaning": "Eye (Med)", "icon": "👁️"},
    {"char": "ᱨ", "name": "IR", "ipa": "/r/", "meaning": "River (Gada)", "icon": "🌊"},
]

# NIPUN Bharat Classroom Lesson Scripts Bank
LESSON_SCRIPTS = [
    {
        "title": "Morning Circle & Welcoming (ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ ᱡᱚᱦᱟᱨ)",
        "grade": "Balvatika & Grade 1",
        "objective": "Build trust, oral language comfort, and positive emotional connection in the mother tongue.",
        "steps": [
            {
                "step": "1. Teacher Greeting",
                "hin": "नमस्ते बच्चों! आप सब कैसे हैं?",
                "sat_olck": "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱯᱮᱭᱟ?",
                "sat_orya": "ଜୋହାର ଗିଦ୍ରା କୋ! ଆପେ ଚେଦ ଲେକା ମେନାଗ ପେୟା?",
                "hoc_deva": "जोहार होनको! आपे चिलका मेनापेया?",
                "unr_deva": "जोहार होनको! आपे चिलकेन मेनापेया?",
                "action": "Smile, fold hands in traditional Johar greeting, invite children into a sitting circle."
            },
            {
                "step": "2. Expected Student Response",
                "hin": "नमस्ते शिक्षक जी! हम सब अच्छे हैं।",
                "sat_olck": "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱢᱠᱮ! ᱟᱞᱮ ᱵᱷᱟᱹᱜᱤ ᱜᱮ ᱢᱮᱱᱟᱜ ᱞᱮᱭᱟ᱾",
                "sat_orya": "ଜୋହାର ମାଚେତ ଗମକେ! ଆଲେ ଭାଗି ଗେ ମେନାଗ ଲେୟା।",
                "hoc_deva": "जोहार माचेत गोमके! अले बुगिते मेनालेया।",
                "unr_deva": "जोहार माचेत गोमके! अले बुगिगे मेनालेया।",
                "action": "Children respond cheerfully in chorus."
            },
            {
                "step": "3. Attendance & Sitting Instruction",
                "hin": "सभी बच्चे आराम से अपनी जगह पर बैठ जाएं।",
                "sat_olck": "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱯᱱᱟᱨ ᱴᱷᱟᱶ ᱨᱮ ᱫᱩᱲᱩᱵ ᱯᱮ᱾",
                "sat_orya": "ସାନାମ ଗିଦ୍ରା ଆପନାର ଠାଓଁ ରେ ଦୁଡ଼ୁବ ପେ।",
                "hoc_deva": "सोबेन होनको आपन-आपन ठाईरे दुबुपे।",
                "unr_deva": "सोबेन होनको आपन ठाईरे दुबुपे।",
                "action": "Guide fidgeting students with gentle hand gestures."
            },
            {
                "step": "4. Transition to Activity",
                "hin": "आज हम सब मिलकर एक सुंदर कहानी और गणित पढ़ेंगे।",
                "sat_olck": "ᱛᱮᱦᱮᱧ ᱵᱚᱱ ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱢᱤᱫᱴᱟᱝ ᱱᱟᱯᱟᱭ ᱠᱟᱹᱦᱱᱤ ᱟᱨ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱯᱟᱲᱦᱟᱣᱟ᱾",
                "sat_orya": "ତେହେଞ୍ଜ ବନ ମିଦ ସାଓତେ ମିଦଟାଙ୍ଗ ନାପାୟ କାହ୍ନି ଆର ଲେଖା ବନ ପାଡ଼ହାୱା।",
                "hoc_deva": "तिसिंग अबु सोबेनते मिदटा काहनी अर लेखा पड़ावेयाबू।",
                "unr_deva": "तिसिंग अबु सोबेनते मिद काहनी अर लेखा पड़ावेयाबू।",
                "action": "Display visual flashcards or open large picture chart."
            }
        ]
    },
    {
        "title": "Math Foundational Numeracy 1-10 (ᱞᱮᱠᱷᱟ ᱯᱟᱲᱦᱟᱣ)",
        "grade": "Grade 1 & 2",
        "objective": "Connect physical objects with counting words in Ol Chiki and Hindi.",
        "steps": [
            {
                "step": "1. Prompt Counting with Objects",
                "hin": "देखो बच्चों, मेरे हाथ में कितनी पेंसिलें हैं?",
                "sat_olck": "ᱧᱮᱞ ᱯᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ, ᱤᱧᱟᱜ ᱛᱤ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱯᱮᱱᱥᱤᱞ ᱢᱮᱱᱟᱜ-ᱟ?",
                "sat_orya": "ଞେଲ ପେ ଗିଦ୍ରା କୋ, ଇଞାଗ ତୀ ରେ ତିନାଗ ପେନସିଲ ମେନାଗ-ଆ?",
                "hoc_deva": "नेलपे होनको, इञाः तीरे चिनमिन पेन्सिल मेनाः?",
                "unr_deva": "नेलपे होनको, इञाः तीरे चिमिन पेन्सिल मेनाः?",
                "action": "Hold up 3 wooden pencils high for all children to see clearly."
            },
            {
                "step": "2. Counting Chorus",
                "hin": "एक... दो... तीन! (तीन पेंसिलें)",
                "sat_olck": "ᱢᱤᱫ (᱑)... ᱵᱟᱨ (᱒)... ᱯᱮ (᱓)! (ᱯᱮᱭᱟ ᱯᱮᱱᱥᱤᱞ)",
                "sat_orya": "ମିଦ (୧)... ବାର (୨)... ପେ (୩)! (ପେୟା ପେନସିଲ)",
                "hoc_deva": "मियाद (१)... बारिया (२)... आपिया (३)!",
                "unr_deva": "मियाद (१)... बारिया (२)... आपिया (३)!",
                "action": "Count slowly, pointing to each pencil one by one."
            },
            {
                "step": "3. Writing on Blackboard",
                "hin": "अब सब अपनी कापी में Ol Chiki में 'ᱯᱮ (᱓)' लिखो।",
                "sat_olck": "ᱱᱤᱛᱚᱜ ᱥᱟᱱᱟᱢ ᱠᱚ ᱟᱯᱱᱟᱨ ᱚᱞ ᱯᱩᱛᱷᱤ ᱨᱮ 'ᱯᱮ (᱓)' ᱚᱞ ᱯᱮ᱾",
                "sat_orya": "ନିତଗ ସାନାମ କୋ ଆପନାର ଅଲ ପୁଥି ରେ 'ପେ (୩)' ଅଲ ପେ।",
                "hoc_deva": "नितोः सोबेन आपन ओल पुथीरे '३' ओलपे।",
                "unr_deva": "नितोः सोबेन आपन ओल पुथीरे '३' ओलपे।",
                "action": "Draw numeral ᱓ clearly in large strokes on blackboard."
            }
        ]
    }
]

# Bilingual Traditional Folk Rhymes & Children's Songs
TRADITIONAL_RHYMES = [
    {
        "title": "Little Bird (ᱪᱮᱬᱮ ᱨᱟᱜ / Cheṇe Rag)",
        "language": "Santali (Ol Chiki & Hindi)",
        "lines": [
            {"tribal": "ᱪᱮᱬᱮ ᱪᱮᱬᱮ ᱫᱟᱨᱮ ᱪᱮᱛᱟᱱ ᱨᱮ,", "hin": "चिड़िया चिड़िया पेड़ के ऊपर,", "eng": "Little bird high up in the tree,"},
            {"tribal": "ᱥᱤᱵᱤᱞ ᱥᱤᱵᱤᱞ ᱥᱮᱨᱮᱧ ᱟᱸᱡᱚᱢ ᱢᱮ᱾", "hin": "मीठा मीठा गाना सुनाती है।", "eng": "Singing a sweet sweet song."},
            {"tribal": "ᱥᱮᱛᱟᱜ ᱥᱮᱛᱟᱜ ᱥᱤᱝ ᱪᱟᱸᱫᱚ ᱨᱟᱠᱟᱵ-ᱮᱱ,", "hin": "सुबह-सुबह सूरज निकल आया,", "eng": "Early morning the bright sun rises,"},
            {"tribal": "ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱥᱮᱱᱚᱜ ᱚᱠᱛᱚ ᱦᱩᱭ-ᱮᱱ᱾", "hin": "अब स्कूल जाने का समय हो गया।", "eng": "Now it is time to go to school."}
        ],
        "activity": "Teacher and students clap hands on rhythm, mime flying birds with outstretched arms."
    },
    {
        "title": "Counting Song (ᱞᱮᱠᱷᱟ ᱥᱮᱨᱮᱧ / Lekha Serenj)",
        "language": "Santali (Ol Chiki & Hindi)",
        "lines": [
            {"tribal": "ᱢᱤᱫ (᱑) ᱫᱚ ᱥᱤᱝ ᱪᱟᱸᱫᱚ ᱢᱤᱫᱴᱟᱝ ᱜᱮ,", "hin": "एक है सूरज जो आसमान में एक है,", "eng": "One is the sun, shining alone in the sky,"},
            {"tribal": "ᱵᱟᱨ (᱒) ᱫᱚ ᱤᱧᱟᱜ ᱢᱮᱫ ᱵᱟᱨᱭᱟ ᱜᱮ᱾", "hin": "दो हैं मेरी प्यारी आंखें दो,", "eng": "Two are my bright eyes,"},
            {"tribal": "ᱯᱮ (᱓) ᱫᱚ ᱪᱮᱬᱮ ᱟᱜ ᱛᱤᱱᱟᱹᱜ ᱠᱟᱹᱴᱷᱤ,", "hin": "तीन हैं चिड़िया के घोंसले के तिनके,", "eng": "Three are twigs in the bird's nest,"},
            {"tribal": "ᱯᱩᱱ (᱔) ᱫᱚ ᱜᱟᱹᱭ ᱟᱜ ᱡᱟᱝᱜᱟ ᱯᱩᱱᱭᱟᱹ ᱜᱮ᱾", "hin": "चार हैं गाय के चार मजबूत पैर।", "eng": "Four are the cow's four sturdy legs."}
        ],
        "activity": "Show fingers for 1, 2, 3, 4 while singing loudly together."
    }
]


def to_script_number(num: int, target_lang="sat_Olck") -> str:
    """Convert integer to target script numerals."""
    digits = DIGITS_MAP.get(target_lang, DIGITS_MAP["sat_Olck"])
    return "".join(digits[int(d)] for d in str(num))


def get_lang_label(target_lang: str) -> str:
    labels = {
        "sat_Olck": "Santali (Ol Chiki - ᱚᱞ ᱪᱤᱠᱤ)",
        "sat_Orya": "Santali (Odia Script - ଓଡ଼ିଆ ଲିପି)",
        "sat_Deva": "Santali (Devanagari - संताली)",
        "hoc_Deva": "Ho (Devanagari - ᱦᱳ)",
        "unr_Deva": "Mundari (Devanagari - ᱢᱩᱱᱰᱟᱨᱤ)",
        "hin_Deva": "Hindi (हिन्दी)",
        "eng_Latn": "English"
    }
    return labels.get(target_lang, "Santali (Ol Chiki)")


def get_vocab_target_word(item: dict, target_lang: str) -> str:
    if target_lang == "sat_Olck":
        return item.get("sat_olck", item.get("hin"))
    elif target_lang == "sat_Orya":
        return item.get("sat_orya", item.get("hin"))
    elif target_lang == "sat_deva":
        return item.get("sat_deva", item.get("hin"))
    elif target_lang == "hoc_deva":
        return item.get("hoc_deva", item.get("hin"))
    elif target_lang == "unr_deva":
        return item.get("unr_deva", item.get("hin"))
    elif target_lang == "eng_Latn":
        return item.get("eng", item.get("hin"))
    return item.get("sat_olck", item.get("hin"))


# ---------------------------------------------------------------------------
# 1. Counting & Numeracy Generator
# ---------------------------------------------------------------------------
def generate_counting_worksheet(title=None, target_lang="sat_Olck", max_num=10):
    """Generate math counting worksheet with visual objects and numerals."""
    if not title:
        title = f"Grade 1 Math - Counting in {get_lang_label(target_lang)}"

    object_icons = ["⭐", "🍎", "🌳", "✏️", "📚", "🐦", "🌸", "🐟", "🎈", "🚗"]
    exercises = []
    
    # 1 to max_num
    nums = list(range(1, min(max_num + 1, 11)))
    random.shuffle(nums)

    for i in nums:
        icon = object_icons[(i - 1) % len(object_icons)]
        script_num = to_script_number(i, target_lang)
        prompt_icons = f"{icon} " * i
        exercises.append({
            "number": i,
            "script_digit": script_num,
            "prompt": prompt_icons,
            "answer_box": f"[  {script_num}  ]"
        })

    return {
        "title": title,
        "type": "Counting",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "instructions": f"Count the objects in each box and write the numeral in {get_lang_label(target_lang)}.",
        "exercises": exercises
    }


def load_trained_dataset_pairs():
    """Load all GPU-trained and harvested sentence pairs from learned_memory.json."""
    pairs = []
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            # 1. Hindi -> Santali pairs
            hin_data = data.get("hin_Deva", {})
            hin_olck = hin_data.get("sat_Olck", {})
            for hin_text, sat_text in hin_olck.items():
                if hin_text and sat_text and len(hin_text) > 2:
                    pairs.append({
                        "hin": hin_text,
                        "eng": hin_text,
                        "sat_olck": sat_text,
                        "sat_orya": hin_data.get("sat_Orya", {}).get(hin_text, transduce_script(sat_text, "ol_chiki", "odia") if transduce_script else sat_text),
                        "sat_deva": hin_data.get("sat_Deva", {}).get(hin_text, transduce_script(sat_text, "ol_chiki", "deva") if transduce_script else sat_text),
                        "hoc_deva": hin_text,
                        "unr_deva": hin_text,
                        "icon": "📝",
                        "category": "Curriculum"
                    })
            # 2. English -> Santali pairs
            eng_data = data.get("eng_Latn", {})
            eng_olck = eng_data.get("sat_Olck", {})
            for eng_text, sat_text in eng_olck.items():
                if eng_text and sat_text and len(eng_text) > 2:
                    pairs.append({
                        "hin": eng_text,
                        "eng": eng_text,
                        "sat_olck": sat_text,
                        "sat_orya": eng_data.get("sat_Orya", {}).get(eng_text, transduce_script(sat_text, "ol_chiki", "odia") if transduce_script else sat_text),
                        "sat_deva": eng_data.get("sat_Deva", {}).get(eng_text, transduce_script(sat_text, "ol_chiki", "deva") if transduce_script else sat_text),
                        "hoc_deva": eng_text,
                        "unr_deva": eng_text,
                        "icon": "📚",
                        "category": "Curriculum"
                    })
        except Exception:
            pass
    return pairs


# ---------------------------------------------------------------------------
# 2. Vocabulary & Trained Sentence Matching Generator
# ---------------------------------------------------------------------------
def generate_matching_worksheet(title=None, target_lang="sat_Olck", category="all", count=6, use_trained_data=True):
    """Generate vocabulary and sentence matching pairs with answer key using trained dataset."""
    if not title:
        title = f"Grade 1 FLN Literacy - Matching Worksheet ({get_lang_label(target_lang)})"

    pool = list(EXPANDED_VOCAB_BANK)
    if use_trained_data:
        trained_pairs = load_trained_dataset_pairs()
        if trained_pairs:
            pool.extend(trained_pairs)

    if category and category != "all" and category != "Curriculum":
        filtered = [item for item in pool if item.get("category", "").lower() == category.lower()]
        if len(filtered) >= 4:
            pool = filtered

    items = random.sample(pool, min(count, len(pool)))
    left_column = [{"hin": it["hin"], "icon": it.get("icon", "📝"), "eng": it.get("eng", it["hin"])} for it in items]
    right_column = [get_vocab_target_word(it, target_lang) for it in items]

    shuffled_right = right_column.copy()
    random.shuffle(shuffled_right)

    pairs = []
    for left, right in zip(left_column, shuffled_right):
        pairs.append({
            "left_hin": left["hin"],
            "left_icon": left["icon"],
            "left_eng": left["eng"],
            "right": right
        })

    answer_key = {it["hin"]: get_vocab_target_word(it, target_lang) for it in items}

    return {
        "title": title,
        "type": "Word Matching",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "instructions": f"Draw a line matching each Hindi/English item on the left to its translation on the right in {get_lang_label(target_lang)}.",
        "pairs": pairs,
        "answer_key": answer_key
    }


# ---------------------------------------------------------------------------
# 3. Visual Flashcards Generator
# ---------------------------------------------------------------------------
def generate_flashcards_worksheet(title=None, target_lang="sat_Olck", category="all", count=8, use_trained_data=True):
    """Generate visual printable flashcard grid incorporating trained vocabulary."""
    if not title:
        title = f"NIPUN Bharat Visual Flashcard Set ({get_lang_label(target_lang)})"

    pool = list(EXPANDED_VOCAB_BANK)
    if use_trained_data:
        trained_pairs = load_trained_dataset_pairs()
        if trained_pairs:
            pool.extend(trained_pairs)

    if category and category != "all":
        filtered = [item for item in pool if item.get("category", "").lower() == category.lower()]
        if len(filtered) >= count:
            pool = filtered

    items = random.sample(pool, min(count, len(pool)))
    cards = []
    for it in items:
        cards.append({
            "icon": it.get("icon", "🃏"),
            "hin": it["hin"],
            "target_word": get_vocab_target_word(it, target_lang),
            "eng": it.get("eng", it["hin"]),
            "phonetic": it.get("phonetic", ""),
            "category": it.get("category", "General")
        })

    return {
        "title": title,
        "type": "Flashcards",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "instructions": "Cut along the dotted lines to create individual classroom flashcards. Practice oral pronunciation with students daily.",
        "cards": cards
    }


# ---------------------------------------------------------------------------
# 4. Script & Alphabet Tracing Generator
# ---------------------------------------------------------------------------
def generate_tracing_worksheet(title=None, target_lang="sat_Olck"):
    """Generate dotted handwriting & script tracing sheet."""
    if not title:
        title = f"Foundational Literacy - Script Tracing Practice ({get_lang_label(target_lang)})"

    letters = OL_CHIKI_ALPHABETS[:8]
    return {
        "title": title,
        "type": "Tracing",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "instructions": "Trace the dotted letter strokes carefully from top to bottom, then say the sound aloud.",
        "letters": letters
    }


# ---------------------------------------------------------------------------
# 5. Fill in the Blanks / Sentence Practice from Trained Corpus
# ---------------------------------------------------------------------------
def generate_fill_blanks_worksheet(title=None, target_lang="sat_Olck", use_trained_data=True):
    """Generate dynamic sentence completion worksheet directly from trained memory."""
    if not title:
        title = f"Grade 2 FLN - Sentence Completion & Grammar ({get_lang_label(target_lang)})"

    # Default canonical sentences
    default_sentences = [
        {"prompt": "1. ᱥᱤᱝ ᱪᱟᱸᱫᱚ ________ ᱨᱮ ᱨᱟᱠᱟᱵ-ᱟ᱾ (ᱥᱮᱛᱟᱜ / ᱧᱤᱸᱫᱟᱹ)", "translation": "सूरज ________ में निकलता है। (सुबह / रात)", "answer": "ᱥᱮᱛᱟᱜ (सुबह)"},
        {"prompt": "2. ᱤᱧ ᱫᱚ ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱨᱮ ________ ᱯᱟᱲᱦᱟᱣ-ᱟ᱾ (ᱯᱩᱛᱷᱤ / ᱫᱟᱨᱮ)", "translation": "मैं स्कूल में ________ पढ़ता हूँ। (किताब / पेड़)", "answer": "ᱯᱩᱛᱷᱤ (किताब)"},
        {"prompt": "3. ᱫᱟᱨᱮ ᱨᱮ ᱥᱤᱵᱤᱞ ________ ᱡᱚᱜ-ᱟ᱾ (ᱡᱚ / ᱠᱚᱞᱚᱢ)", "translation": "पेड़ में मीठा ________ फलता है। (फल / कलम)", "answer": "ᱡᱚ (फल)"},
        {"prompt": "4. ᱥᱮᱛᱟᱜ ᱵᱮᱲᱟ ᱥᱟᱯᱷᱟ ________ ᱧᱩᱭ ᱢᱮ᱾ (ᱫᱟᱜ / ᱫᱟᱨᱮ)", "translation": "सुबह के समय साफ ________ पियो। (पानी / पेड़)", "answer": "ᱫᱟᱜ (पानी)"},
        {"prompt": "5. ᱪᱮᱛᱮᱫᱤᱭᱟᱹ ᱠᱚ ᱠᱞᱟᱥ ᱨᱮ ________ ᱯᱮ᱾ (ᱫᱩᱲᱩᱵ / ᱛᱤᱸᱜᱩᱱ)", "translation": "छात्र कक्षा में ________ जाएं। (बैठ / खड़े)", "answer": "ᱫᱩᱲᱩᱵ (बैठ)"},
    ]

    trained_pairs = load_trained_dataset_pairs() if use_trained_data else []
    sentences = default_sentences

    if trained_pairs and len(trained_pairs) >= 5:
        selected = random.sample(trained_pairs, 5)
        dynamic_sentences = []
        for idx, pair in enumerate(selected, start=1):
            tgt_text = get_vocab_target_word(pair, target_lang)
            words = tgt_text.split()
            if len(words) >= 3:
                blank_idx = len(words) // 2
                correct_w = words[blank_idx]
                masked_words = words.copy()
                masked_words[blank_idx] = "________"
                masked_prompt = " ".join(masked_words)

                # Pick a distractor word
                distractor = "ᱫᱟᱨᱮ" if correct_w != "ᱫᱟᱨᱮ" else "ᱯᱩᱛᱷᱤ"
                prompt_line = f"{idx}. {masked_prompt} ({correct_w} / {distractor})"
                dynamic_sentences.append({
                    "prompt": prompt_line,
                    "translation": f"अभ्यास: {pair['hin']}",
                    "answer": correct_w
                })
        if len(dynamic_sentences) >= 3:
            sentences = dynamic_sentences

    return {
        "title": title,
        "type": "Fill in the Blanks",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "instructions": "Choose the correct word from the options in brackets and write it in the blank space.",
        "sentences": sentences
    }


# ---------------------------------------------------------------------------
# 6. Teacher Bilingual Lesson Script & Activity Guide
# ---------------------------------------------------------------------------
def generate_lesson_script_worksheet(title=None, target_lang="sat_Olck", index=0):
    """Generate teacher's bilingual classroom activity plan."""
    script_data = LESSON_SCRIPTS[index % len(LESSON_SCRIPTS)]
    if not title:
        title = f"Teacher Guide: {script_data['title']}"

    return {
        "title": title,
        "type": "Lesson Script",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "objective": script_data["objective"],
        "grade": script_data["grade"],
        "instructions": "Teacher should read the Hindi instruction, speak the translated tribal sentence aloud, and guide students through the suggested physical action.",
        "steps": script_data["steps"]
    }


# ---------------------------------------------------------------------------
# 7. Bilingual Tribal Children's Folk Rhymes
# ---------------------------------------------------------------------------
def generate_rhyme_card(title=None, target_lang="sat_Olck", index=0):
    """Generate traditional children's folk rhyme learning card."""
    rhyme = TRADITIONAL_RHYMES[index % len(TRADITIONAL_RHYMES)]
    if not title:
        title = f"Bilingual Rhyme & Action Song: {rhyme['title']}"

    return {
        "title": title,
        "type": "Rhyme Card",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "instructions": "Sing the rhyme rhythmically with hand claps and actions. Encourage students to repeat after the teacher.",
        "rhyme": rhyme
    }


# ---------------------------------------------------------------------------
# 8. NIPUN Bharat Diagnostic Assessment Prompts
# ---------------------------------------------------------------------------
def generate_assessment_prompt(title=None, target_lang="sat_Olck"):
    """Generate diagnostic assessment card with 3-level evaluation rubric."""
    if not title:
        title = f"NIPUN Bharat Oral & Written FLN Diagnostic Card ({get_lang_label(target_lang)})"

    questions = [
        {"q_num": "Q1 (Oral)", "prompt": "आस-पास की 3 वस्तुओं के नाम संताली/हो/मुंडारी में बताओ।", "target_q": "ᱟᱢᱟᱜ ᱟᱰᱮ-ᱯᱟᱥᱮ ᱨᱮᱱᱟᱜ ᱯᱮᱭᱟ (᱓) ᱡᱤᱱᱤᱥ ᱨᱮᱱᱟᱜ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭ ᱢᱮ᱾", "competency": "L1: Vocabulary Recall"},
        {"q_num": "Q2 (Oral)", "prompt": "1 से 10 तक मातृभाषा में गिनती सुनाओ।", "target_q": "᱑ ᱠᱷᱚᱱ ᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱟᱸᱡᱚᱢ ᱢᱮ᱾", "competency": "N1: Number Sense 1-10"},
        {"q_num": "Q3 (Written)", "prompt": "कापी पर Ol Chiki में ᱐ से ᱕ तक अंक लिखो।", "target_q": "ᱟᱢᱟᱜ ᱚᱞ ᱯᱩᱛᱷᱤ ᱨᱮ ᱐ ᱠᱷᱚᱱ ᱕ ᱫᱷᱟᱹᱵᱤᱡ ᱚᱞ ᱢᱮ᱾", "competency": "N2: Numeral Writing"},
        {"q_num": "Q4 (Comprehension)", "prompt": "'ᱫᱟᱜ ᱧᱩᱭ ᱢᱮ' का अर्थ बताओ और अभिनय करके दिखाओ।", "target_q": "'ᱫᱟᱜ ᱧᱩᱭ ᱢᱮ' ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱞᱟᱹᱭ ᱢᱮ ᱟᱨ ᱧᱩ ᱠᱟᱛᱮ ᱩᱫᱩᱜ ᱢᱮ᱾", "competency": "L2: Action Comprehension"},
    ]

    return {
        "title": title,
        "type": "Assessment Prompts",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "instructions": "Conduct this 1-on-1 assessment with each child. Mark Emerging (🟡), Developing (🟢), or Proficient (⭐) in the assessment log.",
        "questions": questions
    }


# ---------------------------------------------------------------------------
# 9. Gamified Tribal Forest Safari Board Game (Printable A4)
# ---------------------------------------------------------------------------
def generate_board_game_worksheet(title=None, target_lang="sat_Olck"):
    """Generate printable 12-tile tribal forest safari board game."""
    if not title:
        title = f"🌲 PALASH Forest Quest Board Game ({get_lang_label(target_lang)})"

    tiles = [
        {"num": "1", "icon": "🏡", "name_hin": "घर (Start)", "sat_olck": "ᱚᱲᱟᱜ", "action": "Start here! Say 'Johar!'"},
        {"num": "2", "icon": "🌳", "name_hin": "पेड़", "sat_olck": "ᱫᱟᱨᱮ", "action": "Name 2 fruits in Santali"},
        {"num": "3", "icon": "🌊", "name_hin": "नदी", "sat_olck": "ᱜᱟᱰᱟ", "action": "Mime swimming in the river"},
        {"num": "4", "icon": "🐅", "name_hin": "बाघ (Tiger)", "sat_olck": "ᱛᱟᱹᱨᱩᱵ", "action": "Roar like a tiger! Move +1"},
        {"num": "5", "icon": "🌸", "name_hin": "बाहा फूल", "sat_olck": "ᱵᱟᱦᱟ", "action": "Sing 1 line of Baha rhyme"},
        {"num": "6", "icon": "⛰️", "name_hin": "पहाड़", "sat_olck": "ᱵᱩᱨᱩ", "action": "Climb high! Say 'Buru'"},
        {"num": "7", "icon": "🐘", "name_hin": "हाथी", "sat_olck": "ᱦᱟᱹᱛᱤ", "action": "Count 1 to 5 in Ol Chiki"},
        {"num": "8", "icon": "🥁", "name_hin": "मांदर / ढोल", "sat_olck": "ᱢᱟᱫᱚᱞ", "action": "Clap 3 times to beat drum"},
        {"num": "9", "icon": "🐦", "name_hin": "चिड़िया", "sat_olck": "ᱪᱮᱬᱮ", "action": "Flap wings & fly forward!"},
        {"num": "10", "icon": "☀️", "name_hin": "सूरज", "sat_olck": "ᱥᱤᱝ ᱪᱟᱸᱫᱚ", "action": "Shine bright! Move +2"},
        {"num": "11", "icon": "🏹", "name_hin": "धनुष-बाण", "sat_olck": "ᱟᱜ-ᱥᱟᱨ", "action": "Aim for the target!"},
        {"num": "12", "icon": "🏫", "name_hin": "स्कूल (Winner!)", "sat_olck": "ᱤᱛᱩᱱ ᱟᱥᱲᱟ", "action": "👑 Village Scholar Crown!"}
    ]

    return {
        "title": title,
        "type": "Board Game",
        "target_lang": target_lang,
        "lang_label": get_lang_label(target_lang),
        "instructions": "Roll a die (1-6) or spin a coin. Move your coin token to each square. You MUST speak the tribal word aloud to keep your place!",
        "tiles": tiles
    }


# ---------------------------------------------------------------------------
# Master Dispatcher & HTML Renderer
# ---------------------------------------------------------------------------
def generate_worksheet(ws_type="matching", title=None, target_lang="sat_Olck", category="all", grade="Grade 1"):
    """Master factory function for all study material types."""
    t_lower = ws_type.lower()
    if "count" in t_lower:
        return generate_counting_worksheet(title=title, target_lang=target_lang)
    elif "flash" in t_lower:
        return generate_flashcards_worksheet(title=title, target_lang=target_lang, category=category)
    elif "trace" in t_lower:
        return generate_tracing_worksheet(title=title, target_lang=target_lang)
    elif "fill" in t_lower or "blank" in t_lower:
        return generate_fill_blanks_worksheet(title=title, target_lang=target_lang)
    elif "lesson" in t_lower or "script" in t_lower:
        return generate_lesson_script_worksheet(title=title, target_lang=target_lang)
    elif "rhyme" in t_lower or "song" in t_lower:
        return generate_rhyme_card(title=title, target_lang=target_lang)
    elif "assess" in t_lower or "eval" in t_lower:
        return generate_assessment_prompt(title=title, target_lang=target_lang)
    elif "game" in t_lower or "board" in t_lower or "safari" in t_lower:
        return generate_board_game_worksheet(title=title, target_lang=target_lang)
    else:
        return generate_matching_worksheet(title=title, target_lang=target_lang, category=category)


def export_worksheet_html(worksheet_data, output_path="worksheet.html"):
    """Export any study material type to a beautiful, print-ready HTML page."""
    ws_type = worksheet_data.get("type", "Worksheet")
    title = worksheet_data.get("title", "Primary School Worksheet")
    instructions = worksheet_data.get("instructions", "")
    target_lang = worksheet_data.get("target_lang", "sat_Olck")

    script_class = "ol-chiki-font" if "Olck" in target_lang or "ol" in target_lang else ("odia-font" if "Orya" in target_lang else "")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title} - SurSetu</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+Ol+Chiki:wght@400;600;700&family=Noto+Sans+Oriya:wght@400;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {{
            --primary: #1E3A8A;
            --secondary: #0D9488;
            --accent: #F59E0B;
            --text-dark: #0F172A;
            --border: #CBD5E1;
            --bg-light: #F8FAFC;
        }}
        * {{ box-sizing: border-box; }}
        body {{
            font-family: 'Inter', -apple-system, sans-serif;
            margin: 25px auto;
            max-width: 900px;
            color: var(--text-dark);
            background-color: #ffffff;
            line-height: 1.4;
        }}
        .ol-chiki-font {{
            font-family: 'Noto Sans Ol Chiki', 'Inter', sans-serif;
            font-size: 1.25rem;
            color: #047857;
            font-weight: 700;
        }}
        .odia-font {{
            font-family: 'Noto Sans Oriya', 'Inter', sans-serif;
            font-size: 1.25rem;
            color: #0284C7;
            font-weight: 700;
        }}
        .gov-banner {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid var(--primary);
            padding-bottom: 8px;
            margin-bottom: 12px;
        }}
        .gov-title {{ font-size: 0.85rem; font-weight: 700; color: #475569; text-transform: uppercase; }}
        .header {{
            text-align: center;
            background: linear-gradient(135deg, #EEF2FF, #F0FDFA);
            border: 1px solid #E0E7FF;
            border-radius: 12px;
            padding: 14px 20px;
            margin-bottom: 16px;
        }}
        .header h1 {{
            margin: 0;
            color: var(--primary);
            font-size: 20px;
            font-family: 'Outfit', sans-serif;
        }}
        .header h3 {{
            margin: 4px 0 0 0;
            color: var(--secondary);
            font-size: 13px;
            font-weight: 600;
        }}
        .meta-bar {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            background: var(--bg-light);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 16px;
        }}
        .instructions {{
            background-color: #F0FDF4;
            border-left: 4px solid #10B981;
            padding: 10px 14px;
            margin-bottom: 20px;
            font-size: 13px;
            border-radius: 4px;
            color: #065F46;
        }}
        .grid-table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }}
        .grid-table th, .grid-table td {{
            border: 1px solid var(--border);
            padding: 10px 12px;
            text-align: center;
            font-size: 15px;
        }}
        .grid-table th {{
            background-color: #F1F5F9;
            color: var(--primary);
            font-weight: 700;
            font-size: 13px;
        }}
        
        /* Flashcards Grid */
        .flashcards-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-top: 12px;
        }}
        .flashcard-item {{
            border: 2px dashed #94A3B8;
            border-radius: 12px;
            padding: 14px;
            text-align: center;
            background: #FAFAFA;
            page-break-inside: avoid;
        }}
        .flashcard-icon {{ font-size: 40px; margin-bottom: 4px; }}
        .flashcard-tribal {{ font-size: 24px; font-weight: 800; color: #047857; margin-bottom: 4px; }}
        .flashcard-phonetic {{ font-size: 12px; color: #64748B; font-style: italic; margin-bottom: 6px; }}
        .flashcard-meaning {{ font-size: 16px; font-weight: 700; color: #1E293B; }}

        /* Tracing Sheet */
        .trace-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 10px;
        }}
        .trace-card {{
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 16px;
            page-break-inside: avoid;
        }}
        .trace-char-main {{
            font-size: 44px;
            font-weight: 800;
            color: #1E3A8A;
            line-height: 1;
            width: 70px;
            text-align: center;
        }}
        .trace-dotted-box {{
            flex: 1;
            border-left: 2px solid #E2E8F0;
            padding-left: 12px;
            display: flex;
            gap: 14px;
            font-size: 38px;
            color: #CBD5E1;
            font-style: italic;
        }}

        /* Lesson Script Steps */
        .script-step {{
            background: #FFFFFF;
            border: 1px solid var(--border);
            border-left: 4px solid var(--primary);
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 12px;
            page-break-inside: avoid;
        }}
        .step-title {{ font-weight: 700; color: var(--primary); font-size: 14px; margin-bottom: 6px; }}
        .step-bilingual {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 6px; font-size: 14px; }}
        .step-action {{ font-size: 12px; color: #64748B; background: #F8FAFC; padding: 6px 10px; border-radius: 4px; }}

        /* Footer & Evaluation */
        .eval-section {{
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--border);
            padding-top: 15px;
            font-size: 13px;
            color: #475569;
        }}
        .stars-box {{ display: flex; gap: 6px; font-size: 18px; color: #CBD5E1; }}

        @media print {{
            body {{ margin: 0; padding: 10px; }}
            .no-print {{ display: none; }}
            .flashcard-item, .trace-card, .script-step {{ page-break-inside: avoid; }}
        }}
    </style>
</head>
<body>
    <div class="gov-banner">
        <span class="gov-title">🌿 Jharkhand PALASH MTB-MLE • NIPUN Bharat FLN Suite</span>
        <span style="font-size: 11px; color: #64748B; font-weight: 600;">Offline AI Education Platform</span>
    </div>

    <div class="header">
        <h1>{title}</h1>
        <h3>Mother Tongue-Based Multilingual Education • Primary Wing</h3>
    </div>

    <div class="meta-bar">
        <span>School: ___________________</span>
        <span>Student: __________________</span>
        <span>Class: _______ Roll: _____</span>
        <span>Date: ____________</span>
    </div>

    <div class="instructions">
        <strong>📋 Instructions for Student / Teacher:</strong> {instructions}
    </div>
"""

    # 1. Counting Layout
    if ws_type == "Counting":
        html_content += """    <table class="grid-table">
        <thead>
            <tr>
                <th style="width: 10%;">Item #</th>
                <th style="width: 55%; text-align: left; padding-left: 16px;">Visual Objects to Count</th>
                <th style="width: 35%;">Write Numeral in Tribal Script</th>
            </tr>
        </thead>
        <tbody>
"""
        for it in worksheet_data["exercises"]:
            html_content += f"""            <tr>
                <td><strong>{it['number']}</strong></td>
                <td style="text-align: left; padding-left: 16px; font-size: 20px; letter-spacing: 3px;">{it['prompt']}</td>
                <td class="{script_class}" style="font-size: 24px; color: #047857;">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
            </tr>
"""
        html_content += "        </tbody>\n    </table>\n"

    # 2. Matching Layout
    elif ws_type == "Word Matching":
        html_content += """    <table class="grid-table">
        <thead>
            <tr>
                <th style="width: 40%;">Hindi / Picture Item</th>
                <th style="width: 20%;">Matching Line</th>
                <th style="width: 40%;">Mother Tongue Translation</th>
            </tr>
        </thead>
        <tbody>
"""
        for pair in worksheet_data["pairs"]:
            html_content += f"""            <tr>
                <td style="font-size: 16px; font-weight: 700; text-align: left; padding-left: 20px;">
                    <span style="font-size: 22px; margin-right: 8px;">{pair['left_icon']}</span>
                    {pair['left_hin']} <span style="font-size: 12px; color: #64748B; font-weight: normal;">({pair['left_eng']})</span>
                </td>
                <td style="color: #CBD5E1; font-size: 16px;">──────⃝</td>
                <td class="{script_class}" style="font-size: 20px; text-align: right; padding-right: 20px;">
                    {pair['right']}
                </td>
            </tr>
"""
        html_content += "        </tbody>\n    </table>\n"

    # 3. Flashcards Layout
    elif ws_type == "Flashcards":
        html_content += '    <div class="flashcards-grid">\n'
        for card in worksheet_data["cards"]:
            html_content += f"""        <div class="flashcard-item">
            <div class="flashcard-icon">{card['icon']}</div>
            <div class="flashcard-tribal {script_class}">{card['target_word']}</div>
            <div class="flashcard-phonetic">Pronunciation: {card['phonetic']}</div>
            <div class="flashcard-meaning">{card['hin']} / {card['eng']}</div>
        </div>
"""
        html_content += "    </div>\n"

    # 4. Tracing Layout
    elif ws_type == "Tracing":
        html_content += '    <div class="trace-grid">\n'
        for l in worksheet_data["letters"]:
            html_content += f"""        <div class="trace-card">
            <div class="trace-char-main {script_class}">{l['char']}</div>
            <div class="trace-dotted-box {script_class}">
                <span>{l['char']}</span>
                <span>{l['char']}</span>
                <span>{l['char']}</span>
                <span>[ &nbsp; ]</span>
            </div>
            <div style="font-size: 11px; color: #64748B; text-align: right;">
                <div><strong>{l['name']}</strong> {l['icon']}</div>
                <div>{l['meaning']}</div>
            </div>
        </div>
"""
        html_content += "    </div>\n"

    # 5. Fill in the Blanks Layout
    elif ws_type == "Fill in the Blanks":
        html_content += '    <div style="margin-top: 15px;">\n'
        for s in worksheet_data["sentences"]:
            html_content += f"""        <div style="border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; background: #FAFAFA;">
            <div class="{script_class}" style="font-size: 17px; font-weight: 700; margin-bottom: 4px; color: #047857;">{s['prompt']}</div>
            <div style="font-size: 13px; color: #475569; margin-bottom: 6px;">हिन्दी अर्थ: {s['translation']}</div>
            <div style="font-size: 12px; color: #64748B;">उत्तर: ________________________</div>
        </div>
"""
        html_content += "    </div>\n"

    # 6. Lesson Script Layout
    elif ws_type == "Lesson Script":
        html_content += f"""    <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px; color: #92400E;">
        <strong>🎯 Pedagogical Objective:</strong> {worksheet_data.get('objective', '')} (Target: {worksheet_data.get('grade', '')})
    </div>
    <div>
"""
        for step in worksheet_data["steps"]:
            sat_txt = step.get("sat_olck", "")
            html_content += f"""        <div class="script-step">
            <div class="step-title">{step['step']}</div>
            <div class="step-bilingual">
                <div><strong>Teacher Hindi:</strong> <em>"{step['hin']}"</em></div>
                <div class="{script_class}"><strong>Tribal Spoken:</strong> "{sat_txt}"</div>
            </div>
            <div class="step-action"><strong>Physical Prompt & Action:</strong> {step['action']}</div>
        </div>
"""
        html_content += "    </div>\n"

    # 7. Rhyme Layout
    elif ws_type == "Rhyme Card":
        rhyme = worksheet_data["rhyme"]
        html_content += f"""    <div style="text-align: center; background: #FFFBEB; border: 2px solid #FCD34D; border-radius: 12px; padding: 20px; margin-top: 15px;">
        <h2 style="color: #92400E; margin-top: 0; font-family: 'Outfit', sans-serif;">🎶 {rhyme['title']}</h2>
        <div style="margin: 20px 0;">
"""
        for line in rhyme["lines"]:
            html_content += f"""            <div style="margin-bottom: 14px;">
                <div class="{script_class}" style="font-size: 22px; font-weight: 800; color: #047857;">{line['tribal']}</div>
                <div style="font-size: 14px; color: #475569; font-weight: 600;">{line['hin']}</div>
                <div style="font-size: 12px; color: #94A3B8; font-style: italic;">{line['eng']}</div>
            </div>
"""
        html_content += f"""        </div>
        <div style="background: #FFFFFF; border: 1px dashed #F59E0B; border-radius: 8px; padding: 10px; font-size: 13px; color: #B45309;">
            <strong>Classroom Activity:</strong> {rhyme['activity']}
        </div>
    </div>
"""

    # 8. Assessment Prompts Layout
    elif ws_type == "Assessment Prompts":
        html_content += '    <div style="margin-top: 12px;">\n'
        for q in worksheet_data["questions"]:
            html_content += f"""        <div style="border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 700; color: var(--primary);">{q['q_num']}</span>
                <span style="font-size: 11px; background: #EFF6FF; color: #1D4ED8; padding: 2px 8px; border-radius: 4px; font-weight: 600;">{q['competency']}</span>
            </div>
            <div style="font-size: 14px; color: #334155; margin-bottom: 4px;"><strong>Teacher Prompt (Hindi):</strong> {q['prompt']}</div>
            <div class="{script_class}" style="font-size: 16px; color: #047857; margin-bottom: 8px;"><strong>Tribal Equivalent:</strong> {q['target_q']}</div>
            <div style="display: flex; gap: 20px; font-size: 12px; color: #64748B; border-top: 1px dashed #E2E8F0; padding-top: 6px;">
                <span>Evaluation: [ &nbsp; ] Emerging (🟡)</span>
                <span>[ &nbsp; ] Developing (🟢)</span>
                <span>[ &nbsp; ] Proficient (⭐)</span>
            </div>
        </div>
"""
        html_content += "    </div>\n"

    # 9. Gamified Board Game Layout
    elif ws_type == "Board Game":
        html_content += '    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px;">\n'
        for t in worksheet_data["tiles"]:
            html_content += f"""        <div style="border: 2px solid #059669; border-radius: 12px; padding: 12px; background: #ECFDF5; text-align: center; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="position: absolute; top: 6px; left: 8px; font-weight: 800; font-size: 13px; color: #059669;">#{t['num']}</div>
            <div style="font-size: 32px; margin: 4px 0;">{t['icon']}</div>
            <div class="{script_class}" style="font-size: 18px; font-weight: 800; color: #065F46; margin-bottom: 2px;">{t['sat_olck']}</div>
            <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">{t['name_hin']}</div>
            <div style="font-size: 10px; color: #047857; background: #D1FAE5; padding: 3px 6px; border-radius: 6px;">{t['action']}</div>
        </div>
"""
        html_content += "    </div>\n"

    # Evaluation and Signatures Footer
    html_content += """    <div class="eval-section">
        <div>
            <span>Teacher Evaluation: </span>
            <span class="stars-box">⭐ ⭐ ⭐ ⭐ ⭐</span>
        </div>
        <div>
            <span>Teacher Signature: _______________________</span>
        </div>
    </div>

    <div style="margin-top: 25px; text-align: center; color: #94A3B8; font-size: 11px; border-top: 1px solid #F1F5F9; padding-top: 8px;">
        Generated by SurSetu AI Platform for Tribal Primary Education • Department of School Education & Literacy, Jharkhand
    </div>
</body>
</html>
"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"[EXPORT] Printable HTML Study Material saved to: '{output_path}'")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="SurSetu Comprehensive FLN Study Material Generator")
    parser.add_argument(
        "-t", "--type", choices=["counting", "matching", "flashcards", "tracing", "fill_blanks", "lesson_script", "rhyme", "assessment"], default="matching",
        help="Type of study material to generate"
    )
    parser.add_argument(
        "-l", "--lang", default="sat_Olck", help="Target tribal language (e.g. sat_Olck, sat_Orya, sat_Deva, hoc_Deva, unr_Deva)"
    )
    parser.add_argument(
        "-o", "--output", type=str, default="worksheet_sample.html", help="Output HTML file path"
    )
    args = parser.parse_args()

    print("\n" + "=" * 65)
    print("  SurSetu NIPUN Bharat FLN Study Material Generator")
    print("=" * 65 + "\n")

    ws_data = generate_worksheet(ws_type=args.type, target_lang=args.lang)
    print(f"Generated Material : {ws_data['title']}")
    print(f"Type               : {ws_data['type']}")
    print(f"Language           : {ws_data.get('lang_label', args.lang)}\n")

    export_worksheet_html(ws_data, args.output)


if __name__ == "__main__":
    main()
