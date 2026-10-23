import React from 'react';
import { Calendar, AlertCircle, FileText, Trash2, Eye, ChevronRight } from 'lucide-react';

export default function HistoryItem({ item, onView, onDelete }) {
  const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="history-card" id={`history-item-${item.id}`}>
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>

          {item.emergency && (
            <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={12} />
              Emergency Flagged
            </span>
          )}

          {item.has_file && (
            <span style={{ background: '#f3f4f6', color: '#4b5563', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileText size={12} />
              Attached Document
            </span>
          )}
        </div>

        <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-deep)', marginBottom: '6px' }}>
          {item.symptoms.length > 120 ? `${item.symptoms.substring(0, 120)}...` : item.symptoms}
        </h4>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {item.gemini_result?.conditions?.map((c, i) => (
            <span key={i} style={{ fontSize: '0.78rem', background: '#eef6f1', color: 'var(--primary-green)', padding: '2px 8px', borderRadius: '12px' }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className="nav-btn"
          style={{ background: 'var(--primary-light)', color: 'var(--primary-green)', padding: '8px 14px' }}
          onClick={() => onView(item)}
        >
          <Eye size={16} />
          <span>View</span>
        </button>
        <button
          className="btn-logout"
          title="Delete this record"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
