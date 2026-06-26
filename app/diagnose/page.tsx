'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DiagnoseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const input = searchParams.get('input') || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      // Symbol Engine V1（规则计算）
      const score =
        input.includes('tired') ? 78 :
        input.includes('stress') ? 82 :
        input.includes('lost') ? 70 :
        input.includes('anxious') ? 76 :
        65;

      const type =
        score > 80 ? 'overloaded' :
        score > 70 ? 'unstable' :
        'balanced';

      router.push(`/result?score=${score}&type=${type}&input=${encodeURIComponent(input)}`);
    }, 1200);

    return () => clearTimeout(timer);
  }, [input, router]);

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#C4A862] animate-pulse text-sm tracking-wider">
          Analyzing Body · Mind · Life Systems...
        </div>
      </div>
    </main>
  );
}

export default function Diagnose() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#C4A862] animate-pulse text-sm tracking-wider">Loading...</div>
      </main>
    }>
      <DiagnoseContent />
    </Suspense>
  );
}
