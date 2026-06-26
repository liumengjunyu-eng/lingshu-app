'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { V2Output } from '@/lib/symbol/v2/types';
import { runV3Engine } from '@/lib/symbol/v3';
import type { ContentStudioPayload } from '@/lib/symbol/v3';

const WellnessRadar = dynamic(() => import('@/components/WellnessRadar'), { ssr: false });

type Step = 'score' | 'label' | 'evidence';

export default function Result() {
  const [data, setData] = useState<V2Output | null>(null);
  const [v3, setV3] = useState<ContentStudioPayload | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [step, setStep] = useState<Step>('score');

  useEffect(() => {
    const stored = localStorage.getItem('v2_result');
    if (stored) {
      try {
        const parsed: V2Output = JSON.parse(stored);
        setData(parsed);
        const engines = runV3Engine(parsed);
        setV3(engines.studio);
      } catch {
        // ignore parse errors
      }
    }
    setLoading(false);
  }, []);

  // Auto-reveal: new step every 400ms
  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      if (step === 'score') setStep('label');
      else if (step === 'label') setStep('evidence');
    }, 400);
    return () => clearTimeout(timer);
  }, [step, data]);

  const handleUnlock = () => setUnlocked(true);

  const handleShare = () => {
    if (!data || !v3) return;
    navigator.share?.({
      title: 'My System Report',
      text: `${v3.hook}\n\n${v3.identity}\n${v3.metric}\n\n${v3.share_link}`,
      url: window.location.href,
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#C4A862] animate-pulse text-sm">Loading report...</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white/40 text-sm">No report found. Please take the assessment first.</p>
          <Link href="/diagnose" className="mt-4 inline-block text-[#C4A862]">
            Go to Assessment →
          </Link>
        </div>
      </main>
    );
  }

  const d = data;

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">

        {/* STEP 1: SCORE */}
        <div className={`transition-all duration-700 ${step === 'score' ? 'opacity-100' : 'opacity-30'}`}>
          <div className="text-center">
            <h1 className="text-2xl font-light">System Load Index</h1>
            <p className="text-[#C4A862] text-7xl font-light mt-2 transition-all duration-1000">
              {d.user_profile.intensity_score}
            </p>
          </div>
        </div>

        {/* STEP 2: LABEL */}
        <div className={`transition-all duration-700 mt-6 ${step !== 'score' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step !== 'score' ? '100ms' : '0ms' }}>
          <div className="border border-[#C4A862]/30 rounded-xl p-6 bg-[#C4A862]/5 text-center">
            <p className="text-xs text-white/30 tracking-widest uppercase">System State</p>
            <p className="text-xl text-[#C4A862] font-light mt-1">
              ⚠ {d.interpretation.label}
            </p>
            <p className="text-sm text-white/40 mt-2 max-w-sm mx-auto">
              {d.interpretation.insight}
            </p>
          </div>
        </div>

        {/* STEP 3: EVIDENCE */}
        <div className={`transition-all duration-700 mt-6 ${step === 'evidence' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step === 'evidence' ? '100ms' : '0ms' }}>
          <div className="p-6 border border-white/10 rounded-xl">
            <p className="text-xs text-white/30 uppercase mb-3">Evidence</p>
            <p className="text-sm text-white/50 mb-3 italic">This is not random.</p>
            <ul className="space-y-2">
              {d.interpretation.evidence.map((e, i) => (
                <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                  <span className="text-[#C4A862] mt-0.5">•</span>
                  {e}
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/20 mt-4">
              Confidence: {Math.round(d.confidence * 100)}%
            </p>
          </div>

          {/* Body/Emotion summary */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 border border-white/10 rounded-xl">
              <p className="text-xs text-white/30 uppercase">Body</p>
              <p className="text-sm mt-1 text-white/70">
                {d.signals.body > 60 ? 'Normal' : d.signals.body > 40 ? 'Tired' : 'Depleted'}
              </p>
              <p className="text-xs text-white/40 mt-0.5">Signal: {d.signals.body}</p>
            </div>
            <div className="p-4 border border-white/10 rounded-xl">
              <p className="text-xs text-white/30 uppercase">Emotion</p>
              <p className="text-sm mt-1 text-white/70">
                {d.signals.emotion > 60 ? 'Stable' : d.signals.emotion > 40 ? 'Fragile' : 'Volatile'}
              </p>
              <p className="text-xs text-white/40 mt-0.5">Signal: {d.signals.emotion}</p>
            </div>
          </div>
        </div>

        {/* SIX DIMENSION WELLNESS (free layer) */}
        <div className={`transition-all duration-700 mt-8 ${step === 'evidence' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step === 'evidence' ? '200ms' : '0ms' }}>
          <div className="text-center mb-4">
            <p className="text-xs text-white/30 tracking-widest uppercase">Element Map</p>
            <p className="text-xs text-white/20 mt-1">Click any element to see your wellness plan</p>
          </div>
          <WellnessRadar
            wood={d.five_elements.wood}
            fire={d.five_elements.fire}
            earth={d.five_elements.earth}
            metal={d.five_elements.metal}
            water={d.five_elements.water}
          />
        </div>

        {/* 7-DAY FORECAST (free layer) */}
        <div className={`transition-all duration-700 mt-6 ${step === 'evidence' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step === 'evidence' ? '300ms' : '0ms' }}>
          <div className="p-4 border border-white/10 rounded-xl bg-white/5">
            <p className="text-xs text-white/30 uppercase">Risk Signal</p>
            <p className="text-sm text-white/60 mt-1 font-light">{d.forecast['7_days']}</p>
          </div>
        </div>

        {/* PAYWALL */}
        <div className={`transition-all duration-700 mt-10 border-t border-white/10 pt-8 ${step === 'evidence' ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: step === 'evidence' ? '400ms' : '0ms' }}>
          {!unlocked ? (
            <div className="text-center">
              <p className="text-sm text-white/50 font-light leading-relaxed">
                {d.monetization.paywall_reason}
              </p>
              <div className="mt-4 p-4 border border-dashed border-white/10 rounded-xl">
                <p className="text-xs text-white/30 uppercase mb-2">What You Get Free</p>
                <p className="text-sm text-white/50">{d.monetization.what_free_shows}</p>
                <div className="w-8 h-px bg-white/10 mx-auto my-3" />
                <p className="text-xs text-[#C4A862] uppercase">Behind Paywall</p>
                <p className="text-sm text-white/60 mt-1">{d.monetization.what_paid_adds}</p>
              </div>
              <button
                onClick={handleUnlock}
                className="mt-6 px-8 py-3 bg-[#C4A862] text-[#1A1A1A] rounded-full font-medium hover:opacity-90 transition"
              >
                See Why This Is Happening →
              </button>
            </div>
          ) : (
            /* UNLOCKED SECTION */
            <div className="space-y-6">

              {/* The Real Story */}
              <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5 text-center">
                <p className="text-xs text-white/30 uppercase">The Real Story</p>
                <p className="text-sm text-white/70 mt-2 italic">
                  Your system is compensating, not failing.
                  <br />
                  This pattern is stable — until it is not.
                </p>
              </div>

              {/* Decision: Actions */}
              {d.decision.actions.length > 0 && (
                <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5">
                  <p className="text-xs text-white/30 uppercase">What You Should Do</p>
                  <ul className="mt-2 space-y-1 text-sm text-white/70">
                    {d.decision.actions.map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Decision: Warnings */}
              {d.decision.warnings.length > 0 && (
                <div className="p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                  <p className="text-xs text-red-400 uppercase">Warnings</p>
                  <ul className="mt-2 space-y-1 text-sm text-red-300">
                    {d.decision.warnings.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Decision: Prohibitions */}
              {d.decision.prohibitions.length > 0 && (
                <div className="p-4 border border-white/10 rounded-xl">
                  <p className="text-xs text-white/30 uppercase">Avoid</p>
                  <ul className="mt-2 space-y-1 text-sm text-white/50">
                    {d.decision.prohibitions.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recovery Protocol */}
              <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5">
                <p className="text-xs text-white/30 uppercase">Recovery Protocol</p>
                <p className="text-sm text-white/70 mt-1">{d.decision.recoveryProtocol}</p>
              </div>

              {/* Recovery Pathway */}
              <div className="space-y-4">
                <p className="text-xs text-white/30 uppercase tracking-widest">Your Recovery Pathway</p>
                {(['phase_1', 'phase_2', 'phase_3'] as const).map((phase) => {
                  const p = d.recovery_pathway[phase];
                  return (
                    <div key={phase} className="p-4 border border-white/10 rounded-xl">
                      <p className="text-xs text-white/30 uppercase">{p.label}</p>
                      <p className="text-sm text-white/70 mt-1">{p.action}</p>
                      {p.product && (
                        <p className="text-xs text-[#C4A862] mt-1">→ {p.product.name}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* V3 Content Studio — Your System Story */}
              {v3 && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-xs text-white/30 uppercase tracking-widest text-center mb-4">
                    Your System Story
                  </p>

                  <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5 text-center">
                    <p className="text-xs text-white/30 uppercase tracking-widest">Your Identity</p>
                    <p className="text-lg text-[#C4A862] font-light mt-2">{v3.identity}</p>
                    <div className="w-8 h-px bg-[#C4A862]/20 mx-auto my-3" />
                    <p className="text-sm text-white/60 italic">&ldquo;{v3.hook}&rdquo;</p>
                    <p className="text-xs text-white/30 mt-3">{v3.metric}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${v3.hook}\n\n${v3.body}\n\n${v3.share_link}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="w-full py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition"
                    >
                      {copied ? '✓ Copied!' : '📋 Copy Story'}
                    </button>
                    <button
                      onClick={() => {
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${v3.hook}\n\n${v3.identity}\n${v3.metric}\n\n${v3.share_link}`)}`;
                        window.open(twitterUrl, '_blank');
                      }}
                      className="w-full py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition"
                    >
                      🐦 Share on Twitter
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-full py-3 bg-[#C4A862] text-black rounded-xl text-sm font-medium hover:opacity-90 transition"
                    >
                      📤 Share My Pattern
                    </button>
                  </div>

                  <p className="text-xs text-white/10 text-center mt-4">
                    {v3.share_link}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
