// src/pages/LatestNotesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useToastContext } from '../contexts/ToastContext';
import { api } from '../services/api';
import { escapeHtml } from '../utils/sanitize';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const LatestNotesPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const { theme, toggleTheme } = useThemeContext();
    const { t, toggleLanguage, language } = useLanguageContext();
    const { showError } = useToastContext();

    const [latestNotes, setLatestNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Proteksi redirect jika belum login
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadLatestNotes();
    }, [isAuthenticated]);

    const loadLatestNotes = async () => {
        setLoading(true);
        const result = await api.getAllNotes();

        if (result.success) {
            // Urutkan berdasarkan createdAt terbaru di atas
            const sorted = [...result.notes].sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setLatestNotes(sorted);
        } else {
            setError(result.error || 'Gagal memuat catatan terbaru');
            showError(result.error || '❌ Gagal memuat catatan terbaru');
        }
        setLoading(false);
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

    // Helper untuk mendapatkan status kurang dari 24 jam
    const isNewNote = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffHours = (now - created) / (1000 * 60 * 60);
        return diffHours < 24;
    };

    if (loading) return <LoadingSpinner message={t.loading} />;

    if (error) {
        return (
            <div className="app-container">
                <div className="error-message">{error}</div>
                <button className="btn-primary" onClick={() => navigate('/notes')}>
                    ← {language === 'id' ? 'Kembali ke Catatan' : 'Back to Notes'}
                </button>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="header">
                <h1>🔥 {language === 'id' ? 'Catatan Terbaru' : 'Latest Notes'}</h1>
                <div className="header-actions">
                    <button className="theme-toggle-small" onClick={toggleTheme}>
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button className="lang-toggle-small" onClick={toggleLanguage}>
                        {language === 'id' ? 'EN' : 'ID'}
                    </button>
                    <button className="back-btn" onClick={() => navigate('/notes')}>
                        ← {language === 'id' ? 'Kembali' : 'Back'}
                    </button>
                </div>
            </div>

            <div className="latest-info">
                <p>
                    {language === 'id'
                        ? `✨ Menampilkan ${latestNotes.length} catatan terbaru (diurutkan dari yang terbaru)`
                        : `✨ Showing ${latestNotes.length} latest notes (sorted by newest first)`}
                </p>
            </div>

            {latestNotes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p>{language === 'id' ? 'Belum ada catatan' : 'No notes yet'}</p>
                    <button className="btn-primary" onClick={() => navigate('/notes/new')}>
                        + {language === 'id' ? 'Buat Catatan Pertama' : 'Create First Note'}
                    </button>
                </div>
            ) : (
                <div className="latest-notes-grid">
                    {latestNotes.map((note, index) => (
                        <Card
                            key={note.id}
                            className="latest-note-card"
                            onClick={() => navigate(`/notes/${note.id}`)}
                        >
                            <div className="latest-note-number">#{index + 1}</div>
                            {isNewNote(note.createdAt) && (
                                <span className="new-badge">✨ {language === 'id' ? 'Baru' : 'New'}</span>
                            )}
                            <h3 className="latest-note-title">{escapeHtml(note.title)}</h3>
                            <p className="latest-note-body">
                                {escapeHtml(note.body?.substring(0, 120))}...
                            </p>
                            <div className="latest-note-footer">
                                <span className="latest-note-date">
                                    📅 {formatDate(note.createdAt)}
                                </span>
                                <div className="latest-note-status">
                                    {note.archived && (
                                        <span className="archived-tag">📦 {t.archived}</span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestNotesPage;