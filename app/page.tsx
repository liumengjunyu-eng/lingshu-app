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
  const [index, setIndex] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 200);
    const t2 = setTimeout(() => setShowInput(true), 800);
    const t3 = setTimeout(() => setShowCTA(true), 1400);
    const t4 = setInterval(() => {
      setIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(t4);
    };
  }, []);

  const start = () => {
    if (!input.trim()) return;
    router.push(`/diagnose?input=${encodeURIComponent(input.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      start();
    }
  };

  return (
    <main className="min-h-screen bg-[#050507] flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-[#C4A862]/20">

      {/* 光核背景 */}
      <div className="absolute w-[320px] h-[320px] rounded-full blur-3xl animate-pulse-slow"
        style={{ background: 'rgba(196,168,98,0.1)' }} />

      {/* 第二层光晕 */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(196,168,98,0.06) 0%, transparent 70%)' }} />

      {/* 主内容 */}
      <div className="max-w-lg w-full text-center z-10">

        {/* 主句 */}
        <div className={`transition-all duration-700 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-white text-2xl md:text-[28px] font-light leading-relaxed tracking-tight">
            You are not overwhelmed.
            <br />
            <span className="text-[#C4A862]">You are uncalibrated.</span>
          </h1>
        </div>

        {/* 输入区 */}
        <div className={`mt-10 transition-all duration-700 ${showInput ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Describe your current state."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-white/90 text-sm outline-none resize-none placeholder:text-white/20 transition-all duration-300 focus:border-[#C4A862]/30 focus:bg-white/[0.06]"
          />

          {/* 动态提示（情绪引导，不可点击） */}
          <p className="text-white/25 text-sm mt-3 transition-opacity duration-500 font-light tracking-wide">
            &ldquo;{PLACEHOLDERS[index]}&rdquo;
          </p>
        </div>

        {/* CTA */}
        <div className={`transition-all duration-500 mt-8 ${showCTA ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button
            onClick={start}
            disabled={!input.trim()}
            className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
              input.trim()
                ? 'bg-[#C4A862] text-[#050507] hover:bg-[#B89A52] active:scale-[0.98]'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            Start System Scan
          </button>

          <p className="text-white/15 text-xs mt-3 font-light tracking-wide">
            2 minutes · no registration required
          </p>
        </div>

      </div>
    </main>
  );
}
