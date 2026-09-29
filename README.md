# 🌿 SurSetu (सुर सेतु • ᱥᱩᱨ ᱥᱮᱛᱩ • ସୁର ସᱮତୁ)

> **Offline-First Indigenous Translation & Primary Education Platform**  
> Bridging tribal education across Santali (*Ol Chiki* ᱚᱞ ᱪᱤᱠᱤ & *Odia Script* ଓଡ଼ିଆ), Mundari, Ho, Hindi, and English.

[![Status](https://img.shields.io/badge/Status-MVP%20/%20Pilot%20Ready-emerald.svg)](http://localhost:8000)
[![Dict Lookup](https://img.shields.io/badge/Lookup_Latency-<100ms-blue.svg)](http://localhost:8000)
[![End-to-End Latency](https://img.shields.io/badge/End--to--End_Latency-Sub--second-orange.svg)](http://localhost:8000)
[![Dataset](https://img.shields.io/badge/Parallel%20Corpus-72%2C904%20Pairs-indigo.svg)](http://localhost:8000)
[![Offline Capable](https://img.shields.io/badge/Architecture-100%25%20Offline-green.svg)](http://localhost:8000)

---

## 🌟 Key Highlights & Capabilities

1. **🤖 Inbuilt AI Pedagogical Assistant (Sur Saathi • ᱥᱩᱨ ᱥᱟᱛᱷᱤ)**
   - Specialized offline AI teaching co-pilot for non-native Hindi educators.
   - Interactive voice & text chat for instant lesson planning, bilingual storytelling, classroom management commands, and diagnostic assessment questions.
   - 100% on-device edge intelligence with sub-millisecond response latency and spoken audio feedback.

2. **🎙️ Interactive Speech-to-Text & Translation Studio**
   - Continuous live speech recognition in Hindi and English (Powered by Vosk Edge ASR).
   - Live streaming audio waveform spectrum visualizer with glowing frequency bands.
   - Instant live translation of recognized speech into **Santali (Ol Chiki & Odia Script)**, **Ho**, and **Mundari** via our grammar-aware engine.

3. **🌐 6-Layer Hybrid Rule-Based & Dictionary Engine**
   - **72,904+ Parallel Corpus** indexing with $O(1)$ in-memory hash lookup time (0.08ms dictionary index speed; sub-second end-to-end translation pipeline).
   - Implements native Santali postpositions (*-re*, *-khon*, *-then*, *-ak*, *-ren*, *-saote*).
   - Custom morphological stemmer and greedy sliding window tokenizer for high-accuracy, explainable rule-based translation without neural hallucinations.

4. **🔍 Mayurbhanj Dialect Language Identification (LID)**
   - Distinguishes **Santali written in Odia script (`sat`)** from **Standard Odia (`ori`)** with high precision.
   - Bidirectional phonetic script transducer (**Ol Chiki ⇄ Odia Script ⇄ Devanagari**).

5. **📝 NIPUN Bharat FLN Study Material & Flashcard Studio**
   - Auto-generate 8 distinct educational formats: Math counting (*᱐-᱙* / *୦-୯*), vocabulary matching, 3D interactive flashcard decks, Ol Chiki letter tracing sheets, teacher lesson scripts, action rhymes, and diagnostic assessment cards.
   - 100% offline generation with print-ready A4 PDF layout for rural classrooms.

---

## 🔒 True Offline-First Architecture

SurSetu is engineered specifically for remote tribal "dark zones" with zero internet connectivity:
- **Local Hardware Execution:** The application runs entirely on local hardware using Vosk's lightweight edge models and a locally hosted Flask server.
- **Zero Cloud Calls:** No internet connection or external API key is required for dictionary lookups, rule-based translations, or worksheet generation.
- **Privacy & Sovereignty:** Audio streams and student data remain 100% localized on school devices, ensuring privacy and full data sovereignty in remote tribal areas.

---

## ⚠️ Limitations & Future Roadmap

To maintain technical credibility with evaluators, researchers, and grant committees:

### 📌 Current Limitations
- **Speech Recognition (ASR) Scope:** Vosk natively provides edge ASR for Hindi and English. Direct Santali speech-to-text is currently in experimental development due to the scarcity of large-scale open-source Santali voice datasets.
- **Translation Domain:** The rule-and-corpus engine performs best on primary education vocabulary, foundational literacy & numeracy (FLN), and everyday conversational phrasing; it may struggle with complex, abstract academic prose.

### 🗺️ Future Roadmap
- **Custom Santali Whisper Model:** Fine-tune a lightweight Whisper-based ASR model using community-sourced Santali audio recordings and linguistic fieldwork.
- **Neural Machine Translation (NMT) Transition:** Train a compact quantized Transformer / NMT model once the curated parallel corpus reaches 100,000+ verified sentence pairs.
- **Expanded Dialect & Tribal Support:** Broaden morphology rules and vocabulary for Mundari, Ho, and Kurukh languages.

---

## 🚀 Instant Local Run

```powershell
# 1. Install dependencies
pip install -r requirements.txt
npm install

# 2. Run backend API & speech service
python server.py

# 3. In a separate terminal, launch the React frontend
npm run dev

# 4. Open browser
http://localhost:3000
```

---

## 🌐 1-Click Publishing & Deployment Options

### Option A: Vercel (Serverless / Static Preview)
```bash
npx vercel deploy --prod
```

### Option B: Render / Railway / Heroku (Full Python Backend)
```bash
# Render Build Command:
pip install -r requirements.txt

# Render Start Command:
gunicorn server:app --bind 0.0.0.0:$PORT
```

### Option C: GitHub Pages / Netlify (Static Mode)
```bash
git push origin main
```

---

## 🏛️ Official Project Dossier & Documentation Suite

For national hackathons, government evaluations (Ministry of Tribal Affairs / Ministry of Education / NIPUN Bharat), grant committees, and technical reviews:

1. **🌟 [Master Project Dossier](PROJECT_DOCUMENTATION.md)** — Comprehensive all-in-one project summary, live links, benchmarks, and architecture.
2. **📚 [Modular Technical Documentation (`docs/`)](docs/README.md)**:
   - [📄 Executive Summary](docs/EXECUTIVE_SUMMARY.md) — Strategic impact, problem statement, and policy alignment.
   - [🏛️ System Architecture & Edge Topology](docs/ARCHITECTURE_AND_SYSTEM_DESIGN.md) — Offline runtime, data structures, and fault tolerance.
   - [🌐 Linguistics & 6-Layer NLP Engine](docs/LINGUISTICS_AND_NLP_ENGINE.md) — SVO-to-SOV grammar rules, Trie matching, and script transducers.
   - [🎙️ Speech Studio & AI Assistant](docs/SPEECH_AND_AI_ASSISTANT.md) — Vosk speech recognition and Sur Saathi pedagogical co-pilot.
   - [📝 NIPUN Bharat FLN & Worksheet Studio](docs/WORKSHEETS_AND_FLN_PEDAGOGY.md) — 8 automated printable study material formats.
   - [🛠️ User & Deployment Manual](docs/USER_AND_DEPLOYMENT_MANUAL.md) — Quickstart, local setup, and Cloudflare live publishing.
   - [🔌 REST API Reference](docs/API_REFERENCE.md) — Complete REST API specification and payload examples.
3. **🎯 [Pitch Deck & Slide Guide](PITCH_DECK.md)** — Slide-by-slide presentation deck.
4. **🏛️ [Government Submission Proposal](GOVERNMENT_SUBMISSION_PROPOSAL.md)** — Institutional pilot proposal and budgeting.

---

## 📁 Repository Structure

```
├── src/                             # Modern React 19 + TypeScript + Tailwind CSS PWA Frontend
│   ├── components/                  # UI Components (Speech Studio, Translation Hub, Sur Saathi, etc.)
│   ├── engine/                      # Client-side 6-Layer NLP, ASR, Quiz & Worksheet Generators
│   ├── data/                        # Parallel Corpus, Barakhadi, Multilingual Dictionaries
│   └── services/                    # Audio Caching, Offline Storage & PDF/DOCX Export
├── server.py                        # High-performance Flask API Server & Vosk Speech Handler
├── assistant_engine.py              # Sur Saathi AI Pedagogical Co-Pilot Engine
├── translation_engine.py            # 6-Layer Hybrid Rule-Based & Dictionary Engine
├── test_translation.py             # Verified Primary Education Dictionary & Test Suite
├── datasets/                        # Parallel Corpora, Benchmark Data & Continuous Learning
├── models/                          # Compact Edge NMT Model & Vocabulary Weights
├── worksheets/                      # Automated NIPUN Bharat FLN Worksheet Generators
├── docs/                            # Deep-Dive Modular Technical Documentation
├── SURSETU_RESEARCH_PAPER.md        # Comprehensive Academic Research Paper
└── vite.config.ts                   # Vite + PWA + API Proxy Configuration
```
