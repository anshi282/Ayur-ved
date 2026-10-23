# 🌿 E-Ayurvedic Health Assistant

An AI-powered Ayurvedic wellness and lifestyle guidance web application designed according to the [E-Ayurvedic System Design Specification](file:///home/dell/Desktop/Ayur-ved/E-Ayurvedic_System_Design.pdf).

Users can describe symptoms in free text or upload medical documents/photos (JPG, PNG, PDF) to receive instant Ayurvedic herb recommendations, dietary Ahara guidance, daily Dinacharya habits, and doctor triage, backed by **Google Gemini Multimodal AI** and **Firebase**.

---

## ⚡ Quick Run (One-Click Launchers)

### 🪟 Windows Users:
Simply **Double-Click** on:
```text
start.bat
```
*(Ye script automatically dependencies check karegi, Backend aur Frontend dono start karegi, aur browser me `http://localhost:5173` open kar degi!)*

### 🐧 Linux / macOS Users:
Terminal me run karein:
```bash
./start.sh
```

---

## 🔑 Required APIs & Credentials (Kahan se lena hai aur kahan daalna hai)

Iss project me **2 main services** use hoti hain. Dono ko setup karne ka complete guide niche diya gaya hai:

### 1️⃣ Google Gemini API Key (AI Intelligence ke liye) 🤖
* **Purpose:** User ke symptoms ko samajhna, PDF/image lab reports ko analyze karna, aur Ayurvedic herbs, diet, lifestyle aur emergency flag generate karna.
* **Kahan se lein (Free):**
  1. [Google AI Studio](https://aistudio.google.com/) par jayein.
  2. Apne Google account se login karein aur **"Get API key"** par click karke apni key generate karein.
* **Kahan daalni hai:**
  👉 File open karein: `server/.env`
  ```env
  PORT=5000
  GEMINI_API_KEY=AIzaSyD-YourActualGeminiApiKeyHere
  ```

---

### 2️⃣ Firebase Authentication & Firestore (User Login & History ke liye) 🔥

Firebase setup do hisso me hota hai: Frontend (Client) aur Backend (Server).

#### A. Frontend Config (Login & Google Sign-In)
* **Kahan se lein:**
  1. [Firebase Console](https://console.firebase.google.com/) me naya project create karein.
  2. Left sidebar me **Authentication** enable karein (Google Provider + Email/Password).
  3. **Project Settings** ➔ **General** ➔ Niche **"Your apps"** section me Web icon (`</>`) par click karke app register karein.
  4. Wahan se credentials copy karein.
* **Kahan daalni hai:**
  👉 File create karein: `client/.env` *(aap `client/.env.example` ko copy karke `.env` rename kar sakte hain)*:
  ```env
  VITE_FIREBASE_API_KEY=AIzaSy...
  VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your-project-id
  VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=1029384756
  VITE_FIREBASE_APP_ID=1:1029384756:web:abcd1234efgh
  ```

#### B. Backend Service Account (Database me History save karne ke liye)
* **Kahan se lein:**
  1. Firebase Console me **Project Settings** ➔ **Service accounts** tab par jayein.
  2. **"Generate new private key"** button par click karein. Ek `.json` file download hogi.
* **Kahan daalni hai:**
  👉 Us downloaded `.json` file ka naam badal kar `serviceAccountKey.json` rakhein aur use is folder me paste kar dein:
  ```text
  server/config/serviceAccountKey.json
  ```
  Aur verify karein ki `server/.env` me ye line maujood ho:
  ```env
  FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
  ```

---

## 💡 Bina API Keys ke Test Kaise Karein? (Demo Mode)

> [!NOTE]
> Agar aapke paas abhi API keys nahi hain, tab bhi aap project ko turant test kar sakte hain!
> System me **Smart Simulation & 1-Click Demo Mode** integrated hai:
> 1. App open karein (`http://localhost:5173`).
> 2. Sign In page par **"Instant Preview Access (1-Click Demo)"** par click karein.
> 3. AI aur History functions bina kisi key ke locally run honge!

---

## 🧪 Testing Scenarios

1. **Normal Symptoms Test:**
   - Symptoms box me likhein: `"Cold, dry cough, and mild throat irritation"`
   - Result: Sitopaladi Churna, Mulethi, ginger warm water, lifestyle routine return hoga.
2. **Emergency Red Alert Test:**
   - Symptoms box me likhein: `"Severe chest pain and difficulty in breathing"`
   - Result: Glowing Red Emergency Alert banner trigger hoga aur hospital ER triage suggest karega.
3. **Medical Report Upload Test:**
   - Drag & drop any JPG, PNG image or PDF lab report (<= 20MB). File analysis ke baad privacy protection ke liye server disk se turant auto-delete ho jayegi.
4. **History Management Test:**
   - Top navbar me **"My History"** par click karein. Previous records dekh sakte hain aur individual ya clear all delete kar sakte hain.

---

## 🛠️ Manual Terminal Commands

Agar aap bina `.bat` / `.sh` script ke terminal se chalana chahein:

### Terminal 1: Backend Server
```bash
cd server
npm install
npm start
# Server runs on: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Terminal 2: Frontend App
```bash
cd client
npm install
npm run dev
# Vite runs on: http://localhost:5173
```

---

## 📂 Project Architecture & File Map

```text
Ayur-ved/
├── client/                     # React Frontend (Vite)
│   ├── .env.example            # Frontend Firebase environment template
│   ├── src/
│   │   ├── components/         # Navbar, FormCard, ResultCard, EmergencyAlert, HistoryItem
│   │   ├── context/            # AuthContext (Firebase Auth + 1-Click Demo)
│   │   ├── pages/              # Home, Result, History, Login
│   │   ├── services/           # Backend API connector
│   │   ├── index.css           # Ayurvedic Design System (Forest Green + Amber)
│   │   └── App.jsx             # Router layout
│   └── vite.config.js
│
├── server/                     # Node.js + Express REST API
│   ├── .env.example            # Backend environment template (Gemini & Firebase)
│   ├── config/                 # Gemini Client & Firebase Admin configs
│   ├── middleware/             # Auth token check, Multer file upload, Rate limiter
│   ├── routes/                 # /api/analyze, /api/history
│   ├── services/               # Gemini Multimodal prompt builder & AI service
│   ├── uploads/                # Temp upload directory (auto-deleted after analysis)
│   └── index.js                # Express entry point
│
├── start.bat                   # 1-Click launcher for Windows
├── start.sh                    # 1-Click launcher for Linux / Mac
├── E-Ayurvedic_System_Design.pdf # Original system design reference
└── README.md                   # Project documentation
```

---

## 🛡️ Medical Safety & Disclaimer

This application is designed as a wellness and lifestyle guide and does not provide formal medical diagnosis, clinical prescriptions, or replace consultation with a licensed medical practitioner.
