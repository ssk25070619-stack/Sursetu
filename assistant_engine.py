"""
SurSetu - AI Pedagogical Assistant Engine (Sur Saathi / ᱥᱩᱨ ᱥᱟᱛᱷᱤ)
-----------------------------------------------------------------------
A specialized AI Teaching Co-Pilot for primary school educators delivering
Mother Tongue-Based Multilingual Education (MTB-MLE) in Jharkhand & Regional Schools.

Core Capabilities:
  1. Instant Classroom Translation & Phrasing (Hindi/English <-> Santali, Ho, Mundari)
  2. NIPUN Bharat Lesson Plan & Activity Generation
  3. Bilingual Storytelling & Folk Rhymes on Demand
  4. Foundational Numeracy & Literacy (FLN) Pedagogical Guidance
  5. Classroom Management, Discipline & Welcoming Commands
  6. 100% Offline-Capable Rule & Knowledge-Based Intelligence
"""

import re
import json
import random
import time

try:
    from translation_engine import UnsupervisedSantaliTranslator, transduce_script
    from worksheets.generator import EXPANDED_VOCAB_BANK, LESSON_SCRIPTS, TRADITIONAL_RHYMES
except ImportError:
    UnsupervisedSantaliTranslator = None
    transduce_script = None
    EXPANDED_VOCAB_BANK = []
    LESSON_SCRIPTS = []
    TRADITIONAL_RHYMES = []


