# 📚 SurSetu — Master Documentation Directory

Welcome to the official technical and pedagogical documentation suite for **SurSetu (SurSetu)** — the Offline-First Indigenous Language AI Bridge for Primary Education in Mother Tongue Multilingual Education (MTB-MLE).

---

## 📑 Documentation Index

| Document | Description | Target Audience |
|---|---|---|
| [1. Executive Summary](file:///d:/Sursetu-main/Sursetu-main/docs/EXECUTIVE_SUMMARY.md) | High-level overview, problem statement, solution, impact metrics, and NEP 2020 alignment | Evaluators, Grant Committees, Government Officials |
| [2. System Architecture & Edge Topology](file:///d:/Sursetu-main/Sursetu-main/docs/ARCHITECTURE_AND_SYSTEM_DESIGN.md) | Complete end-to-end architecture, offline edge runtime, PWA service workers, caching, and dataflow | Software Architects, System Evaluators |
| [3. NLP, Linguistics & Multi-Script Engine](file:///d:/Sursetu-main/Sursetu-main/docs/LINGUISTICS_AND_NLP_ENGINE.md) | 6-Layer hybrid MT pipeline, PrefixTrie $O(K)$ matching, SVO-to-SOV grammar parser, script transducer | NLP Researchers, Linguists, Developers |
| [4. Offline Speech Studio & AI Assistant](file:///d:/Sursetu-main/Sursetu-main/docs/SPEECH_AND_AI_ASSISTANT.md) | Vosk acoustic speech recognition, DSP audio filtering, and PALASH Saathi pedagogical co-pilot | AI Engineers, Educators |
| [5. NIPUN Bharat FLN & Worksheet Studio](file:///d:/Sursetu-main/Sursetu-main/docs/WORKSHEETS_AND_FLN_PEDAGOGY.md) | Foundational Literacy & Numeracy (FLN) study materials, interactive flashcards, and Tribal Quest game | Curriculum Designers, Teachers |
| [6. User & Deployment Guide](file:///d:/Sursetu-main/Sursetu-main/docs/USER_AND_DEPLOYMENT_MANUAL.md) | Setup, dependency management, offline hardware deployment, Cloudflare tunnel live publishing | System Administrators, Users |
| [7. REST API Reference](file:///d:/Sursetu-main/Sursetu-main/docs/API_REFERENCE.md) | Exhaustive REST API specification with endpoints, payloads, response schemas, and curl examples | Integrators, Developers |

---

## 🌟 Quick Platform Summary

- **Primary Mission:** Eliminate the language barrier for 10M+ indigenous tribal children entering primary schools in Jharkhand, Odisha, West Bengal, and Bihar.
- **Supported Languages & Scripts:**
  - **Santali:** Ol Chiki Script (ᱚᱞ ᱪᱤᱠᱤ) & Odia Script (ଓଡ଼ିଆ ଲିପି)
  - **Ho:** Devanagari & Warang Citi scripts (ᱦᱳ)
  - **Mundari:** Devanagari & Ol Onol (ᱢᱩᱱᱰᱟᱨᱤ)
  - **Bridge Languages:** Hindi (हिन्दी) & English
- **Offline Guarantee:** 100% functional without internet connectivity or external API subscriptions.
- **Latency Benchmark:** $0.00\text{ ms}$ average offline dictionary/rule latency; $<0.8\text{ ms}$ Trie multi-word matching across 72,900+ corpus records.
