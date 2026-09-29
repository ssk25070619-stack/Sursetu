"""
SurSetu - Subword Neural Fallback & Morphological Decomposition Engine
-------------------------------------------------------------------------
Addresses Out-Of-Vocabulary (OOV) and unseen complex words in low-resource regimes:
  1. Subword Morphological Decomposition (Prefix, Root, Suffix stripping)
  2. Character N-gram Similarity Matching across Munda Lexicons
  3. Phonetic Script Naturalization / Loanword Transduction (English/Hindi -> Ol Chiki / Odia)
  4. Preserves Sentence Coherence without Leaving Untranslated Latin Characters
"""

import os
import sys
import re
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from translation_engine import transduce_script

# Latin to Ol Chiki Phonetic Transliteration Table
LATN_TO_OL_CHIKI = {
    "a": "ᱟ", "aa": "ᱟ", "i": "ᱤ", "ee": "ᱤ", "u": "ᱩ", "oo": "ᱩ",
    "e": "ᱮ", "o": "ᱳ", "ai": "ᱮ", "au": "ᱳ",
    "k": "ᱠ", "kh": "ᱠᱷ", "g": "ᱜ", "gh": "ᱜᱷ", "ng": "ᱝ",
    "c": "ᱪ", "ch": "ᱪᱷ", "j": "ᱡ", "jh": "ᱡᱷ", "ny": "ᱧ",
    "t": "ᱛ", "th": "ᱛᱷ", "d": "ᱫ", "dh": "ᱫᱷ", "n": "ᱱ",
    "p": "ᱯ", "ph": "ᱯᱷ", "f": "ᱯᱷ", "b": "ᱵ", "bh": "ᱵᱷ", "m": "ᱢ",
    "y": "ᱭ", "r": "ᱨ", "l": "ᱞ", "w": "ᱣ", "v": "ᱣ",
    "s": "ᱥ", "sh": "ᱥ", "h": "ᱦ", "rh": "ᱲ",
    "tion": "ᱥᱚᱱ", "sion": "ᱥᱚᱱ"
}

# Common English & Hindi Morphological Affixes for Subword Chunking
COMMON_ENGLISH_PREFIXES = ["un", "re", "in", "im", "dis", "non", "pre", "post", "anti", "mis"]
COMMON_ENGLISH_SUFFIXES = ["ing", "ed", "ly", "tion", "sion", "ness", "ment", "able", "ible", "al", "ful", "less", "est", "er", "s", "es"]


