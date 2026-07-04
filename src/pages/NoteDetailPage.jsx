import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useToastContext } from '../contexts/ToastContext';
import { api } from '../services/api';
import { sanitizeHtml, escapeHtml } from '../utils/sanitize';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();
  const { t, toggleLanguage, language } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadNote();
  }, [id, isAuthenticated]);

  const loadNote = async () => {
    setLoading(true);
    const result = await api.getNote(id);
    if (result.success) {
      const sanitizedNote = {
        ...result.note,
        title: escapeHtml(result.note.title),
        body: sanitizeHtml(result.note.body),
      };
      setNote(sanitizedNote);
    } else {
      setError(result.error || 'Catatan tidak ditemukan');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm(t.deleteConfirm)) {
      const result = await api.deleteNote(id);
      if (result.success) {
        showSuccess('✅ Catatan berhasil dihapus!');
        navigate('/notes');
      } else {
        showError(result.error || '❌ Gagal menghapus catatan');
      }
    }
  };

  const handleArchive = async () => {
    const result = await api.archiveNote(id);
    if (result.success) {
      showSuccess('✅ Catatan diarsipkan!');
      navigate('/notes');
    } else {
      showError(result.error || '❌ Gagal mengarsipkan');
    }
  };

  const handleUnarchive = async () => {
    const result = await api.unarchiveNote(id);
    if (result.success) {
      showSuccess('✅ Catatan dikeluarkan dari arsip!');
      navigate('/notes');
    } else {
      showError(result.error || '❌ Gagal mengeluarkan dari arsip');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <LoadingSpinner message={t.loading} />;

  if (error) {
    return (
      <div className="app-container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="error-message">{error}</div>
        <Button variant="primary" onClick={() => navigate('/notes')} style={{ marginTop: 16 }}>
          ← {t.back}
        </Button>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="app-container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="error-message">Catatan tidak ditemukan</div>
        <Button variant="primary" onClick={() => navigate('/notes')} style={{ marginTop: 16 }}>
          ← {t.back}
        </Button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/notes')}>← {t.back}</button>
        <div className="detail-actions">
          <button className="theme-toggle-small" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="lang-toggle-small" onClick={toggleLanguage}>
            {language === 'id' ? 'EN' : 'ID'}
          </button>
        </div>
      </div>

      <Card className="detail-card">
        <h1 className="detail-title" dangerouslySetInnerHTML={{ __html: note.title }} />
        <div className="detail-date">
          📅 {formatDate(note.createdAt)}
          {note.archived && <span className="archived-badge">📦 {t.archived}</span>}
        </div>
        <div className="detail-body" dangerouslySetInnerHTML={{ __html: note.body }} />
        <div className="detail-buttons">
          {note.archived ? (
            <button className="unarchive-btn" onClick={handleUnarchive}>
              📤 {t.unarchive}
            </button>
          ) : (
            <button className="archive-btn" onClick={handleArchive}>
              📦 {t.archive}
            </button>
          )}
          <button className="delete-note-btn" onClick={handleDelete}>
            🗑️ {t.delete}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default NoteDetailPage;