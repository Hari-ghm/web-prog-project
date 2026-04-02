import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/backendApi';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, updateUserPreferences } = useAuth();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (user?.preferences?.theme) {
      setTheme(user.preferences.theme);
    }
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system' || theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(
    async (newTheme) => {
      setTheme(newTheme);
      if (!user) return;

      try {
        await api.savePreferences({ theme: newTheme });
        updateUserPreferences({ theme: newTheme });
      } catch {
        // Non-blocking save.
      }
    },
    [user, updateUserPreferences]
  );

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
