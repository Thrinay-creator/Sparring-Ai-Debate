import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './en';
import te from './te';
import hi from './hi';

const translations = { en, te, hi };
const LANGUAGE_STORAGE_KEY = 'sparring_language';

export const LANGUAGE_CONFIG = {
  en: {
    recognition: 'en-IN',
    speech: 'en-IN',
    aiLanguage: 'English'
  },
  te: {
    recognition: 'te-IN',
    speech: 'te-IN',
    aiLanguage: 'Telugu'
  },
  hi: {
    recognition: 'hi-IN',
    speech: 'hi-IN',
    aiLanguage: 'Hindi'
  }
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && ['en', 'te', 'hi'].includes(stored)) {
        return stored;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = useCallback((newLang) => {
    if (['en', 'te', 'hi'].includes(newLang)) {
      setLanguageState(newLang);
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch (e) {
        console.error('Failed to save language preference', e);
      }
    }
  }, []);

  // Helper function to resolve dot-notated translation keys (e.g. 'setup.topicLabel')
  const t = useCallback((path, params = {}) => {
    const currentDict = translations[language] || translations.en;
    const fallbackDict = translations.en;

    const resolve = (dict, p) => {
      const parts = p.split('.');
      let cur = dict;
      for (const part of parts) {
        if (cur && typeof cur === 'object' && part in cur) {
          cur = cur[part];
        } else {
          return null;
        }
      }
      return typeof cur === 'string' ? cur : null;
    };

    let str = resolve(currentDict, path) || resolve(fallbackDict, path) || path;

    // Parameter interpolation: {paramName}
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((key) => {
        str = str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]));
      });
    }

    return str;
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageConfig: LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.en,
      languageConfig: LANGUAGE_CONFIG
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
