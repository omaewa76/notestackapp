// src/pages/NotesPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useToastContext } from '../contexts/ToastContext';
import { useNotes } from '../hooks/useNotes';
import { sanitizeInput, escapeHtml } from '../utils/sanitize';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';

const NotesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();
  const { t, toggleLanguage, language } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();
  const { notes, archivedNotes, loading, addNote, deleteNote, archiveNote, unarchiveNote } = useNotes();

  const [showArchived, setShowArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State untuk pencarian dengan initial value dari URL
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('q') || '';
  });

  // Filter notes berdasarkan pencarian
  const filteredNotes = notes.filter(note =>
    searchQuery === '' ||
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArchivedNotes = archivedNotes.filter(note =>
    searchQuery === '' ||
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedNotes = showArchived ? filteredArchivedNotes : filteredNotes;

  // Handle pencarian - update URL search params
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const handleAddNote = async () => {
    const sanitizedTitle = sanitizeInput(title).trim();
    const sanitizedBody = sanitizeInput(body).trim();

    if (!sanitizedTitle) {
      showError('❌ Judul tidak boleh kosong');
      return;
    }

    setSubmitting(true);
    const result = await addNote(sanitizedTitle, sanitizedBody);
    setSubmitting(false);

    if (result.success) {
      setShowModal(false);
      setTitle('');
      setBody('');
      showSuccess('✅ Catatan berhasil ditambahkan!');
    } else {
      showError(result.error || '❌ Gagal menambahkan catatan');
    }
  };

  const handleDelete = async (id, noteTitle, e) => {
    e.stopPropagation();
    if (window.confirm(`Hapus catatan "${escapeHtml(noteTitle)}"?`)) {
      const result = await deleteNote(id);
      if (result.success) {
        showSuccess('✅ Catatan berhasil dihapus!');
      } else {
        showError(result.error || '❌ Gagal menghapus catatan');
      }
    }
  };

  const handleArchive = async (id, e) => {
    e.stopPropagation();
    const result = await archiveNote(id);
    if (result.success) {
      showSuccess('✅ Catatan diarsipkan!');
    } else {
      showError(result.error || '❌ Gagal mengarsipkan');
    }
  };

  const handleUnarchive = async (id, e) => {
    e.stopPropagation();
    const result = await unarchiveNote(id);
    if (result.success) {
      showSuccess('✅ Catatan dikeluarkan dari arsip!');
    } else {
      showError(result.error || '❌ Gagal mengeluarkan dari arsip');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) return <LoadingSpinner message={t.loading} />;

  return (
    <div className="app-container">
      <div className="header">
        <h1>📝 {t.appName}</h1>
        <div className="header-actions">
          <button className="theme-toggle-small" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="lang-toggle-small" onClick={toggleLanguage}>
            {language === 'id' ? 'EN' : 'ID'}
          </button>
          <button className="archive-toggle" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? `📝 ${t.notes}` : `📦 ${t.archived}`}
          </button>
          <span className="user-email">👤 {user?.name || user?.email || 'User'}</span>
          <button className="logout-btn" onClick={logout}>{t.logout}</button>
        </div>
      </div>

      {/* Controlled Component dengan Shareable URL */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder={language === 'id' ? '🔍 Cari catatan...' : '🔍 Search notes...'}
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchQuery && (
          <span className="search-count">
            {displayedNotes.length} {language === 'id' ? 'ditemukan' : 'found'}
          </span>
        )}
      </div>

      {/* Navigasi ke halaman terpisah */}
      <button className="add-note-btn" onClick={() => navigate('/notes/new')}>
        + {t.addNote}
      </button>

      <div className="notes-count">
        {showArchived
          ? `📦 ${displayedNotes.length} ${t.archived.toLowerCase()}`
          : `📝 ${displayedNotes.length} ${t.notes.toLowerCase()}`}
      </div>

      {displayedNotes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>{showArchived ? t.noArchived : t.noNotes}</p>
          {!showArchived && (
            <button className="btn-primary" onClick={() => navigate('/notes/new')}>
              + {t.addNote}
            </button>
          )}
          {showArchived && (
            <button className="btn-primary" onClick={() => setShowArchived(false)}>
              📝 {t.notes}
            </button>
          )}
        </div>
      ) : (
        <div className="notes-grid">
          {displayedNotes.map(note => (
            <Card key={note.id} className="note-card" onClick={() => navigate(`/notes/${note.id}`)}>
              <h3 className="note-title">{escapeHtml(note.title)}</h3>
              <p className="note-body">{escapeHtml(note.body?.substring(0, 100))}...</p>
              <div className="note-footer">
                <span className="note-date">📅 {formatDate(note.createdAt)}</span>
                <div className="note-actions">
                  <button
                    className="btn-view"
                    onClick={(e) => { e.stopPropagation(); navigate(`/notes/${note.id}`); }}
                  >
                    👁️ {t.view}
                  </button>
                  {showArchived ? (
                    <button
                      className="archive-btn"
                      onClick={(e) => handleUnarchive(note.id, e)}
                    >
                      📤 {t.unarchive}
                    </button>
                  ) : (
                    <button
                      className="archive-btn"
                      onClick={(e) => handleArchive(note.id, e)}
                    >
                      📦 {t.archive}
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(note.id, note.title, e)}
                  >
                    🗑️ {t.delete}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <button className="btn-secondary" onClick={() => navigate('/notes/latest')}>
        🔥 {language === 'id' ? 'Terbaru' : 'Latest'}
      </button>

      {/* Navigasi ke halaman tambah catatan */}
      <button className="fab" onClick={() => navigate('/notes/new')}>+</button>

    </div>
  );
};

export default NotesPage;