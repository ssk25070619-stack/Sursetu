"""
SurSetu - Unified Web Application Backend Server
---------------------------------------------------
Bridges:
  1. Offline Speech Recognition (Vosk ASR Engine from test_mic.py)
  2. Machine Translation Engine (Dictionary & NLLB MT from test_translation.py)
  3. Primary School Worksheet Generator (from worksheets/generator.py)
  4. Web Frontend (index.html, style.css, app.js)
"""

import json
import os
import sys
import time
from flask import Flask, jsonify, request, send_from_directory, Response

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Import existing modules
try:
    from test_translation import EDUCATIONAL_DICTIONARY, fallback_translate
except ImportError:
    EDUCATIONAL_DICTIONARY = {}
    fallback_translate = lambda text, s, t: text

try:
    from worksheets.generator import (
        export_worksheet_html,
        generate_worksheet,
        generate_counting_worksheet,
        generate_matching_worksheet,
        generate_flashcards_worksheet,
        generate_tracing_worksheet,
        generate_fill_blanks_worksheet,
        generate_lesson_script_worksheet,
        generate_rhyme_card,
        generate_assessment_prompt,
    )
except ImportError:
    generate_worksheet = None
    generate_counting_worksheet = None
    generate_matching_worksheet = None

# Detect React Build distribution folder or fallback to project root
DIST_DIR = os.path.join(PROJECT_ROOT, "dist")
STATIC_DIR = DIST_DIR if os.path.exists(DIST_DIR) and os.path.exists(os.path.join(DIST_DIR, "index.html")) else PROJECT_ROOT

# Initialize Flask App
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="")


@app.after_request
def add_cors_headers(response):
    """Ensure all API and asset responses work seamlessly across tunnels & custom domains."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, ngrok-skip-browser-warning, bypass-tunnel-reminder"
    return response


@app.route("/")
def index():
    """Serve main SurSetu web interface (Modern React PWA if built, or standalone HTML)."""
    if os.path.exists(os.path.join(STATIC_DIR, "index.html")):
        return send_from_directory(STATIC_DIR, "index.html")
    return send_from_directory(PROJECT_ROOT, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Serve CSS, JS, manifest, and asset files with SPA client fallback."""
    if os.path.exists(os.path.join(STATIC_DIR, filename)):
        return send_from_directory(STATIC_DIR, filename)
    if os.path.exists(os.path.join(PROJECT_ROOT, filename)):
        return send_from_directory(PROJECT_ROOT, filename)
    # SPA Client Route fallback for React Router / client state
    if os.path.exists(os.path.join(STATIC_DIR, "index.html")):
        return send_from_directory(STATIC_DIR, "index.html")
    return send_from_directory(PROJECT_ROOT, "index.html")


try:
    from translation_engine import (
        UnsupervisedSantaliTranslator,
        classify_odia_santali,
        transduce_script,
    )
    server_translator = UnsupervisedSantaliTranslator(base_dictionary=EDUCATIONAL_DICTIONARY)
except ImportError:
    server_translator = None
    classify_odia_santali = None
    transduce_script = None

try:
    from tts_engine import synthesize_speech
except ImportError:
    synthesize_speech = None

try:
    from teacher_pilot_logger import pilot_logger
except ImportError:
    pilot_logger = None

# Initialize Vosk Model & Cached Recognizer on Server for Offline Voice Recognition
vosk_model = None
cached_kaldi_recognizer = None

def get_vosk_model():
    """Get or lazily initialize the Vosk offline acoustic model."""
    global vosk_model
    if vosk_model is not None:
        return vosk_model
    try:
        from vosk import Model
        from test_mic import find_model_path
        mpath = find_model_path()
        if mpath:
            vosk_model = Model(mpath)
            print(f"[SERVER VOSK] Loaded offline model from: '{mpath}'")
        else:
            print("[SERVER VOSK WARNING] Could not find valid Vosk model directory.")
    except Exception as e:
        print(f"[SERVER VOSK WARNING] Could not load Vosk model: {e}")
    return vosk_model

def get_kaldi_recognizer(samplerate=16000):
    """Reuse cached Kaldi recognizer to eliminate graph allocation latency."""
    global cached_kaldi_recognizer
    vm = get_vosk_model()
    if not vm:
        return None
    from vosk import KaldiRecognizer
    if cached_kaldi_recognizer is None:
        cached_kaldi_recognizer = KaldiRecognizer(vm, samplerate)
    return cached_kaldi_recognizer

# Initial load attempt
get_vosk_model()

# Fast In-Memory Translation Cache on Server
SERVER_TRANSLATION_CACHE = {}


