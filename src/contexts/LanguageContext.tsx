'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  translations,
  galleryItemsTranslations,
  LOCALES,
  type SupportedLanguages,
  type Translation,
  type GalleryItem,
} from '@/i18n/translations';

interface LanguageContextValue {
  currentLanguage: SupportedLanguages;
  locale: string;
  translations: Translation;
  setCurrentLanguage: (lang: SupportedLanguages) => void;
  getTranslatedGalleryItems: () => GalleryItem[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguages>('en');

  // Detect the preferred language once on mount (saved choice wins over browser).
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as SupportedLanguages | null;
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      return;
    }

    const browserLanguage = navigator.language.split('-')[0] as SupportedLanguages;
    if (translations[browserLanguage]) {
      setCurrentLanguage(browserLanguage);
    }
  }, []);

  // Keep the document <html lang> in sync for accessibility and SEO.
  useEffect(() => {
    document.documentElement.lang = LOCALES[currentLanguage];
  }, [currentLanguage]);

  const changeLanguage = (lang: SupportedLanguages) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  const value: LanguageContextValue = {
    currentLanguage,
    locale: LOCALES[currentLanguage],
    translations: translations[currentLanguage],
    setCurrentLanguage: changeLanguage,
    getTranslatedGalleryItems: () => galleryItemsTranslations[currentLanguage],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
