'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PLACEHOLDERS = [
  "I feel tired all the time...",
  "I can't switch off my mind...",
  "My body is resting but not recovering...",
  "Something feels off but I don't know why...",
];

const LOADING_STATES = ['Analyzing', 'Listening', 'Ready'];

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [phIdx, setPhIdx] = useState(0);
  const [phase, setPhase] = useState<-1 | 0 | 1 | 2>(-1);  // -1=loading, 0=hook, 1=input, 2=all
  const [loadIdx, setLoadIdx] = useState(0);

  // Phase sequence
  useEffect(() => {
    const t1 = setTimeout(() => setLoadIdx(1), 500);
    const t2 = setTimeout(() => setLoadIdx(2), 1000);
    const t3 = setTimeout(() => setPhase(0), 1600);  // show hook
    const t4 = setTimeout(() => setPhase(1), 2400);  // show input zone
    const t5 = setTimeout(() => setPhase(2), 3000);  // show CTA
    const t6 = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearInterval(t6); };
  }, []);

  const charCount = input.length;
  const glowIntensity = Math.min(1, charCount / 40);
  const breathScale = 1 + glowIntensity * 0.12;
  const glowOpacity = 0.12 + glowIntensity * 0.2;

  const submit = () => {
    if (!input.trim()) return;
    router.push(`/diagnose?input=${encodeURIComponent(input.trim())}`);
  };

  // ============ LOADING STATE ============
  if (phase === -1) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-[200px] h-[200px] rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(196,168,98,0.15) 0%, transparent 70%)' }} />
        <div className="relative text-center">
          <div className="w-2 h-2 mx-auto mb-4 rounded-full bg-[#C4A862]/60 animate-ping" style={{ animationDuration: '2s' }} />
          <p className="text-white/25 text-sm font-light tracking-[0.3em]">
            {LOADING_STATES[loadIdx]}<span className="animate-pulse" style={{ animationDuration: '1s' }}>.</span>
            <span className="animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.2s' }}>.</span>
            <span className="animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.4s' }}>.</span>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-6 relative overflow-hidden selection:bg-[#C4A862]/20">

      {/* 呼吸光核 - 响应输入长度 */}
      <div className="absolute rounded-full blur-[120px] transition-all duration-1000 ease-out"
        style={{
          width: `${360 * breathScale}px`,
          height: `${360 * breathScale}px`,
          opacity: glowOpacity,
          background: `radial-gradient(circle, rgba(196,168,98,${0.12 + glowIntensity * 0.18}) 0%, transparent 70%)`,
        }} />

      {/* 脉冲点 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2">
        <div className="w-full h-full rounded-full bg-[#C4A862]/50 animate-ping" style={{ animationDuration: '4s' }} />
      </div>

      <div className="relative w-full max-w-md text-center">

        {/* Hook */}
        <div className={`transition-all duration-700 ${phase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white/12 text-[10px] tracking-[0.25em] mb-6 font-light">L I N G S H U</p>

          <h1 className="text-white text-[clamp(24px,4.5vw,32px)] font-light leading-tight tracking-tight">
            Your symptoms are speaking.
          </h1>

          <p className="text-white/40 text-sm font-light mt-4 leading-relaxed max-w-sm mx-auto">
            Most people treat the symptom.
            <br />
            Few understand the system behind it.
          </p>
        </div>

        {/* Input zone */}
        <div className={`transition-all duration-700 delay-200 mt-10 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && input.trim()) { e.preventDefault(); submit(); }
            }}
            rows={2}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white/90 text-sm outline-none resize-none placeholder:text-white/12 transition-all duration-500 focus:border-[#C4A862]/30 focus:bg-white/[0.06]"
            placeholder={PLACEHOLDERS[phIdx]}
          />

          {/* 轮播提示 - 不可点击 */}
          {!input && (
            <p className="text-white/15 text-sm mt-3 h-5 transition-opacity duration-500 font-light italic tracking-wide">
              &ldquo;{PLACEHOLDERS[(phIdx + 1) % PLACEHOLDERS.length]}&rdquo;
            </p>
          )}

          {/* 空状态时显示次级提示 */}
          {input && input.length < 10 && (
            <p className="text-white/15 text-xs mt-3 transition-opacity duration-500 font-light">
              Tell me more...
            </p>
          )}

          {/* CTA */}
          <div className={`transition-all duration-500 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className={`transition-all duration-300 ${charCount > 0 ? 'mt-6' : 'mt-5'}`}>
              <button
                onClick={submit}
                disabled={!input.trim()}
                className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  input.trim()
                    ? 'bg-[#C4A862] text-[#0B0B0B] hover:opacity-90 active:scale-[0.97]'
                    : 'bg-white/5 text-white/12 cursor-not-allowed'
                }`}
              >
                {input.trim().length > 20 ? 'Reveal My Pattern' : 'Understand My System'}
              </button>
            </div>
          </div>

          {/* Trust anchor */}
          <p className="text-white/12 text-xs mt-5 leading-relaxed font-light max-w-xs mx-auto">
            Based on Traditional Chinese Medicine, Five Elements Theory, and Behavioral Pattern Analysis.
          </p>
        </div>

      </div>
    </main>
  );
}
