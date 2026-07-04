import { STORAGE_KEYS, THEMES, LANGUAGES } from './constants';

class StorageManager {
  // Token Management
  saveToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      return true;
    }
    return false;
  }

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  // User Management
  saveUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  }

  getUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Theme Management
  saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  getTheme() {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme || THEMES.LIGHT;
  }

  // Language Management
  saveLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  getLanguage() {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return lang || LANGUAGES.ID;
  }

  // Auth Check
  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    this.removeToken();
    this.removeUser();
  }
}

export const storage = new StorageManager();