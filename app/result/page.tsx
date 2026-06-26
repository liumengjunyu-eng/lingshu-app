'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();
  const score = Number(searchParams.get('score') || 65);
  const type = searchParams.get('type') || 'balanced';
  const input = searchParams.get('input') || '';

  const productMap: Record<string, string[]> = {
    overloaded: [
      'TCM Liver Detox Set',
      'Deep Sleep Recovery Kit',
      'Stress Reset Acupressure Tool'
    ],
    unstable: [
      'Energy Balance Herbal Pack',
      'Emotional Regulation Oil Blend',
      'Body Restore Program'
    ],
    balanced: [
      'Daily Maintenance Wellness Kit',
      'Focus Stability Formula'
    ]
  };

  const products = productMap[type] || productMap.balanced;

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-light">Your System State</h1>
        <div className="mt-4 text-[#C4A862] text-5xl font-light">{score}</div>
        <p className="text-white/30 text-sm mt-2">System Load Index</p>

        <div className="mt-10 text-left bg-white/5 border border-white/10 p-6 rounded-xl">
          <p className="text-white/60 text-sm leading-relaxed">
            Your system shows imbalance between physical energy, emotional load, and decision fatigue.
            This is not fatigue — it is accumulation of recovery debt.
          </p>
          <p className="text-white/30 text-xs mt-3">Based on: &quot;{input}&quot;</p>
        </div>

        <div className="mt-10 text-left">
          <h2 className="text-lg text-[#C4A862] mb-4">Recommended Recovery Products</h2>
          <div className="space-y-3">
            {products.map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#C4A862]/40 transition cursor-default"
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/share"
          className="mt-10 inline-block px-8 py-3 bg-[#C4A862] text-[#1A1A1A] rounded-full font-medium hover:opacity-90 transition"
        >
          Share My System Report
        </Link>
      </div>
    </main>
  );
}

export default function Result() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#1A1A1A] text-white px-6 py-12 flex items-center justify-center">
        <div className="text-[#C4A862]">Loading result...</div>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
