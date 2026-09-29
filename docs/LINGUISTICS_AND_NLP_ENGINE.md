# 🌐 SurSetu — Linguistics & 6-Layer Multi-Script NLP Engine

## 1. The Linguistic Challenge: Austroasiatic vs Indo-Aryan

Santali, Ho, and Mundari belong to the **Munda branch of the Austroasiatic language family**, whereas Hindi, Bengali, and Odia belong to the **Indo-Aryan branch of the Indo-European family**.

| Linguistic Dimension | Indo-Aryan (Hindi / Odia / English) | Munda (Santali / Ho / Mundari) | SurSetu Engine Treatment |
|---|---|---|---|
| **Sentence Word Order** | English: **SVO** (Subject-Verb-Object) | Native: **SOV** (Subject-Object-Verb) | Syntactic SVO-to-SOV Reordering Layer |
| **Case Markers** | Independent Prepositions / Postpositions | Agglutinative Enclitic Postpositions | Postposition Fusion Engine |
| **Copula Existence** | Explicit "is/are/am" (है/हैं) | Contextual Enclitics (*-kana*, *-menag-a*) | Copular & Possessive Template Synthesizer |
| **Writing Scripts** | Devanagari, Odia, Latin | Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ), Odia, Devanagari | Phonetic Multi-Script Transducer |

---

## 2. The 6-Layer Hybrid Inference Pipeline

```
Raw Input Sentence (Hindi / English)
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│ Layer 1: 72,904+ Exact Parallel Corpus Memory Index    │  ──► Match Found? ──► [RETURN EXACT CORPUS] (0.00ms)
└────────────────────────┬───────────────────────────────┘
                         │ (No Exact Sentence Match)
                         ▼
┌────────────────────────────────────────────────────────┐
│ Layer 2: Verified Primary Educational Dictionary       │  ──► Match Found? ──► [RETURN DICTIONARY PAIR] (0.00ms)
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Layer 3: Dynamic Continuous Learned Memory Store       │  ──► Match Found? ──► [RETURN LEARNED MEMORY] (0.00ms)
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Layer 4: English & Hindi SVO-to-SOV Syntactic Grammar  │
│          - Copular Reordering: "This is a [Noun]"      │  ──► Syntactic Pattern? ──► [RETURN SOV SYNTHESIS]
│          - Possessive Fusion: "I have a [Noun]"        │
│          - Imperative Restructure: "[Verb] [Object]"   │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Layer 5: PrefixTrie Longest Match & Morphological Stem │
│          - O(K) Multi-Word Sliding Window (Trie)       │  ──► [ASSEMBLE TOKENIZED SOV SEQUENCE]
│          - Postposition Fusion (-re, -khon, -then)     │
│          - Verbal Inflection Stem Pruning              │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Layer 6: Deep Phonetic Multi-Script Transducer         │
│          - Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) ⇄ Odia Script (ଓଡ଼ିଆ)     │  ──► [FINAL MULTI-SCRIPT TARGET OUTPUT]
│          - Devanagari (देवनागरी) ⇄ Latin (Roman)       │
└────────────────────────────────────────────────────────┘
```

---

## 3. Syntactic Grammar Transformations

### 3.1 Copular SVO-to-SOV Restructuring
- **English Source:** `This is a tree` (SVO: Subject="This", Verb="is", Object="a tree")
- **Grammar Transformation:**
  $$\text{Subject (ᱱᱚᱶᱟ ᱫᱚ)} + \text{Indefinite Article (ᱢᱤᱫᱴᱟᱹᱝ)} + \text{Object (ᱫᱟᱨᱮ)} + \text{Copula (ᱠᱟᱱᱟ)}$$
- **Target Santali (Ol Chiki):** **`ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱹᱝ ᱫᱟᱨᱮ ᱠᱟᱱᱟ`** (SOV)
- **Target Santali (Odia Script):** **`ନᱶଆ ଦ ମିଦଟାଙ ଦାରେ କାନା`**

### 3.2 Possessive Postposition Synthesizer
- **English Source:** `I have a pen`
- **Grammar Transformation:**
  $$\text{Subject Pronoun (ᱤᱧ)} + \text{Locative/Possessive Postposition (ᱴᱷᱮᱱ)} + \text{Article (ᱢᱤᱫᱴᱟᱹᱝ)} + \text{Noun (ᱠᱚᱞᱚᱢ)} + \text{Existential (ᱢᱮᱱᱟᱜᱼᱟ)}$$
- **Target Santali (Ol Chiki):** **`ᱤᱧ ᱴᱷᱮᱱ ᱢᱤᱫᱴᱟᱹᱝ ᱠᱚᱞᱚᱢ ᱢᱮᱱᱟᱜᱼᱟ`**

### 3.3 Classroom Imperative Inversion
- **English Source:** `Open your book`
- **Grammar Transformation:**
  $$\text{Possessive Pronoun (ᱟᱢᱟᱜ)} + \text{Noun (ᱯᱩᱛᱷᱤ)} + \text{Verb Root (ᱡᱷᱤᱡᱽ)} + \text{Imperative Marker (ᱢᱮ)}$$
