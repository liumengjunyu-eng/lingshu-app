// lib/i18n/context.tsx
'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import zhMessages from '@/messages/zh.json';
import zhTWMessages from '@/messages/zh-TW.json';
import enMessages from '@/messages/en.json';
import jaMessages from '@/messages/ja.json';
import koMessages from '@/messages/ko.json';

const allMessages: Record<string, Record<string, unknown>> = {
  zh: zhMessages as Record<string, unknown>,
  'zh-TW': zhTWMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
  ja: jaMessages as Record<string, unknown>,
  ko: koMessages as Record<string, unknown>,
};

type I18nContextType = {
  locale: string;
  t: (key: string, namespace?: string) => string;
};

const I18nContext = createContext<I18nContextType>({
  locale: 'zh',
  t: (key: string, namespace?: string) => key,
});

function resolveValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function I18nProvider({ locale, children }: { locale: string; children: ReactNode }) {
  const safeLocale = locale in allMessages ? locale : 'zh';
  const messages = allMessages[safeLocale];

  const value = useMemo<I18nContextType>(() => ({
    locale: safeLocale,
    t: (key: string, namespace?: string) => {
      if (namespace) {
        const ns = messages[namespace] as Record<string, unknown> | undefined;
        if (ns) return resolveValue(ns, key);
      }
      return resolveValue(messages, key);
    },
  }), [safeLocale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale() {
  return useContext(I18nContext).locale;
}

export function useTranslations(namespace?: string) {
  const { t } = useContext(I18nContext);
  return (key: string) => t(key, namespace);
}
