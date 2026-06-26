'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/diagnose');
  }, [router]);

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <div className="text-[#C4A862] animate-pulse text-sm">Loading...</div>
    </main>
  );
}
