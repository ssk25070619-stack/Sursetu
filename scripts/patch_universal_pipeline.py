"""
Patch Universal Grammar, Morphology, and Homonym Resolution into Python & TS Engines
"""
import os
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from universal_santali_engine import (
    UNIVERSAL_LEXICON,
    UNIVERSAL_IDIOMS_AND_PHRASES,
    disambiguate_homonym,
    apply_morphological_verb_rules
)
import translation_engine

def update_corpus_ts():
    corpus_ts_path = os.path.join(PROJECT_ROOT, "src", "data", "corpus.ts")
    with open(corpus_ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Create additional entries for VERIFIED_VOCABULARY if missing
    new_vocab_entries = []
    for k, v_ol in UNIVERSAL_LEXICON.items():
        v_od = translation_engine.transduce_script(v_ol, "ol_chiki", "odia")
        v_de = translation_engine.transduce_script(v_ol, "ol_chiki", "deva")
        v_la = translation_engine.transduce_script(v_ol, "ol_chiki", "latin")
        entry_str = f"  '{k.lower()}': {{ sat_Olck: '{v_ol}', sat_Orya: '{v_od}', sat_Deva: '{v_de}', sat_Latn: '{v_la}' }},"
        new_vocab_entries.append(entry_str)

    print("Corpus TS ready.")

def update_nlp_engine():
    nlp_path = os.path.join(PROJECT_ROOT, "src", "engine", "nlpEngine.ts")
    with open(nlp_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add CONVERSATIONAL_PHRASES updates from UNIVERSAL_IDIOMS_AND_PHRASES
    phrase_additions = []
    for k, v in UNIVERSAL_IDIOMS_AND_PHRASES.items():
        if f"'{k}'" not in content:
            phrase_additions.append(f"  '{k}': '{v}',")

    if phrase_additions and "const CONVERSATIONAL_PHRASES: Record<string, string> = {" in content:
        insert_text = "\n".join(phrase_additions) + "\n"
        content = content.replace(
            "const CONVERSATIONAL_PHRASES: Record<string, string> = {",
            f"const CONVERSATIONAL_PHRASES: Record<string, string> = {{\n{insert_text}"
        )

    # Add COMMON_CONVERSATIONAL_WORDS updates from UNIVERSAL_LEXICON
    word_additions = []
    for k, v in UNIVERSAL_LEXICON.items():
        if f"'{k}'" not in content:
            word_additions.append(f"  '{k}': '{v}',")

    if word_additions and "const COMMON_CONVERSATIONAL_WORDS: Record<string, string> = {" in content:
        insert_text = "\n".join(word_additions) + "\n"
        content = content.replace(
            "const COMMON_CONVERSATIONAL_WORDS: Record<string, string> = {",
            f"const COMMON_CONVERSATIONAL_WORDS: Record<string, string> = {{\n{insert_text}"
        )

    with open(nlp_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("nlpEngine.ts updated successfully with universal phrases and words.")

if __name__ == "__main__":
    update_corpus_ts()
    update_nlp_engine()
    print("Universal patch complete.")
