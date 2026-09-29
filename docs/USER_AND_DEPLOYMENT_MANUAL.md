# 🛠️ SurSetu — User & Deployment Manual

## 1. System Requirements & Prerequisites

### 1.1 Minimum Hardware Specifications
- **Operating System:** Windows 10/11, Ubuntu 20.04+, macOS 12+, or Raspberry Pi OS (64-bit).
- **Processor:** Dual-Core 1.8 GHz CPU (Intel Core i3, AMD Ryzen 3, or ARM Cortex-A72).
- **RAM:** Minimum 2 GB (Application memory footprint is ~420 MB).
- **Storage:** Minimum 500 MB free disk space (includes acoustic models and 72.9k parallel corpus).
- **Audio Device:** Standard built-in laptop microphone or USB headset.

### 1.2 Software Prerequisites
- **Python:** Python 3.9, 3.10, 3.11, or 3.12.
- **Web Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox, or Chromium (any modern browser with Web Audio & Service Worker support).

---

## 2. Quick Local Setup & Installation

### Step 1: Clone or Open Workspace
```powershell
cd d:\Sursetu-main\Sursetu-main
```

### Step 2: Set Up Virtual Environment & Dependencies
```powershell
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1   # On Windows PowerShell
# source .venv/bin/activate     # On Linux / macOS

# Install core lightweight requirements
pip install -r requirements.txt
```

*Contents of `requirements.txt`:*
```text
flask>=3.0.0
vosk>=0.3.45
sounddevice>=0.4.6
numpy>=1.24.0
requests>=2.31.0
```

---

## 3. Running the Application

### Option A: 1-Click Live Public Launcher (Recommended)
Automatically starts the local server and creates an official, zero-configuration HTTPS Cloudflare public tunnel:

```powershell
.\.venv\Scripts\python.exe launch_live.py
```

**Output:**
```
=================================================================
  🌿 SURSETU - STARTING CLOUDFLARE LIVE PUBLIC SERVER
=================================================================
  👉 LIVE PUBLIC URL:  https://ohio-tobago-economy-absence.trycloudflare.com
  👉 LOCALHOST URL:    http://localhost:8080
=================================================================
```

### Option B: Local Offline Server
Runs the standalone local Flask backend without external tunnels:

```powershell
.\.venv\Scripts\python.exe server.py
```
Open **`http://localhost:8080`** in your web browser.

---

## 4. Progressive Web App (PWA) Offline Installation

1. Open `http://localhost:8080` or the HTTPS Live Link in Google Chrome / Microsoft Edge.
2. Click the **Install App** icon in the browser address bar (or Menu ➔ *Install SurSetu*).
3. The application will install as a native desktop/mobile application.
4. Once installed, disconnect from the internet or enable **Airplane Mode**.
5. SurSetu will continue executing translations, speech synthesis, AI assistant dialogues, and worksheet generation 100% offline.

---

## 5. Production Cloud Deployment (Optional)

### 5.1 Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "server.py"]
```

Build and run:
```bash
docker build -t sursetu .
docker run -p 8080:8080 sursetu
```

### 5.2 Render / Railway / Cloud Run
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python server.py`
- **Environment Variable:** `PORT=8080`
