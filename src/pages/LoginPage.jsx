import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useToastContext } from '../contexts/ToastContext';
import { sanitizeEmail, escapeHtml } from '../utils/sanitize';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();
  const { t, toggleLanguage, language } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    navigate('/notes');
  }

  const validateForm = () => {
    const newErrors = {};

    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail) {
      newErrors.email = 'Email tidak valid';
      showError('❌ Email tidak valid');
    }

    if (!password) {
      newErrors.password = 'Password harus diisi';
      showError('❌ Password harus diisi');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login({ email, password });

    if (result.success) {
      showSuccess(`🎉 Selamat datang kembali!`);
      setTimeout(() => navigate('/notes'), 500);
    } else {
      showError(result.error || '❌ Email atau password salah');
    }
  };

  if (loading) return <LoadingSpinner message={t.loading} />;

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

      <Card className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">📝</div>
          <h1>{t.login}</h1>
          <p>{language === 'id' ? 'Silakan masuk untuk melanjutkan' : 'Please login to continue'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label={t.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh@email.com"
            required
            icon="📧"
            error={errors.email}
          />
          <Input
            label={t.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            icon="🔒"
            error={errors.password}
          />

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? t.loading : t.login}
          </Button>
        </form>

        <p className="auth-footer">
          {t.noAccount} <Link to="/register">{t.register}</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;