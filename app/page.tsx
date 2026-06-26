'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SAMPLE_CASES = [
  'Running on empty',
  "Can't switch off at night",
  'Lost my edge',
];

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 自动聚焦输入框
    setTimeout(() => inputRef.current?.focus(), 1200);
  }, []);

  const handleStart = () => {
    if (!input.trim()) return;
    router.push(`/diagnose?input=${encodeURIComponent(input)}`);
  };

  const handleSampleClick = (sample: string) => {
    setInput(sample);
    // 选案例后自动提交
    setTimeout(() => {
      router.push(`/diagnose?input=${encodeURIComponent(sample)}`);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        {/* 光晕（呼吸感 CSS 实现） */}
        <div className="relative mb-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#C4A862]/10 animate-pulse blur-xl" />
        </div>

        {/* 核心断言 */}
        <h1 className="text-3xl md:text-4xl font-light text-white leading-tight">
          You&apos;re not broken.
          <br />
          You&apos;re just running a system
          <br />
          that wasn&apos;t designed to sustain.
        </h1>

        <p className="mt-4 text-white/30 text-sm">
          Describe your current state. One sentence is fine.
        </p>

        {/* 输入框 */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. I feel exhausted, unmotivated, and mentally overloaded..."
          className="mt-8 w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm min-h-[100px] outline-none focus:border-[#C4A862]/50 transition placeholder:text-white/20 resize-none"
        />

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!input.trim()}
          className="mt-6 px-8 py-3 bg-[#C4A862] text-[#1A1A1A] rounded-full font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Analyze My System
        </button>

        {/* 案例气泡 */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {SAMPLE_CASES.map((sample) => (
            <button
              key={sample}
              onClick={() => handleSampleClick(sample)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-white/30 hover:border-[#C4A862]/30 hover:text-[#C4A862] transition"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* 底部信用标识 */}
        <p className="mt-12 text-xs text-white/10">
          LingShu · System Pattern Recognition
        </p>
      </div>
    </main>
  );
}
