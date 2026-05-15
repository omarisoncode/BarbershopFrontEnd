/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';
import api, { setAccessToken } from '../utils/api';

export const AuthContext = createContext();
const AUTH_USER_STORAGE_KEY = 'auth-user';

const normalizeAuthUser = (nextUser) => {
  if (!nextUser) {
    return null;
  }

  return {
    ...nextUser,
    _id: nextUser._id || nextUser.id || '',
    id: nextUser.id || nextUser._id || '',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const cached = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
      return cached ? normalizeAuthUser(JSON.parse(cached)) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const persistUser = (nextUser) => {
    const normalizedUser = normalizeAuthUser(nextUser);
    setUser(normalizedUser);

    if (typeof window === 'undefined') {
      return;
    }

    if (normalizedUser) {
      window.localStorage.setItem(
        AUTH_USER_STORAGE_KEY,
        JSON.stringify(normalizedUser),
      );
    } else {
      window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  };

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await api.post('/auth/refresh');
        setAccessToken(res.data.accessToken);
        persistUser(res.data.user);
      } catch (error) {
        setAccessToken(null);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          persistUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    refreshUser();
  }, []);

  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    setAccessToken(res.data.accessToken);
    persistUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    setAccessToken(res.data.accessToken);
    persistUser(res.data.user);
    return res.data.user;
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    persistUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      persistUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
