import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Sprout,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Layers
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { supabase } from '../supabase';
import { useLanguage } from '../context/LanguageContext';
import { INDIAN_STATES, INDIAN_STATES_CITIES } from '../constants/indianRegions';
import { Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'onboarding';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { isAuthenticated, completeOnboarding } = useFarmData();
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'onboarding'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  // Onboarding multi-step state
  const [onboardStep, setOnboardStep] = useState(1);
  const [farmerName, setFarmerName] = useState('Darshan Patil');
  const [phone, setPhone] = useState('+91 98452 34120');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState('Mandya');
  const [village, setVillage] = useState('Pandavapura');
  const [landSize, setLandSize] = useState<number>(6.5);
  const [farmingType, setFarmingType] = useState<'Precision Tech' | 'Organic' | 'Conventional'>('Precision Tech');
  const [primaryCrop, setPrimaryCrop] = useState('Tomato & Paddy');

  if (!isOpen) return null;

  // REAL Supabase auth. Wrong passwords, unregistered emails and
  // unconfirmed accounts fail here with Supabase's own error — nothing
  // is logged in locally. Google redirects to Supabase/Google and back
  // to this site (redirectTo must be allow-listed in Supabase Auth).
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMessage('');
    setAuthLoading(true);
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setAuthMessage('If this email has an account, a password reset link has been sent. Check your inbox.');
        return;
      }
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        if (data.session) {
          onClose(); // Signed in immediately (email confirmation off)
        } else {
          setAuthMessage('Account created. Check your email to confirm your account, then sign in.');
          setMode('login');
        }
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      onClose(); // onAuthStateChange in FarmDataContext sets the real user
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setAuthMessage('');
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      // Browser redirects to Google/Supabase now; the session returns here.
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in failed. Please try again.');
      setAuthLoading(false);
    }
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMode('register');
      setName(farmerName);
      return;
    }
    completeOnboarding({
      name: farmerName,
      phone,
      state: selectedState,
      district: selectedDistrict,
      village,
      landSize,
      farmingType,
      preferredLanguage: language
    });
    onClose();
  };

  const districtsForState = INDIAN_STATES_CITIES[selectedState] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-[#022C22]/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white sm:rounded-[1.75rem] shadow-2xl border border-[#E5EDE7] overflow-hidden md:flex min-h-full sm:min-h-0">
        {/* LEFT: full-height farm image (desktop) / top banner (mobile) */}
        <div className="relative md:w-5/12 shrink-0 h-44 md:h-auto overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80"
            alt="Green farmland in India"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#022C22]/70 via-[#022C22]/40 to-[#022C22]/90" />
          <div className="relative z-10 flex h-full flex-col justify-end md:justify-between p-5 sm:p-6 text-white">
            <div className="hidden md:flex items-center gap-2">
              <img src="/logo-icon.svg" alt="KrishiSmart AI" className="w-10 h-10 rounded-xl ring-1 ring-white/30" />
              <span className="font-extrabold font-heading tracking-tight">KRISHISMART AI</span>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-extrabold font-heading leading-tight drop-shadow">
                Smart Farming.<br />Better Decisions.<br />Better Future.
              </p>
              <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed max-w-xs">
                Crop health, weather, mandi prices and smart irrigation — in one premium farm platform.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#064E3B] to-[#064E3B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sprout className="w-6 h-6 text-[#6EE7B7]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg font-heading leading-tight">
                {mode === 'onboarding'
                  ? 'Farmer Setup & Onboarding'
                  : mode === 'register'
                  ? 'Create KrishiSmart Account'
                  : mode === 'forgot'
                  ? 'Reset Password'
                  : 'Sign In to KrishiSmart AI'}
              </h3>
              <p className="text-xs text-[#D1FAE5]">
                {mode === 'onboarding'
                  ? `Step ${onboardStep} of 3 • Personalize your smart farm`
                  : 'Smart Farming. Better Decisions. Better Future.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ONBOARDING FLOW */}
        {mode === 'onboarding' && !isAuthenticated ? (
          <div className="p-6 space-y-4 text-center">
            <h3 className="font-extrabold text-lg font-heading">Create your account first</h3>
            <p className="text-sm text-[#5A6E64] leading-relaxed">
              Farm setup is saved to your real Supabase account. Sign up or sign in, then come back to complete your farm setup.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMode('register')} className="flex-1 py-3 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md">
                Create Account
              </button>
              <button type="button" onClick={() => setMode('login')} className="flex-1 py-3 rounded-xl border border-[#CBD8D0] hover:bg-[#F7FAF7] text-[#3E5248] font-bold text-sm">
                Sign In
              </button>
            </div>
          </div>
        ) : mode === 'onboarding' ? (
          <form onSubmit={handleOnboardingSubmit} className="p-6 space-y-5">
            {/* Step Indicators */}
            <div className="flex items-center justify-between gap-2 border-b border-[#EFF4EF] pb-3">
              {[1, 2, 3].map((st) => (
                <div
                  key={st}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    st <= onboardStep ? 'bg-[#059669]' : 'bg-[#E5EDE7]'
                  }`}
                />
              ))}
            </div>

            {onboardStep === 1 && (
              <div className="w-full min-w-0 space-y-4 animate-in fade-in">
                <div className="text-xs font-bold text-[#718078] uppercase tracking-wider">
                  Step 1: Farmer Details
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden"
                    placeholder="e.g. Ramesh Patil"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Mobile Phone (for SMS/WhatsApp alerts)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden"
                    placeholder="+91 98452 00000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Preferred Language</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'kn', label: 'ಕನ್ನಡ' },
                      { code: 'hi', label: 'हिंदी' }
                    ].map((l) => (
                      <button
                        type="button"
                        key={l.code}
                        onClick={() => setLanguage(l.code as Language)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          language === l.code
                            ? 'bg-[#059669] text-white border-[#059669] shadow-xs'
                            : 'bg-[#F7FAF7] border-[#E5EDE7] text-[#3E5248] hover:bg-[#EFF4EF]'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOnboardStep(2)}
                  className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Next: Farm Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {onboardStep === 2 && (
              <div className="w-full min-w-0 space-y-4 animate-in fade-in">
                <div className="text-xs font-bold text-[#718078] uppercase tracking-wider">
                  Step 2: Farm Location & Region
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const cities = INDIAN_STATES_CITIES[e.target.value] || [];
                      if (cities.length > 0) setSelectedDistrict(cities[0]);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden bg-white"
                  >
                    {districtsForState.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Village / Taluk</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden"
                    placeholder="e.g. Pandavapura"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(1)}
                    className="flex-1 py-3 rounded-xl border border-[#CBD8D0] hover:bg-[#F7FAF7] text-[#3E5248] font-bold text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardStep(3)}
                    className="flex-1 py-3 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Next: Crops & Land</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 3 && (
              <div className="w-full min-w-0 space-y-4 animate-in fade-in">
                <div className="text-xs font-bold text-[#718078] uppercase tracking-wider">
                  Step 3: Land Size & Crops
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">
                    Total Cultivable Land (Acres): <span className="text-[#064E3B] font-bold">{landSize} Acres</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={landSize}
                    onChange={(e) => setLandSize(parseFloat(e.target.value))}
                    className="w-full accent-[#059669]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A9A90] font-semibold">
                    <span>0.5 Acre</span>
                    <span>10 Acres</span>
                    <span>25 Acres</span>
                    <span>50+ Acres</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Farming Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Precision Tech', 'Organic', 'Conventional'] as const).map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFarmingType(type)}
                        className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                          farmingType === type
                            ? 'bg-[#059669] text-white border-[#059669] shadow-xs'
                            : 'bg-[#F7FAF7] border-[#E5EDE7] text-[#3E5248] hover:bg-[#EFF4EF]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Current Crops</label>
                  <input
                    type="text"
                    value={primaryCrop}
                    onChange={(e) => setPrimaryCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden"
                    placeholder="e.g. Paddy, Tomato, Sugarcane"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(2)}
                    className="flex-1 py-3 rounded-xl border border-[#CBD8D0] hover:bg-[#F7FAF7] text-[#3E5248] font-bold text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Setup</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          /* REGULAR LOGIN / REGISTER FORM */
          <div className="p-6 space-y-4">
            {/* Social Google Login Button */}
            <button
              type="button"
              disabled={authLoading}
              onClick={handleGoogleAuth}
              className="w-full py-3 rounded-xl border border-[#CBD8D0] hover:bg-[#F7FAF7] text-[#243A32] font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-[#E5EDE7]"></div>
              <span className="px-3 text-[11px] font-bold text-[#8A9A90] uppercase">Or with email</span>
              <div className="flex-1 border-t border-[#E5EDE7]"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full min-w-0 space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Farmer Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden"
                    placeholder="Darshan Patil"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#3E5248] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden"
                  placeholder="farmer@example.com"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#3E5248]">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-[#059669] hover:text-[#064E3B] font-semibold"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-hidden"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#718078] hover:text-[#064E3B] hover:bg-[#EFF4EF]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}


              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {authError}
                </div>
              )}
              {authMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                  {authMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md shadow-[#059669]/20 transition-all disabled:opacity-60"
              >
                {authLoading ? 'Please wait…' : mode === 'register' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In'}
              </button>
            </form>

            <div className="pt-2 text-center">
              {mode === 'login' ? (
                <div className="text-xs text-[#718078]">
                  New to KrishiSmart?{' '}
                  <button
                    onClick={() => setMode('onboarding')}
                    className="text-[#064E3B] font-bold hover:underline"
                  >
                    Start Farmer Onboarding →
                  </button>
                </div>
              ) : (
                <div className="text-xs text-[#718078]">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-[#064E3B] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
