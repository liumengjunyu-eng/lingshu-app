import type { Metadata } from 'next';
import '../globals.css';
import { I18nProvider } from '@/lib/i18n/context';

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
  return <I18nProvider locale={params.locale}>{children}</I18nProvider>;
}
