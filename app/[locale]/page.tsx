'use client';

import { HookLine } from '@/components/HookLine';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/lib/i18n/context';

export default function HomePage() {
  const t = useTranslations('common');

  return (
    <main className="min-h-dvh bg-[#FBF9F6] flex flex-col">
      <div className="fixed top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16 pt-20">
        <HookLine />

        <p className="mt-10 text-[17px] text-[#6B6B6B] max-w-sm mx-auto text-center leading-relaxed">
          {t('subtitle')}
        </p>

        <a
          href="/diagnose"
          className="mt-10 inline-flex items-center gap-2 px-10 py-[14px] text-[17px] font-medium text-white bg-[#4A7C49] rounded-full hover:bg-[#3D6A3C] active:bg-[#346533] transition-all"
        >
          {t('start')}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <p className="mt-auto pt-12 text-[11px] text-[#B0B0B0] tracking-[0.08em]">
          {t('powered')}
        </p>
      </div>
    </main>
  );
}