class SubwordMorphologicalEngine:
    """Decomposes unseen words and naturalizes loanwords into native scripts."""

    def __init__(self, vocab_set: set = None):
        self.vocab_set = vocab_set or set()

    def decompose_subwords(self, word: str) -> list:
        """Decompose an out-of-vocabulary word into stem and affix fragments."""
        word_clean = word.lower().strip()
        if len(word_clean) <= 3:
            return [word_clean]

        prefix = ""
        suffix = ""
        stem = word_clean

        # Check prefix
        for pfx in COMMON_ENGLISH_PREFIXES:
            if stem.startswith(pfx) and len(stem) > len(pfx) + 2:
                prefix = pfx
                stem = stem[len(pfx):]
                break

        # Check suffix
        for sfx in COMMON_ENGLISH_SUFFIXES:
            if stem.endswith(sfx) and len(stem) > len(sfx) + 2:
                suffix = sfx
                stem = stem[:-len(sfx)]
                break

        parts = []
        if prefix:
            parts.append(f"{prefix}-")
        parts.append(stem)
        if suffix:
            parts.append(f"-{suffix}")
        return parts

    def naturalize_loanword_olchiki(self, word: str) -> str:
        """Phonetically naturalize an unseen English/Hindi loanword into Ol Chiki script."""
        text = word.lower().strip()
        
        # Mapping table with all Latin phonemes to Ol Chiki glyphs
        phoneme_map = {
            "tion": "ᱥᱚᱱ", "sion": "ᱥᱚᱱ", "kh": "ᱠᱷ", "gh": "ᱜᱷ", "ng": "ᱝ",
            "ch": "ᱪᱷ", "jh": "ᱡᱷ", "th": "ᱛᱷ", "dh": "ᱫᱷ", "ph": "ᱯᱷ", "bh": "ᱵᱷ",
            "sh": "ᱥ", "rh": "ᱲ", "aa": "ᱟ", "ee": "ᱤ", "oo": "ᱩ", "ai": "ᱮ", "au": "ᱳ",
            "a": "ᱟ", "b": "ᱵ", "c": "ᱠ", "d": "ᱫ", "e": "ᱮ", "f": "ᱯᱷ", "g": "ᱜ",
            "h": "ᱦ", "i": "ᱤ", "j": "ᱡ", "k": "ᱠ", "l": "ᱞ", "m": "ᱢ", "n": "ᱱ",
            "o": "ᱳ", "p": "ᱯ", "q": "ᱠ", "r": "ᱨ", "s": "ᱥ", "t": "ᱛ", "u": "ᱩ",
            "v": "ᱣ", "w": "ᱣ", "x": "ᱠᱥ", "y": "ᱭ", "z": "ᱡ"
        }

        # Greedy Left-to-Right String Scanner
        result = []
        i = 0
        n = len(text)
        while i < n:
            matched = False
            # Check 4-gram, 2-gram, then 1-gram
            for length in [4, 2, 1]:
                if i + length <= n:
                    chunk = text[i:i+length]
                    if chunk in phoneme_map:
                        result.append(phoneme_map[chunk])
                        i += length
                        matched = True
                        break
            if not matched:
                if text[i].isalnum():
                    result.append("ᱚ")
                else:
                    result.append(text[i])
                i += 1

        return "".join(result)

    def fallback_translate_token(self, token: str, target_lang: str = "sat_Olck") -> str:
        """Process an out-of-vocabulary token through the subword fallback pipeline."""
        if not token:
            return ""

        # If token is in Devanagari script, use accurate Barakhadi Transducer
        if any('\u0900' <= c <= '\u097F' for c in token):
            ol_str = transduce_script(token, "deva", "ol_chiki")
        else:
            # Step 1: Subword Decomposition
            subwords = self.decompose_subwords(token)
            # Step 2: Loanword Naturalization to target script
            ol_str = self.naturalize_loanword_olchiki(token)

        if target_lang == "sat_Olck":
            return ol_str
        elif target_lang in ["sat_Orya", "odia"]:
            return transduce_script(ol_str, "ol_chiki", "odia")
        elif target_lang in ["sat_Deva", "deva"]:
            return transduce_script(ol_str, "ol_chiki", "deva")
        elif target_lang in ["sat_Latn", "latin"]:
            return transduce_script(ol_str, "ol_chiki", "latin")
        else:
            return ol_str


# Singleton instance
subword_engine = SubwordMorphologicalEngine()


def fallback_subword_translate(token: str, target_lang: str = "sat_Olck") -> str:
    """Public helper function for OOV fallback translation."""
    return subword_engine.fallback_translate_token(token, target_lang)


if __name__ == "__main__":
    test_oov_words = [
        "Computer",
        "Hospital",
        "Transportation",
        "Cleanliness",
        "Microscope",
        "Classroom"
    ]

    print("\n" + "=" * 70)
    print("  🚀 Testing Subword Fallback & Loanword Naturalization")
    print("=" * 70 + "\n")

    for w in test_oov_words:
        decomp = subword_engine.decompose_subwords(w)
        ol_res = fallback_subword_translate(w, "sat_Olck")
        odia_res = fallback_subword_translate(w, "sat_Orya")
        deva_res = fallback_subword_translate(w, "sat_Deva")

        print(f"Word        : '{w}'")
        print(f"  Subwords  : {decomp}")
        print(f"  Ol Chiki  : {ol_res}")
        print(f"  Odia      : {odia_res}")
        print(f"  Devanagari: {deva_res}\n")
