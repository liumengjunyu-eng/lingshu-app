'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, saveSession } from '@/lib/core/session';
import { buildCognitiveState, calculateLoadIndex } from '@/lib/v4/cognitiveEngine';
import { generateLayeredReport } from '@/lib/v4/reportGenerator';
import { detectConflict, getConflictNarrative } from '@/lib/v4/conflictEngine';

const LOAD_MESSAGES = [
  'Listening to your system...',
  'Translating patterns...',
  'Mapping your energy...',
  'Reading the signals...',
  'Finding the source...',
];

// Persona styles for visual differentiation
const PERSONA_STYLES: Record<string, { 
  icon: string; 
  gradient: string; 
  accent: string;
  hook: string;
}> = {
  'Cognitive Overload': { 
    icon: '🌀', 
    gradient: 'from-[#1A1525] to-[#0A0A0A]', 
    accent: '#A084C8',
    hook: "Your mind has been running in the background for so long, you forgot it could be quiet.",
  },
  'Emotional Compression': { 
    icon: '🌊', 
    gradient: 'from-[#1A1520] to-[#0A0A0A]', 
    accent: '#C8A084',
    hook: "You carry things deep. Not because you are weak — but because you learned to absorb.",
  },
  'Physical Depletion': { 
    icon: '🔥', 
    gradient: 'from-[#1A1510] to-[#0A0A0A]', 
    accent: '#C8A060',
    hook: "Your body has been sending signals. You just learned to turn down the volume.",
  },
  'Compensated System': { 
    icon: '🌓', 
    gradient: 'from-[#151A15] to-[#0A0A0A]', 
    accent: '#88A088',
    hook: "You are functional. But functional is not the same as whole.",
  },
  'Balanced System': { 
    icon: '◈', 
    gradient: 'from-[#1A1A1A] to-[#0A0A0A]', 
    accent: '#5A8A6A',
    hook: "You have found a rhythm. Not perfect — but sustainable.",
  },
};

