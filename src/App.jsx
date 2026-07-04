// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import AddNotePage from './pages/AddNotePage';
import ArchivedNotesPage from './pages/ArchivedNotesPage';
import NotFoundPage from './pages/NotFoundPage';
import LatestNotesPage from './pages/LatestNotesPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                {/* Protected Routes - Notes */}
                <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
                <Route path="/notes/new" element={<ProtectedRoute><AddNotePage /></ProtectedRoute>} />
                <Route path="/notes/latest" element={<ProtectedRoute><LatestNotesPage /></ProtectedRoute>} />
                <Route path="/notes/archived" element={<ProtectedRoute><ArchivedNotesPage /></ProtectedRoute>} />
                <Route path="/notes/:id" element={<ProtectedRoute><NoteDetailPage /></ProtectedRoute>} />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/notes" replace />} />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;