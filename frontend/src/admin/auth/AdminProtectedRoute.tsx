import React from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { Sprout } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  onRedirectLogin: () => void;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, onRedirectLogin }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfcf9] text-stone-800">
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col items-center gap-3">
          <Sprout className="w-8 h-8 text-emerald-600 animate-bounce" />
          <div className="text-xs font-bold text-emerald-800 tracking-wide">
            Verifying Admin Session...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    onRedirectLogin();
    return null;
  }

  return <>{children}</>;
};
