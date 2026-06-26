'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState('');

  const handleStart = () => {
    if (!input.trim()) return;
    router.push(`/diagnose?input=${encodeURIComponent(input)}`);
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
          What is draining your system?
        </h1>
        <p className="mt-4 text-white/40 text-sm">
          Describe your current physical + emotional state
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I feel exhausted, unmotivated, and mentally overloaded..."
          className="mt-8 w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm min-h-[120px] outline-none focus:border-[#C4A862] transition placeholder:text-white/20"
        />
        <button
          onClick={handleStart}
          className="mt-6 px-8 py-3 bg-[#C4A862] text-[#1A1A1A] rounded-full font-medium hover:opacity-90 transition"
        >
          Analyze My System
        </button>
      </div>
    </main>
  );
}
