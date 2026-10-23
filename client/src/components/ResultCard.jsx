import React from 'react';
import { 
  Heart, 
  Activity, 
  Leaf, 
  Apple, 
  Moon, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle, 
  FileSpreadsheet,
  Printer,
  RotateCcw
} from 'lucide-react';
import EmergencyAlert from './EmergencyAlert';

export default function ResultCard({ data, onReset }) {
  if (!data) return null;

  const result = data.gemini_result || data;
  const isEmergency = Boolean(data.emergency || result.emergency);

  return (
    <div id="ayurvedic-result-container" style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* 1. Emergency Alert (shown first if flagged) */}
      {isEmergency && <EmergencyAlert specialist={result.specialist} />}

      {/* Top Header Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Ayurvedic Analysis & Guidance</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Personalized holistic lifestyle recommendations powered by Gemini Multimodal AI
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="nav-btn" 
            onClick={() => window.print()}
            style={{ background: '#ffffff', border: '1px solid var(--border-color)' }}
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>
          <button 
            className="nav-btn" 
            onClick={onReset}
            style={{ background: 'var(--primary-light)', color: 'var(--primary-green)' }}
          >
            <RotateCcw size={16} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* 2. Two-column Grid of Cards */}
      <div className="results-grid">
        {/* Card A: Possible Conditions / Dosha Imbalance */}
        <div className="result-card-box" id="result-conditions-card">
          <div className="result-card-header">
            <Activity size={20} color="var(--primary-green)" />
            <h3>Possible Conditions & Dosha Balance</h3>
          </div>
          <div>
            {result.conditions && result.conditions.length > 0 ? (
              result.conditions.map((cond, idx) => (
                <span key={idx} className="badge-tag">
                  {cond}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>General wellness profile within balance.</p>
            )}
          </div>
        </div>

        {/* Card B: Suggested Medical Specialist */}
        <div className="result-card-box" id="result-specialist-card">
          <div className="result-card-header">
            <Stethoscope size={20} color="var(--accent-amber)" />
            <h3>Recommended Medical Specialist</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--accent-gold-bg)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-amber)' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#92400e' }}>
                {result.specialist || 'General Physician / Ayurvedic Vaidya'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#b45309' }}>
                Consult a certified practitioner for diagnostic confirmation.
              </div>
            </div>
          </div>
        </div>

        {/* Card C: Abnormal Lab Values (if extracted) */}
        {result.abnormal_values && result.abnormal_values.length > 0 && (
          <div className="result-card-box" style={{ gridColumn: 'span 2' }} id="result-lab-values-card">
            <div className="result-card-header">
              <FileSpreadsheet size={20} color="#b91c1c" />
              <h3>Report Insights & Abnormal Parameters</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {result.abnormal_values.map((item, idx) => (
                <div key={idx} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#991b1b', marginBottom: '4px' }}>
                    <span>{item.test}</span>
                    <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {item.value}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#7f1d1d' }}>
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card D: Recommended Ayurvedic Herbs */}
        <div className="result-card-box" id="result-herbs-card">
          <div className="result-card-header">
            <Leaf size={20} color="var(--primary-green)" />
            <h3>Herbs & Ayurvedic Formulations</h3>
          </div>
          <div>
            {result.herbs && result.herbs.length > 0 ? (
              result.herbs.map((herb, idx) => (
                <div key={idx} className="herb-item">
                  <div className="herb-name">{herb.name}</div>
                  <div className="herb-benefit">{herb.benefit}</div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No specific herb formulation indicated.</p>
            )}
          </div>
        </div>

        {/* Card E: Fruits & Diet (Ahara) */}
        <div className="result-card-box" id="result-diet-card">
          <div className="result-card-header">
            <Apple size={20} color="var(--accent-amber)" />
            <h3>Nutritive Diet & Fruits (Ahara)</h3>
          </div>
          <ul className="bullet-list">
            {result.fruits_diet && result.fruits_diet.map((diet, idx) => (
              <li key={idx}>{diet}</li>
            ))}
          </ul>
        </div>

        {/* Card F: Lifestyle & Daily Habits (Dinacharya) */}
        <div className="result-card-box" style={{ gridColumn: 'span 2' }} id="result-lifestyle-card">
          <div className="result-card-header">
            <Moon size={20} color="var(--primary-deep)" />
            <h3>Lifestyle & Daily Routine (Vihara & Dinacharya)</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {result.lifestyle && result.lifestyle.map((life, idx) => (
              <div key={idx} style={{ background: '#faf9f6', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ede8de', display: 'flex', gap: '10px' }}>
                <CheckCircle size={18} color="var(--primary-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{life}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Mandatory Medical Disclaimer */}
      <div className="disclaimer-card" id="mandatory-disclaimer-box">
        <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0 }} />
        <div className="disclaimer-text">
          <strong>Medical Disclaimer:</strong> {result.disclaimer || "This application provides general Ayurvedic lifestyle and wellness guidance powered by artificial intelligence. It does not constitute professional medical advice, clinical diagnosis, or treatment. Always seek the advice of a qualified healthcare professional with any questions regarding medical conditions."}
        </div>
      </div>
    </div>
  );
}
