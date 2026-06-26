'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PLACEHOLDERS = [
  "I feel tired all the time...",
  "I can't switch off my mind...",
  "My body is resting but not recovering...",
  "Something feels off but I don't know why...",
];

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [phIdx, setPhIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only run animations after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPhIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const submit = () => {
    if (!input.trim()) return;
    router.push(`/diagnose?input=${encodeURIComponent(input.trim())}`);
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C4A862]/5 blur-[150px] pointer-events-none" />

      <div className="relative w-full max-w-lg text-center">

        {/* Main Hook */}
        <h1 
          className={`text-white text-[clamp(28px,5vw,40px)] font-light leading-[1.2] tracking-tight transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          You have been carrying
          <br />
          <span className="text-[#C4A862]">more than people realize.</span>
        </h1>

        {/* Sub hook */}
        <p 
          className={`text-white/40 text-base font-light mt-6 leading-relaxed transition-all duration-700 delay-150 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Tell me what has been weighing on you lately.
        </p>

        {/* Input */}
        <div 
          className={`mt-10 transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                e.preventDefault();
                submit();
              }
            }}
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-white/90 text-sm outline-none resize-none placeholder:text-white/20 transition-all duration-300 focus:border-[#C4A862]/40 focus:bg-white/[0.05]"
            placeholder={PLACEHOLDERS[phIdx]}
          />

          {/* CTA */}
          <button
            onClick={submit}
            disabled={!input.trim()}
            className={`w-full mt-4 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
              input.trim()
                ? 'bg-[#C4A862] text-[#0B0B0B] hover:opacity-90'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            {input.trim() ? 'Continue' : 'Start here'}
          </button>
        </div>

        {/* Trust indicators */}
        <div 
          className={`mt-8 transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-white/20 text-xs font-light">
            2 minutes · No registration · Private
          </p>
        </div>

        {/* Why people come here */}
        <div 
          className={`mt-16 pt-8 border-t border-white/[0.06] transition-all duration-700 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-4">
            People usually come here because
          </p>
          <div className="space-y-2">
            {[
              "They feel exhausted all the time",
              "Their mind never stops",
              "They feel stuck but don't know why",
              "They are carrying more than they can restore",
            ].map((item, i) => (
              <p key={i} className="text-white/40 text-sm font-light">
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* What this is */}
        <div 
          className={`mt-12 transition-all duration-700 delay-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-white/25 text-xs leading-relaxed max-w-sm mx-auto">
            Not a personality test. Not a horoscope.
            <br />
            A system diagnosis of what your body, mind and emotions
            <br />
            have been trying to tell you.
          </p>
        </div>

      </div>
    </main>
  );
}
