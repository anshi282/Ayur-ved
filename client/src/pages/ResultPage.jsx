import React from 'react';
import ResultCard from '../components/ResultCard';

export default function ResultPage({ resultData, onReset }) {
  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <ResultCard data={resultData} onReset={onReset} />
    </div>
  );
}
