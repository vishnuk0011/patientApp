import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import translations from '../constants/translations/';
import { ITranslate } from '../constants/types';

// Create a new i18n instance
const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export const TranslationContext = React.createContext({});

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<string>('en');

  // Always guarantee a valid string
  i18n.locale = locale || 'en';

  const t = useCallback(
    (scope: string | string[], options?: object) => {
      return i18n.translate(scope, { ...options, locale: locale || 'en' });
    },
    [locale]
  );

  // Get locale from storage or device
  const getLocale = useCallback(async () => {
    try {
      const storedLocale = await AsyncStorage.getItem('locale');

      // Safely read device locale (SDK 53 compatible)
      const deviceLocale =
        typeof Localization.locale === 'string' &&
        Localization.locale.length > 0
          ? Localization.locale
          : 'en';

      // Ensure string fallback always
      setLocale(storedLocale ?? deviceLocale ?? 'en');
    } catch (error) {
      setLocale('en');
    }
  }, []);

  useEffect(() => {
    getLocale();
  }, [getLocale]);

  useEffect(() => {
    if (locale && typeof locale === 'string') {
      AsyncStorage.setItem('locale', locale);
    }
  }, [locale]);

  const contextValue = {
    t,
    locale,
    setLocale,
    translate: t,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

/*
 * useTranslation hook based on i18n-js
 */
export const useTranslation = () =>
  useContext(TranslationContext) as ITranslate;