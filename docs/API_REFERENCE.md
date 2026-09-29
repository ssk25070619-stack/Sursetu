# 🔌 SurSetu — REST API Reference

The SurSetu server provides a high-speed, CORS-enabled REST API for translation, offline speech transcription, language identification, AI pedagogical assistance, and study material generation.

**Base URL:** `http://localhost:8080` (or the active Cloudflare HTTPS live tunnel).

---

## 1. System & Health Endpoints

### `GET /api/status` or `GET /api/health`
Checks backend engine status, loaded dictionary languages, Vosk acoustic model state, and memory count.

**Response `200 OK`:**
```json
{
  "status": "online",
  "version": "1.2.0",
  "engine": "Adaptive & Unsupervised Multi-Layer Engine",
  "vosk_model_loaded": true,
  "dictionary_languages": ["hin_Deva", "eng_Latn"],
  "learned_words_count": 382,
  "offline_ready": true
}
```

---

## 2. Translation & Linguistic Endpoints

### `POST /api/translate`
High-speed grammar-aware translation from Hindi or English into Santali scripts or companion dialects.

**Request Body:**
```json
{
  "text": "This is a tree",
  "src": "eng_Latn",
  "tgt": "sat_Olck",
  "force_offline": true
}
```

**Response `200 OK`:**
```json
{
  "original_text": "This is a tree",
  "translated_text": "ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱹᱝ ᱫᱟᱨᱮ ᱠᱟᱱᱟ",
  "source_language": "eng_Latn",
  "target_language": "sat_Olck",
  "confidence": 0.98,
  "mode": "SYNTACTIC_COPULAR_SOV",
  "provider": "SurSetu 6-Layer Offline Edge",
  "latency_ms": 0.52,
  "transliterations": {
    "sat_Olck": "ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱹᱝ ᱫᱟᱨᱮ ᱠᱟᱱᱟ",
    "sat_Orya": "ନᱶଆ ଦ ମିଦଟାଙ ଦାରେ କାନା",
    "sat_Deva": "नᱶआ द मिदटां दारे काना",
    "sat_Latn": "nowa do midtang dare kana"
  }
}
```

---

### `POST /api/transduce_script`
Direct bidirectional phonetic script conversion.

**Request Body:**
```json
{
  "text": "ᱥᱟᱱᱟᱢ ᱠᱚ ᱡᱚᱦᱟᱨ",
  "src_script": "ol_chiki",
  "tgt_script": "odia"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "original_text": "ᱥᱟᱱᱟᱢ ᱠᱚ ᱡᱚᱦᱟᱨ",
  "transduced_text": "ସାନାମ କ ଜହାର",
  "src_script": "ol_chiki",
  "tgt_script": "odia"
}
```

---

### `POST /api/classify_odia_santali`
Classifies whether text written in Odia script is Santali (`sat`) or Standard Odia (`ori`).

**Request Body:**
```json
{
  "text": "ଆମ ଓଲଗ ପଢ଼ହବ ଏମ ବଦୟ ସେ?"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "detected_language": "sat",
  "language_name": "Santali (in Odia Script)",
  "confidence": 0.95,
  "explanation": "Detected Santali enclitics: [ରେ, ଏମ, ବଦୟ]"
}
```

---

### `POST /api/learn`
Registers a new vocabulary pair dynamically into continuous edge memory without retraining.

**Request Body:**
```json
{
  "hindi": "स्मार्टफोन",
  "santali": "ᱥᱢᱟᱨᱴᱯᱷᱳᱱ",
  "tgt_lang": "sat_Olck"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Successfully learned: 'स्मार्टफोन' -> 'ᱥᱢᱟᱨᱴᱯᱷᱳᱱ'",
  "hindi": "स्मार्टफोन",
  "santali": "ᱥᱢᱟᱨᱴᱯᱷᱳᱱ"
}
```

---

## 3. Speech Recognition & Audio Endpoints

### `POST /api/asr/record_hardware_mic`
Records hardware microphone locally, normalizes audio, transcribes with Vosk, and translates immediately.

