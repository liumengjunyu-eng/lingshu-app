// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['zh', 'zh-TW', 'en', 'ja', 'ko'] as const;
export const defaultLocale = 'zh';

export const localeNames = {
  zh: '简体中文',
  'zh-TW': '繁體中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
};

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locales.includes(locale as any) ? locale : defaultLocale;
  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default,
  };
});
