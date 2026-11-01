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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FAF7] text-[#243A32]">
        <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] shadow-sm flex flex-col items-center gap-3">
          <Sprout className="w-8 h-8 text-[#059669] animate-bounce" />
          <div className="text-xs font-bold text-[#064E3B] tracking-wide">
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