**Request Body:**
```json
{
  "duration": 3.5,
  "target_lang": "sat_Olck"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "hindi_text": "किताब खोलो",
  "translated_text": "ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ",
  "confidence": 1.0,
  "mode": "EXACT_DICTIONARY",
  "target_lang": "sat_Olck"
}
```

---

### `GET /api/tts`
Synthesizes speech audio for Santali, Hindi, or English text.

**Parameters:**
- `text`: Text string to speak.
- `lang`: Language code (`sat_Olck`, `sat_Orya`, `hin_Deva`, `eng_Latn`).

**Response `200 OK`:**
- Binary MP3 audio stream (`Content-Type: audio/mpeg`).

---

## 4. AI Assistant (PALASH Saathi) Endpoints

### `POST /api/assistant/chat`
Answers pedagogical queries for lesson planning, classroom instructions, bilingual storytelling, and FLN math.

**Request Body:**
```json
{
  "message": "कक्षा 1 के लिए पाठ योजना बनाओ",
  "target_lang": "sat_Olck",
  "grade": "Grade 1"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "title": "📋 NIPUN Bharat MTB-MLE 15-Minute Lesson Plan",
  "reply_text": "### 🎯 पाठ योजना: मौखिक भाषा विकास एवं परिवेशीय जुड़ाव (Grade 1)...",
  "suggested_chips": ["🔢 गणित गिनती गतिविधि", "🃏 फ्लैशकार्ड बनाओ", "📝 वर्कशीट प्रिंट करें"],
  "audio_speak_text": "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱯᱮᱭᱟ?",
  "intent": "LESSON_PLAN",
  "latency_ms": 0.48
}
```

---

## 5. Study Material & Worksheet Endpoints

### `POST /api/worksheets/generate`
Generates print-ready HTML worksheets and study materials.

**Request Body:**
```json
{
  "type": "matching",
  "target_lang": "sat_Olck",
  "grade": "Grade 1",
  "category": "School",
  "title": "Grade 1 School Vocab Matching"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "title": "Grade 1 School Vocab Matching",
  "type": "matching",
  "target_lang": "sat_Olck",
  "lang_label": "Santali (Ol Chiki - ᱚᱞ ᱪᱤᱠᱤ)",
  "html": "<!DOCTYPE html><html>...</html>"
}
```

---

## 6. Offline Speech Synthesis (TTS) Endpoints

### `POST /api/tts/synthesize` or `GET /api/tts/synthesize?text=...&lang=sat_Olck`
Synthesizes pure 16kHz 16-bit Mono Linear PCM WAV audio directly on edge hardware in $<15\text{ms}$.

**Request Body (POST):**
```json
{
  "text": "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ",
  "lang": "sat_Olck"
}
```

**Response `200 OK`:**
* **Content-Type:** `audio/wav`
* **Body:** Binary 16kHz RIFF/WAV audio stream.

---

## 7. Teacher Pilot Telemetry & Feedback Endpoints

### `POST /api/feedback/submit`
Ingests offline teacher session surveys and System Usability Scale (SUS) scores.

**Request Body:**
```json
{
  "teacher_id": "T-JH-01",
  "district": "Ranchi",
  "sus_score": 88.0,
  "ratings": {
    "speech_clarity": 4.8,
    "translation_accuracy": 4.6,
    "worksheet_utility": 5.0,
    "offline_reliability": 5.0
  },
  "qualitative_quote": "A4 tracing sheets are invaluable for our Grade 1 students."
}
```

### `GET /api/feedback/summary`
Returns aggregated System Usability Scale (SUS) scores and pilot deployment statistics.

**Response `200 OK`:**
```json
{
  "success": true,
  "summary": {
    "total_evaluators": 3,
    "system_usability_scale_sus": 86.5,
    "sus_grade": "A+ (Excellent)",
    "average_ratings_5_star": {
      "speech_clarity": 4.63,
      "translation_accuracy": 4.57,
      "worksheet_utility": 4.9,
      "offline_reliability": 5.0,
      "overall_satisfaction": 4.8
    }
  }
}
```