class SurSetuAiAssistant:
    def __init__(self, translator_engine=None):
        self.translator = translator_engine or (UnsupervisedSantaliTranslator() if UnsupervisedSantaliTranslator else None)
        self.name = "Sur Saathi (सुर साथी • ᱥᱩᱨ ᱥᱟᱛᱷᱤ)"

    def answer_query(self, user_message: str, target_lang="sat_Olck", grade="Grade 1") -> dict:
        """
        Process teacher query and return a structured pedagogical response
        with multi-script tribal rendering, phonetics, and actionable classroom suggestions.
        """
        msg = user_message.strip().lower()
        start_time = time.time()

        # Determine Intent
        intent = self._classify_intent(msg)

        if intent == "GREETING":
            resp = self._handle_greeting(target_lang)
        elif intent == "LESSON_PLAN":
            resp = self._handle_lesson_plan(msg, target_lang, grade)
        elif intent == "CLASSROOM_COMMAND":
            resp = self._handle_command_translation(msg, target_lang)
        elif intent == "STORY_RHYME":
            resp = self._handle_story_rhyme(msg, target_lang)
        elif intent == "MATH_NUMERACY":
            resp = self._handle_math_numeracy(msg, target_lang, grade)
        elif intent == "VOCABULARY":
            resp = self._handle_vocabulary_query(msg, target_lang)
        elif intent == "ASSESSMENT":
            resp = self._handle_assessment(msg, target_lang, grade)
        elif intent == "CULTURE_FESTIVAL":
            resp = self._handle_culture(msg, target_lang)
        else:
            resp = self._handle_general_translation_or_chat(user_message, target_lang)

        latency_ms = (time.time() - start_time) * 1000
        resp["latency_ms"] = round(latency_ms, 2)
        resp["intent"] = intent
        resp["target_lang"] = target_lang

        return resp

    def _classify_intent(self, msg: str) -> str:
        if any(w in msg for w in ["नमस्ते", "hello", "hi", "जोहार", "johar", "प्रणाम", "kaise ho", "help"]):
            return "GREETING"
        if any(w in msg for w in ["lesson plan", "पाठ योजना", "योजना", "activity", "गतिविधि", "क्लास कैसे शुरू", "class kaise"]):
            return "LESSON_PLAN"
        if any(w in msg for w in ["बैठो", "खड़े हो", "चुप", "किताब खोलो", "शांत", "sit down", "stand up", "open book", "quiet", "silence", "आदेश", "command", "हाथ धो"]):
            return "CLASSROOM_COMMAND"
        if any(w in msg for w in ["कहानी", "कविता", "गीत", "rhyme", "story", "song", "लोरी", "action song", "चिड़िया"]):
            return "STORY_RHYME"
        if any(w in msg for w in ["गिनती", "गणित", "math", "count", "number", "जोड़", "घटाव", "addition", "subtraction", "1 से 10", "अंक"]):
            return "MATH_NUMERACY"
        if any(w in msg for w in ["फल", "जानवर", "पक्षी", "शरीर", "पेड़", "animal", "fruit", "body", "vegetable", "शब्द", "meaning", "kahte hain", "कहते हैं"]):
            return "VOCABULARY"
        if any(w in msg for w in ["आकलन", "मूल्यांकन", "assessment", "test", "question", "प्रश्न", "diagnostic", "जांच"]):
            return "ASSESSMENT"
        if any(w in msg for w in ["त्योहार", "बाहा", "सरहुल", "सोहराय", "festival", "culture", "परब", "baha", "sohrai", "sarhul"]):
            return "CULTURE_FESTIVAL"
        return "GENERAL_QUERY"

    def _handle_greeting(self, target_lang: str) -> dict:
        return {
            "title": "🙏 जोहार शिक्षक साथी! (Johar Teacher!)",
            "reply_text": (
                "**जोहार! (Johar!)** मैं आपका AI शिक्षक सहायक **Sur Saathi** हूँ।\n\n"
                "मैं प्राथमिक विद्यालयों में संताली (Ol Chiki ᱚᱞ ᱪᱤᱠᱤ & Odia Script), हो (Ho) और मुंडारी (Mundari) में मातृभाषा आधारित शिक्षण (MTB-MLE) को सहज बनाने के लिए तैयार हूँ।\n\n"
                "**आप मुझसे पूछ सकते हैं:**\n"
                "- 🌅 *'कक्षा 1 के लिए संताली में मॉर्निंग सर्कल पाठ योजना बनाओ'* \n"
                "- 💬 *'कक्षा में बच्चों से संताली में किताब खोलने को कैसे कहें?'* \n"
                "- 🔢 *'बच्चों को Ol Chiki में 1 से 10 तक गिनती सिखाने की गतिविधि बताओ'* \n"
                "- 📖 *'चिड़िया और पेड़ पर बच्चों के लिए छोटी द्विभाषी कहानी बताओ'* \n"
                "- 📋 *'NIPUN Bharat के लिए 3 मौखिक आकलन प्रश्न तैयार करो'*"
            ),
            "suggested_chips": [
                "🌅 मॉर्निंग सर्कल पाठ योजना",
                "🔢 1 से 10 तक गिनती गतिविधि",
                "💬 कक्षा अनुशासन निर्देश",
                "🎶 संताली बाल कविता",
                "📋 NIPUN Bharat आकलन प्रश्न"
            ],
            "audio_speak_text": "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱢᱠᱮ! ᱟᱞᱮ ᱟᱢᱟᱜ ᱜᱚᱲᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣ ᱢᱮᱱᱟᱜ ᱞᱮᱭᱟ᱾"
        }

    def _handle_lesson_plan(self, msg: str, target_lang: str, grade: str) -> dict:
        return {
            "title": "📋 NIPUN Bharat MTB-MLE 15-Minute Lesson Plan",
            "reply_text": (
                f"### 🎯 पाठ योजना: मौखिक भाषा विकास एवं परिवेशीय जुड़ाव ({grade})\n"
                "**उद्देश्य:** बच्चों में अपनी मातृभाषा में बोलने की झिझक दूर करना और नए शब्दों से परिचित कराना।\n\n"
                "#### 1️⃣ चरण 1: स्वागत एवं मॉर्निंग सर्कल (3 मिनट)\n"
                "- **शिक्षक बोलें (Hindi):** *'नमस्ते बच्चों! आज आप सब कैसे हैं?'*\n"
                "- **मातृभाषा में बोलें (Ol Chiki):** **`ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱯᱮᱭᱟ?`**\n"
                "- **उच्चारण:** *Johar gidra ko! Ape ched leka menag peya?*\n"
                "- **क्रिया:** हाथ जोड़कर मुस्कुराते हुए जोहार करें।\n\n"
                "#### 2️⃣ चरण 2: चित्र एवं वस्तु पहचान गतिविधि (7 मिनट)\n"
                "- हाथ में एक सेब या पेड़ का चित्र दिखाएं।\n"
                "- **शिक्षक पूछें:** *'यह क्या है?'* ➔ **`ᱱᱚᱣᱟ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?`** *(Nowa do ched kana?)*\n"
                "- **बच्चे उत्तर देंगे:** *'यह पेड़ / फल है'* ➔ **`ᱱᱚᱣᱟ ᱫᱚ ᱫᱟᱨᱮ / ᱡᱚ ᱠᱟᱱᱟ᱾`** *(Nowa do dare / jo kana)*\n\n"
                "#### 3️⃣ चरण 3: दोहराव एवं तालबद्ध बाल गीत (5 मिनट)\n"
                "- बच्चों के साथ मिलकर ताली बजाते हुए 'चिड़िया' (Cheṇe) की कविता गाएं।\n"
                "- **`ᱪᱮᱬᱮ ᱪᱮᱬᱮ ᱫᱟᱨᱮ ᱪᱮᱛᱟᱱ ᱨᱮ, ᱥᱤᱵᱤᱞ ᱥᱤᱵᱤᱞ ᱥᱮᱨᱮᱧ ᱟᱸᱡᱚᱢ ᱢᱮ᱾`**"
            ),
            "suggested_chips": [
                "🔢 गणित गिनती गतिविधि",
                "🃏 इस पाठ के लिए फ्लैशकार्ड बनाओ",
                "📝 वर्कशीट प्रिंट करें",
                "📋 कक्षा समाप्ति निर्देश"
            ],
            "audio_speak_text": "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱯᱮᱭᱟ? ᱛᱮᱦᱮᱧ ᱵᱚᱱ ᱯᱟᱲᱦᱟᱣᱟ᱾"
        }

    def _handle_command_translation(self, msg: str, target_lang: str) -> dict:
        commands = [
            {"hin": "किताब खोलो", "olck": "ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ", "orya": "ପୁଥି ଝିଜ ମେ", "hoc": "पुथी उताकेपे", "unr": "पुथी उताकेपे", "phonetic": "Puthi jhij me", "icon": "📖"},
            {"hin": "सब बैठ जाओ", "olck": "ᱥᱟᱱᱟᱢ ᱠᱚ ᱫᱩᱲᱩᱵ ᱯᱮ", "orya": "ସାନାମ କୋ ଦୁଡ଼ୁବ ପେ", "hoc": "सोबेन दुबुपे", "unr": "सोबेन दुबुपे", "phonetic": "Sanam ko durub pe", "icon": "🪑"},
            {"hin": "खड़े हो जाओ", "olck": "ᱛᱤᱸᱜᱩᱱ ᱢᱮ / ᱯᱮ", "orya": "ତିଙ୍ଗୁନ ମେ", "hoc": "तिंगुपे", "unr": "तिंगुपे", "phonetic": "Tingun pe", "icon": "🧍"},
            {"hin": "शांत रहो / आवाज मत करो", "olck": "ᱛᱷᱤᱨ ᱛᱟᱦᱮᱸᱱ ᱯᱮ", "orya": "ଥିର ତାହେନ ପେ", "hoc": "थिरपे", "unr": "थिरपे", "phonetic": "Thir tahen pe", "icon": "🤫"},
            {"hin": "साफ-साफ लिखो", "olck": "ᱥᱟᱯᱷᱟ ᱚᱞ ᱢᱮ", "orya": "ସାଫା ଅଲ ମେ", "hoc": "सुपुयेते ओलपे", "unr": "सुपुयेते ओलपे", "phonetic": "Sapha ol me", "icon": "✍️"},
            {"hin": "हाथ धो लो", "olck": "ᱛᱤ ᱟᱹᱨᱩᱵ ᱢᱮ", "orya": "ତୀ ଆରୁବ ମେ", "hoc": "ती अकुपे", "unr": "ती अकुपे", "phonetic": "Ti arub me", "icon": "🧼"}
        ]

        rows_md = ""
        for c in commands:
            rows_md += f"| {c['icon']} **{c['hin']}** | **`{c['olck']}`** | *{c['phonetic']}* | `{c['hoc']}` |\n"

        return {
            "title": "🗣️ आवश्यक कक्षा अनुशासन एवं निर्देश (Classroom Commands)",
            "reply_text": (
                "गैर-मातृभाषी शिक्षकों के लिए दैनिक कक्षा संचालन हेतु त्वरित निर्देश तालिका:\n\n"
                "| हिन्दी निर्देश | संताली (Ol Chiki ᱚᱞ ᱪᱤᱠᱤ) | उच्चारण (Phonetic) | हो / मुंडारी |\n"
                "|---|---|---|---|\n"
                + rows_md +
                "\n💡 **शिक्षण सुझाव:** निर्देश बोलते समय हाथ के इशारों (Action Gestures) का प्रयोग अवश्य करें ताकि बच्चे शब्द और क्रिया के संबंध को तेजी से समझ सकें।"
            ),
            "suggested_chips": [
                "📖 किताब खोलो और पढ़ो",
                "🥛 पानी पीने की अनुमति",
                "👏 बच्चों की प्रशंसा के शब्द",
                "🏠 घर जाने के निर्देश"
            ],
            "audio_speak_text": "ᱥᱟᱱᱟᱢ ᱠᱚ ᱫᱩᱲᱩᱵ ᱯᱮ ᱟᱨ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾"
        }

    def _handle_story_rhyme(self, msg: str, target_lang: str) -> dict:
        return {
            "title": "🎶 द्विभाषी बाल कहानी एवं कविता (Bilingual Story & Rhyme)",
            "reply_text": (
                "### 🐦 छोटी कहानी: चिड़िया और हरा पेड़ (ᱪᱮᱬᱮ ᱟᱨ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱫᱟᱨᱮ)\n\n"
                "1. **हिन्दी:** एक सुंदर जंगल में एक छोटी चिड़िया रहती थी।\n"
                "   - **Ol Chiki:** **`ᱢᱤᱫᱴᱟᱝ ᱱᱟᱯᱟᱭ ᱵᱤᱨ ᱨᱮ ᱢᱤᱫᱴᱟᱝ ᱦᱩᱰᱤᱧ ᱪᱮᱬᱮ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟᱭ᱾`**\n"
                "   - *Phonetic:* Mit'ang napay bir re mit'ang hudiny chene tahe' kanay.\n\n"
                "2. **हिन्दी:** वह हर सुबह मीठा गाना गाती थी और नदी से पानी पीती थी।\n"
                "   - **Ol Chiki:** **`ᱩᱱᱤ ᱫᱚ ᱡᱟᱣ ᱥᱮᱛᱟᱜ ᱥᱤᱵᱤᱞ ᱥᱮᱨᱮᱧ ᱥᱮᱨᱮᱧᱟᱭ ᱟᱨ ᱜᱟᱰᱟ ᱠᱷᱚᱱ ᱫᱟᱜ ᱧᱩᱭᱟᱭ᱾`**\n"
                "   - *Phonetic:* Uni do jaw setag sibil serenj serenjay ar gada khon daag nyuyay.\n\n"
                "3. **हिन्दी:** पेड़ ने कहा— 'मेरे प्यारे दोस्त, तुम मेरी शाखाओं पर खेलो।'\n"
                "   - **Ol Chiki:** **`ᱫᱟᱨᱮ ᱢᱮᱱ ᱠᱮᱫ-ᱟ— 'ᱤᱧᱤᱡ ᱯᱮᱭᱟᱨ ᱜᱟᱛᱮ, ᱟᱢ ᱤᱧᱟᱜ ᱰᱟᱹᱨ ᱨᱮ ᱮᱱᱮᱡ ᱢᱮ᱾'`**\n"
                "   - *Phonetic:* Dare men ked-a— 'Injij pear gate, am injag dar re enej me.'\n\n"
                "---\n"
                "### 🎵 कक्षा बाल गीत (Action Rhyme):\n"
                "**`ᱪᱮᱬᱮ ᱪᱮᱬᱮ ᱫᱟᱨᱮ ᱪᱮᱛᱟᱱ ᱨᱮ,`** *(चिड़िया चिड़िया पेड़ के ऊपर,)*\n"
                "**`ᱥᱤᱵᱤᱞ ᱥᱤᱵᱤᱞ ᱥᱮᱨᱮᱧ ᱟᱸᱡᱚᱢ ᱢᱮ᱾`** *(मीठा मीठा गाना सुनाती है।)*\n"
                "**`ᱥᱮᱛᱟᱜ ᱥᱮᱛᱟᱜ ᱥᱤᱝ ᱪᱟᱸᱫᱚ ᱨᱟᱠᱟᱵ-ᱮᱱ,`** *(सुबह-सुबह सूरज निकल आया,)*\n"
                "**`ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱥᱮᱱᱚᱜ ᱚᱠᱛᱚ ᱦᱩᱭ-ᱮᱱ᱾`** *(अब स्कूल जाने का समय हो गया।)*"
            ),
            "suggested_chips": [
                "🖨️ इस कविता की वर्कशीट प्रिंट करें",
                "🐯 बाघ और बकरी की कहानी",
                "🍎 फलों पर आधारित कविता"
            ],
            "audio_speak_text": "ᱪᱮᱬᱮ ᱪᱮᱬᱮ ᱫᱟᱨᱮ ᱪᱮᱛᱟᱱ ᱨᱮ, ᱥᱤᱵᱤᱞ ᱥᱤᱵᱤᱞ ᱥᱮᱨᱮᱧ ᱟᱸᱡᱚᱢ ᱢᱮ᱾"
        }

    def _handle_math_numeracy(self, msg: str, target_lang: str, grade: str) -> dict:
        return {
            "title": "🔢 FLN Foundational Numeracy 1–10 (ᱞᱮᱠᱷᱟ ᱯᱟᱲᱦᱟᱣ)",
            "reply_text": (
                "### 📐 Ol Chiki एवं देवनागरी में 1 से 10 तक अंक चार्ट:\n\n"
                "| अंक | Ol Chiki | संताली उच्चारण | हिन्दी | हो / मुंडारी |\n"
                "|---|---|---|---|---|\n"
                "| **1** | **`᱑`** | **`ᱢᱤᱫ`** *(Mid)* | एक | मियाद (Miyad) |\n"
                "| **2** | **`᱒`** | **`ᱵᱟᱨ`** *(Bar)* | दो | बारिया (Bariya) |\n"
                "| **3** | **`᱓`** | **`ᱯᱮ`** *(Pe)* | तीन | आपिया (Apiya) |\n"
                "| **4** | **`᱔`** | **`ᱯᱩᱱ / ᱯᱳᱱ`** *(Pun)* | चार | उपुनिया (Upuniya) |\n"
                "| **5** | **`᱕`** | **`ᱢᱚᱬᱮ`** *(Mone)* | पांच | मोड़ेया (Moreya) |\n"
                "| **6** | **`᱖`** | **`ᱛᱩᱨᱩᱭ`** *(Turuy)* | छह | तुरुइया (Turuiya) |\n"
                "| **7** | **`᱗`** | **`ᱮᱭᱟᱭ`** *(Eyay)* | सात | एया (Eya) |\n"
                "| **8** | **`᱘`** | **`ᱤᱨᱟᱹᱞ`** *(Iral)* | आठ | इरल (Iral) |\n"
                "| **9** | **`᱙`** | **`ᱟᱨᱮ`** *(Are)* | नौ | अरे (Are) |\n"
                "| **10** | **`᱑᱐`** | **`ᱜᱮᱞ`** *(Gel)* | दस | गेल (Gel) |\n\n"
                "🎯 **कक्षा गतिविधि (कंकड़/पत्तियों से गिनती):**\n"
                "1. बच्चों को 5 कंकड़ (stone pebbles) दें।\n"
                "2. एक-एक कंकड़ उठाते हुए बोलें: **`ᱢᱤᱫ... ᱵᱟᱨ... ᱯᱮ... ᱯᱩᱱ... ᱢᱚᱬᱮ!`**\n"
                "3. श्यामपट्ट (Blackboard) पर अंक **`᱕`** बनाकर उंगली से हवा में लिखने का अभ्यास कराएं।"
            ),
            "suggested_chips": [
                "🖨️ गिनती की वर्कशीट तैयार करें",
                "➕ साधारण जोड़ की गतिविधि",
                "🃏 1 से 10 के फ्लैशकार्ड दिखाओ"
            ],
            "audio_speak_text": "ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱯᱩᱱ, ᱢᱚᱬᱮ, ᱛᱩᱨᱩᱭ, ᱮᱭᱟᱭ, ᱤᱨᱟᱹᱞ, ᱟᱨᱮ, ᱜᱮᱞ᱾"
        }

    def _handle_vocabulary_query(self, msg: str, target_lang: str) -> dict:
        return {
            "title": "📚 संताली / हो / मुंडारी प्राथमिक शब्दावली बैंक",
            "reply_text": (
                "### 🌟 महत्वपूर्ण प्राथमिक परिवेशीय शब्द:\n\n"
                "#### 🌳 प्रकृति एवं पर्यावरण (Nature)\n"
                "- **सूरज (Sun):** `ᱥᱤᱝ ᱪᱟᱸᱫᱚ` *(Sing Chando)* | हो: `सिंगी`\n"
                "- **चांद (Moon):** `ᱧᱤᱸᱫᱟᱹ ᱪᱟᱸᱫᱚ` *(Nyinda Chando)* | मुंडारी: `चांदू`\n"
                "- **पेड़ (Tree):** `ᱫᱟᱨᱮ` *(Dare)* | हो/मुंडारी: `दारु`\n"
                "- **पानी (Water):** `ᱫᱟᱜ` *(Daag)* | हो: `दाः`\n"
                "- **फूल (Flower):** `ᱵᱟᱦᱟ` *(Baha)* | मुंडारी: `बा`\n"
                "- **फल (Fruit):** `ᱡᱚ` *(Jo)* | हो: `जो`\n\n"
                "#### 🐅 पशु एवं पक्षी (Animals & Birds)\n"
                "- **हाथी (Elephant):** `ᱦᱟᱹᱛᱤ` *(Hati)*\n"
                "- **बाघ (Tiger):** `ᱛᱟᱹᱨᱩᱵ` *(Tarub)* | हो: `कुला`\n"
                "- **गाय (Cow):** `ᱜᱟᱹᱭ` *(Gayi)* | मुंडारी: `उरीः`\n"
                "- **चिड़िया (Bird):** `ᱪᱮᱬᱮ` *(Chene)* | हो: `चेड़े`\n"
                "- **मछली (Fish):** `ᱦᱟᱹᱠᱩ` *(Haku)* | मुंडारी: `हाइ`\n\n"
                "#### 👁️ शरीर के अंग (Body Parts)\n"
                "- **आंख (Eye):** `ᱢᱮᱫ` *(Med)*\n"
                "- **कान (Ear):** `ᱞᱩᱛᱩᱨ` *(Lutur)*\n"
                "- **हाथ (Hand):** `ᱛᱤ` *(Ti)*\n"
                "- **पैर (Leg):** `ᱡᱟᱝᱜᱟ` *(Janga)* | हो: `काता`"
            ),
            "suggested_chips": [
                "👨‍👩‍👧 परिवार के संबंध (Family)",
                "🍲 भोजन व दैनिक वस्तुएं",
                "🖨️ शब्दावली मिलान वर्कशीट"
            ],
            "audio_speak_text": "ᱥᱤᱝ ᱪᱟᱸᱫᱚ, ᱫᱟᱨᱮ, ᱫᱟᱜ, ᱵᱟᱦᱟ, ᱦᱟᱹᱛᱤ, ᱪᱮᱬᱮ, ᱢᱮᱫ, ᱛᱤ᱾"
        }

    def _handle_assessment(self, msg: str, target_lang: str, grade: str) -> dict:
        return {
            "title": "📋 NIPUN Bharat FLN मौखिक व लिखित आकलन प्रश्न",
            "reply_text": (
                f"### 🎯 कक्षा {grade} के लिए 4 नैदानिक प्रश्न (Diagnostic Prompts):\n\n"
                "1. **दक्षता L1 (मौखिक शब्दावली):**\n"
                "   - **हिन्दी शिक्षक पूछें:** *'अपने शरीर के 3 अंगों के नाम संताली में बताओ।'* \n"
                "   - **संताली प्रश्न:** **`ᱟᱢᱟᱜ ᱦᱚᱲᱢᱚ ᱨᱮᱱᱟᱜ ᱯᱮᱭᱟ (᱓) ᱦᱟᱹᱴᱤᱧ ᱨᱮᱱᱟᱜ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭ ᱢᱮ᱾`**\n"
                "   - **अपेक्षित उत्तर:** `ᱢᱮᱫ` *(आंख)*, `ᱞᱩᱛᱩᱨ` *(कान)*, `ᱛᱤ` *(हाथ)*\n\n"
                "2. **दक्षता N1 (संख्या ज्ञान):**\n"
                "   - **हिन्दी शिक्षक पूछें:** *'1 से 5 तक Ol Chiki में बोलकर सुनाओ।'* \n"
                "   - **संताली प्रश्न:** **`᱑ ᱠᱷᱚᱱ ᱕ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱟᱸᱡᱚᱢ ᱢᱮ᱾`**\n"
                "   - **अपेक्षित उत्तर:** `ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱯᱩᱱ, ᱢᱚᱬᱮ`\n\n"
                "3. **दक्षता L2 (निर्देश समझ):**\n"
                "   - **शिक्षक बोलें:** **`ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ`** *(किताब खोलो)*\n"
                "   - **जांच:** बच्चा निर्देश सुनकर अपनी किताब खोलता है या नहीं।\n\n"
                "📊 **मूल्यांकन पैमाना:** उभरता हुआ (Emerging 🟡) | प्रगतिशील (Developing 🟢) | निपुण (Proficient ⭐)"
            ),
            "suggested_chips": [
                "🖨️ मुद्रण योग्य मूल्यांकन प्रपत्र बनाएं",
                "📈 उपचारात्मक शिक्षण सुझाव",
                "💬 अभिभावक संवाद टिप्स"
            ],
            "audio_speak_text": "ᱟᱢᱟᱜ ᱦᱚᱲᱢᱚ ᱨᱮᱱᱟᱜ ᱯᱮᱭᱟ ᱦᱟᱹᱴᱤᱧ ᱨᱮᱱᱟᱜ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭ ᱢᱮ᱾"
        }

    def _handle_culture(self, msg: str, target_lang: str) -> dict:
        return {
            "title": "🌺 आदिवासी संस्कृति एवं पर्व-त्योहार (Tribal Heritage)",
            "reply_text": (
                "### 🌸 बाहा परब (Baha Festival / ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ)\n"
                "- **महत्व:** संताल समुदाय का दूसरा सबसे बड़ा पर्व, जो वसंत ऋतु में सखुआ (Sal) और महुआ के नए फूलों के आगमन पर मनाया जाता है।\n"
                "- **शिक्षण बिंदु:** प्रकृति प्रेम, वृक्षों का संरक्षण और आभार प्रकट करना।\n"
                "- **कक्षा संवाद:**\n"
                "  - **`ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱥᱤᱵᱤᱞ ᱯᱚᱨᱚᱵᱽ ᱠᱟᱱᱟ᱾`**\n"
                "  - *(बाहा परब हमारा प्यारा और पवित्र त्योहार है।)*\n\n"
                "### 🌾 सोहराय (Sohrai) / करम (Karam)\n"
                "- फसलों और पशुधन (Cattle) के प्रति आदर व्यक्त करने का पर्व।"
            ),
            "suggested_chips": [
                "🌸 बाहा परब पर बाल कविता",
                "🌳 सरहुल उत्सव का महत्व",
                "🎶 पारंपरिक सोहराय गीत"
            ],
            "audio_speak_text": "ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱥᱤᱵᱤᱞ ᱯᱚᱨᱚᱵᱽ ᱠᱟᱱᱟ᱾"
        }

    def _handle_general_translation_or_chat(self, user_msg: str, target_lang: str) -> dict:
        trans_res = ""
        gemini_insight = ""

        # Try Gemini API if key is available in hybrid or cloud mode
        try:
            from cloud_sync_api import cloud_sync
            if cloud_sync and cloud_sync.config.get("gemini_api_key") and cloud_sync.config.get("mode") != "offline":
                prompt = (
                    f"A primary school teacher in Jharkhand asks: '{user_msg}'.\n"
                    f"Provide an actionable, friendly MTB-MLE pedagogical response for primary school children in "
                    f"Santali (Ol Chiki ᱚᱞ ᱪᱤᱠᱤ) / Ho / Mundari with Hindi bridges. Include phonetic pronunciation."
                )
                g_res = cloud_sync.generate_with_gemini(prompt)
                if g_res.get("success"):
                    gemini_insight = g_res.get("generated_text", "")
        except Exception:
            pass

        if self.translator:
            try:
                res = self.translator.translate(user_msg, "hin_Deva", target_lang)
                trans_res = res["translated_text"]
            except Exception:
                trans_res = ""

        if gemini_insight:
            reply_text = (
                f"### ✨ Sur Saathi AI Pedagogical Guidance\n\n"
                f"{gemini_insight}\n\n"
                + (f"**त्वरित अनुवाद ({target_lang}):** **`{trans_res}`**\n" if trans_res else "")
            )
        else:
            reply_text = (
                f"**आपके प्रश्न का अनुवाद व शिक्षण विश्लेषण:**\n\n"
                f"- **मूल प्रश्न:** *\"{user_msg}\"*\n"
                + (f"- **मातृभाषा अनुवाद ({target_lang}):** **`{trans_res}`**\n\n" if trans_res else "") +
                "💡 **कक्षा शिक्षण सुझाव:** आप इस वाक्य को कक्षा में स्पष्ट उच्चारण के साथ बोलें और श्यामपट्ट पर Ol Chiki लिपि में लिखकर बच्चों से समूह में दोहराने को कहें।"
            )

        return {
            "title": "✨ AI शिक्षण सहायक (Sur Saathi)",
            "reply_text": reply_text,
            "suggested_chips": [
                "📋 इस विषय पर पाठ योजना बनाओ",
                "🔊 उच्चारण सुनो",
                "🃏 फ्लैशकार्ड उत्पन्न करें"
            ],
            "audio_speak_text": trans_res or user_msg
        }


# Global Assistant Instance
ai_assistant = SurSetuAiAssistant()
