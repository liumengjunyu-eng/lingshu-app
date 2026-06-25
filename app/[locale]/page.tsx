'use client';

import { useTranslations } from 'next-intl';
import { HookLine } from '@/components/HookLine';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations('common');

  return (
    <main className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center px-6 py-12">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-8">
        <HookLine />

        <p className="text-[17px] text-[#4A4A4A] max-w-md mx-auto leading-relaxed">
          {t('subtitle')}
        </p>

        <a
          href="/diagnose"
          className="inline-flex items-center px-12 py-4 mx-auto text-lg font-medium text-white bg-[#4A7C49] rounded-xl hover:bg-[#3D6A3C] transition-all shadow-[0_4px_12px_rgba(74,124,73,0.2)]"
        >
          {t('start')} →
        </a>

        <p className="text-[11px] text-[#B0B0B0] tracking-widest uppercase mt-6">
          {t('powered')}
        </p>
      </div>
    </main>
  );
}
