# 🌿 E-Ayurvedic Health Assistant

An AI-powered Ayurvedic wellness and lifestyle guidance web application designed according to the [E-Ayurvedic System Design Specification](file:///home/dell/Desktop/Ayur-ved/E-Ayurvedic_System_Design.pdf).

Users can describe symptoms in free text or upload medical documents/photos (JPG, PNG, PDF) to receive instant Ayurvedic herb recommendations, dietary Ahara guidance, daily Dinacharya habits, and doctor triage, backed by **Google Gemini Multimodal AI** and **Firebase**.

---

## ✨ Features

- **Multimodal AI Analysis:** Gemini 2.x understands text symptoms and reads uploaded lab reports, prescriptions, or skin photos directly.
- **Emergency Detection & Red Alert:** Instantly flags critical symptoms (chest pain, shortness of breath, severe bleeding, stroke signs) with high-priority hospital advice.
- **Ayurvedic Guidance:** Delivers traditional herbs with their therapeutic benefits, Ahara (fruits & diet) suggestions, and Vihara (lifestyle/sleep/pranayama) routines.
- **Privacy First:** Uploaded documents are deleted immediately from disk after AI inference. Only high-level metadata and structured insights are retained.
- **Personal Consultation History:** Private history stored per user in Firebase Firestore with options to view past assessments or delete single/all records.
- **Dual Mode (Ready-to-Run):** Works immediately with full intelligent simulation fallback for local development & demonstration, and switches seamlessly to live Firebase & Gemini when keys are added.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Lucide Icons, Modern Vanilla CSS Design System
- **Backend:** Node.js, Express.js, Multer (file handling), Helmet, CORS, Express-Rate-Limit
- **AI Intelligence:** Google Gemini API (`@google/generative-ai`)
- **Authentication & Database:** Firebase Auth (Google Sign-In + Email/Password), Cloud Firestore

---

## 🚀 Quick Start Guide

### 1. Start Backend Server
```bash
cd server
npm start
# Server starts on http://localhost:5000
```
Health check: `http://localhost:5000/api/health`

### 2. Start Frontend App
```bash
cd client
npm run dev
# Vite dev server runs on http://localhost:5173
```

---

## 🔑 Environment Variables Setup

### Backend (`server/.env`)
Create or edit `server/.env`:
```env
PORT=5000

# Get your Gemini API Key from: https://aistudio.google.com/
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Firebase Admin SDK (Optional for local demo mode, required for production Firestore)
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
```

### Frontend (`client/.env`)
Create `client/.env` (optional, for connecting your live Firebase project):
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📂 Project Architecture

```
Ayur-ved/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, FormCard, ResultCard, EmergencyAlert, HistoryItem
│   │   ├── context/            # AuthContext (Firebase + Demo mode)
│   │   ├── pages/              # Home, Result, History, Login
│   │   ├── services/           # API fetch and Firebase client
│   │   ├── App.jsx             # Main router and layout
│   │   └── index.css           # Ayurvedic Design System
│   └── vite.config.js
│
├── server/                     # Express REST Backend
│   ├── config/                 # Firebase Admin & Gemini client config
│   ├── middleware/             # Auth token check, Multer file upload, Rate limiter
│   ├── routes/                 # POST /api/analyze, /api/history CRUD
│   ├── services/               # Gemini multimodal caller & prompt builder
│   └── index.js                # Server entry point
│
├── E-Ayurvedic_System_Design.pdf # Original system design reference
└── README.md
```

---

## 🛡️ Medical Safety & Disclaimer

This application is designed as a wellness and lifestyle guide and does not provide formal medical diagnosis, clinical prescriptions, or replace consultation with a licensed medical practitioner.
