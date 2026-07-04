export const STORAGE_KEYS = {
  TOKEN: 'notestack_token',
  USER: 'notestack_user',
  THEME: 'notestack_theme',
  LANGUAGE: 'notestack_language',
};

export const API_BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'https://notes-api.dicoding.dev/v1');

export const getApiUrl = (endpoint) => {
  const base = import.meta.env.PROD ? '' : API_BASE_URL;
  return `${base}/${endpoint}`;
}

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const LANGUAGES = {
  ID: 'id',
  EN: 'en',
};