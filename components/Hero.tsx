'use client';

import { useTranslations } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';

export function Hero() {
  const { t } = useTranslations('common');

  return (
    <section className="relative min-h-dvh flex items-center justify-center px-6 overflow-hidden bg-[#FBF9F6]">
      {/* 右上角语言切换 */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* 装饰光斑：紧凑、实心、不 blur，肉眼可见 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-[#4A7C49]/20 animate-breath-slow" />
        <div className="absolute bottom-[25%] right-[10%] w-48 h-48 rounded-full bg-[#C9A96E]/25 animate-float-slow" />
        <div className="absolute top-[55%] left-[60%] w-32 h-32 rounded-full bg-[#4A7C49]/15 animate-pulse-slow" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="flex justify-center gap-2 text-xs sm:text-sm text-[#4A7C49]/50 tracking-[0.2em] uppercase mb-8">
          <span>5 个问题 · 5 种人格 · 1 个诊断</span>
        </div>

        <h1 className="font-serif font-bold text-[#1A1A1A] text-3xl sm:text-4xl md:text-5xl leading-[1.2] tracking-[-0.01em]">
          {t('heroTitle')
            .split('|')
            .map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          {t('heroTitleEm') && (
            <>
              <br />
              <span className="text-[#4A7C49]">
                {t('heroTitleEm')
                  .split('|')
                  .map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
              </span>
            </>
          )}
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
