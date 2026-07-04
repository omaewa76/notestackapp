// src/pages/NotFoundPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useThemeContext();
    const { t, toggleLanguage, language } = useLanguageContext();

    return (
        <div className="page-container">
            <div className="theme-toggle-wrapper">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button>
                <button className="lang-toggle" onClick={toggleLanguage}>
                    {language === 'id' ? '🇬🇧 English' : '🇮🇩 Indonesia'}
                </button>
            </div>

            <div className="not-found-container">
                <div className="not-found-icon">🔍</div>
                <h1 className="not-found-title">404</h1>
                <p className="not-found-message">
                    {language === 'id'
                        ? 'Halaman yang Anda cari tidak ditemukan'
                        : 'The page you are looking for does not exist'}
                </p>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/notes')}
                    style={{ marginTop: 24, padding: '12px 24px' }}
                >
                    🏠 {language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;