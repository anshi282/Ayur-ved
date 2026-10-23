import React, { useState } from 'react';
import { Sparkles, Shield, HeartPulse, CheckCircle2, Zap } from 'lucide-react';
import FormCard from '../components/FormCard';
import { analyzeHealthData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onAnalysisComplete }) {
  const { getToken, currentUser } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const token = await getToken();
      const response = await analyzeHealthData(formData, token);
      onAnalysisComplete(response);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={14} />
          Powered by Google Gemini 2.x Multimodal AI
        </div>
        <h1 className="hero-title">
          Ancient Ayurvedic Wisdom, <span>Instantly Analyzed</span>
        </h1>
        <p className="hero-subtitle">
          Describe your symptoms or upload your lab reports & photos. Receive instant Ayurvedic herb recommendations, dietary Ahara guidance, and routine Vihara adjustments.
        </p>

        {/* Value Props Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '22px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: 'var(--primary-deep)', fontWeight: 500 }}>
            <CheckCircle2 size={16} color="var(--primary-green)" />
            <span>Multimodal Lab Report & Photo Reader</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: 'var(--primary-deep)', fontWeight: 500 }}>
            <CheckCircle2 size={16} color="var(--primary-green)" />
            <span>Emergency Red Alert Safety Detection</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: 'var(--primary-deep)', fontWeight: 500 }}>
            <Shield size={16} color="var(--primary-green)" />
            <span>Zero Data Selling • Privacy First</span>
          </div>
        </div>
      </section>

      {/* Error alert if any */}
      {errorMessage && (
        <div style={{ maxWidth: '800px', margin: '0 auto 20px', background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', fontSize: '0.9rem' }}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* Main Form Section */}
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <FormCard onSubmit={handleFormSubmit} isAnalyzing={isAnalyzing} />
      </div>
    </div>
  );
}