@app.route("/api/status", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def get_status():
    """System health check and loaded engine status."""
    vm = get_vosk_model()
    vosk_model_exists = vm is not None

    learned_count = 0
    if server_translator and "hin_Deva" in server_translator.memory:
        learned_count = len(server_translator.memory["hin_Deva"].get("sat_Olck", {}))

    return jsonify({
        "status": "online",
        "vosk_model_loaded": vosk_model_exists,
        "dictionary_languages": list(EDUCATIONAL_DICTIONARY.keys()),
        "learned_words_count": learned_count,
        "engine": "Adaptive & Unsupervised Multi-Layer Engine",
        "version": "1.2.0",
        "offline_ready": True
    })


@app.route("/api/asr/record_hardware_mic", methods=["POST"])
def api_record_hardware_mic():
    """Record audio directly from local hardware microphone and transcribe offline with Vosk."""
    vm = get_vosk_model()
    if not vm:
        return jsonify({"error": "Vosk speech model not loaded on server. Please ensure vosk-model-small-hi-0.22 is in the directory."}), 500

    data = request.get_json() or {}
    duration = float(data.get("duration", 3.5))
    target_lang = data.get("target_lang", "sat_Olck")
    samplerate = 16000

    try:
        import numpy as np
        import sounddevice as sd
        from vosk import KaldiRecognizer

        print(f"[SERVER ASR] Recording hardware mic for {duration} seconds at {samplerate}Hz...")
        recording = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype="int16")
        sd.wait()

        # DSP Audio Conditioning & Normalization
        audio_float = recording.astype(np.float32).flatten()
        audio_float -= np.mean(audio_float)
        max_val = np.max(np.abs(audio_float))
        if max_val > 80.0:
            audio_float = (audio_float / max_val) * 26000.0
        recording_clean = np.clip(audio_float, -32768, 32767).astype(np.int16)

        audio_bytes = bytes(recording_clean)
        recognizer = KaldiRecognizer(vm, samplerate)
        recognizer.AcceptWaveform(audio_bytes)
        res = json.loads(recognizer.FinalResult())
        hindi_text = res.get("text", "").strip()

        print(f"[SERVER ASR] Transcribed: '{hindi_text}'")

        # Translate immediately with 0ms offline engine
        translated_text = ""
        confidence = 0.0
        mode = "EMPTY"
        if hindi_text and server_translator:
            trans_res = server_translator.translate(hindi_text, "hin_Deva", target_lang, offline_only=True)
            translated_text = trans_res["translated_text"]
            confidence = trans_res["confidence"]
            mode = trans_res["mode"]

        return jsonify({
            "success": True,
            "hindi_text": hindi_text,
            "translated_text": translated_text,
            "confidence": confidence,
            "mode": mode,
            "target_lang": target_lang
        })
    except Exception as err:
        print(f"[SERVER ASR ERROR] {err}")
        return jsonify({"error": f"Microphone recording failed: {err}"}), 500


