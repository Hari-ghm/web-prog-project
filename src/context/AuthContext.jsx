import React, { createContext, useContext, useState, useCallback } from 'react';
import { api, setAuthToken } from '../services/backendApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    setAuthToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore network/auth errors on logout
    }
    setAuthToken(null);
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    if (!user) return null;
    const response = await api.me();
    setUser(response.user);
    return response.user;
  }, [user]);

  const updateUserPreferences = useCallback((preferences) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        preferences: {
          ...(prev.preferences || {}),
          ...preferences
        }
      };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading: false, refreshUser, updateUserPreferences }}>
      {children}
    </AuthContext.Provider>
  );
};
