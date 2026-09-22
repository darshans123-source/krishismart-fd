import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor';
  status: 'Active' | 'Inactive';
  lastLogin?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  hasRole: (requiredRole: 'Super Admin' | 'Admin' | 'Editor') => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('krishi_admin_token'));
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const savedToken = localStorage.getItem('krishi_admin_token');
    if (!savedToken) {
      setAdmin(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const res = await adminApi.auth.getMe();
      if (res.success && res.data) {
        setAdmin(res.data);
        setToken(savedToken);
      } else {
        localStorage.removeItem('krishi_admin_token');
        setAdmin(null);
        setToken(null);
      }
    } catch (err) {
      localStorage.removeItem('krishi_admin_token');
      setAdmin(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async ({ email, password, rememberMe = true }: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      const res = await adminApi.auth.login({ email, password });
      if (res.success && res.data) {
        setAdmin(res.data.admin);
        setToken(res.data.token);
        if (rememberMe) {
          localStorage.setItem('krishi_admin_token', res.data.token);
        } else {
          sessionStorage.setItem('krishi_admin_token', res.data.token);
          localStorage.setItem('krishi_admin_token', res.data.token);
        }
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('krishi_admin_token');
    sessionStorage.removeItem('krishi_admin_token');
    setAdmin(null);
    setToken(null);
    window.location.pathname = '/admin/login';
  };

  const hasRole = (requiredRole: 'Super Admin' | 'Admin' | 'Editor') => {
    if (!admin) return false;
    if (admin.role === 'Super Admin') return true;
    if (admin.role === 'Admin') return requiredRole !== 'Super Admin';
    return requiredRole === 'Editor';
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin && !!token,
        loading,
        login,
        logout,
        refreshProfile,
        hasRole
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