@app.route("/api/asr/transcribe_audio", methods=["POST"])
def api_transcribe_audio():
    """Transcribe raw audio data (PCM 16-bit or WAV) sent from browser/client with DSP normalization."""
    vm = get_vosk_model()
    if not vm:
        return jsonify({"error": "Vosk speech model not loaded on server"}), 500

    import base64
    import io
    import wave
    import numpy as np
    from vosk import KaldiRecognizer

    data = request.get_json() or {}
    audio_b64 = data.get("audio_base64", "")
    target_lang = data.get("target_lang", "sat_Olck")
    samplerate = int(data.get("samplerate", 16000))

    if not audio_b64:
        return jsonify({"error": "Missing audio_base64"}), 400

    try:
        audio_bytes = base64.b64decode(audio_b64)
        pcm_bytes = audio_bytes
        detected_rate = samplerate

        # Check if incoming data has a RIFF/WAV header
        if audio_bytes.startswith(b"RIFF") and b"WAVE" in audio_bytes[:16]:
            try:
                with wave.open(io.BytesIO(audio_bytes), "rb") as wf:
                    detected_rate = wf.getframerate()
                    n_channels = wf.getnchannels()
                    sampwidth = wf.getsampwidth()
                    raw_frames = wf.readframes(wf.getnframes())

                    # Convert to int16 mono
                    if sampwidth == 2:
                        samples = np.frombuffer(raw_frames, dtype=np.int16)
                        if n_channels > 1:
                            samples = samples.reshape(-1, n_channels).mean(axis=1).astype(np.int16)
                    else:
                        samples = np.frombuffer(raw_frames, dtype=np.int8).astype(np.int16) * 256

                    # Resample if not 16000Hz
                    if detected_rate != 16000 and len(samples) > 0:
                        target_len = int(len(samples) * (16000 / detected_rate))
                        indices = np.linspace(0, len(samples) - 1, target_len)
                        samples = np.interp(indices, np.arange(len(samples)), samples).astype(np.int16)
                        detected_rate = 16000

                    # Audio conditioning: DC offset removal & gain normalization
                    samples_float = samples.astype(np.float32)
                    samples_float -= np.mean(samples_float)
                    max_amp = np.max(np.abs(samples_float)) if len(samples_float) > 0 else 0
                    if max_amp > 100.0:
                        # Normalize to ~80% of full dynamic range
                        samples_float = (samples_float / max_amp) * 26000.0
                    pcm_bytes = np.clip(samples_float, -32768, 32767).astype(np.int16).tobytes()
            except Exception as wav_err:
                print(f"[ASR WAV parse notice] {wav_err}")
                pcm_bytes = audio_bytes

        recognizer = KaldiRecognizer(vm, 16000)
        # Feed in chunks of 4096 bytes for optimal Kaldi acoustic decoding
        chunk_size = 4096
        for offset in range(0, len(pcm_bytes), chunk_size):
            chunk = pcm_bytes[offset:offset + chunk_size]
            recognizer.AcceptWaveform(chunk)

        res = json.loads(recognizer.FinalResult())
        hindi_text = res.get("text", "").strip()

        print(f"[ASR Transcribed from WAV Base64]: '{hindi_text}'")

        translated_text = ""
        confidence = 0.0
        mode = "EMPTY"
        if hindi_text and server_translator:
            trans_res = server_translator.translate(hindi_text, "hin_Deva", target_lang, offline_only=True)
            translated_text = trans_res["translated_text"]
            confidence = trans_res["confidence"]
            mode = trans_res["mode"]

        return jsonify({
            "success": True,
            "hindi_text": hindi_text,
            "translated_text": translated_text,
            "confidence": confidence,
            "mode": mode,
            "target_lang": target_lang
        })
    except Exception as err:
        print(f"[SERVER ASR ERROR]: {err}")
        return jsonify({"error": f"Audio processing failed: {err}"}), 500


@app.route("/api/tts/synthesize", methods=["POST", "GET"])
@app.route("/api/tts", methods=["POST", "GET"])
def api_tts_synthesize():
    """
    Offline Text-to-Speech (TTS) Synthesizer endpoint.
    Returns 16kHz WAV audio stream for Santali (Ol Chiki/Odia), Ho, Mundari, Kurukh, Hindi, English.
    """
    if request.method == "POST":
        data = request.get_json() or {}
        text = data.get("text", "").strip()
        lang = data.get("lang", "sat_Olck")
        pitch = float(data.get("pitch", 145.0))
        speed = float(data.get("speed", 1.0))
    else:
        text = request.args.get("text", "").strip()
        lang = request.args.get("lang", "sat_Olck")
        pitch = float(request.args.get("pitch", 145.0))
        speed = float(request.args.get("speed", 1.0))

    if not text:
        return jsonify({"error": "Missing 'text' parameter"}), 400

    if synthesize_speech:
        try:
            wav_bytes = synthesize_speech(text, lang, pitch=pitch, speed=speed)
            resp = Response(wav_bytes, mimetype="audio/wav")
            resp.headers["Cache-Control"] = "public, max-age=86400"
            resp.headers["Content-Disposition"] = f'inline; filename="tts_{lang}.wav"'
            return resp
        except Exception as e:
            return jsonify({"error": f"TTS synthesis failed: {e}"}), 500
    return jsonify({"error": "TTS engine not loaded"}), 500


@app.route("/api/feedback/submit", methods=["POST"])
def api_submit_feedback():
    """Submit teacher pilot feedback and session usability survey."""
    if not pilot_logger:
        return jsonify({"error": "Pilot logger not loaded"}), 500
    data = request.get_json() or {}
    summary = pilot_logger.submit_feedback(data)
    return jsonify({"success": True, "message": "Feedback recorded successfully", "summary": summary})


@app.route("/api/feedback/summary", methods=["GET"])
def api_feedback_summary():
    """Retrieve aggregated System Usability Scale (SUS) metrics and survey summaries."""
    if not pilot_logger:
        return jsonify({"error": "Pilot logger not loaded"}), 500
    summary = pilot_logger.compute_summary()
    return jsonify({"success": True, "summary": summary})