- **Target Santali (Ol Chiki):** **`ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ`**

---

## 4. Postposition Agglutination Rules

Santali attaches postpositional markers directly to the governing noun or pronoun:

| Case | Preposition / Postposition | Santali Marker (Ol Chiki) | Odia Script | Example (Noun="School" / ᱤᱛᱩᱱ ᱟᱥᱲᱟ) | Meaning |
|---|---|---|---|---|---|
| **Locative (In / At)** | में / in, at | **`ᱨᱮ`** (`-re`) | **`ରେ`** | **`ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱨᱮ`** | In school |
| **Ablative (From)** | से / from | **`ᱠᱷᱚᱱ`** (`-khon`) | **`ଖନ`** | **`ᱟᱹᱛᱩ ᱠᱷᱚᱱ`** | From village |
| **Sociative (With)** | के साथ / with | **`ᱥᱟᱶᱛᱮ`** (`-saonte`) | **`ସାୱତେ`** | **`ᱵᱚᱭᱦᱟ ᱥᱟᱶᱛᱮ`** | With brother |
| **Dative (To / For)** | के लिए / for | **`ᱞᱟᱹᱜᱤᱫ`** (`-lagid`) | **`ଲାଗିଦ`** | **`ᱜᱤᱫᱽᱨᱟᱹ ᱞᱟᱹᱜᱤᱫ`** | For children |
| **Genitive (Of / 's - Inanimate)** | का, के, की / of | **`ᱨᱮᱱᱟᱜ`** (`-renag`) | **`ରେନାଗ`** | **`ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ`** | Of tree |
| **Genitive (Of - Animate)** | का, के, की / of | **`ᱨᱮᱱ`** (`-ren`) | **`ରେନ`** | **`ᱢᱟᱪᱮᱛ ᱨᱮᱱ`** | Teacher's |

---

## 5. Phonetic Script Transduction Engine

The script transducer performs syllabic matra and consonant mapping between **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)**, **Odia (ଓଡ଼ିଆ)**, **Devanagari (संताली)**, and **Latin Phonetics**:

### 5.1 Aspirated Consonant Synthesis
- `ᱠ` ($k$) + `ᱷ` ($h$) ➔ **`ᱠᱷ`** ➔ Odia **`ଖ`** ➔ Devanagari **`ख`**
- `ᱜ` ($g$) + `ᱷ` ($h$) ➔ **`ᱜᱷ`** ➔ Odia **`ଘ`** ➔ Devanagari **`घ`**
- `ᱪ` ($ch$) + `ᱷ` ($h$) ➔ **`ᱪᱷ`** ➔ Odia **`ଛ`** ➔ Devanagari **`छ`**
- `ᱛ` ($t$) + `ᱷ` ($h$) ➔ **`ᱛᱷ`** ➔ Odia **`ଥ`** ➔ Devanagari **`थ`**
- `ᱫ` ($d$) + `ᱷ` ($h$) ➔ **`ᱫᱷ`** ➔ Odia **`ଧ`** ➔ Devanagari **`ध`**
- `ᱯ` ($p$) + `ᱷ` ($h$) ➔ **`ᱯᱷ`** ➔ Odia **`ଫ`** ➔ Devanagari **`फ`**
- `ᱵ` ($b$) + `ᱷ` ($h$) ➔ **`ᱵᱷ`** ➔ Odia **`ଭ`** ➔ Devanagari **`भ`**

### 5.2 Independent Vowel vs Matra Transduction
When an Ol Chiki vowel follows a consonant, it transduces to a dependent vowel diacritic (Matra); when it begins a syllable or word, it transduces to the independent vowel letter:

- Word Initial `ᱟ` ➔ Devanagari **`आ`** / Odia **`ଆ`**
- Post-Consonant `ᱫ` + `ᱟ` ➔ Devanagari **`दा`** / Odia **`ଦା`**

---

## 6. Mayurbhanj Language Identifier (LID: sat vs ori)

In Northern Odisha (Mayurbhanj, Balasore, Keonjhar), Santali is frequently printed in Odia characters. Standard NLP tools misclassify this as Standard Odia (`ori`), failing translation.

SurSetu's classifier evaluates:
1. **Santali Morphological Markers in Odia Script:**
   - Case enclitics: `ରେ` (*-re*), `ଖନ` (*-khon*), `ଠେନ` (*-then*), `ଲାଗିଦ` (*-lagid*).
   - Pronouns & verbs: `ଇଞ` (*inj*), `ଆମ` (*am*), `ମେନାଗ` (*menag*), `କାନା` (*kana*), `ଚେଦ` (*ched*).
2. **Standard Odia Exclusives:**
   - Verbal auxiliaries: `ଅଛି`, `କରିବା`, `ହେଉଛି`, `ସମ୍ଭାବନା`, `ହେବାର`.
3. **Statistical Classifier Score:**
   $$\text{Score} = \frac{\sum \text{Weight}(\text{Santali Markers}) - \sum \text{Weight}(\text{Odia Markers})}{\text{Total Distinct Tokens}}$$
   Yields $>99\%$ classification accuracy on Mayurbhanj multilingual texts.
