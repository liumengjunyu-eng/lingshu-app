// components/LanguageSwitcher.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { localeNames } from '@/i18n';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && Object.keys(localeNames).includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    router.push('/' + segments.join('/'));
    setIsOpen(false);
  };

  const currentName = localeNames[locale as keyof typeof localeNames] || 'English';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-[#EAE5DE] text-sm text-[#4A4A4A] hover:border-[#4A7C49] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
        <span>{currentName}</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-[#EAE5DE] rounded-2xl shadow-elevated overflow-hidden z-50">
          {Object.entries(localeNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => switchLanguage(code)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                locale === code
                  ? 'bg-[#E8F0E6] text-[#1A1A1A] font-medium'
                  : 'text-[#4A4A4A] hover:bg-[#F5F5F2]'
              }`}
            >
              {name}
              {locale === code && <span className="float-right text-[#4A7C49]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
