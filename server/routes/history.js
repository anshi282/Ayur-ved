import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { db, isInitialized, memoryStore } from '../config/firebaseAdmin.js';

const router = express.Router();

// GET /api/history - List all past analyses of the logged-in user
router.get('/', verifyToken, async (req, res) => {
  const user_uid = req.user.uid;

  try {
    if (isInitialized && db) {
      const snapshot = await db.collection('history')
        .where('user_uid', '==', user_uid)
        .orderBy('created_at', 'desc')
        .get();

      const items = snapshot.docs.map(doc => doc.data());
      return res.json({ success: true, count: items.length, history: items });
    } else {
      const userRecords = Array.from(memoryStore.history.values())
        .filter(rec => rec.user_uid === user_uid)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return res.json({ success: true, count: userRecords.length, history: userRecords });
    }
  } catch (error) {
    console.error('Fetch History Error:', error);
    return res.status(500).json({ error: 'Database Error', message: 'Could not fetch history records.' });
  }
});

// GET /api/history/:id - Open one past analysis in detail
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const user_uid = req.user.uid;

  try {
    let record = null;
    if (isInitialized && db) {
      const doc = await db.collection('history').doc(id).get();
      if (doc.exists) {
        record = doc.data();
      }
    } else {
      record = memoryStore.history.get(id);
    }

    if (!record) {
      return res.status(404).json({ error: 'Not Found', message: 'History record does not exist.' });
    }

    if (record.user_uid !== user_uid) {
      return res.status(403).json({ error: 'Forbidden', message: 'You cannot access another user’s record.' });
    }

    return res.json({ success: true, record });
  } catch (error) {
    console.error('Fetch Record Detail Error:', error);
    return res.status(500).json({ error: 'Database Error', message: 'Failed to fetch record detail.' });
  }
});

// DELETE /api/history/:id - Delete one record
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const user_uid = req.user.uid;

  try {
    if (isInitialized && db) {
      const docRef = db.collection('history').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Not Found', message: 'Record not found.' });
      }

      if (doc.data().user_uid !== user_uid) {
        return res.status(403).json({ error: 'Forbidden', message: 'Unauthorized to delete this record.' });
      }

      await docRef.delete();

      // Delete associated file metadata
      const fileQuery = await db.collection('files').where('history_id', '==', id).get();
      const batch = db.batch();
      fileQuery.docs.forEach(f => batch.delete(f.ref));
      await batch.commit();

      return res.json({ success: true, message: 'Record deleted successfully.' });
    } else {
      const record = memoryStore.history.get(id);
      if (!record) {
        return res.status(404).json({ error: 'Not Found', message: 'Record not found.' });
      }
      if (record.user_uid !== user_uid) {
        return res.status(403).json({ error: 'Forbidden', message: 'Unauthorized to delete this record.' });
      }

      memoryStore.history.delete(id);
      for (const [fileId, fileRec] of memoryStore.files.entries()) {
        if (fileRec.history_id === id) {
          memoryStore.files.delete(fileId);
        }
      }

      return res.json({ success: true, message: 'Record deleted successfully.' });
    }
  } catch (error) {
    console.error('Delete History Item Error:', error);
    return res.status(500).json({ error: 'Database Error', message: 'Could not delete history item.' });
  }
});

// DELETE /api/history - Delete the full history of the user
router.delete('/', verifyToken, async (req, res) => {
  const user_uid = req.user.uid;

  try {
    if (isInitialized && db) {
      const historyQuery = await db.collection('history').where('user_uid', '==', user_uid).get();
      const filesQuery = await db.collection('files').where('user_uid', '==', user_uid).get();

      const batch = db.batch();
      historyQuery.docs.forEach(doc => batch.delete(doc.ref));
      filesQuery.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      return res.json({ success: true, message: 'All history records deleted successfully.' });
    } else {
      let count = 0;
      for (const [id, rec] of memoryStore.history.entries()) {
        if (rec.user_uid === user_uid) {
          memoryStore.history.delete(id);
          count++;
        }
      }
      for (const [id, rec] of memoryStore.files.entries()) {
        if (rec.user_uid === user_uid) {
          memoryStore.files.delete(id);
        }
      }

      return res.json({ success: true, message: `Deleted ${count} history records.` });
    }
  } catch (error) {
    console.error('Delete All History Error:', error);
    return res.status(500).json({ error: 'Database Error', message: 'Could not clear history.' });
  }
});

export default router;