@app.route("/api/languages", methods=["GET"])
def api_get_languages():
    """Return all 4 supported indigenous languages with script metadata and features."""
    languages = [
        {
            "id": "santali",
            "name": "Santali (ᱥᱟᱱᱛᱟᱲᱤ)",
            "family": "Austroasiatic (Munda)",
            "scripts": [
                {"id": "sat_Olck", "name": "Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)", "primary": True},
                {"id": "sat_Orya", "name": "Odia Script (ଓଡ଼ିଆ)"},
                {"id": "sat_Deva", "name": "Devanagari (संताली)"},
                {"id": "sat_Latn", "name": "Latin Roman"}
            ],
            "regions": ["Jharkhand", "Odisha", "West Bengal", "Bihar", "Assam"],
            "features": ["INT4 Quantized Edge MT", "Vosk Offline ASR", "Acoustic TTS", "NIPUN FLN TLMs"]
        },
        {
            "id": "ho",
            "name": "Ho (𑢹𑣉𑣉 𑣎𑣂𑣑𑣂 / हो भाषा)",
            "family": "Austroasiatic (Munda / Kherwarian)",
            "scripts": [
                {"id": "ho_Wara", "name": "Warang Citi (𑢹𑣉𑣉 𑣎𑣂𑣑𑣂)", "primary": True},
                {"id": "ho_Deva", "name": "Devanagari (हो)"},
                {"id": "ho_Latn", "name": "Latin Roman"}
            ],
            "regions": ["Kolhan Division", "West Singhbhum", "East Singhbhum", "Mayurbhanj"],
            "features": ["Warang Citi Transduction", "Oral Classroom Subtitles", "Flashcards", "Worksheets"]
        },
        {
            "id": "mundari",
            "name": "Mundari (𞓚𞓝𞓙𞓞 / मुण्डारी)",
            "family": "Austroasiatic (Munda)",
            "scripts": [
                {"id": "mun_Bani", "name": "Mundari Bani (𞓚𞓝𞓙𞓞)", "primary": True},
                {"id": "mun_Deva", "name": "Devanagari (मुण्डारी)"},
                {"id": "mun_Latn", "name": "Latin Roman"}
            ],
            "regions": ["Chhota Nagpur", "Khunti", "Ranchi", "Simdega"],
            "features": ["Mundari Bani Transduction", "Birsa Safari TLM", "Bilingual Reader", "Offline TTS"]
        },
        {
            "id": "kurukh",
            "name": "Kurukh (𑑎𑑚𑑎𑑙 / कुड़ुख़ / Oraon)",
            "family": "Dravidian (North Dravidian)",
            "scripts": [
                {"id": "kru_Deva", "name": "Devanagari (कुड़ुख़)", "primary": True},
                {"id": "kru_Tolo", "name": "Tolong Siki (𑑎𑑚𑑎𑑙)"},
                {"id": "kru_Latn", "name": "Latin Roman"}
            ],
            "regions": ["Gumla", "Lohardaga", "Latehar", "Ranchi", "Santhal Pargana"],
            "features": ["Tolong Siki Transduction", "Dravidian Morphology Engine", "Graded Reader", "FLN Math"]
        }
    ]
    return jsonify({"languages": languages, "total": len(languages), "status": "active"})


@app.route("/api/dictionary", methods=["GET"])
def api_get_dictionary():
    """Return full multilingual educational dictionary for all supported languages."""
    query = request.args.get("q", "").strip()
    target = request.args.get("target", "")

    result = {}
    for src, tgts in EDUCATIONAL_DICTIONARY.items():
        if src not in result:
            result[src] = {}
        for tgt_k, vocab in tgts.items():
            if target and tgt_k != target:
                continue
            if query:
                result[src][tgt_k] = {k: v for k, v in vocab.items() if query.lower() in k.lower() or query.lower() in str(v).lower()}
            else:
                result[src][tgt_k] = vocab

    return jsonify({
        "dictionary": result,
        "query": query,
        "count": sum(len(v) for tgts in result.values() for v in tgts.values())
    })

