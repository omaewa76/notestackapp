// src/pages/ArchivedNotesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useToastContext } from '../contexts/ToastContext';
import { useNotes } from '../hooks/useNotes';
import { escapeHtml } from '../utils/sanitize';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const ArchivedNotesPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const { theme, toggleTheme } = useThemeContext();
    const { t, toggleLanguage, language } = useLanguageContext();
    const { showSuccess, showError } = useToastContext();
    const { archivedNotes, loading, unarchiveNote, deleteNote } = useNotes();

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleUnarchive = async (id) => {
        const result = await unarchiveNote(id);
        if (result.success) {
            showSuccess('✅ Catatan dikeluarkan dari arsip!');
        } else {
            showError(result.error || '❌ Gagal mengeluarkan dari arsip');
        }
    };

    const handleDelete = async (id, noteTitle) => {
        if (window.confirm(`Hapus catatan "${escapeHtml(noteTitle)}"?`)) {
            const result = await deleteNote(id);
            if (result.success) {
                showSuccess('✅ Catatan berhasil dihapus!');
            } else {
                showError(result.error || '❌ Gagal menghapus catatan');
            }
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
                <h1>📦 {language === 'id' ? 'Catatan Terarsip' : 'Archived Notes'}</h1>
                <div className="header-actions">
                    <button className="theme-toggle-small" onClick={toggleTheme}>
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button className="lang-toggle-small" onClick={toggleLanguage}>
                        {language === 'id' ? 'EN' : 'ID'}
                    </button>
                    <button className="back-btn" onClick={() => navigate('/notes')}>
                        ← {language === 'id' ? 'Kembali ke Catatan' : 'Back to Notes'}
                    </button>
                </div>
            </div>

            {archivedNotes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p>{language === 'id' ? 'Belum ada catatan yang diarsipkan' : 'No archived notes yet'}</p>
                    <button className="btn-primary" onClick={() => navigate('/notes')}>
                        📝 {language === 'id' ? 'Lihat Catatan Aktif' : 'View Active Notes'}
                    </button>
                </div>
            ) : (
                <div className="notes-grid">
                    {archivedNotes.map(note => (
                        <Card key={note.id} className="note-card">
                            <h3 className="note-title">{escapeHtml(note.title)}</h3>
                            <p className="note-body">{escapeHtml(note.body?.substring(0, 100))}...</p>
                            <div className="note-footer">
                                <span className="note-date">📅 {formatDate(note.createdAt)}</span>
                                <div className="note-actions">
                                    <button
                                        className="archive-btn"
                                        onClick={() => navigate(`/notes/${note.id}`)}
                                    >
                                        👁️ {t.view}
                                    </button>
                                    <button
                                        className="archive-btn"
                                        onClick={() => handleUnarchive(note.id)}
                                    >
                                        📤 {t.unarchive}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(note.id, note.title)}
                                    >
                                        🗑️ {t.delete}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArchivedNotesPage;