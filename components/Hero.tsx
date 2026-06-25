'use client';

import { useTranslations } from '@/lib/i18n/context';

export function Hero() {
  const { t, rich } = useTranslations('common');

  return (
    <section className="relative min-h-dvh flex items-center justify-center px-6 overflow-hidden bg-[#FBF9F6]">
      {/* CSS 模糊球（GPU 加速，无 Canvas） */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative w-[500px] h-[500px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4A7C49]/15 via-[#C9A96E]/5 to-transparent blur-3xl animate-breath-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#4A7C49]/5 blur-2xl animate-pulse-slow" />
          <div className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full bg-[#C9A96E]/10 blur-xl animate-float-slow" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="flex justify-center gap-2 text-xs sm:text-sm text-[#4A7C49]/50 tracking-[0.2em] uppercase mb-8">
          <span>Recovery Intelligence</span>
          <span className="text-[#C9A96E]">·</span>
          <span>LingShu</span>
        </div>

        <h1 className="font-serif font-bold text-[#1A1A1A] text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-[-0.02em]">
          {t('heroTitle')}<br/>
          <span className="text-[#4A7C49]">{t('heroTitleEm')}</span>
        </h1>

        <p className="text-[#6B6B6B] text-base sm:text-lg max-w-md mx-auto mt-6 leading-relaxed">
          {t('heroSubtitle')}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="/diagnose"
            className="px-10 py-4 bg-[#4A7C49] text-white rounded-full text-[15px] sm:text-base font-medium tracking-wide hover:bg-[#3D6A3C] transition-all duration-300 shadow-[0_8px_32px_rgba(74,124,73,0.15)] hover:shadow-[0_12px_48px_rgba(74,124,73,0.25)] hover:-translate-y-0.5"
          >
            {t('start')}
          </a>
          <a
            href="#how-it-works"
            className="px-10 py-4 border border-[#1A1A1A]/10 text-[#1A1A1A]/60 rounded-full text-[15px] sm:text-base font-medium hover:bg-white/50 transition-all duration-300"
          >
            {t('learnMore')} →
          </a>
        </div>

        <p className="text-[#B0B0B0] text-xs sm:text-sm mt-8 tracking-wide">
          {t('heroMeta')}
        </p>
      </div>
    </section>
  );
}
