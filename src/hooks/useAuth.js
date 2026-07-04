import { useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser } from '../utils/network-data';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('notestack_token');
    const savedUser = localStorage.getItem('notestack_user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    setLoading(true);

    const result = await registerUser(userData);
    setLoading(false);

    if (!result.error) {
      return { success: true };
    }

    setError(result.message);
    return { success: false, error: result.message };
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    setLoading(true);

    const result = await loginUser(credentials);
    setLoading(false);

    if (!result.error) {
      const user = localStorage.getItem('notestack_user');
      setUser(user ? JSON.parse(user) : { email: credentials.email });
      return { success: true };
    }

    setError(result.message);
    return { success: false, error: result.message };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('notestack_token');
    localStorage.removeItem('notestack_user');
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };
};