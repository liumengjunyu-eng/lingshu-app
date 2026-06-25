// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

export default function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  // 从 URL 推断 locale 并暴露给 layout
  const pathname = req.nextUrl.pathname;
  const match = pathname.match(/^\/(zh-TW|ja|ko|en|zh)(?:\/|$)/);
  const locale = match?.[1] || defaultLocale;

  res.headers.set('x-locale', locale);
  res.headers.set('x-pathname', pathname);
  return res;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*|result|test).*)'],
};
