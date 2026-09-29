# 📝 SurSetu — NIPUN Bharat FLN & Worksheet Studio

## 1. Pedagogical Alignment: NEP 2020 & NIPUN Bharat

The **NIPUN Bharat Mission** (National Initiative for Proficiency in Reading with Understanding and Numeracy) emphasizes that children must achieve foundational literacy and numeracy by the end of Grade 3. For tribal children, achieving this goal is impossible if educational materials are exclusively presented in non-native languages.

SurSetu implements Mother Tongue-Based Multilingual Education (**MTB-MLE**) through automated, culturally contextualized teaching and learning materials (TLMs).

---

## 2. Automated Study Material Formats

```
+-------------------------------------------------------------------------------+
|                       8 AUTOMATED STUDY MATERIAL FORMATS                      |
+-------------------------------------------------------------------------------+
|  1. 🔢 Math Counting & Digits (Ol Chiki ᱐-᱙ / Odia ୦-୯ / Tactile Icons)      |
|  2. 🧩 Vocabulary & Picture Match (FLN Bilingual Connecting Activity)         |
|  3. 🃏 Visual Flashcard Deck (2x4 Cut-and-Fold Pocket Learning Cards)         |
|  4. ✍️ Alphabet & Script Tracing Sheets (Ol Chiki Dotted Stroke Guides)       |
|  5. 📝 Fill in the Blanks (Contextual Sentence Completion with Word Banks)     |
|  6. 📜 Teacher Lesson Script (Step-by-step 15-Minute Classroom Guide)         |
|  7. 🎶 Bilingual Folk Rhyme (Action songs with cultural illustrations)        |
|  8. 📋 Diagnostic Assessment Cards (NIPUN Bharat Rubric & Evaluation Scores)  |
|  9. 🎲 Tribal Forest Board Game (Printable A4 Safari Educational Game)        |
+-------------------------------------------------------------------------------+
```

### 2.1 Printable A4 HTML & PDF Layout Architecture
- **CSS `@media print` Optimization:** Automatically removes background glow, navigation bars, and headers. Outputs crisp black-and-white or high-contrast color A4 sheets with student name, grade, and date headers.
- **Embedded Web Fonts:** Embeds *Noto Sans Ol Chiki* and *Noto Sans Oriya* so that printed documents render with 100% typographic accuracy on any basic classroom printer without missing font square boxes (tofu).

---

## 3. Interactive 3D Digital Flashcards

Built into the web application is an interactive digital flashcard deck:
- **3D Card Flip Animation:** CSS `transform-style: preserve-3d` with smooth 0.6s perspective flip.
- **Front Face:** High-resolution emoji/icon + native script (**Ol Chiki ᱚᱞ ᱪᱤᱠᱤ** or **Odia Script ଓଡ଼ିଆ**) + phonetic pronunciation.
- **Back Face:** Hindi and English translation + curriculum category badge (School, Nature, Family, Animals, Body Parts).
- **Loud Audio Pronunciation:** Integrated audio button triggers clear, loud native speech feedback.

---

## 4. Tribal Quest (Gamified Multi-Script Learning)

To reinforce vocabulary retention among primary students, SurSetu includes **Tribal Quest**:

```
+-------------------------------------------------------------------------------+
|                             TRIBAL QUEST GAME                                 |
+-------------------------------------------------------------------------------+
|  Mode 1: 🏹 Birsa Archer (Shoot the correct Santali word on target board)     |
|  Mode 2: 🥁 Mandar Drum (Audio listening challenge: hear sound & pick word)  |
|  Mode 3: 🧩 Word Jumble (Tap floating Ol Chiki character tiles in sequence)   |
|                                                                               |
|  Gamification Elements:                                                       |
|  - Score HUD: +50 Points per hit + Streak Multiplier                          |
|  - Reward Currency: 🍃 Sacred Sal Leaves                                      |
|  - Ranks: Forest Explorer ➔ Dhamsa Tracker ➔ Birsa Champion ➔ Master Guru     |
|  - Web Audio Synthesizer: Procedural drum rhythms and victory chimes          |
|  - Particle FX: Dynamic floating leaf confetti animations                     |
+-------------------------------------------------------------------------------+
```
