import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import { locales, Language, LocaleKeys } from '../i18n/locales';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: LocaleKeys, replacements?: { [key: string]: string | number }) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('preferredLanguage');
    if (stored && stored in locales) {
      return stored as Language;
    }
    const navigatorLanguage = window.navigator.language.split('-')[0] as Language;
    if (navigatorLanguage && navigatorLanguage in locales) {
      return navigatorLanguage;
    }
  }
  return 'en';
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('preferredLanguage', language);
      window.document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    if (lang in locales) {
      setLanguageState(lang);
    }
  }, []);

  const t = useCallback((key: LocaleKeys, replacements?: { [key: string]: string | number }): string => {
    let translation = locales[language][key] || locales['en'][key] || key;
    if (replacements) {
        for (const rKey in replacements) {
            translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
        }
    }
    return translation;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};