export default function ResultPage() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [revealStep, setRevealStep] = useState(0); // 0=loading, 1=hook, 2=system, 3=pattern, 4=score, 5=cta

  const session = getSession();

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setLoadMsgIdx((prev) => (prev + 1) % LOAD_MESSAGES.length);
    }, 800);

    const timer = setTimeout(() => {
      const s = getSession();
      if (!s) { 
        setLoaded(true); 
        setRevealStep(1);
        return; 
      }

      // Build report from session
      let cognitive;
      if (s.v5State) {
        // V5.1 has extracted state
        cognitive = s.v5State;
      } else {
        // Fallback to V4 engine
        cognitive = buildCognitiveState(s.answers);
      }
      
      const layeredReport = generateLayeredReport(cognitive);
      const conflictSignal = detectConflict(cognitive);
      
      setReport({ 
        ...layeredReport, 
        conflict: conflictSignal,
        cognitive,
      });

      setLoaded(true);
      clearInterval(msgInterval);
      
      // Staggered reveal sequence
      setTimeout(() => setRevealStep(1), 100);   // Hook
      setTimeout(() => setRevealStep(2), 1200);  // System view
      setTimeout(() => setRevealStep(3), 2400);  // Pattern
      setTimeout(() => setRevealStep(4), 3600);  // Score
      setTimeout(() => setRevealStep(5), 4800);  // CTA
      
    }, 2000);

    return () => { clearTimeout(timer); clearInterval(msgInterval); };
  }, []);

  // ============ LOADING ============
  if (!loaded || revealStep === 0) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
          <div className="w-full h-full border border-[#C4A862]/5 rounded-full animate-ping-slow" />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border border-[#C4A862]/20 flex items-center justify-center mb-4">
            <span className="text-[#C4A862] text-sm animate-spin-slow">◈</span>
          </div>
          <p className="text-[#6A6A6A] text-sm font-light">{LOAD_MESSAGES[loadMsgIdx]}</p>
        </div>
        
        <style jsx>{`
          @keyframes ping-slow {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.4); opacity: 0; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-ping-slow { animation: ping-slow 3s ease-out infinite; }
          .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        `}</style>
      </main>
    );
  }

  // ============ NO DATA ============
  if (!report) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border border-[#4A4A4A]/30 flex items-center justify-center mb-4">
            <span className="text-[#4A4A4A] text-lg">—</span>
          </div>
          <p className="text-[#6A6A6A] text-sm font-light">No data found.</p>
          <button onClick={() => router.push('/')} className="mt-4 text-[#C4A862] text-sm hover:underline font-light">
            Start over →
          </button>
        </div>
      </main>
    );
  }

  const personaKey = Object.keys(PERSONA_STYLES).find(k => report.primary.label.includes(k)) || 'Compensated System';
  const persona = PERSONA_STYLES[personaKey];
  const name = session?.input || 'You';

  return (
    <main className={`min-h-screen bg-gradient-to-b ${persona.gradient}`}>
      <div className="max-w-xl mx-auto px-5 py-12 pb-24">

        {/* ============ STEP 1: EMOTIONAL HOOK ============ */}
        <div className={`text-center mb-8 transition-all duration-700 ${revealStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white/12 text-[10px] tracking-[0.25em] mb-6 font-light">L I N G S H U</p>
          
          <p className="text-white/60 text-base leading-relaxed italic font-light max-w-sm mx-auto">
            "{persona.hook}"
          </p>
        </div>

        {/* ============ STEP 2: SYSTEM VIEW ============ */}
        <div className={`text-center mb-8 transition-all duration-700 delay-200 ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">{persona.icon}</span>
            <span className="text-[#C4A862] text-xs tracking-[0.2em] font-light">SYSTEM ANALYSIS</span>
          </div>
          
          <h1 className="font-serif text-[clamp(28px,5vw,42px)] font-light leading-[1.1] text-[#F5F5F5]">
            {report.primary.label}
          </h1>
          
          <p className="text-white/40 text-sm font-light mt-4 leading-relaxed max-w-sm mx-auto">
            {report.primary.description}
          </p>
        </div>

        {/* ============ STEP 3: ROOT PATTERN ============ */}
        <div className={`border border-[#C4A862]/10 rounded-xl p-5 mb-8 bg-[#C4A862]/3 transition-all duration-700 ${revealStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[#4A4A4A] text-xs tracking-[0.2em] uppercase mb-2">Root Pattern</p>
          <p className="text-[#C4A862] text-sm leading-relaxed">
            {report.tertiary?.find((t: any) => t.label === 'Root Cause')?.value || 
             'Your system is carrying more than it can restore.'}
          </p>
          
          {/* How it shows up */}
          <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
            <p className="text-[#4A4A4A] text-xs tracking-[0.2em] uppercase mb-3">How it shows up</p>
            <div className="space-y-2">
              {report.secondary.slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#C4A862] text-xs mt-0.5">—</span>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ STEP 4: SYSTEM LOAD (DATA) ============ */}
        <div className={`flex justify-center mb-8 transition-all duration-700 ${revealStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="58" fill="none" stroke="#1A1A1A" strokeWidth="2" />
              <circle cx="64" cy="64" r="58" fill="none" stroke={persona.accent} strokeWidth="2"
                strokeDasharray={`${(report.score / 100) * 364.4} 364.4`} strokeLinecap="round"
                className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[36px] font-light leading-none tracking-tight" style={{ color: persona.accent }}>
                {report.score}
              </span>
              <span className="text-[8px] text-[#4A4A4A] tracking-widest mt-0.5">LOAD INDEX</span>
            </div>
          </div>
        </div>

        {/* ============ STEP 5: CTA / PAYWALL ============ */}
        <div className={`mt-8 text-center transition-all duration-700 ${revealStep >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Conflict note */}
          {report.conflict && report.conflict.uncertainty > 30 && (
            <div className="border border-[#1A1A1A] rounded-xl p-3 mb-4 bg-[#121212]">
              <p className="text-[#6A6A6A] text-xs italic leading-relaxed">
                {getConflictNarrative(report.conflict)}
              </p>
            </div>
          )}

          {/* Trust anchor */}
          <p className="text-[#4A4A4A] text-xs mb-6 font-light">
            Not a diagnostic tool. A self-reflection framework.
          </p>

          {/* Primary CTA */}
          <button
            onClick={() => setShowPaywall(true)}
            className="w-full py-3 border border-[#C4A862]/30 text-[#C4A862] rounded-full hover:bg-[#C4A862] hover:text-[#0A0A0A] transition text-sm tracking-wide"
          >
            I found the source. Would you like to see it? →
          </button>

          {/* Secondary actions */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => router.push('/share')}
              className="text-[#4A4A4A] text-xs hover:text-[#6A6A6A] transition"
            >
              Share this →
            </button>
            <span className="text-[#1A1A1A]">|</span>
            <button
              onClick={() => router.push('/diagnose')}
              className="text-[#4A4A4A] text-xs hover:text-[#6A6A6A] transition"
            >
              Retake
            </button>
          </div>
        </div>
      </div>

      {/* ============ PAYWALL MODAL ============ */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
          onClick={() => { setShowPaywall(false); setWaitlistStatus('idle'); }}>
          <div className="bg-[#121212] rounded-t-2xl p-7 max-w-xl w-full border-t border-[#C4A862]/20"
            onClick={(e) => e.stopPropagation()}>

            {waitlistStatus === 'done' ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-3">📩</p>
                <p className="text-base font-medium text-[#F5F5F5] mb-1">You're on the list</p>
                <p className="text-sm text-[#6A6A6A] mb-6">We'll notify you when deep analysis launches.</p>
                <button onClick={() => { setShowPaywall(false); setWaitlistStatus('idle'); }}
                  className="w-full py-3 border border-[#C4A862]/30 text-[#C4A862] rounded-full text-sm font-medium hover:bg-[#C4A862] hover:text-[#0A0A0A] transition">
                  Got it
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-5">
                  <p className="text-3xl mb-3">◈</p>
                  <p className="text-lg font-medium text-[#F5F5F5] mb-1">The Source</p>
                  <p className="text-sm text-[#6A6A6A] leading-relaxed">
                    Beneath everything you described, there is one pattern.
                    <br />
                    I found it.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] rounded-xl p-4 mb-4 border border-[#1A1A1A]">
                  <div className="flex items-center gap-2 text-sm text-[#B0B0B0] mb-1">
                    <span className="text-[#5A8A6A]">✓</span> Personalized recovery protocol
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B0B0B0] mb-1">
                    <span className="text-[#5A8A6A]">✓</span> Daily energy predictions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B0B0B0] mb-1">
                    <span className="text-[#5A8A6A]">✓</span> Progress tracking dashboard
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B0B0B0]">
                    <span className="text-[#5A8A6A]">✓</span> 7-day guided recovery
                  </div>
                </div>

                <input type="email" placeholder="your@email.com" value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] text-sm text-[#F5F5F5] outline-none focus:border-[#C4A862]/30 mb-3 box-border placeholder:text-[#4A4A4A]" />

                <button onClick={async () => {
                  if (!waitlistEmail.includes('@')) return;
                  setWaitlistStatus('loading');
                  try {
                    await fetch('/api/waitlist', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: waitlistEmail }),
                    });
                  } catch { /* silent */ }
                  setWaitlistStatus('done');
                }} disabled={waitlistStatus === 'loading'}
                  className="w-full py-3 bg-[#C4A862] text-[#0A0A0A] rounded-full text-sm font-medium disabled:opacity-50 hover:bg-[#B38A3D] transition">
                  {waitlistStatus === 'loading' ? 'Submitting...' : 'Join Waitlist'}
                </button>

                <button onClick={() => setShowPaywall(false)}
                  className="w-full py-2 text-[#4A4A4A] text-xs mt-2 hover:text-[#6A6A6A] transition">
                  Maybe later
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