@app.route("/api/translate", methods=["POST"])
def api_translate():
    """
    Translation API endpoint with Ultra-Fast Auto-Offline Resilience.
    1. Checks offline O(1) in-memory cache, learned memory & dictionary for instant sub-millisecond response.
    2. If force_offline is set, bypasses cloud and executes local 6-layer offline engine at 0ms.
    3. If missing and online, calls Bhashini NMT API and auto-harvests result into local memory.
    4. Seamlessly falls back to local 6-layer engine on network interruption or offline mode.
    """
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    src = data.get("src", "hin_Deva")
    tgt = data.get("tgt", "sat_Olck")
    force_offline = data.get("force_offline", False)

    if not text:
        return jsonify({"error": "Missing 'text' field"}), 400

    start_time = time.time()
    cache_key = (text, src, tgt, force_offline)
    if cache_key in SERVER_TRANSLATION_CACHE:
        res_data = SERVER_TRANSLATION_CACHE[cache_key].copy()
        res_data["latency_ms"] = round((time.time() - start_time) * 1000, 2)
        return jsonify(res_data)

    translated_text = ""
    confidence = 0.0
    mode = "OFFLINE_EDGE"
    token_breakdown = []
    provider = "SurSetu 6-Layer Edge Engine"

    # Step 1: Check if exact high-confidence offline translation exists in 0ms
    exact_offline = None
    if server_translator and tgt in ["sat_Olck", "sat_Orya", "sat_Deva", "sat_Latn"]:
        engine_res = server_translator.translate(text, src, tgt, offline_only=True)
        if engine_res.get("confidence", 0.0) >= 0.95 or engine_res.get("mode") in ["EXACT_CORPUS_MATCH", "EXACT_DICTIONARY", "LEARNED_MEMORY", "SYNTACTIC_COPULAR_SOV", "SYNTACTIC_POSSESSIVE", "SYNTACTIC_IMPERATIVE_SOV"]:
            exact_offline = engine_res

    # Step 2: If no exact full offline match and cloud sync is available (and not force_offline)
    if not exact_offline and not force_offline and cloud_sync:
        cfg = cloud_sync.config
        if cfg.get("mode", "hybrid") in ["hybrid", "cloud_priority"] and (cfg.get("bhashini_api_key") or cfg.get("bhashini_udyat_key")):
            try:
                bhashini_res = cloud_sync.translate_with_bhashini(text, src, tgt)
                if bhashini_res.get("success") and bhashini_res.get("translated_text"):
                    translated_text = bhashini_res["translated_text"]
                    confidence = 0.98
                    mode = "BHASHINI_CLOUD_AUTO_CACHED"
                    provider = "Bhashini ULCA / Dhruva (Auto-Cached to Edge)"
                    
                    # Auto-Harvest into offline edge memory in background for future zero-latency access
                    try:
                        if src in ["hin_Deva", "hi"] and tgt in ["sat_Olck", "sat"]:
                            cloud_sync.sync_curriculum_to_offline_cache([{"hin": text, "sat": translated_text}])
                            if server_translator:
                                server_translator.learn(text, translated_text, target_lang="sat_Olck")
                    except Exception as harvest_err:
                        print(f"[AUTO-HARVEST WARNING] {harvest_err}")
            except Exception as cloud_err:
                print(f"[CLOUD FALLBACK TRIGGERED] Bhashini error: {cloud_err}")

    # Step 3: Automatic Offline Fallback (0ms execution)
    if not translated_text:
        if exact_offline:
            translated_text = exact_offline["translated_text"]
            confidence = exact_offline["confidence"]
            mode = exact_offline["mode"]
            token_breakdown = exact_offline.get("token_breakdown", [])
            provider = "SurSetu 6-Layer Offline Edge"
        elif server_translator and tgt in ["sat_Olck", "sat_Orya", "sat_Deva", "sat_Latn"]:
            engine_res = server_translator.translate(text, src, tgt, offline_only=True)
            translated_text = engine_res["translated_text"]
            confidence = engine_res["confidence"]
            mode = engine_res["mode"]
            token_breakdown = engine_res.get("token_breakdown", [])
            provider = "SurSetu 6-Layer Offline Edge"
        else:
            translated_text = fallback_translate(text, src, tgt)
            confidence = 1.0
            mode = "EXACT_DICTIONARY"
            token_breakdown = []
            provider = "Local Offline Dictionary"

    # Multi-Script Transliteration (Santali, Ho, Mundari, Kurukh, Hindi, English)
    transliterations = {}
    if translated_text and transduce_script:
        if tgt in ["sat_Olck", "sat_Orya", "sat_Deva", "sat_Latn"]:
            ol_base = translated_text if tgt == "sat_Olck" else transduce_script(translated_text, tgt, "sat_Olck")
            transliterations = {
                "sat_Olck": ol_base,
                "sat_Orya": transduce_script(ol_base, "ol_chiki", "odia"),
                "sat_Deva": transduce_script(ol_base, "ol_chiki", "deva"),
                "sat_Latn": transduce_script(ol_base, "ol_chiki", "latin"),
            }
        elif tgt in ["ho_Wara", "ho_Deva", "hoc_Deva", "ho_Latn"]:
            deva_base = translated_text if tgt in ["ho_Deva", "hoc_Deva"] else transduce_script(translated_text, tgt, "deva")
            transliterations = {
                "ho_Wara": transduce_script(deva_base, "deva", "warang_citi"),
                "ho_Deva": deva_base,
                "ho_Latn": transduce_script(deva_base, "deva", "latin") if hasattr(transduce_script, "__call__") else translated_text
            }
        elif tgt in ["mun_Bani", "mun_Deva", "unr_Deva", "mun_Latn"]:
            deva_base = translated_text if tgt in ["mun_Deva", "unr_Deva"] else transduce_script(translated_text, tgt, "deva")
            transliterations = {
                "mun_Bani": transduce_script(deva_base, "deva", "mundari_bani"),
                "mun_Deva": deva_base,
                "mun_Latn": deva_base
            }
        elif tgt in ["kru_Tolo", "kru_Deva", "kru_Latn"]:
            deva_base = translated_text if tgt == "kru_Deva" else transduce_script(translated_text, tgt, "deva")
            transliterations = {
                "kru_Tolo": transduce_script(deva_base, "deva", "tolong_siki"),
                "kru_Deva": deva_base,
                "kru_Latn": deva_base
            }

    latency_ms = (time.time() - start_time) * 1000

    response_payload = {
        "original_text": text,
        "translated_text": translated_text,
        "source_language": src,
        "target_language": tgt,
        "confidence": confidence,
        "mode": mode,
        "provider": provider,
        "offline_ready": True,
        "token_breakdown": token_breakdown,
        "transliterations": transliterations,
        "latency_ms": round(latency_ms, 2)
    }

    if len(SERVER_TRANSLATION_CACHE) < 5000:
        SERVER_TRANSLATION_CACHE[cache_key] = response_payload

    return jsonify(response_payload)


