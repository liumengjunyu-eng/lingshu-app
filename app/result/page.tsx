'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ─── 身份生成逻辑（基于诊断数据） ─────────────────────

interface IdentityResult {
  name: string;
  archetype: string;
  mirror: string;
  element: string;
  elementColor: string;
  elementSymbol: string;
  shadow: string;
}

const TYPES: Record<string, (score: number) => IdentityResult> = {
  performer: (score) => ({
    name: score > 65 ? 'The Fire-Wood Overdriver' : 'The Silent High Performer',
    archetype: score > 65 ? '行动驱动的燃烧者' : '持续输出者',
    mirror: 'You look productive from the outside.\nFrom the inside, it feels different.',
    element: 'Fire',
    elementColor: '#C9A96E',
    elementSymbol: '◉',
    shadow: 'The thing about running at 110% is that the crash is not optional — it\'s structural.',
  }),
  drifter: (score) => ({
    name: score > 55 ? 'The Water-Depleted Thinker' : 'The Drifter',
    archetype: score > 55 ? '深度恢复者' : '漂泊恢复者',
    mirror: 'You\'ve been recovering for so long\nit became your default state.',
    element: 'Water',
    elementColor: '#4A7C49',
    elementSymbol: '◐',
    shadow: 'Recovery is not a lifestyle. It\'s a system. You\'re stuck in the first gear.',
  }),
  balanced: () => ({
    name: 'The Balanced Observer',
    archetype: '平衡观察者',
    mirror: 'You\'ve found something rare:\na system that works.',
    element: 'Earth',
    elementColor: '#8B7355',
    elementSymbol: '◎',
    shadow: 'Even balance needs maintenance. The question is — are you watching the signs?',
  }),
};

function ElementSymbol({ el, color }: { el: string; color: string }) {
  const paths: Record<string, string> = {
    Fire: 'M32 8 L52 56 L12 56 Z',
    Water: 'M12 24 Q32 8 52 24 Q32 56 12 24',
    Earth: 'M12 44 Q32 20 52 44 Q32 56 12 44',
    Wood: 'M32 56 L12 20 L52 20 Z',
    Metal: 'M12 12 L52 12 L52 52 L12 52 Z',
  };
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" className="opacity-20">
      <path d={paths[el] || paths.Earth} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ─── 主组件 ──────────────────────────────────────────

function ResultContent() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '42');
  const type = searchParams.get('type') || 'performer';

  const identity = useMemo(() => {
    const generator = TYPES[type] || TYPES.performer;
    return generator(score);
  }, [score, type]);

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {/* Top spacer */}
      <div className="flex-1" />

      <div className="max-w-lg mx-auto px-6 text-center">
        {/* Element decorative */}
        <div className="flex justify-center mb-6">
          <ElementSymbol el={identity.element} color={identity.elementColor} />
        </div>

        {/* Recovery Identity (大标题，传播核心) */}
        <div className="text-forest/30 text-xs tracking-[0.2em] uppercase mb-3">
          Recovery Identity
        </div>
        <h1 className="font-sans font-bold text-ink text-4xl sm:text-5xl lg:text-6xl leading-tight">
          {identity.name}
        </h1>

        {/* Mirror sentence */}
        <div className="mt-6 px-4">
          <p className="text-ink/50 text-lg leading-relaxed font-light whitespace-pre-line">
            &ldquo;{identity.mirror}&rdquo;
          </p>
        </div>

        <div className="w-10 h-0.5 bg-gold/20 mx-auto my-6" />

        {/* Score (小字，次要) */}
        <div className="text-xs text-ink/20 tracking-wider">Recovery Debt Index</div>
        <div className="text-5xl font-bold text-ink/10 mt-1">{score}</div>

        {/* Element */}
        <div className="mt-5 flex items-center justify-center gap-2 text-ink/20 text-xs">
          <span>{identity.elementSymbol}</span>
          <span>{identity.element} element dominant</span>
          <span>{identity.elementSymbol}</span>
        </div>

        {/* Shadow insight */}
        <div className="mt-8 bg-white/50 rounded-xl px-5 py-4 border border-forest/5 max-w-sm mx-auto">
          <p className="text-ink/30 text-xs italic leading-relaxed">
            {identity.shadow}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button className="w-full sm:w-auto px-8 py-3.5 bg-forest text-white rounded-full text-sm font-medium tracking-wide hover:bg-forest/90 transition-all duration-300 shadow-[0_4px_20px_rgba(35,65,50,0.12)]">
            Share My Identity
          </button>
          <Link
            href="/lifegraph"
            className="w-full sm:w-auto px-8 py-3.5 border border-ink/10 text-ink/40 rounded-full text-sm font-medium hover:bg-white/50 transition-all duration-300"
          >
            See Your Life Graph &rarr;
          </Link>
        </div>

        {/* Deeper CTA */}
        <div className="mt-12 mb-16">
          <div className="border-t border-forest/5 pt-8">
            <div className="text-ink/20 text-xs tracking-wider uppercase">Go Deeper</div>
            <p className="text-ink/40 text-sm mt-2 max-w-xs mx-auto">
              Your full Symbol Report reveals the root cause behind your recovery debt — with personalized actions.
            </p>
            <Link
              href="/deep-report"
              className="inline-block mt-4 px-6 py-2.5 border border-gold/20 text-gold/70 rounded-full text-xs font-medium hover:bg-gold/5 transition-all duration-300"
            >
              Unlock Full Report &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="flex-1" />
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-ink/20 text-sm">Loading your identity...</div>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
