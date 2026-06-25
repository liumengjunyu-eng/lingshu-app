import './globals.css';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

const LOCALE_LANGS: Record<string, string> = {
  'zh': 'zh-CN',
  'zh-TW': 'zh-TW',
  'en': 'en',
  'ja': 'ja',
  'ko': 'ko',
};

function detectLocaleFromPath(): string {
  // 优先从 middleware 注入的 header 读取
  const headerLocale = headers().get('x-locale') || headers().get('x-next-intl-locale');
  if (headerLocale && LOCALE_LANGS[headerLocale]) return headerLocale;

  // fallback：从 pathname 推断
  const pathname = headers().get('x-pathname') || headers().get('x-invoke-path') || '';
  const match = pathname.match(/^\/(zh-TW|ja|ko|en|zh)(?:\/|$)/);
  return match?.[1] || 'zh';
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = detectLocaleFromPath();
  const lang = LOCALE_LANGS[locale] || 'zh-CN';

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
