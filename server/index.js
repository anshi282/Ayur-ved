import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import analyzeRouter from './routes/analyze.js';
import historyRouter from './routes/history.js';
import { isInitialized as isFirebaseReady } from './config/firebaseAdmin.js';
import { genAI } from './config/geminiClient.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'E-Ayurvedic Health Assistant API',
    version: '1.0.0',
    firebase_auth_ready: isFirebaseReady,
    gemini_api_ready: !!genAI,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/history', historyRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  if (err.message && err.message.includes('Only JPG, PNG, and PDF')) {
    return res.status(400).json({ error: 'Validation Error', message: err.message });
  }
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`🌿 E-Ayurvedic Assistant Backend running on http://localhost:${PORT}`);
  console.log(`   Health endpoint: http://localhost:${PORT}/api/health`);
});
