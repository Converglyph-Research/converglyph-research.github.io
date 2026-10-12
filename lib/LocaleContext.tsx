'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, DICTIONARY } from './i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  dict: Record<string, string>;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: () => {},
  dict: DICTIONARY.en
});

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('aetheria_lang') as Locale | null;
    if (saved === 'vi' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    } else {
      const navLang = (typeof navigator !== 'undefined' ? navigator.language : '').toLowerCase();
      const detected: Locale = navLang.startsWith('vi') ? 'vi' : 'en';
      setLocaleState(detected);
      document.documentElement.lang = detected;
    }
  }, []);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem('aetheria_lang', loc);
    document.documentElement.lang = loc;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dict: DICTIONARY[locale] || DICTIONARY.en }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
