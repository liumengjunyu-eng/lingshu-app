'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ArchetypeSymbol({ type }: { type: string }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="22" stroke="#234132" strokeWidth="1.2" opacity="0.3" />
      <circle
        cx="32" cy="32" r="22"
        stroke="#C7A86B" strokeWidth="1.2" opacity="0.5"
        strokeDasharray="80 60" strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="3" fill="#234132" opacity="0.5" />
      <circle cx="54" cy="20" r="2" fill="#C7A86B" opacity="0.4" />
      <circle cx="14" cy="46" r="2" fill="#C7A86B" opacity="0.4" />
    </svg>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '42');
  const type = searchParams.get('type') || 'performer';

  const personas: Record<string, { title: string; mirror: string }> = {
    performer: {
      title: 'The Silent High Performer',
      mirror: 'Looks stable. Internally exhausted.',
    },
    drifter: {
      title: 'The Drifter',
      mirror: 'Always recovering. Never fully restored.',
    },
    balanced: {
      title: 'The Balanced One',
      mirror: 'Recovered. Present. Resilient.',
    },
  };

  const persona = personas[type] || personas.performer;

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <ArchetypeSymbol type={type} />
        </div>

        <div className="text-forest/40 text-sm tracking-[0.2em] uppercase">Recovery Identity</div>
        <h1 className="font-sans font-bold text-ink text-4xl sm:text-5xl lg:text-6xl mt-3 leading-tight">
          {persona.title}
        </h1>

        <p className="text-ink/60 text-lg sm:text-xl mt-4 max-w-md mx-auto leading-relaxed font-light">
          {persona.mirror}
        </p>

        <div className="w-12 h-0.5 bg-gold/30 mx-auto my-6" />

        <div className="flex items-center justify-center gap-3">
          <span className="text-ink/30 text-sm">Recovery Debt Index</span>
          <span className="text-forest font-semibold text-4xl">{score}</span>
          <span className="text-ink/20 text-sm">/ 100</span>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-xs text-ink/30">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest/40" />
            Reset
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest/20" />
            Restore
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest/10" />
            Rebuild
          </span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-10 py-4 bg-forest text-white rounded-full text-base font-medium tracking-wide hover:bg-forest/90 transition-all duration-300 shadow-[0_8px_32px_rgba(35,65,50,0.12)]">
            Share My Type
          </button>
          <Link
            href="/recovery"
            className="px-10 py-4 border border-ink/10 text-ink/50 rounded-full text-base font-medium hover:bg-white/50 transition-all duration-300"
          >
            View Path &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center text-ink/30">Loading…</div>}>
      <ResultContent />
    </Suspense>
  );
}
