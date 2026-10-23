import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Leaf, ShieldCheck, Heart } from 'lucide-react';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [analysisResult, setAnalysisResult] = useState(null);
  const { currentUser } = useAuth();

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
    setActivePage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main style={{ flex: 1 }}>
        {activePage === 'login' && (
          <LoginPage onLoginSuccess={() => setActivePage('home')} />
        )}

        {activePage === 'home' && (
          <HomePage onAnalysisComplete={handleAnalysisComplete} />
        )}

        {activePage === 'result' && (
          <ResultPage
            resultData={analysisResult}
            onReset={handleReset}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage onBackToHome={() => setActivePage('home')} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border-color)', padding: '24px 0', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Leaf size={16} color="var(--primary-green)" />
            <span><strong>E-Ayurvedic Health Assistant</strong> — Gemini Multimodal AI & Firebase</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="var(--primary-green)" />
              Privacy Protected (Uploaded files deleted after analysis)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
