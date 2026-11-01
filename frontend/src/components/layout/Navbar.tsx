import React, { useState } from 'react';
import {
  Search,
  Bell,
  ShoppingCart,
  Globe,
  Sun,
  User,
  Sparkles,
  Menu,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarmData } from '../../context/FarmDataContext';
import { Language } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onToggleMobileSidebar: () => void;
  onNavigateAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNotifications,
  onOpenAuth,
  onOpenCart,
  onToggleMobileSidebar,
  onNavigateAdmin
}) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    user,
    weather,
    cart,
    notifications,
    isAuthenticated,
    locationState,
    setIsLocationModalOpen,
    isWeatherLive
  } = useFarmData();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    if (query.includes('crop') || query.includes('farm') || query.includes('field')) {
      setCurrentTab('myFarms');
    } else if (query.includes('ai') || query.includes('doctor') || query.includes('disease') || query.includes('soil')) {
      setCurrentTab('aiHub');
    } else if (query.includes('price') || query.includes('bhavishya') || query.includes('future') || query.includes('predict')) {
      setCurrentTab('krishiBhavishya');
    } else if (query.includes('scheme') || query.includes('kisan') || query.includes('subsidy')) {
      setCurrentTab('govtSchemes');
    } else if (query.includes('market') || query.includes('mandi')) {
      setCurrentTab('market');
    } else if (query.includes('weather') || query.includes('rain')) {
      setCurrentTab('weather');
    } else if (query.includes('drone')) {
      setCurrentTab('drone');
    } else if (query.includes('pump') || query.includes('water') || query.includes('irrigation')) {
      setCurrentTab('pump');
    } else if (query.includes('store') || query.includes('seed') || query.includes('buy') || query.includes('fertilizer')) {
      setCurrentTab('store');
    } else if (query.includes('finance') || query.includes('profit') || query.includes('loan')) {
      setCurrentTab('finance');
    } else {
      setCurrentTab('dashboard');
    }
    setSearchQuery('');
  };

  const languageLabels: Record<Language, { label: string; flag: string }> = {
    en: { label: 'English', flag: '🇬🇧' },
    kn: { label: 'ಕನ್ನಡ', flag: '🇮🇳' },
    hi: { label: 'हिंदी', flag: '🇮🇳' }
  };

  return (
    <header className="sticky top-0 z-40 w-full min-w-0 bg-white/85 backdrop-blur-md border-b border-[#E5EDE7]/80 shadow-soft transition-all overflow-x-clip">
      <div className="w-full min-w-0 px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-[#5A6E64] hover:bg-[#EFF4EF] transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer group min-w-0 shrink-0"
          >
            <img
              src="/logo-icon.svg"
              alt="KrishiSmart AI logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl shadow-xs group-hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-xl tracking-tight text-[#172B24] font-heading whitespace-nowrap">
                  KRISHISMART <span className="text-[#064E3B]">AI</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold bg-[#ECFDF5] text-[#064E3B] rounded-md border border-[#A7F3D0]">
                  Smart Farming
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-[#718078] font-medium -mt-0.5">
                {t('tagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Universal Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-md mx-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9A90]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-[#EFF4EF]/80 border border-[#E5EDE7]/80 rounded-full text-xs focus:outline-hidden focus:ring-2 focus:ring-[#059669] focus:bg-white focus:border-[#6EE7B7] transition-all placeholder:text-[#8A9A90] shadow-2xs"
            />
          </form>
        </div>

        {/* Right: Actions (Location Selector, Weather, Language, Notifications, Cart, Profile) */}
        <div className="flex items-center gap-1 sm:gap-2.5 min-w-0 shrink-0">
          {/* Real-time Location Control Pill */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-white hover:bg-[#ECFDF5] border border-[#E5EDE7] hover:border-[#6EE7B7] transition-all text-[#243A32] group shadow-2xs min-w-0"
            title="Click to detect GPS or change farm location"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  locationState.source === 'gps' ? 'bg-[#10B981]' : 'bg-amber-500'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  locationState.source === 'gps' ? 'bg-[#059669]' : 'bg-amber-600'
                }`}
              ></span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-[#243A32] group-hover:text-[#064E3B] truncate max-w-[84px] sm:max-w-[170px]">
              📍 {locationState.address.district || 'Raichur'}, {locationState.address.state || 'Karnataka'}
            </span>
          </button>

          {/* Quick Weather Capsule */}
          <button
            onClick={() => setCurrentTab('weather')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 hover:bg-amber-100/80 transition-colors text-amber-900"
            title="Farm weather station"
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold">{weather.temp}°C</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#E5EDE7] text-[#3E5248] hover:bg-[#F7FAF7] text-xs font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#059669]" />
              <span className="hidden sm:inline">{languageLabels[language].label}</span>
              <ChevronDown className="w-3 h-3 text-[#8A9A90]" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-[#EFF4EF] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {(['en', 'kn', 'hi'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between hover:bg-[#ECFDF5] transition-colors ${
                      language === lang ? 'text-[#064E3B] font-bold bg-[#ECFDF5]/60' : 'text-[#3E5248]'
                    }`}
                  >
                    <span>{languageLabels[lang].label}</span>
                    <span className="text-sm">{languageLabels[lang].flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Portal Gateway */}
          {onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#6EE7B7] bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#064E3B] text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
              title="Enter Admin Portal / CMS"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
              <span className="hidden sm:inline">Admin CMS</span>
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl text-[#5A6E64] hover:bg-[#EFF4EF] hover:text-[#172B24] transition-colors"
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#059669] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-[#5A6E64] hover:bg-[#EFF4EF] hover:text-[#172B24] transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile / Login CTA */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-[#E5EDE7] hover:border-[#6EE7B7] hover:bg-[#F7FAF7] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center font-bold text-xs border border-[#6EE7B7] overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#243A32] leading-tight flex items-center gap-1">
                  <span>{user.name.split(' ')[0]}</span>
                  {user.isPremium && (
                    <span className="px-1 py-0.2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-extrabold rounded-sm uppercase tracking-wider">
                      PRO
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#059669] font-semibold leading-none">
                  Lvl {user.level} Farmer
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-xs font-bold shadow-md shadow-[#059669]/20 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('login')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
