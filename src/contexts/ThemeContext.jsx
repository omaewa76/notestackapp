import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { THEMES } from '../utils/constants';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => storage.getTheme());

  useEffect(() => {
    storage.saveTheme(theme);
    if (theme === THEMES.DARK) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};