@app.route("/api/offline_bundle", methods=["GET"])
def api_offline_bundle():
    """Return complete offline dictionary, learned memory, and grammar rules for client-side offline execution."""
    learned_mem = {}
    if os.path.exists(os.path.join(PROJECT_ROOT, "datasets", "learned_memory.json")):
        try:
            with open(os.path.join(PROJECT_ROOT, "datasets", "learned_memory.json"), "r", encoding="utf-8") as f:
                learned_mem = json.load(f)
        except Exception:
            pass

    # Extract all vocabulary from server_translator base dictionary if present
    full_dict = EDUCATIONAL_DICTIONARY
    if server_translator and hasattr(server_translator, "base_dict"):
        full_dict = server_translator.base_dict

    total_phrases = sum(len(v) for v in learned_mem.get("hin_Deva", {}).values()) if learned_mem else 0
    total_phrases += sum(len(v) for v in full_dict.get("hin_Deva", {}).values()) if full_dict else 0

    return jsonify({
        "success": True,
        "version": "1.2.0-offline",
        "educational_dictionary": full_dict,
        "learned_memory": learned_mem,
        "total_offline_phrases": total_phrases
    })


@app.route("/api/tts", methods=["GET", "POST"])
def api_tts():
    """
    Generate loud, clear speech audio for Santali, Hindi, or English text.
    Transduces Ol Chiki / Odia script to phonetic Devanagari representation for natural pronunciation.
    """
    import urllib.parse
    import urllib.request
    from flask import Response
    
    if request.method == "POST":
        data = request.get_json() or {}
        text = data.get("text", "").strip()
        lang = data.get("lang", "sat_Olck")
    else:
        text = request.args.get("text", "").strip()
        lang = request.args.get("lang", "sat_Olck")

    if not text:
        return jsonify({"error": "Missing 'text' parameter"}), 400

    # Phonetic adaptation for Santali
    phonetic_text = text
    tl = "hi"
    if lang in ["sat_Olck", "ol_chiki", "olchiki"] or any(0x1C50 <= ord(c) <= 0x1C7F for c in text):
        if transduce_script:
            phonetic_text = transduce_script(text, "ol_chiki", "deva")
        tl = "hi"
    elif lang in ["sat_Orya", "odia", "oriya"] or any(0x0B00 <= ord(c) <= 0x0B7F for c in text):
        tl = "or"
        phonetic_text = text
    elif lang in ["eng_Latn", "en", "english"]:
        tl = "en"
        phonetic_text = text
    else:
        tl = "hi"

    try:
        q_enc = urllib.parse.quote(phonetic_text)
        url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl={tl}&q={q_enc}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=1.2) as res:
            audio_bytes = res.read()
            return Response(audio_bytes, mimetype="audio/mpeg", headers={
                "Content-Type": "audio/mpeg",
                "Cache-Control": "public, max-age=86400",
                "Accept-Ranges": "bytes"
            })
    except Exception:
        # High-Fidelity 16kHz Offline WAV Formant Synthesizer Fallback
        try:
            if synthesize_speech:
                wav_bytes = synthesize_speech(phonetic_text, lang)
                if wav_bytes:
                    return Response(wav_bytes, mimetype="audio/wav", headers={
                        "Content-Type": "audio/wav",
                        "Cache-Control": "public, max-age=86400",
                        "Accept-Ranges": "bytes"
                    })
        except Exception as synth_err:
            print(f"[SERVER TTS ERROR] Synthesizer failed: {synth_err}")
            
        return jsonify({
            "offline_mode": True,
            "error": "TTS offline fallback active",
            "phonetic_text": phonetic_text,
            "tl": tl
        }), 200


