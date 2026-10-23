import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyMockForAyurvedaAppPreview",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ayurvedic-assistant.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ayurvedic-assistant",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ayurvedic-assistant.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcd1234efgh"
};

let app = null;
let auth = null;
let isConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'AIzaSyDemoKeyMockForAyurvedaAppPreview'
);

try {
  if (isConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  }
} catch (e) {
  console.warn('Firebase initialization error, fallback to demo mode:', e);
}

export {
  auth,
  isConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
};
