import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import zhMessages from '@/messages/zh.json';
import zhTWMessages from '@/messages/zh-TW.json';
import enMessages from '@/messages/en.json';
import jaMessages from '@/messages/ja.json';
import koMessages from '@/messages/ko.json';
import '../globals.css';

const allMessages: Record<string, Record<string, unknown>> = {
  zh: zhMessages,
  'zh-TW': zhTWMessages,
  en: enMessages,
  ja: jaMessages,
  ko: koMessages,
};

export const metadata: Metadata = {
  title: '灵枢 · 你的恢复系统',
  description: '基于身体状态，帮你找到恢复节奏',
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = allMessages[locale] || allMessages.zh;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