@app.route("/api/classify_odia_santali", methods=["POST"])
def api_classify_odia_santali():
    """Classify whether Odia script input is Santali (sat) or Odia (ori)."""
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "Missing 'text' parameter"}), 400

    if classify_odia_santali:
        result = classify_odia_santali(text)
        return jsonify({"success": True, **result})

    return jsonify({"error": "Classifier module not available"}), 500


@app.route("/api/transduce_script", methods=["POST"])
def api_transduce_script():
    """Transduce text between Ol Chiki, Odia Script, and Devanagari."""
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    src_script = data.get("src_script", "ol_chiki")
    tgt_script = data.get("tgt_script", "odia")

    if not text:
        return jsonify({"error": "Missing 'text' parameter"}), 400

    if transduce_script:
        output_text = transduce_script(text, src_script, tgt_script)
        return jsonify({
            "success": True,
            "original_text": text,
            "transduced_text": output_text,
            "src_script": src_script,
            "tgt_script": tgt_script
        })

    return jsonify({"error": "Transducer module not available"}), 500


@app.route("/api/learn", methods=["POST"])
def api_learn():
    """Dynamically register a new translation pair into continuous memory."""
    data = request.get_json() or {}
    hindi = data.get("hindi", "").strip()
    santali = data.get("santali", "").strip()
    tgt_lang = data.get("tgt_lang", "sat_Olck")

    if not hindi or not santali:
        return jsonify({"error": "Both 'hindi' and 'santali' fields are required"}), 400

    if server_translator:
        server_translator.learn(hindi, santali, target_lang=tgt_lang)
        return jsonify({
            "success": True,
            "message": f"Successfully learned: '{hindi}' -> '{santali}'",
            "hindi": hindi,
            "santali": santali
        })

    return jsonify({"error": "Translator engine not initialized"}), 500


@app.route("/api/worksheets/generate", methods=["POST"])
@app.route("/api/generate-worksheet", methods=["POST"])
@app.route("/api/generate_worksheet", methods=["POST"])
def api_generate_worksheet():
    """Comprehensive Worksheet & FLN Study Material Generator API endpoint."""
    data = request.get_json() or {}
    ws_type = data.get("type", "matching")
    ws_title = data.get("title")
    target_lang = data.get("target_lang", "sat_Olck")
    category = data.get("category", "all")
    grade = data.get("grade", "Grade 1")

    if generate_worksheet:
        ws_data = generate_worksheet(
            ws_type=ws_type,
            title=ws_title,
            target_lang=target_lang,
            category=category,
            grade=grade
        )
    elif ws_type == "counting" and generate_counting_worksheet:
        ws_data = generate_counting_worksheet(title=ws_title, target_lang=target_lang)
    elif generate_matching_worksheet:
        ws_data = generate_matching_worksheet(title=ws_title, target_lang=target_lang, category=category)
    else:
        return jsonify({"error": "Worksheet generator module not loaded"}), 500

    # Save to temp html file to read html string and cleanly remove
    clean_type_tag = ws_type.replace(" ", "_").lower()
    temp_output_path = os.path.join(PROJECT_ROOT, f"temp_worksheet_{clean_type_tag}.html")
    export_worksheet_html(ws_data, temp_output_path)

    html_content = ""
    if os.path.exists(temp_output_path):
        try:
            with open(temp_output_path, "r", encoding="utf-8") as f:
                html_content = f.read()
            os.remove(temp_output_path)
        except Exception:
            pass

    return jsonify({
        "success": True,
        "title": ws_data.get("title"),
        "type": ws_data.get("type"),
        "target_lang": ws_data.get("target_lang"),
        "lang_label": ws_data.get("lang_label"),
        "html": html_content
    })


# ---------------------------------------------------------------------------
# AI Assistant (Sur Saathi) Chat Endpoint
# ---------------------------------------------------------------------------
try:
    from assistant_engine import ai_assistant
except ImportError:
    ai_assistant = None


