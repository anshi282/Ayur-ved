import React from 'react';
import { AlertOctagon, PhoneCall, ArrowRight } from 'lucide-react';

export default function EmergencyAlert({ specialist }) {
  return (
    <div className="emergency-banner" id="emergency-alert-banner">
      <div className="emergency-icon">
        <AlertOctagon size={36} color="#ffffff" />
      </div>
      <div className="emergency-content">
        <h3>URGENT MEDICAL ATTENTION RECOMMENDED</h3>
        <p>
          The symptoms or indicators detected suggest a potential medical emergency.
          Ayurvedic home guidance is <strong>not suitable</strong> for acute critical distress.
        </p>
        <div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ background: '#7f1d1d', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            🚨 Action Required: Visit Nearest ER / Hospital Immediately
          </span>
          {specialist && (
            <span style={{ fontSize: '0.85rem', color: '#fecaca' }}>
              Suggested Triage: <strong>{specialist}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
