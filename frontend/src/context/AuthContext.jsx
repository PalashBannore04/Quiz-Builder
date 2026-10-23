import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('qb_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('qb_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('qb_token');
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          const userData = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
          };
          setUser(userData);
          localStorage.setItem('qb_user', JSON.stringify(userData));
        } catch (err) {
          console.warn('Session expired or invalid token', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: jwtToken, id, name, role } = res.data;
    const userData = { id, name, email, role };

    localStorage.setItem('qb_token', jwtToken);
    localStorage.setItem('qb_user', JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const { token: jwtToken, id, role } = res.data;
    const userData = { id, name, email, role };

    localStorage.setItem('qb_token', jwtToken);
    localStorage.setItem('qb_user', JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('qb_token');
    localStorage.removeItem('qb_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
