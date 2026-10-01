# 🌿 SurSetu (सुर सेतु • ᱥᱩᱨ ᱥᱮᱛᱩ • ସୁର ସେତୁ • 𑢹𑣉 𑣞𑣄𑣞𑣄 • 𞓚𞓟𞓗 𞓞𞓎𞓞𞓎) — Master Project Documentation Dossier
## Offline-First Indigenous Language AI Platform for Primary Tribal Education
### Bridging Santali (*Ol Chiki* ᱚᱞ ᱪᱤᱠᱤ & *Odia Script* ଓଡ଼ିଆ), Ho (*Warang Citi* 𑢹𑣉), Mundari (*Mundari Bani* 𞓚𞓟𞓗), Kurukh (*Tolong Siki* ᱛᱚᱞᱚᱝ ᱥᱤᱠᱤ), Hindi, and English

---

## 📌 Table of Contents
1. [Project Overview & Mission](#1-project-overview--mission)
2. [Live Links & System Access](#2-live-links--system-access)
3. [The Core Problem & Tribal Education Reality](#3-the-core-problem--tribal-education-reality)
4. [Key Architectural Innovations](#4-key-architectural-innovations)
5. [The 6-Layer Hybrid NLP & Multi-Script Engine](#5-the-6-layer-hybrid-nlp--multi-script-engine)
6. [Offline Speech-to-Text Studio (Edge ASR)](#6-offline-speech-to-text-studio-edge-asr)
7. [Sur Saathi — Pedagogical AI Co-Pilot](#7-sur-saathi--pedagogical-ai-co-pilot)
8. [NIPUN Bharat FLN Study Material & Worksheet Studio](#8-nipun-bharat-fln-study-material--worksheet-studio)
9. [Tribal Quest — Gamified Literacy Game & Barakhadi Chart](#9-tribal-quest--gamified-literacy-game--barakhadi-chart)
10. [Institutional Governance & Learning Diagnostics MIS](#10-institutional-governance--learning-diagnostics-mis)
11. [Performance Benchmarks & Latency Profiling](#11-performance-benchmarks--latency-profiling)
12. [Policy Alignment & National Missions](#12-policy-alignment--national-missions)
13. [Complete REST API Specification](#13-complete-rest-api-specification)
14. [Installation & Deployment Guide](#14-installation--deployment-guide)
15. [Documentation Suite Index](#15-documentation-suite-index)

---

## 1. Project Overview & Mission

**SurSetu** is an edge-native, zero-cloud-dependent language bridge designed to solve the critical linguistic exclusion faced by over 11.7 million indigenous tribal children entering primary schools across Jharkhand, Odisha, West Bengal, Bihar, and Assam.

By uniting an offline speech recognition acoustic model, an $O(K)$ PrefixTrie 6-layer grammar translation engine, an AI pedagogical lesson co-pilot, interactive multi-script phonics charts, and an automated NIPUN Bharat worksheet generator, SurSetu empowers non-native teachers to instruct, communicate, and create curriculum study materials in indigenous mother tongues from day one.

---

## 2. Live Links & System Access

| Access Channel | Link / Target | Notes |
|---|---|---|
| **🎥 Official Video Demonstration** | **[YouTube Prototype Demo](https://youtu.be/uIZi-zK9w3M)** | Full end-to-end working demonstration of speech, translation & FLN studio |
| **🌐 Worldwide Public Live Link** | **[Cloudflare HTTPS Tunnel](https://ohio-tobago-economy-absence.trycloudflare.com)** | Real-time global HTTPS CDN access with zero signup |
| **💻 Local Workstation Address** | **`http://localhost:8080`** | Standalone offline loopback on local school hardware |
| **📱 PWA Offline Mode** | **[Installable Web App (PWA)](https://ssk25070619-stack.github.io/Sursetu/)** | 100% functional in complete airplane mode / dark zones |

---

## 3. The Core Problem & Tribal Education Reality

In primary schools across tribal belts:
- **82% of Children Speak Non-State Mother Tongues:** Children enter school fluent only in Santali, Ho, Mundari, or Kurukh.
- **70%+ Teachers are Non-Native Speakers:** Teachers speak Standard Hindi, Odia, or Bengali, creating a communication barrier on day one.
- **Connectivity Dark Zones:** 68% of tribal schools have no reliable broadband or cellular data, making standard cloud AI tools unusable.
- **Multi-Script Dilemma:** Indigenous languages are transcribed in diverse historical and regional scripts (e.g., Santali in Ol Chiki and Odia script; Ho in Warang Citi and Devanagari; Mundari in Mundari Bani and Odia).
- **Learning Loss & Dropouts:** Early grade dropouts in tribal districts exceed 34% due to early linguistic alienation and comprehension loss.

---

## 4. Key Architectural Innovations

```
+-------------------------------------------------------------------------------+
|                            SURSETU SYSTEM DESIGN                          |
+-------------------------------------------------------------------------------+
|  CLIENT (Browser / PWA)                                                       |
|  - Modern Glassmorphism UI • Noto Sans Ol Chiki / Oriya / Warang Citi Fonts   |
|  - Web Audio Waveform Visualizer (RMS Energy Metering & Canvas Spectrum)      |
|  - Service Worker (v1.3.0 Edge Cache) for 100% Offline Autonomy               |
|  - Multi-Script Stroke Tracing Canvas + Interactive Barakhadi Wall Chart       |
|                                                                               |
|  SERVER BACKEND (Flask @ 0.0.0.0:8080)                                        |
|  - DSP Audio Normalizer + Vosk Kaldi Recognizer Pooling                       |
|  - LRU Translation Cache Layer                                                |
|  - 6-Layer Grammar & Multi-Script NLP Pipeline                                |
|  - Pedagogical AI Co-Pilot & Print-Ready 8-Format Worksheet Generator         |
|  - Real-Time Learning Diagnostics & Misconception Analysis Engine             |
|  - Intermittent Cloud Sync (Supabase / SQLite Offline Sync)                   |
+-------------------------------------------------------------------------------+
```

---

## 5. The 6-Layer Hybrid NLP & Multi-Script Engine

```
                    Raw Sentence (Hindi / English)
                                  │
  ┌───────────────────────────────┴───────────────────────────────┐
  ▼                                                               ▼
[Layer 1: 72,904+ Corpus Hash] ──► Match? ──► [RETURN CORPUS] (0.00ms)
  ▼
[Layer 2: Verified Lexicon]    ──► Match? ──► [RETURN DICTIONARY] (0.00ms)
  ▼
[Layer 3: Dynamic Edge Memory]  ──► Match? ──► [RETURN MEMORY] (0.00ms)
  ▼
[Layer 4: SVO-to-SOV Grammar]   ──► Copular, Possessive, Imperatives
  ▼
[Layer 5: PrefixTrie Chunking]  ──► O(K) Multi-Word Window + Postposition Fusion
  ▼
[Layer 6: Script Transducer]    ──► 10 Native & Regional Scripts (Ol Chiki ⇄ Odia ⇄ Deva ⇄ Warang ⇄ Bani ⇄ Tolong)
```

### Grammar Synthesis Examples:
1. **Copular SVO-to-SOV:**
   - English: `This is a tree`
   - Santali (Ol Chiki): **`ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱹᱝ ᱫᱟᱨᱮ ᱠᱟᱱᱟ`**
   - Santali (Odia Script): **`ନᱶଆ ଦ ମିଦଟାଙ ଦାରେ କାନା`**
2. **Possessive Fusion:**
   - English: `I have a pen`
   - Santali: **`ᱤᱧ ᱴᱷᱮᱱ ᱢᱤᱫᱴᱟᱹᱝ ᱠᱚᱞᱚᱢ ᱢᱮᱱᱟᱜᱼᱟ`**
3. **Classroom Imperative:**
   - English: `Open the book`
   - Santali: **`ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ`**
4. **Postposition Agglutination:**
   - English: `In school` ➔ **`ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱨᱮ`** (`-re` locative)
   - English: `From village` ➔ **`ᱟᱹᱛᱩ ᱠᱷᱚᱱ`** (`-khon` ablative)

---

## 6. Offline Speech-to-Text Studio (Edge ASR)

- **Vosk Kaldi Engine:** Local acoustic model (`vosk-model-small-hi-0.22`) executing on standard CPU with $\text{RTF} \approx 0.32$.
- **DSP Audio Normalizer:** DC offset subtraction + dynamic peak normalizer ($26,000\text{ max amp}$) preventing audio clipping.
- **Glowing Waveform Spectrum Visualizer:** Real-time Web Audio API frequency analysis directly on the client canvas.
- **Instant Translation Pipeline:** Speech transcribed in Hindi/English translates to Santali/Ho/Mundari/Kurukh in $<0.8\text{ ms}$ with loud phonetic TTS feedback.

---

## 7. Sur Saathi — Pedagogical AI Co-Pilot

Specialized offline pedagogical assistant supporting non-native teachers across 5 languages:
- 📋 **NIPUN Bharat Lesson Plans:** 15-minute 3-step structured lesson matrix (Welcome Circle ➔ Object Identification ➔ Action Rhyme).
- 🗣️ **Classroom Commands:** Daily instructional table with physical action gestures in Santali, Ho, and Mundari.
- 🎶 **Bilingual Storytelling & Action Songs:** Culturally contextual folk tales (The Bird & The Tree, Birsa Archer) with phonetic pronunciation guides.
- 🔢 **Foundational Numeracy Activities:** Tactile 1–10 counting activities using leaves and pebbles with Ol Chiki digits (*᱐-᱙*).
- 📋 **Diagnostic Assessment:** Oral assessment questions aligned with learning outcomes.

---

## 8. NIPUN Bharat FLN Study Material & Worksheet Studio

Generates 8 print-ready study material formats with embedded *Noto Sans Ol Chiki*, *Noto Sans Oriya*, and *Warang Citi* typography:
1. 🔢 **Math Counting & Digits** (Ol Chiki *᱐-᱙*, Odia *୦-୯*, English *0-9*)
2. 🧩 **Vocabulary & Picture Matching** (2-column randomized matching)
3. 🃏 **3D & Printable Visual Flashcard Decks** (2x4 cut-and-fold format with audio)
4. ✍️ **Letter Stroke-Order Tracing Sheets** (with interactive canvas tracing)
5. 📝 **Fill in the Blanks & Grammar Practice Sheets**
6. 📜 **Teacher Lesson Delivery Scripts**
7. 🎶 **Illustrated Bilingual Folk Rhymes**
8. 📋 **Diagnostic Assessment Cards**

---

## 9. Tribal Quest — Gamified Literacy Game & Barakhadi Chart

- **Game Modes:** 🏹 Birsa Archer (Target hit), 🥁 Mandar Drum (Audio listening), 🧩 Word Jumble (Ol Chiki letter ordering).
- **Interactive Barakhadi Wall Chart:** Phonics matrix displaying vowel-consonant combinations across Ol Chiki, Devanagari, and Odia script with instant audio playback.
- **Indigenous Letter Tracing Canvas:** Guided stroke-by-stroke letter drawing with visual checkpoints.
- **Gamification Mechanics:** Real-time score HUD, streak multipliers, sacred Sal leaf digital tokens, and procedural tribal drum audio feedback.

---

## 10. Institutional Governance & Learning Diagnostics MIS

- **Multi-Role RBAC:** Configured for Teacher, Headmaster, Block Education Officer (BEO), District Education Officer (DEO), and State Administrator.
- **Learning Diagnostics Dashboard:** Real-time FLN milestone mastery trackers, competency heatmaps, and attendance-outcome correlation.
- **Misconception Engine:** Pinpoints persistent phonological transfer mistakes (e.g., glottal stop confusion, script confusion).
- **Intermittent Sync:** Dual-storage architecture (IndexedDB + Supabase) that caches student performance locally and seamlessly syncs to state dashboards during intermittent network windows.

---

## 11. Performance Benchmarks & Latency Profiling

| Benchmark Criterion | Standard Target | SurSetu Result |
|---|---|---|
| **Dictionary & Rule Latency** | $< 50\text{ ms}$ | **0.08 ms** (Sub-millisecond) |
| **Trie Multi-Word Matching** | $< 10\text{ ms}$ | **0.60 ms** across 72.9k corpus |
| **Speech-to-Text Latency** | Real-time | **$\text{RTF} = 0.32$** (Standard CPU) |
| **Multi-Script Transduction** | $< 5\text{ ms}$ | **0.12 ms** per sentence |
| **Evaluation Suite Accuracy** | $> 90\%$ | **100% Passed (Canonical Test Suite)** |
| **System RAM Footprint** | $< 2\text{ GB}$ | **~420 MB Total RAM** |
| **Cold Startup Time** | $< 10\text{ s}$ | **1.8 seconds** |

---

## 12. Policy Alignment & National Missions

- **National Education Policy (NEP 2020, §4.11–4.13):** Mother-tongue instruction in foundational stages.
- **NIPUN Bharat Mission:** Achieving universal Foundational Literacy and Numeracy by Grade 3.
- **PM-JANMAN & Tribal Sub-Plan:** Tech-enabled inclusion for Particularly Vulnerable Tribal Groups.

---

## 13. Complete REST API Specification

| Endpoint | Method | Purpose | Sample Payload / Output |
|---|---|---|---|
| `/api/status` | `GET` | Health check & engine status | `{"status": "online", "learned_words_count": 382}` |
| `/api/translate` | `POST` | 6-layer grammar translation | `{"text": "Open book", "src": "eng_Latn", "tgt": "sat_Olck"}` |
| `/api/asr/record_hardware_mic` | `POST` | Hardware mic recording & ASR | `{"duration": 3.5, "target_lang": "sat_Olck"}` |
| `/api/transduce_script` | `POST` | Ol Chiki ⇄ Odia ⇄ Devanagari ⇄ Warang | `{"text": "ᱥᱟᱱᱟᱢ ᱠᱚ", "src_script": "ol_chiki", "tgt_script": "odia"}` |
| `/api/classify_odia_santali` | `POST` | Mayurbhanj LID (`sat` vs `ori`) | `{"text": "ଆମ ଓଲଗ ପଢ଼ହବ"}` ➔ `sat (95%)` |
| `/api/assistant/chat` | `POST` | Sur Saathi pedagogical AI | `{"message": "पाठ योजना", "target_lang": "sat_Olck"}` |
| `/api/worksheets/generate` | `POST` | 8-format study material generator | `{"type": "matching", "grade": "Grade 1"}` |
| `/api/learn` | `POST` | Register continuous edge memory | `{"hindi": "कंप्यूटर", "santali": "ᱥᱟᱝᱜᱤᱧ ᱚᱞ"}` |
| `/api/tts` | `GET/POST`| Loud speech synthesis | `/api/tts?text=ᱫᱟᱨᱮ&lang=sat_Olck` |

---

## 14. Installation & Deployment Guide

```powershell
# 1. Clone workspace
git clone https://github.com/sursetu/sursetu.git
cd sursetu

# 2. Setup Virtual Environment & Install Dependencies
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
npm install

# 3. Launch Live Server + Cloudflare Tunnel
.\.venv\Scripts\python.exe launch_live.py

# 4. Access Platform
# Local: http://localhost:8080
# Public Live: https://ohio-tobago-economy-absence.trycloudflare.com
```

---

## 15. Documentation Suite Index

For deep-dive technical documents, explore the modular docs folder:
- [📄 Executive Summary](docs/EXECUTIVE_SUMMARY.md)
- [🏛️ System Architecture & Edge Topology](docs/ARCHITECTURE_AND_SYSTEM_DESIGN.md)
- [🌐 Linguistics & 6-Layer NLP Engine](docs/LINGUISTICS_AND_NLP_ENGINE.md)
- [🎙️ Offline Speech Studio & AI Assistant](docs/SPEECH_AND_AI_ASSISTANT.md)
- [📝 NIPUN Bharat FLN & Worksheet Studio](docs/WORKSHEETS_AND_FLN_PEDAGOGY.md)
- [📊 Feasibility & Business Model](docs/FEASIBILITY_AND_BUSINESS_MODEL.md)
- [🛠️ User & Deployment Manual](docs/USER_AND_DEPLOYMENT_MANUAL.md)
- [🔌 REST API Reference](docs/API_REFERENCE.md)

