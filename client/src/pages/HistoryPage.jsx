import React, { useState, useEffect } from 'react';
import { History, Trash2, ArrowLeft, RefreshCw, X, AlertCircle } from 'lucide-react';
import HistoryItem from '../components/HistoryItem';
import ResultCard from '../components/ResultCard';
import { getHealthHistory, deleteHistoryItem, clearAllHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage({ onBackToHome }) {
  const { getToken } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const records = await getHealthHistory(token);
      setHistoryList(records);
    } catch (err) {
      console.error('Fetch history error:', err);
      setError(err.message || 'Could not load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis record?')) {
      return;
    }
    try {
      const token = await getToken();
      await deleteHistoryItem(id, token);
      setHistoryList(prev => prev.filter(item => item.id !== id));
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete record.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete your entire consultation history? This action cannot be undone.')) {
      return;
    }
    try {
      const token = await getToken();
      await clearAllHistory(token);
      setHistoryList([]);
      setSelectedRecord(null);
    } catch (err) {
      alert(err.message || 'Failed to clear history.');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '880px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <button
            className="nav-btn"
            style={{ padding: '0 0 10px', background: 'transparent', color: 'var(--text-muted)' }}
            onClick={onBackToHome}
          >
            <ArrowLeft size={16} />
            <span>Back to Consultation</span>
          </button>
          <h2 style={{ fontSize: '1.9rem', marginBottom: '4px' }}>My Health History</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Private record of all your past Ayurvedic wellness assessments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="nav-btn"
            style={{ background: '#ffffff', border: '1px solid var(--border-color)' }}
            onClick={fetchHistory}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          {historyList.length > 0 && (
            <button
              className="nav-btn"
              style={{ background: '#fee2e2', color: '#dc2626' }}
              onClick={handleClearAll}
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🌿</div>
          <p>Loading your past analyses...</p>
        </div>
      ) : historyList.length === 0 ? (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <History size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Saved Analyses Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.92rem' }}>
            Your completed symptom assessments and lab report readings will automatically be archived here.
          </p>
          <button className="btn-primary" style={{ maxWidth: '240px', margin: '0 auto' }} onClick={onBackToHome}>
            Start New Consultation
          </button>
        </div>
      ) : (
        /* History Items List */
        <div>
          {historyList.map(item => (
            <HistoryItem
              key={item.id}
              item={item}
              onView={(rec) => setSelectedRecord(rec)}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal-body" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedRecord(null)}>
              <X size={20} />
            </button>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', background: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                Recorded on {new Date(selectedRecord.created_at).toLocaleString()}
              </span>
            </div>
            <ResultCard data={selectedRecord} onReset={() => setSelectedRecord(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
