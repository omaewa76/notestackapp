import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useToastContext } from '../contexts/ToastContext';
import { sanitizeName, sanitizeEmail, isValidPassword, escapeHtml } from '../utils/sanitize';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();
  const { t, toggleLanguage, language } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const sanitizedName = sanitizeName(name);
    if (!sanitizedName) {
      newErrors.name = 'Nama tidak valid (minimal 2 karakter, maksimal 100)';
      showError('❌ Nama tidak valid');
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail) {
      newErrors.email = 'Email tidak valid';
      showError('❌ Email tidak valid');
    }

    if (!isValidPassword(password)) {
      newErrors.password = 'Password minimal 6 karakter';
      showError('❌ Password minimal 6 karakter');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      showError('❌ Password tidak cocok');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await register({ name, email, password });

    if (result.success) {
      showSuccess('✅ Registrasi berhasil! Silakan login.');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
      setTimeout(() => navigate('/login'), 2000);
    } else {
      showError(result.error || '❌ Registrasi gagal. Silakan coba lagi.');
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
          <div className="auth-icon">✨</div>
          <h1>{t.register}</h1>
          <p>{language === 'id' ? 'Buat akun baru untuk mulai mencatat' : 'Create a new account to start noting'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label={t.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={language === 'id' ? 'Nama lengkap' : 'Full name'}
            required
            icon="👤"
            error={errors.name}
          />
          <Input
            label={t.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@contoh.com"
            required
            icon="📧"
            error={errors.email}
          />
          <Input
            label={t.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={language === 'id' ? 'Minimal 6 karakter' : 'Minimum 6 characters'}
            required
            icon="🔒"
            error={errors.password}
          />
          <Input
            label={t.confirmPassword}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={language === 'id' ? 'Ketik ulang password' : 'Confirm password'}
            required
            icon="✓"
            error={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? t.loading : t.register}
          </Button>
        </form>

        <p className="auth-footer">
          {t.hasAccount} <Link to="/login">{t.login}</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;