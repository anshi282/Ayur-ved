import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let isInitialized = false;
let db = null;
let auth = null;

// In-memory fallback for local development/demo when service account is not yet provided
const memoryStore = {
  users: new Map(),
  history: new Map(),
  files: new Map()
};

try {
  const serviceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  let credential = null;
  if (serviceAccountJson) {
    credential = admin.credential.cert(JSON.parse(serviceAccountJson));
  } else if (serviceAccountKeyPath && fs.existsSync(path.resolve(serviceAccountKeyPath))) {
    credential = admin.credential.cert(path.resolve(serviceAccountKeyPath));
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    credential = admin.credential.applicationDefault();
  }

  if (credential) {
    admin.initializeApp({
      credential
    });
    isInitialized = true;
    db = admin.firestore();
    auth = admin.auth();
    console.log('✅ Firebase Admin initialized with official credentials.');
  } else {
    console.warn('⚠️ No Firebase service account credentials found. Running in dev memory-store mode.');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin init failed or skipped:', error.message);
}

export { admin, db, auth, isInitialized, memoryStore };
