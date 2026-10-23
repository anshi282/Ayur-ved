import express from 'express';
import fs from 'fs';
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { analyzeLimiter } from '../middleware/rateLimiter.js';
import { analyzeWithGemini } from '../services/gemini.js';
import { db, isInitialized, memoryStore } from '../config/firebaseAdmin.js';

const router = express.Router();

router.post('/', verifyToken, analyzeLimiter, upload.single('file'), async (req, res) => {
  const file = req.file;
  const { symptoms, age, gender, duration } = req.body;
  const user_uid = req.user.uid;

  if (!symptoms && !file) {
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Please provide either symptom description or upload a document/photo.'
    });
  }

  try {
    // 1. Invoke Gemini multimodal analysis
    const analysisResult = await analyzeWithGemini({
      symptoms,
      age: age ? parseInt(age, 10) : null,
      gender,
      duration,
      file
    });

    const isEmergency = Boolean(analysisResult.emergency);
    const recordId = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`;
    const createdAt = new Date().toISOString();

    const historyRecord = {
      id: recordId,
      user_uid,
      symptoms: symptoms || '(Document provided)',
      age: age ? parseInt(age, 10) : null,
      gender: gender || null,
      duration: duration || null,
      gemini_result: analysisResult,
      emergency: isEmergency,
      has_file: !!file,
      created_at: createdAt
    };

    let fileRecord = null;
    if (file) {
      fileRecord = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
        history_id: recordId,
        user_uid,
        file_type: file.mimetype,
        file_name: file.originalname,
        size_kb: Math.round(file.size / 1024),
        created_at: createdAt
      };
    }

    // 2. Persist in Firestore (or in-memory store in dev mode)
    if (isInitialized && db) {
      await db.collection('history').doc(recordId).set(historyRecord);
      if (fileRecord) {
        await db.collection('files').doc(fileRecord.id).set(fileRecord);
      }
    } else {
      memoryStore.history.set(recordId, historyRecord);
      if (fileRecord) {
        memoryStore.files.set(fileRecord.id, fileRecord);
      }
    }

    // 3. Immediately delete temporary file from disk for privacy & disk space protection
    if (file && fs.existsSync(file.path)) {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Failed to remove temp upload:', err.message);
      });
    }

    // 4. Return structured response to client
    return res.status(200).json({
      success: true,
      recordId,
      historyRecord,
      gemini_result: analysisResult,
      emergency: isEmergency
    });
  } catch (error) {
    if (file && fs.existsSync(file.path)) {
      try { fs.unlinkSync(file.path); } catch (e) {}
    }
    console.error('Analysis Endpoint Error:', error);
    return res.status(500).json({
      error: 'Analysis Error',
      message: 'Failed to process Ayurvedic symptom analysis. Please try again.'
    });
  }
});

export default router;
