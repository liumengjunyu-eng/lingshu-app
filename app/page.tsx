'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PLACEHOLDERS = [
  "I feel stuck but don't know why",
  'My mind is full but nothing moves',
  'I am tired but still functional',
  'Something feels off lately',
];

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState(0);
  const [phIdx, setPhIdx] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(t3);
    };
  }, []);

  const submit = () => {
    if (!input.trim()) return;
    router.push(`/diagnose?input=${encodeURIComponent(input.trim())}`);
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-6 relative overflow-hidden selection:bg-[#C4A862]/20">

      {/* 呼吸光核 */}
      <div className="absolute w-[360px] h-[360px] rounded-full blur-[120px] animate-breath"
        style={{ background: 'radial-gradient(circle, rgba(196,168,98,0.12) 0%, transparent 70%)' }} />

      {/* 呼吸点 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2">
        <div className="w-full h-full rounded-full bg-[#C4A862]/60 animate-ping" style={{ animationDuration: '3s' }} />
      </div>

      <div className="relative w-full max-w-md text-center">

        {/* 第一阶段：Hook */}
        <div className={`transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white/15 text-[10px] tracking-[0.25em] mb-5 font-light">L I N G S H U</p>

          <h1 className="text-white text-[26px] font-light leading-tight tracking-tight">
            You are not broken.
          </h1>

          <p className="text-[#C4A862] text-base font-light mt-3 leading-relaxed">
            You are operating beyond recovery capacity.
          </p>
        </div>

        {/* 第二阶段：输入 */}
        <div className={`transition-all duration-700 delay-200 mt-10 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
            }}
            placeholder="Describe your current state..."
            rows={2}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white text-sm outline-none resize-none placeholder:text-white/15 transition-all duration-300 focus:border-[#C4A862]/30 focus:bg-white/[0.06]"
          />

          {/* 轮播提示（不可点击） */}
          <p className="text-white/20 text-sm mt-3 h-5 transition-opacity duration-500 font-light tracking-wide">
            &ldquo;{PLACEHOLDERS[phIdx]}&rdquo;
          </p>

          {/* CTA */}
          <button
            onClick={submit}
            disabled={!input.trim()}
            className={`mt-6 w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
              input.trim()
                ? 'bg-[#C4A862] text-[#0B0B0B] hover:opacity-90 active:scale-[0.97]'
                : 'bg-white/5 text-white/15 cursor-not-allowed'
            }`}
          >
            Analyze My System
          </button>

          <p className="text-white/12 text-xs mt-4 font-light tracking-wide">
            Free &middot; 2 minutes &middot; No signup
          </p>
        </div>

      </div>
    </main>
  );
}