@app.route("/api/assistant/chat", methods=["POST"])
def api_assistant_chat():
    """Inbuilt AI Teaching Assistant (Sur Saathi) endpoint."""
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    target_lang = data.get("target_lang", "sat_Olck")
    grade = data.get("grade", "Grade 1")

    if not message:
        return jsonify({"error": "Missing 'message' field"}), 400

    if ai_assistant:
        res = ai_assistant.answer_query(user_message=message, target_lang=target_lang, grade=grade)
        return jsonify({
            "success": True,
            **res
        })

    return jsonify({
        "success": True,
        "title": "AI Assistant Response",
        "reply_text": f"Echo: {message}",
        "suggested_chips": ["नमस्ते", "पाठ योजना"],
        "audio_speak_text": message
    })


# ---------------------------------------------------------------------------
# Cloud Sync & Multi-Tier API Settings Endpoints
# ---------------------------------------------------------------------------
try:
    from cloud_sync_api import cloud_sync
except ImportError:
    cloud_sync = None


@app.route("/api/cloud_sync/status", methods=["GET"])
def api_cloud_sync_status():
    """Get Cloud API connectivity, credentials state, and local cache status."""
    if not cloud_sync:
        return jsonify({"success": False, "error": "Cloud sync engine unavailable"}), 500

    cfg = cloud_sync.config
    return jsonify({
        "success": True,
        "mode": cfg.get("mode", "hybrid"),
        "has_bhashini": bool(cfg.get("bhashini_api_key") and cfg.get("bhashini_user_id")),
        "has_gemini": bool(cfg.get("gemini_api_key")),
        "has_hf": bool(cfg.get("huggingface_token")),
        "last_sync_timestamp": cfg.get("last_sync_timestamp"),
        "synced_pairs_count": cfg.get("synced_pairs_count", 0)
    })


@app.route("/api/cloud_sync/config", methods=["GET", "POST"])
def api_cloud_sync_config():
    """Get (masked) or update cloud API keys and sync preferences."""
    if not cloud_sync:
        return jsonify({"success": False, "error": "Cloud sync engine unavailable"}), 500

    if request.method == "POST":
        data = request.get_json() or {}
        updates = {}
        for k in ["mode", "bhashini_user_id", "bhashini_api_key", "bhashini_pipeline_id", "gemini_api_key", "huggingface_token", "sarvam_api_key"]:
            if k in data and data[k] is not None:
                updates[k] = data[k]

        saved = cloud_sync.save_config(updates)
        return jsonify({"success": True, "message": "API configuration updated successfully", "config": saved})

    # GET request - return masked keys for security
    cfg = cloud_sync.config.copy()
    for k in ["bhashini_api_key", "gemini_api_key", "huggingface_token", "sarvam_api_key"]:
        val = cfg.get(k, "")
        if val and len(val) > 8:
            cfg[k] = val[:4] + "*" * (len(val) - 8) + val[-4:]
    return jsonify({"success": True, "config": cfg})


@app.route("/api/cloud_sync/sync", methods=["POST"])
def api_cloud_sync_now():
    """Execute on-demand cloud-to-offline edge synchronization."""
    if not cloud_sync:
        return jsonify({"success": False, "error": "Cloud sync engine unavailable"}), 500

    data = request.get_json() or {}
    batch_pairs = data.get("batch_pairs")

    res = cloud_sync.sync_curriculum_to_offline_cache(batch_pairs=batch_pairs)
    return jsonify(res)


@app.route("/api/metrics", methods=["GET"])
def api_metrics():
    """Return runtime system metrics, memory cache size, and engine telemetry."""
    learned_count = 0
    if server_translator and "hin_Deva" in server_translator.memory:
        learned_count = len(server_translator.memory["hin_Deva"].get("sat_Olck", {}))
    
    vm = get_vosk_model()
    return jsonify({
        "status": "healthy",
        "cached_translations": len(SERVER_TRANSLATION_CACHE),
        "learned_phrases": learned_count,
        "vosk_loaded": vm is not None,
        "supported_languages": ["santali", "ho", "mundari", "hindi", "odia", "english"],
        "scripts": ["Ol Chiki", "Devanagari", "Odia", "Latin", "Warang Chiti", "Mundari Bani"],
        "engine_architecture": "6-Layer PrefixTrie & Morphological Transducer Edge Engine",
        "timestamp": time.time()
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"\n" + "=" * 65)
    print(f"  🚀 SurSetu Unified Web Application Server running at:")
    print(f"     http://127.0.0.1:{port}")
    print(f"     http://localhost:{port}")
    print(f"=" * 65 + "\n")
    app.run(host="0.0.0.0", port=port, debug=False)
