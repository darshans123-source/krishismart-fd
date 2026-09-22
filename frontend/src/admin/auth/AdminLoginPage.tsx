import React, { useState } from 'react';
import { Sprout, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateFarmer: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateFarmer }) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both admin email and password.');
      return;
    }

    setLoading(true);
    const result = await login({ email, password, rememberMe });
    setLoading(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.message || 'Invalid admin credentials');
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#061e12] text-stone-100 p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Gradient & Agricultural Motif */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_50%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide shadow-xs backdrop-blur-md">
            <Sprout className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>KRISHISMART AI • ADMIN PORTAL</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading mt-3">
            Admin CMS Console
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xs mx-auto">
            Centralized content management, telemetry control, and precision farming administration.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-emerald-950/60 backdrop-blur-xl border border-emerald-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600/40 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@krishismart.ai"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-emerald-900/40 border border-emerald-700/60 text-white placeholder-emerald-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Password</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-emerald-900/40 border border-emerald-700/60 text-white placeholder-emerald-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-emerald-300/90 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-emerald-700 text-emerald-500 focus:ring-emerald-400 bg-emerald-900/50"
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset link has been dispatched to authorized IT administrator.')}
                className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-emerald-800/60 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/70 text-center">
              Quick Test Credentials
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@krishismart.ai', 'admin123')}
                className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-[11px] font-semibold text-emerald-200 text-center transition-all cursor-pointer"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('editor@krishismart.ai', 'editor123')}
                className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-[11px] font-semibold text-emerald-200 text-center transition-all cursor-pointer"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('content@krishismart.ai', 'content123')}
                className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-[11px] font-semibold text-emerald-200 text-center transition-all cursor-pointer"
              >
                Editor
              </button>
            </div>
          </div>
        </div>

        {/* Return to Farmer App Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onNavigateFarmer}
            className="text-xs text-emerald-300/80 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Return to Farmer Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};
