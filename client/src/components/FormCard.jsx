import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, Sparkles, AlertCircle, Clock, Calendar, User } from 'lucide-react';

export default function FormCard({ onSubmit, isAnalyzing }) {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female');
  const [duration, setDuration] = useState('3-5 days');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processSelectedFile(selected);
    }
  };

  const processSelectedFile = (selected) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(selected.type)) {
      alert('Only JPG, PNG images and PDF documents are allowed.');
      return;
    }
    if (selected.size > 20 * 1024 * 1024) {
      alert('File size exceeds the 20MB limit.');
      return;
    }
    setFile(selected);
    if (selected.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symptoms.trim() && !file) {
      alert('Please describe your symptoms or upload a medical document / photo.');
      return;
    }

    const formData = new FormData();
    formData.append('symptoms', symptoms);
    if (age) formData.append('age', age);
    if (gender) formData.append('gender', gender);
    if (duration) formData.append('duration', duration);
    if (file) formData.append('file', file);

    onSubmit(formData);
  };

  return (
    <div className="card" id="symptoms-form-card">
      <form onSubmit={handleSubmit}>
        {/* Symptoms Free Text */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="input-symptoms">
            <Sparkles size={16} color="var(--primary-green)" />
            Describe Your Symptoms or Health Concerns
          </label>
          <textarea
            id="input-symptoms"
            className="form-control"
            placeholder="e.g. Experiencing mild throat irritation, dry cough for 3 days, low energy after meals, feeling heavy in mornings..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>

        {/* Demographics Grid: Age, Gender, Duration */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="input-age">
              <User size={15} />
              Age
            </label>
            <input
              id="input-age"
              type="number"
              min="1"
              max="120"
              className="form-control"
              placeholder="e.g. 28"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="select-gender">
              <User size={15} />
              Gender
            </label>
            <select
              id="select-gender"
              className="form-control"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="input-duration">
              <Clock size={15} />
              Duration
            </label>
            <select
              id="input-duration"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1-2 days">1 - 2 Days (Sudden)</option>
              <option value="3-5 days">3 - 5 Days</option>
              <option value="1-2 weeks">1 - 2 Weeks</option>
              <option value="Over a month">Over a month (Chronic)</option>
            </select>
          </div>
        </div>

        {/* File Upload Zone */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label>
            <FileText size={16} color="var(--primary-green)" />
            Upload Medical Report or Photo (Optional)
          </label>

          <div
            id="file-dropzone"
            className={`upload-zone ${dragActive ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div className="upload-icon">
              <UploadCloud size={28} />
            </div>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
              Drag & drop medical report or skin photo here, or browse
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Supports JPG, PNG, and PDF files up to 20MB.
            </p>
            <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
              <AlertCircle size={14} />
              Tip: Upload a clear, well-lit photo or legible document for best AI reading.
            </div>
          </div>

          {/* Selected File Preview Box */}
          {file && (
            <div className="file-preview-card" id="selected-file-preview">
              <div className="file-info">
                {previewUrl ? (
                  <img src={previewUrl} alt="Upload preview" className="file-thumb" />
                ) : (
                  <div style={{ background: '#f3f4f6', padding: '10px', borderRadius: '6px' }}>
                    <FileText size={24} color="#dc2626" />
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {(file.size / 1024).toFixed(1)} KB • {file.type.toUpperCase()}
                  </div>
                </div>
              </div>
              <button
                type="button"
                id="btn-remove-file"
                className="file-remove-btn"
                onClick={removeFile}
                title="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-submit-analysis"
          className="btn-primary"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span className="spinner">⏳</span>
              Analyzing with Gemini Multimodal AI...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Get Ayurvedic Wellness Guidance
            </>
          )}
        </button>
      </form>
    </div>
  );
}
