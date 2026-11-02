import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  /** Indian number formatting (en-IN grouping), data unchanged. */
  formatNumber: (value: number) => string;
  /** Indian currency formatting with ₹, data unchanged. */
  formatCurrency: (value: number) => string;
  /** Locale-aware date formatting for the selected language. */
  formatDate: (value: string | number | Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCALE_FOR_LANGUAGE: Record<Language, string> = {
  en: 'en-IN',
  kn: 'kn-IN',
  hi: 'hi-IN'
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('krishi_lang');
      return (saved === 'kn' || saved === 'hi' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  // Persisted + instant: changing language re-renders the whole tree
  // through React state, with no page refresh, and survives refresh,
  // navigation and re-login via localStorage (krishi_lang).
  useEffect(() => {
    try {
      localStorage.setItem('krishi_lang', language);
    } catch {
      // private mode etc. — language still works for this session
    }
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultText || key;
  };

  const locale = LOCALE_FOR_LANGUAGE[language] || 'en-IN';
  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  const formatDate = (value: string | number | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatNumber, formatCurrency, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
