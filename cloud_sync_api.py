"""
SurSetu - Cloud API Sync & Hybrid Neural Manager
---------------------------------------------------
Integrates:
  1. Bhashini API (Digital India / ULCA) for Indic NMT, ASR, and TTS
  2. Google Gemini (AI Studio API) for NIPUN Bharat Curriculum & Story Generation
  3. AI4Bharat / Hugging Face Inference Pipeline (IndicTrans2)
  4. Local Edge Sync Manager (Harvests & Merges into Offline O(1) Memory Cache)
"""

import json
import os
import sys
import time
import urllib.request
import urllib.parse
from typing import Dict, Any, List, Optional

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(PROJECT_ROOT, "datasets", "api_config.json")
MEMORY_FILE = os.path.join(PROJECT_ROOT, "datasets", "learned_memory.json")
DICT_FILE = os.path.join(PROJECT_ROOT, "datasets", "santali_dictionary.json")

try:
    from translation_engine import transduce_script
except ImportError:
    transduce_script = None


class CloudSyncManager:
    """Manages Bhashini, Google Gemini, and AI4Bharat cloud API connectors and local edge synchronization."""

    def __init__(self):
        self.config = self._load_config()

    def _load_config(self) -> Dict[str, Any]:
        """Load API configuration from local config file or environment."""
        default_config = {
            "mode": "hybrid",  # "offline", "hybrid", "cloud_priority"
            "bhashini_user_id": os.environ.get("BHASHINI_USER_ID", ""),
            "bhashini_api_key": os.environ.get("BHASHINI_API_KEY", ""),
            "bhashini_pipeline_id": os.environ.get("BHASHINI_PIPELINE_ID", ""),
            "gemini_api_key": os.environ.get("GEMINI_API_KEY", ""),
            "huggingface_token": os.environ.get("HF_TOKEN", ""),
            "sarvam_api_key": os.environ.get("SARVAM_API_KEY", ""),
            "last_sync_timestamp": None,
            "synced_pairs_count": 0
        }
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    saved = json.load(f)
                    default_config.update(saved)
            except Exception as e:
                print(f"[CONFIG WARNING] Could not read {CONFIG_FILE}: {e}")
        return default_config

    def save_config(self, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update and persist API settings."""
        self.config.update(updates)
        os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(self.config, f, indent=2, ensure_ascii=False)
        return self.config

    # -----------------------------------------------------------------------
    # 1. Google Gemini API: Curriculum & Pedagogy Synthesis
    # -----------------------------------------------------------------------
    def generate_with_gemini(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """Generate structured FLN lesson plans or stories using Gemini AI Studio."""
        api_key = self.config.get("gemini_api_key")
        if not api_key:
            return {
                "success": False,
                "error": "Google Gemini API key not configured. Add your key in API Settings.",
                "offline_fallback": True
            }

        system_prompt = system_instruction or (
            "You are an expert curriculum designer and linguistic assistant for Jharkhand's PALASH "
            "Mother Tongue-Based Multilingual Education (MTB-MLE) program. You generate NIPUN Bharat aligned "
            "lesson scripts, flashcards, and diagnostic assessment prompts for primary school children learning in "
            "Santali (Ol Chiki ᱚᱞ ᱪᱤᱠᱤ & Odia script), Ho, and Mundari with Hindi bridges."
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"System Context: {system_prompt}\n\nTask: {prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1024
            }
        }

        # Try active Gemini models in order
        candidate_models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.6-flash"]
        last_err = ""

        for model_name in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=10.0) as resp:
                    result_json = json.loads(resp.read().decode("utf-8"))
                    candidates = result_json.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        text_out = "".join(p.get("text", "") for p in parts)
                        return {
                            "success": True,
                            "generated_text": text_out,
                            "model": model_name,
                            "provider": "Google AI Studio"
                        }
            except Exception as e:
                last_err = str(e)
                continue

        return {"success": False, "error": f"Gemini API call failed: {last_err}", "offline_fallback": True}

    # -----------------------------------------------------------------------
    # 2. Bhashini ULCA API: Primary Indic NMT Pipeline
    # -----------------------------------------------------------------------
    def translate_with_bhashini(self, text: str, src_lang="hi", tgt_lang="sat") -> Dict[str, Any]:
        """Translate text using the Government of India Bhashini ULCA / Dhruva NMT API."""
        user_id = self.config.get("bhashini_user_id")
        api_key = self.config.get("bhashini_api_key") or self.config.get("bhashini_udyat_key")
        pipeline_id = self.config.get("bhashini_pipeline_id")

        if not api_key:
            return {
                "success": False,
                "error": "Bhashini credentials not set. Running in offline edge mode.",
                "offline_fallback": True
            }

        # Normalize language codes to Bhashini ISO 639-1 / 639-3 standard
        lang_map = {
            "hin_Deva": "hi", "hi": "hi", "hindi": "hi",
            "sat_Olck": "sat", "sat_Deva": "sat", "sat_Orya": "sat", "sat_Latn": "sat", "sat": "sat", "santali": "sat",
            "eng_Latn": "en", "en": "en", "english": "en",
            "ory_Orya": "or", "or": "or", "odia": "or",
            "ben_Beng": "bn", "bn": "bn", "bengali": "bn"
        }
        source_l = lang_map.get(src_lang, src_lang)
        target_l = lang_map.get(tgt_lang, tgt_lang)

        # Bhashini ULCA / Dhruva compute endpoint
        url = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
        headers = {
            "Content-Type": "application/json",
            "Authorization": api_key
        }
        if user_id:
            headers["userID"] = user_id

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": source_l,
                            "targetLanguage": target_l
                        }
                    }
                }
            ],
            "inputData": {
                "input": [{"source": text}]
            }
        }

        try:
            import ssl
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with urllib.request.urlopen(req, context=ctx, timeout=10.0) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                output_list = res_data.get("pipelineResponse", [{}])[0].get("output", [])
                if output_list:
                    trans_text = output_list[0].get("target", "")
                    return {
                        "success": True,
                        "translated_text": trans_text,
                        "provider": "Bhashini ULCA / Dhruva"
                    }
                return {"success": False, "error": "Empty response from Bhashini pipeline"}
        except Exception as e:
            return {"success": False, "error": f"Bhashini API call error: {e}", "offline_fallback": True}

    # -----------------------------------------------------------------------
    # 3. AI4Bharat / Hugging Face Inference API
    # -----------------------------------------------------------------------
    def translate_with_ai4bharat(self, text: str, src_lang="hin_Deva", tgt_lang="sat_Olck") -> Dict[str, Any]:
        """Inference via Hugging Face Serverless API for IndicTrans2."""
        token = self.config.get("huggingface_token")
        model_id = "ai4bharat/indictrans2-indic-indic-dist-200M"

        endpoints = [
            f"https://router.huggingface.co/hf-inference/models/{model_id}",
            f"https://api-inference.huggingface.co/models/{model_id}"
        ]

        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"

        payload = {"inputs": text}
        last_err = ""

        for url in endpoints:
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers=headers,
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=8.0) as resp:
                    res_data = json.loads(resp.read().decode("utf-8"))
                    if isinstance(res_data, list) and len(res_data) > 0:
                        trans_text = res_data[0].get("translation_text", "")
                        return {
                            "success": True,
                            "translated_text": trans_text,
                            "provider": "AI4Bharat IndicTrans2"
                        }
            except Exception as e:
                last_err = str(e)
                continue

        return {"success": False, "error": f"HuggingFace inference error: {last_err}", "offline_fallback": True}

    # -----------------------------------------------------------------------
    # 4. 1-Click Offline Edge Sync: Harvest & Merge into Local O(1) Memory
    # -----------------------------------------------------------------------
    def sync_curriculum_to_offline_cache(self, batch_pairs: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Merge newly validated bilingual sentence pairs and multi-script representations
        directly into 'datasets/learned_memory.json' for instant zero-latency offline access.
        """
        start_time = time.time()
        
        # Default canonical FLN synchronization batch if none passed
        if not batch_pairs:
            batch_pairs = [
                {"hin": "कक्षा में ध्यान से सुनो", "sat": "ᱠᱞᱟᱥ ᱨᱮ ᱫᱷᱮᱭᱟᱱ ᱛᱮ ᱟᱸᱡᱚᱢ ᱢᱮ", "eng": "Listen carefully in the class"},
                {"hin": "अपनी कापी और पेंसिल निकालो", "sat": "ᱟᱢᱟᱜ ᱚᱞ ᱯᱩᱛᱷᱤ ᱟᱨ ᱯᱮᱱᱥᱤᱞ ᱚᱰᱚᱠ ᱢᱮ", "eng": "Take out your notebook and pencil"},
                {"hin": "आज हम सब मिलकर खेलेंगे", "sat": "ᱛᱮᱦᱮᱧ ᱵᱚᱱ ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱵᱚᱱ ᱮᱱᱮᱡ-ᱟ", "eng": "Today we will play together"},
                {"hin": "साफ पानी पियो और हाथ धो लो", "sat": "ᱥᱟᱯᱷᱟ ᱫᱟᱜ ᱧᱩᱭ ᱢᱮ ᱟᱨ ᱛᱤ ᱟᱹᱨᱩᱵ ᱢᱮ", "eng": "Drink clean water and wash hands"},
                {"hin": "सभी बच्चे अपनी जगह पर बैठें", "sat": "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱯᱱᱟᱨ ᱴᱷᱟᱶ ᱨᱮ ᱫᱩᱲᱩᱵ ᱯᱮ", "eng": "All children sit in your places"},
                {"hin": "श्यामपट्ट पर सुंदर लिखो", "sat": "ᱵᱞᱮᱠᱵᱳᱨᱰ ᱨᱮ ᱱᱟᱯᱟᱭ ᱚᱞ ᱢᱮ", "eng": "Write neatly on the blackboard"},
                {"hin": "सुबह का सूरज बहुत सुंदर है", "sat": "ᱥᱮᱛᱟᱜ ᱨᱮᱱᱟᱜ ᱥᱤᱝ ᱪᱟᱸᱫᱚ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭᱟ", "eng": "The morning sun is very beautiful"},
                {"hin": "पेड़ों की रक्षा करो", "sat": "ᱫᱟᱨᱮ ᱠᱚ ᱡᱚᱛᱚᱱ ᱢᱮ", "eng": "Protect the trees"},
                {"hin": "हमारा गांव बहुत प्यारा है", "sat": "ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱫᱚ ᱟᱹᱰᱤ ᱥᱤᱵᱤᱞᱟ", "eng": "Our village is very lovely"},
                {"hin": "संताली हमारी प्यारी मातृभाषा है", "sat": "ᱥᱟᱱᱛᱟᱲᱤ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱥᱤᱵᱤᱞ ᱯᱟᱹᱨᱥᱤ ᱠᱟᱱᱟ", "eng": "Santali is our sweet mother tongue"},
            ]

        # Load existing learned memory
        memory_data = {"hin_Deva": {"sat_Olck": {}, "sat_Orya": {}, "sat_Deva": {}, "sat_Latn": {}}}
        if os.path.exists(MEMORY_FILE):
            try:
                with open(MEMORY_FILE, "r", encoding="utf-8") as f:
                    memory_data = json.load(f)
            except Exception:
                pass

        if "hin_Deva" not in memory_data:
            memory_data["hin_Deva"] = {}
        for subk in ["sat_Olck", "sat_Orya", "sat_Deva", "sat_Latn"]:
            memory_data["hin_Deva"].setdefault(subk, {})

        new_count = 0
        for pair in batch_pairs:
            hin = pair.get("hin", "").strip()
            sat = pair.get("sat", "").strip()

            if hin and sat:
                memory_data["hin_Deva"]["sat_Olck"][hin] = sat
                if transduce_script:
                    memory_data["hin_Deva"]["sat_Orya"][hin] = transduce_script(sat, "ol_chiki", "odia")
                    memory_data["hin_Deva"]["sat_Deva"][hin] = transduce_script(sat, "ol_chiki", "deva")
                    memory_data["hin_Deva"]["sat_Latn"][hin] = transduce_script(sat, "ol_chiki", "latin")
                new_count += 1

        # Write to disk
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            json.dump(memory_data, f, indent=2, ensure_ascii=False)

        total_learned = len(memory_data["hin_Deva"]["sat_Olck"])
        
        # Update config metadata
        self.save_config({
            "last_sync_timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "synced_pairs_count": total_learned
        })

        dt = (time.time() - start_time) * 1000

        return {
            "success": True,
            "synced_in_batch": new_count,
            "total_offline_pairs": total_learned,
            "duration_ms": round(dt, 2),
            "timestamp": self.config.get("last_sync_timestamp"),
            "message": f"Successfully merged {new_count} curriculum pairs into offline edge cache."
        }


# Global Sync Manager Instance
cloud_sync = CloudSyncManager()
