import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchSession = async () => {
    try {
      if (!api.getToken()) {
        setLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.warn('Session restoration failed:', err.message);
      api.setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        api.setToken(res.data.accessToken);
        setUser(res.data.user);
        await fetchSession();
        return true;
      }
      return false;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const res = await api.register(userData);
      if (res.success && res.data) {
        api.setToken(res.data.accessToken);
        setUser(res.data.user);
        await fetchSession();
        return true;
      }
      return false;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    } finally {
      api.setToken(null);
      localStorage.removeItem('referhire_cached_user');
      setUser(null);
      setProfile(null);
    }
  };

  // Instant demo role switcher
  const quickDemoLogin = async (roleName) => {
    const demoCredentials = {
      CANDIDATE: { email: 'candidate@referhire.com', password: 'password123' },
      REFERRER: { email: 'referrer@google.com', password: 'password123' },
      RECRUITER: { email: 'recruiter@techcorp.com', password: 'password123' },
      ADMIN: { email: 'admin@referhire.com', password: 'password123' }
    };

    const target = demoCredentials[roleName];
    if (target) {
      return await login(target.email, target.password);
    }
  };

  const refreshProfile = async () => {
    if (user?.role === 'CANDIDATE') {
      const res = await api.getCandidateProfile();
      if (res.success) setProfile(res.data);
    } else if (user?.role === 'REFERRER') {
      const res = await api.getReferrerProfile();
      if (res.success) setProfile(res.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshProfile,
        isAuthenticated: !!user,
        role: user?.role || null
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
