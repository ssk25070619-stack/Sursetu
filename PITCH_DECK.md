# 🎯 SMART INDIA HACKATHON 2026 — OFFICIAL PRESENTATION DOSSIER
## Problem Statement ID: SIH26042 | Team ID: SIH2026-0120 | Team Name: VajraRaksha

---

## Slide 1: Title Page
* **Problem Statement ID:** `SIH26042`
* **Problem Statement Title:** `AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education`
* **Theme:** `Smart Education`
* **PS Category:** `Software`
* **Team ID:** `SIH2026-0120`
* **Team Name:** `VajraRaksha`
* **Project Name:** 🌿 **SurSetu (सुर सेतु • ᱥᱩᱨ ᱥᱮᱛᱩ • 𑢹𑣉 𑣞𑣄𑣞𑣄 • 𞓚𞓟𞓗 𞓞𞓎𞓞𞓎)**

> **Speaker Note:**  
> "Good morning, esteemed jury members and delegates. We are Team VajraRaksha presenting SurSetu under Problem Statement SIH26042. Today, over 10 million tribal children in India walk into classrooms where they do not understand the language spoken by their teachers. We are proud to present SurSetu—an edge-native, zero-cloud indigenous AI platform built specifically for mother tongue-based primary education."

---

## Slide 2: Idea Title — Problem & Solution

### 🚨 The Problem: Target 10M+ Tribal Children (Jharkhand, Odisha, West Bengal, Bihar)
1. **Language Barrier:** Children speak indigenous mother tongues at home (Santali, Ho, Mundari, Kurukh) but are taught in Hindi, Odia, or Bengali.
2. **Learning Gap:** Poor comprehension of basic instructions, phonics, and numbers leads to early dropouts and loss of FLN milestones.
3. **Multi-Script Complexity:** Tribal languages are written across multiple scripts (Ol Chiki, Warang Chiti, Mundari Bani, Odia, Devanagari), making content distribution fractured.
4. **Cloud AI Limitations:** 70%+ of primary schools in tribal belts are in 'dark zones' with zero internet, high latency, and high subscription costs.

### 💡 The Solution: SurSetu 4 Core Pillars
1. **Edge-Native Zero-Cloud Architecture:** Standalone platform running entirely on low-cost hardware and bare minimum 2 GB RAM Android phones using PWA with local DSP/ASR pipelines.
2. **Hybrid Dual-Engine Translation Core:** 6-layer Rule-Corpus NLP engine + compact SPM parameter Transformer NMT model.
3. **Phonetic Multi-Script Transducer:** Bidirectional transliteration between scripts (Ol Chiki, Warang Chiti, Mundari Bani, Odia, Devanagari) with Munda dialect support.
4. **Pedagogical Assistant & FLN Generator:** Offline co-pilot with AI worksheet engine generating 8 NIPUN Bharat curriculum formats.

---

## Slide 3: Technical Approach & Performance Metrics

### 🏗️ Technical Architecture
* **Client Browser / PWA Layer:** React 19 + TypeScript + PWA + Service Worker + Mobile 2GB Engine
  * *Speech Studio:* Offline ASR & Speech Recognition
  * *Translation Hub:* Tribal-language Hybrid NLP
  * *Sur Saathi:* AI-Assisted Teacher Support
  * *Worksheet Studio:* Automated FLN Worksheet Engine
* **6-Layer NLP Engine:**
  * Layer 1: Tokenization & Normalization
  * Layer 2: 72k Corpus Exact Match Hash ($O(1)$)
  * Layer 3: Verified Primary Dictionary & Grammar Transform
  * Layer 4: Context Processing & Output Generation
  * Layer 5: Vosk Kaldi ASR & LRU Audio Cache
  * Layer 6: Phonetic Script Transducer
* **Data Layer (All Local Offline Storage):**
  * `72,904+` Parallel Corpus
  * Verified Dictionaries & Datasets
  * Barakhadi / Tracing Resources
  * Native Output: Text, Audio, Worksheets, Games

### ⚡ Verified Benchmark Performance
* **< 100 ms:** Dictionary Lookup ($O(1)$ Hash Map)
* **0.60 ms:** Trie Phrase Matching
* **0.32 RTF:** Real-time Speech Recognition
* **~420 MB RAM (Desktop) / < 40 MB Heap (Mobile):** Optimized edge memory footprint dedicated for 2 GB RAM phones
* **~1.8 s:** Cold Startup Boot Time

---

## Slide 4: Feasibility and Viability

### ✅ Feasibility
* MVP / pilot-ready architecture with working offline workflow.
* Runs on standard school laptops, tablets, and entry-level smartphones with bare minimum 2 GB RAM without GPU.
* Compatible with Android, Windows, Linux, and macOS environments.
* No dedicated cloud infrastructure required for core pedagogical functions.
* Aligns directly with NEP 2020 (§4.11–4.22) and NIPUN Bharat FLN guidelines.

### ⚠️ Challenges, Risks & Mitigation
* **Challenge:** Santali ASR and audio datasets are sparse across regional dialects.
* **Mitigation:** Expanding verified corpus to 100K+ pairs, fine-tuning lightweight acoustic models, and using **Cross-Munda Transfer Learning** across Santali, Ho, and Mundari root lemmas.

### 📈 Viability & Roadmap
* Zero recurring API or cloud hosting cost for schools.
* Local on-device data processing guarantees student privacy and data sovereignty.
* Simple teacher onboarding with physical and digital printouts.

---

## Slide 5: Impacts and Benefits

### 🔄 The Transformation: Translate ➔ Teach ➔ Access
* **Before:** Language barrier, limited learning resources, teacher difficulty in explaining, internet dependency.
* **After:** Better comprehension, higher student participation, effective teaching support, offline & accessible learning.

### 🌍 Real-World Impact Dimensions
* **Educational:** Improved foundational literacy and numeracy (FLN) for primary school children.
* **Affordable:** Ultra cost-effective learning solution with zero recurring software fees.
* **Cultural:** Preserves and digitizes indigenous languages, scripts (Ol Chiki, Warang Chiti), and oral folk heritage.
* **Offline:** 100% operational in dark zones without internet.
* **Scalable:** Readily expandable to Kurukh, Gondi, Kui, and other tribal languages.

---

## Slide 6: Research and References

### 🏛️ Government Initiatives
* **National Education Policy (NEP 2020 §4.11–4.22):** Mother-tongue instruction mandate for primary education.
* **NIPUN Bharat Guidelines:** National Initiative for Proficiency in Reading with Understanding and Numeracy.
* **Mother Tongue-Based Multilingual Education (MTB-MLE):** Pedagogical framework for tribal classrooms.
* **BHASHINI (MeitY / Digital India):** National Language Translation Mission.

### 📚 Academic & Corpus Sources
* **IndicTrans2 (AI4Bharat, 2023):** SOTA Indic Language Translation Models and Benchmarks.
* **Hindi–Mundari Bitext Corpus (Microsoft Research, IIT Kharagpur & Karya Inc., 2023):** Foundational Munda bitext resource.
* **Ol Chiki Orthography & Phonetics Research (Pandit Raghunath Murmu Foundation).**

### 🔗 Project Links
* **Live Demo Web App:** [https://ssk25070619-stack.github.io/Sursetu/](https://ssk25070619-stack.github.io/Sursetu/)
* **GitHub Repository:** [https://github.com/ssk25070619-stack/Sursetu](https://github.com/ssk25070619-stack/Sursetu)
* **Official Video Walkthrough:** [https://youtu.be/uIZi-zK9w3M](https://youtu.be/uIZi-zK9w3M)
