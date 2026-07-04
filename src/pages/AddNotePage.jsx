// src/pages/AddNotePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useToastContext } from '../contexts/ToastContext';
import { useNotes } from '../hooks/useNotes';
import { sanitizeInput } from '../utils/sanitize';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const AddNotePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();
  const { t, toggleLanguage, language } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();
  const { addNote, loading } = useNotes();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Proteksi redirect jika belum login
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    const sanitizedTitle = sanitizeInput(title).trim();
    
    if (!sanitizedTitle) {
      newErrors.title = 'Judul tidak boleh kosong';
      showError('❌ Judul tidak boleh kosong');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    const result = await addNote(title, body);
    setSubmitting(false);
    
    if (result.success) {
      showSuccess('✅ Catatan berhasil ditambahkan!');
      navigate('/notes');
    } else {
      showError(result.error || '❌ Gagal menambahkan catatan');
    }
  };

  if (loading) return <LoadingSpinner message={t.loading} />;

  return (
    <div className="addnote-container">
      {/* Header dengan navigasi */}
      <div className="addnote-header">
        <button className="back-btn" onClick={() => navigate('/notes')}>
          ← {language === 'id' ? 'Kembali ke Catatan' : 'Back to Notes'}
        </button>
        <div className="addnote-header-actions">
          <button className="theme-toggle-small" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="lang-toggle-small" onClick={toggleLanguage}>
            {language === 'id' ? 'EN' : 'ID'}
          </button>
        </div>
      </div>

      {/* Form Tambah Catatan */}
      <div className="addnote-content">
        <Card className="addnote-card">
          <div className="addnote-icon">✏️</div>
          <h1 className="addnote-title">
            {language === 'id' ? 'Tulis Catatan Baru' : 'Write New Note'}
          </h1>
          <p className="addnote-subtitle">
            {language === 'id' 
              ? 'Buat catatan baru dengan judul dan isi yang menarik' 
              : 'Create a new note with an interesting title and content'}
          </p>

          <form onSubmit={handleSubmit} className="addnote-form">
            <div className="form-group">
              <label className="form-label">
                {language === 'id' ? 'Judul' : 'Title'} 
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder={language === 'id' ? 'Masukkan judul catatan...' : 'Enter note title...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              {errors.title && <span className="input-error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                {language === 'id' ? 'Isi Catatan' : 'Content'}
              </label>
              <textarea
                className="form-textarea"
                placeholder={language === 'id' ? 'Tuliskan ide atau catatanmu di sini...' : 'Write your ideas or notes here...'}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
              />
            </div>

            <div className="addnote-actions">
              <button 
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/notes')}
              >
                {language === 'id' ? 'Batal' : 'Cancel'}
              </button>
              <button 
                type="submit"
                className="btn-submit"
                disabled={submitting}
              >
                {submitting 
                  ? (language === 'id' ? 'Menyimpan...' : 'Saving...') 
                  : (language === 'id' ? 'Simpan Catatan' : 'Save Note')}
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* Tips Card */}
      <div className="addnote-tips">
        <Card className="tips-card">
          <h3>💡 {language === 'id' ? 'Tips Menulis Catatan' : 'Writing Tips'}</h3>
          <ul>
            <li>📌 {language === 'id' ? 'Buat judul yang jelas dan mudah diingat' : 'Create a clear and memorable title'}</li>
            <li>✍️ {language === 'id' ? 'Tulis poin-poin penting terlebih dahulu' : 'Write important points first'}</li>
            <li>🎯 {language === 'id' ? 'Fokus pada satu topik per catatan' : 'Focus on one topic per note'}</li>
            <li>🔄 {language === 'id' ? 'Jangan lupa untuk mengarsipkan catatan yang sudah tidak aktif' : 'Archive notes that are no longer active'}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AddNotePage;