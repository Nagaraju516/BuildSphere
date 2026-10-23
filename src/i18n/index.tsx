import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import enTranslations from '../locales/en.json';
import teTranslations from '../locales/te.json';
import hiTranslations from '../locales/hi.json';

const dictionaries: Record<SupportedLanguage, any> = {
  en: enTranslations,
  te: teTranslations,
  hi: hiTranslations,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  formatCurrency: (amount: number, compact?: boolean) => string;
  formatDate: (dateStr: string) => string;
  verifyCompleteness: () => { missingTe: string[]; missingHi: string[]; totalKeys: number };
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('buildsphere_language') as SupportedLanguage;
      if (saved && (saved === 'en' || saved === 'te' || saved === 'hi')) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('buildsphere_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[language] || enTranslations;
    const value = getNestedValue(dict, key);
    if (value !== undefined) {
      return value;
    }
    // Controlled fallback to English
    const fallbackValue = getNestedValue(enTranslations, key);
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    return fallback || key;
  };

  const formatCurrency = (amount: number, compact: boolean = false): string => {
    if (compact) {
      if (amount >= 10000000) {
        const cr = (amount / 10000000).toFixed(2);
        return language === 'te' ? `₹ ${cr} కోట్లు` : language === 'hi' ? `₹ ${cr} करोड़` : `₹ ${cr} Cr`;
      }
      if (amount >= 100000) {
        const lk = (amount / 100000).toFixed(2);
        return language === 'te' ? `₹ ${lk} లక్షలు` : language === 'hi' ? `₹ ${lk} लाख` : `₹ ${lk} Lakh`;
      }
    }
    const localeCode = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    try {
      return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `₹ ${amount.toLocaleString('en-IN')}`;
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      const localeCode = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      return new Intl.DateTimeFormat(localeCode, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const verifyCompleteness = () => {
    const keys: string[] = [];
    const extractKeys = (obj: any, prefix = '') => {
      for (const k of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
          extractKeys(obj[k], fullKey);
        } else {
          keys.push(fullKey);
        }
      }
    };
    extractKeys(enTranslations);

    const missingTe: string[] = [];
    const missingHi: string[] = [];

    for (const key of keys) {
      if (getNestedValue(teTranslations, key) === undefined) {
        missingTe.push(key);
      }
      if (getNestedValue(hiTranslations, key) === undefined) {
        missingHi.push(key);
      }
    }

    return {
      totalKeys: keys.length,
      missingTe,
      missingHi,
    };
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatCurrency,
        formatDate,
        verifyCompleteness,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
