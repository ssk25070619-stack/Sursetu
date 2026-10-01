# 📚 SurSetu — Master Documentation Directory

Welcome to the official technical and pedagogical documentation suite for **SurSetu (SurSetu)** — the Offline-First Indigenous Language AI Bridge for Primary Education in Mother Tongue Multilingual Education (MTB-MLE).

---

## 📑 Documentation Index

| Document | Description | Target Audience |
|---|---|---|
| [1. Executive Summary](EXECUTIVE_SUMMARY.md) | High-level overview, problem statement, solution, impact metrics, and NEP 2020 alignment | Evaluators, Grant Committees, Government Officials |
| [2. System Architecture & Edge Topology](ARCHITECTURE_AND_SYSTEM_DESIGN.md) | Complete end-to-end architecture, offline edge runtime, PWA service workers, caching, and dataflow | Software Architects, System Evaluators |
| [3. NLP, Linguistics & Multi-Script Engine](LINGUISTICS_AND_NLP_ENGINE.md) | 6-Layer hybrid MT pipeline, PrefixTrie $O(K)$ matching, SVO-to-SOV grammar parser, script transducer | NLP Researchers, Linguists, Developers |
| [4. Offline Speech Studio & AI Assistant](SPEECH_AND_AI_ASSISTANT.md) | Vosk acoustic speech recognition, DSP audio filtering, and Sur Saathi pedagogical co-pilot | AI Engineers, Educators |
| [5. NIPUN Bharat FLN & Worksheet Studio](WORKSHEETS_AND_FLN_PEDAGOGY.md) | Foundational Literacy & Numeracy (FLN) study materials, interactive flashcards, and Tribal Quest game | Curriculum Designers, Teachers |
| [6. User & Deployment Guide](USER_AND_DEPLOYMENT_MANUAL.md) | Setup, dependency management, offline hardware deployment, Cloudflare tunnel live publishing | System Administrators, Users |
| [7. REST API Reference](API_REFERENCE.md) | Exhaustive REST API specification with endpoints, payloads, response schemas, and curl examples | Integrators, Developers |
| [8. Feasibility Analysis & Sustainable Business Model](FEASIBILITY_AND_BUSINESS_MODEL.md) | Public sector deployment model, DMFT/CSR funding streams, impact KPIs, and 4-phase roadmap | Government Officials, Grant Committees, Evaluators |

---

## 🌟 Quick Platform Summary

- **Primary Mission:** Eliminate the language barrier for 11.7M+ indigenous tribal children entering primary schools in Eastern India.
- **Supported Languages & Scripts:**
  - **Santali:** Ol Chiki Script (ᱚᱞ ᱪᱤᱠᱤ), Odia Script (ଓଡ଼ିଆ ଲିପି), Devanagari, and Latin
  - **Ho:** Warang Citi (𑢹𑣉), Devanagari, and Odia
  - **Mundari:** Mundari Bani (𞓚𞓟𞓗), Devanagari, and Odia
  - **Kurukh (Oraon):** Tolong Siki (ᱛᱚᱞᱚᱝ ᱥᱤᱠᱤ) & Devanagari
  - **Bridge Languages:** Hindi (हिन्दी) & English
- **Offline Guarantee:** 100% functional without internet connectivity or external API subscriptions.
- **Latency Benchmark:** $0.00\text{ ms}$ average offline dictionary/rule latency; $<0.8\text{ ms}$ Trie multi-word matching across 72,900+ corpus records.
