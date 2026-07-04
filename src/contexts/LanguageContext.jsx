import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { LANGUAGES } from '../utils/constants';

const LanguageContext = createContext();

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguageContext must be used within LanguageProvider');
  return context;
};

const translations = {
  [LANGUAGES.ID]: {
    appName: 'NoteStack', loading: 'Memuat...', login: 'Masuk', register: 'Daftar', logout: 'Keluar',
    email: 'Email', password: 'Password', name: 'Nama', confirmPassword: 'Konfirmasi Password',
    noAccount: 'Belum punya akun?', hasAccount: 'Sudah punya akun?', addNote: 'Tambah Catatan',
    notes: 'Catatan Aktif', archived: 'Arsip', noNotes: 'Belum ada catatan. Buat catatan pertama yuk!',
    noArchived: 'Belum ada catatan yang diarsipkan', deleteConfirm: 'Apakah Anda yakin ingin menghapus catatan ini?',
    view: 'Lihat', delete: 'Hapus', archive: 'Arsipkan', unarchive: 'Keluarkan', save: 'Simpan',
    cancel: 'Batal', titlePlaceholder: 'Judul catatan...', contentPlaceholder: 'Isi catatan...',
    back: 'Kembali', loginSuccess: 'Selamat datang kembali!', loginError: 'Email atau password salah',
    registerSuccess: 'Registrasi berhasil! Silakan login.', registerError: 'Registrasi gagal',
  },
  [LANGUAGES.EN]: {
    appName: 'NoteStack', loading: 'Loading...', login: 'Login', register: 'Register', logout: 'Logout',
    email: 'Email', password: 'Password', name: 'Name', confirmPassword: 'Confirm Password',
    noAccount: "Don't have an account?", hasAccount: 'Already have an account?', addNote: 'Add Note',
    notes: 'Active Notes', archived: 'Archived', noNotes: 'No notes yet. Create your first note!',
    noArchived: 'No archived notes', deleteConfirm: 'Are you sure you want to delete this note?',
    view: 'View', delete: 'Delete', archive: 'Archive', unarchive: 'Unarchive', save: 'Save',
    cancel: 'Cancel', titlePlaceholder: 'Note title...', contentPlaceholder: 'Note content...',
    back: 'Back', loginSuccess: 'Welcome back!', loginError: 'Invalid email or password',
    registerSuccess: 'Registration successful! Please login.', registerError: 'Registration failed',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => storage.getLanguage());

  useEffect(() => { storage.saveLanguage(language); }, [language]);

  const toggleLanguage = () => setLanguage(prev => prev === LANGUAGES.ID ? LANGUAGES.EN : LANGUAGES.ID);

  const t = translations[language];

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>;
};