"""
SurSetu - 1-Click Live Public Launcher (Powered by Cloudflare Quick Tunnels)
--------------------------------------------------------------------------------
Zero Configuration, Zero Signup, No Auth Tokens Required.
Generates an official high-speed HTTPS Cloudflare link.
"""

import os
import re
import subprocess
import sys
import threading
import time
import socket
from server import app

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
CLOUDFLARED_PATH = os.path.join(PROJECT_ROOT, "cloudflared.exe")

def find_available_port():
    for p in [8080, 8088, 8501, 5000, 8000]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.5)
            if s.connect_ex(('127.0.0.1', p)) != 0:
                return p
    return 8080

PORT = int(os.environ.get("PORT", 0)) or find_available_port()


def run_flask():
    """Run Flask server on local port."""
    try:
        print(f"[FLASK] Starting server on http://127.0.0.1:{PORT} ...", flush=True)
        app.run(host="0.0.0.0", port=PORT, debug=False, use_reloader=False)
    except Exception as e:
        print(f"[FLASK EXCEPTION] {e}", flush=True)


def start_live():
    print("\n" + "=" * 65)
    print("  🌿 SURSETU - STARTING CLOUDFLARE LIVE PUBLIC SERVER")
    print("=" * 65)

    if not os.path.exists(CLOUDFLARED_PATH):
        print(f"[INFO] cloudflared.exe not found at {CLOUDFLARED_PATH}. Attempting download from official release...")
        try:
            import urllib.request
            url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
            urllib.request.urlretrieve(url, CLOUDFLARED_PATH)
            print("[INFO] cloudflared.exe downloaded successfully!")
        except Exception as e:
            print(f"[WARNING] Could not download cloudflared.exe: {e}")
            print(f"[INFO] Running SurSetu locally at http://localhost:{PORT}")
            run_flask()
            return

    # 1. Start Flask in background thread
    server_thread = threading.Thread(target=run_flask, daemon=True)
    server_thread.start()
    time.sleep(1.5)

    # 2. Launch cloudflared tunnel in auto-reconnect loop
    cmd = [CLOUDFLARED_PATH, "tunnel", "--url", f"http://127.0.0.1:{PORT}"]
    url_pattern = re.compile(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com")

    while True:
        try:
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                encoding="utf-8",
                errors="replace"
            )

            public_url = None
            for line in iter(process.stdout.readline, ""):
                if not public_url:
                    match = url_pattern.search(line)
                    if match:
                        public_url = match.group(0)
                        with open(os.path.join(PROJECT_ROOT, "LIVE_LINK.txt"), "w", encoding="utf-8") as f:
                            f.write(public_url.strip())

                        print("\n" + "*" * 65, flush=True)
                        print("  🎉 YOUR SURSETU LIVE PUBLIC LINK IS READY!", flush=True)
                        print("*" * 65, flush=True)
                        print(f"\n  👉 LIVE PUBLIC URL:  {public_url}", flush=True)
                        print(f"  👉 LOCALHOST URL:    http://localhost:{PORT}", flush=True)
                        print("\n  ✅ Zero Signup • Fast Global Cloudflare CDN • HTTPS Secure", flush=True)
                        print("  Open this link on your phone, tablet, or share with anyone!", flush=True)
                        print("*" * 65 + "\n", flush=True)

            process.wait()
            print("[INFO] Tunnel disconnected, reconnecting in 3 seconds...", flush=True)
            time.sleep(3)
        except KeyboardInterrupt:
            print("\n[INFO] Stopping live tunnel and server...")
            if process:
                process.terminate()
            break
        except Exception as e:
            print(f"[TUNNEL RECONNECT ERROR] {e}, retrying in 5 seconds...", flush=True)
            time.sleep(5)


if __name__ == "__main__":
    start_live()
