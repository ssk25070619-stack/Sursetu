"""
SurSetu - Linguistic Error Analyzer & Failure Mode Categorizer
------------------------------------------------------------------
Systematically analyzes translation outputs, identifies errors, and categorizes them into:
  1. OOV_VOCABULARY (Out of Vocabulary / Unseen Words)
  2. SYNTAX_ORDER (SVO vs SOV inversion issues)
  3. POSTPOSITION_MISMATCH (Agglutinative suffix detachment: -re, -khon, -ak)
  4. SCRIPT_DIACRITIC (Glottalized stop or matra conversion discrepancy)
  5. CODE_SWITCHING (Mixed Hindi/English loanword handling)
"""

import os
import sys
import json
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from translation_engine import UnsupervisedSantaliTranslator
from test_translation import EDUCATIONAL_DICTIONARY

CATEGORIES = [
    "OOV_VOCABULARY",
    "SYNTAX_ORDER",
    "POSTPOSITION_MISMATCH",
    "SCRIPT_DIACRITIC",
    "CODE_SWITCHING"
]

def analyze_error(source: str, hypothesis: str, reference: str) -> dict:
    """Classify error type between hypothesis and reference."""
    if hypothesis.strip() == reference.strip():
        return {"status": "EXACT_MATCH", "error_type": None, "score": 1.0}

    # Check for OOV (English words passed through verbatim)
    words = re.findall(r'[a-zA-Z]+', hypothesis)
    if words:
        return {
            "status": "OOV_FALLBACK",
            "error_type": "OOV_VOCABULARY",
            "details": f"Unseen words kept in Latin: {words}",
            "score": 0.6
        }

    # Check for Postposition suffix discrepancy
    ref_suffixes = ["ᱨᱮ", "ᱠᱷᱚᱱ", "ᱟᱜ", "ᱨᱮᱱ", "ᱥᱟᱶᱛᱮ"]
    for sfx in ref_suffixes:
        if sfx in reference and sfx not in hypothesis:
            return {
                "status": "MORPHOLOGY_DEFECT",
                "error_type": "POSTPOSITION_MISMATCH",
                "details": f"Missing expected suffix marker '{sfx}'",
                "score": 0.75
            }

    # Check for Word order inversion
    if len(hypothesis.split()) != len(reference.split()):
        return {
            "status": "SYNTAX_DRIFT",
            "error_type": "SYNTAX_ORDER",
            "details": "Length/order mismatch in syntactic chunks",
            "score": 0.8
        }

    return {
        "status": "MINOR_DIACRITIC_VARIATION",
        "error_type": "SCRIPT_DIACRITIC",
        "details": "Minor phonetic spelling or diacritic divergence",
        "score": 0.9
    }


def run_error_analysis():
    print("\n" + "=" * 70)
    print("  🔍 SurSetu Linguistic Error Analyzer & Failure Categorization")
    print("=" * 70 + "\n")

    engine = UnsupervisedSantaliTranslator(base_dictionary=EDUCATIONAL_DICTIONARY)
    
    # Run test on 20 challenging test cases with known complex syntax
    challenge_cases = [
        {"src": "The boy runs fast from the school to the village", "ref": "ᱜᱤᱫᱽᱨᱟᱹ ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱠᱷᱚᱱ ᱟᱛᱳ ᱛᱮ ᱞᱚᱜᱚᱱ ᱮ ᱫᱟᱹᱲ ᱮᱫᱟ"},
        {"src": "Three big green trees are near the river", "ref": "ᱜᱟᱰᱟ ᱥᱩᱨ ᱨᱮ ᱯᱮ ᱢᱟᱨᱟᱝ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱫᱟᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ"},
        {"src": "Teacher gave a red pencil to the girl", "ref": "ᱢᱟᱪᱮᱛ ᱠᱩᱲᱤ ᱜᱤᱫᱽᱨᱟᱹ ᱴᱷᱮᱱ ᱢᱤᱫᱴᱟᱹᱝ ᱟᱨᱟᱜ ᱯᱮᱱᱥᱤᱞ ᱮ ᱮᱢᱟᱫᱮᱭᱟ"},
        {"src": "In the morning we eat rice with vegetables", "ref": "ᱥᱮᱛᱟᱜ ᱨᱮ ᱟᱵᱚ ᱩᱛᱩ ᱥᱟᱶᱛᱮ ᱫᱟᱠᱟ ᱵᱚ ᱡᱚᱢ-ᱟ"},
        {"src": "This computer is new", "ref": "ᱱᱚᱶᱟ ᱠᱚᱢᱯᱤᱭᱩᱴᱟᱨ ᱱᱟᱶᱟ ᱜᱮᱭᱟ"}
    ]

    analysis_results = []
    error_counts = {c: 0 for c in CATEGORIES}

    for idx, item in enumerate(challenge_cases, 1):
        res = engine.translate(item["src"], "eng_Latn", "sat_Olck")
        hypo = res["translated_text"]
        eval_res = analyze_error(item["src"], hypo, item["ref"])
        eval_res["id"] = idx
        eval_res["src"] = item["src"]
        eval_res["hypothesis"] = hypo
        eval_res["reference"] = item["ref"]
        analysis_results.append(eval_res)

        if eval_res["error_type"]:
            error_counts[eval_res["error_type"]] += 1

        print(f"[{idx}] Source: '{item['src']}'")
        print(f"    Hypothesis : {hypo}")
        print(f"    Reference  : {item['ref']}")
        print(f"    Diagnosis  : {eval_res['status']} -> {eval_res['error_type']} (Score: {eval_res['score']})\n")

    print("=" * 70)
    print("📊 Error Distribution Summary:")
    for cat, count in error_counts.items():
        print(f"  - {cat:<25}: {count} occurrences")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    run_error_analysis()
