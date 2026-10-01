# 📜 SurSetu Changelog & Version History

All notable changes to the **SurSetu** offline indigenous education and translation platform are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-01 — *Official SIH Pilot Ready Release*

### 🚀 Major Features & Additions
- **Native Android Platform (`android/`):** Full Capacitor integration with Gradle wrapper, `AndroidManifest.xml`, and automated APK build workflows (`.github/workflows/build-apk.yml`).
- **72,904 Verified Multi-Script Parallel Corpus:** Added [`datasets/corpus_metadata.json`](datasets/corpus_metadata.json) and [`datasets/verify_corpus_dataset.py`](datasets/verify_corpus_dataset.py) verifying 72,904 rows across Ol Chiki, Odia, and Devanagari.
- **Single-Command Live Demo Runner:** Added [`demo_walkthrough.py`](demo_walkthrough.py) for instantaneous terminal walkthrough of speech, translation, lesson plans, and worksheets in $<1.5\text{s}$.
- **Automated GitHub Actions CI/CD:** Added [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) for continuous testing and automated GitHub Pages PWA deployment.
- **Official Demo Video:** Embedded official YouTube walkthrough (`https://youtu.be/uIZi-zK9w3M`) across README and documentation suite.
- **50-Sentence Empirical Baseline Evaluation:** Benchmarked against Google Translate, Bhashini, and NLLB-200 with $0.229\text{ms}$ average MT latency.

### 🌐 Linguistic & Pedagogical Core
- **6-Layer Hybrid NLP Engine:** In-memory $O(1)$ Hash + $O(K)$ PrefixTrie, SVO-to-SOV grammar reordering, and native Munda postposition fusion (`-re`, `-khon`, `-then`, `-ak`, `-ren`, `-saote`).
- **10-Script Support across 4 Indigenous Languages:** Santali (*Ol Chiki*, *Odia*, *Deva*, *Latin*), Ho (*Warang Citi*, *Deva*, *Odia*), Mundari (*Mundari Bani*, *Deva*, *Odia*), Kurukh (*Tolong Siki*, *Deva*).
- **Mayurbhanj Dialect Language Identification (LID):** Distinguishes Odia-script Santali from Standard Odia with $>98.4\%$ precision.
- **Sur Saathi Pedagogical AI Co-Pilot:** 100% offline edge assistant generating 3-step NIPUN Bharat lesson plans, classroom action commands, and bilingual folk storytelling.
- **8-Format Printable FLN Worksheet Studio:** Automated Math counting, picture matching, 3D flashcards, and stroke tracing canvas with A4 PDF export.

---

## [0.9.0] - 2026-09-25 — *Core NLP & Speech Studio Prototype*
- Vosk Kaldi offline speech-to-text integration (`vosk-model-small-hi-0.22`).
- Web Audio API real-time glowing frequency spectrum visualizer.
- Initial parallel sentence database and FLN primary curriculum vocabulary.
