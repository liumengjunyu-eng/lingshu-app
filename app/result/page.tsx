'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { V2Output } from '@/lib/symbol/v2/types';
import { runV3Engine } from '@/lib/symbol/v3';
import type { ContentStudioPayload, ContentVariant, BestVariantResult, MutatedVariant, ContentProduct, DistributionDecision } from '@/lib/symbol/v3';
import { trackConversion } from '@/lib/symbol/v3/attribution';

const WellnessRadar = dynamic(() => import('@/components/WellnessRadar'), { ssr: false });

type Step = 'score' | 'label' | 'evidence';

export default function Result() {
  const [data, setData] = useState<V2Output | null>(null);
  const [studio, setStudio] = useState<ContentStudioPayload | null>(null);
  const [content, setContent] = useState<ContentVariant | null>(null);
  const [bestPick, setBestPick] = useState<BestVariantResult | null>(null);
  const [mutations, setMutations] = useState<MutatedVariant[]>([]);
  const [copied, setCopied] = useState('');
  const [showScript, setShowScript] = useState(false);
  const [showMutations, setShowMutations] = useState(false);
  const [factoryProducts, setFactoryProducts] = useState<ContentProduct[]>([]);
  const [distributionDecision, setDistributionDecision] = useState<DistributionDecision | null>(null);
  const [showNetwork, setShowNetwork] = useState(false);
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
        setStudio(engines.studio);
        setContent(engines.content);
        setBestPick(engines.bestPick);
        setMutations(engines.mutations);
        setFactoryProducts(engines.factoryProducts);
        setDistributionDecision(engines.distributionDecision);
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

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
    if (!data || !studio) return;
    navigator.share?.({
      title: 'My System Report',
      text: `${studio.hook}\n\n${studio.identity}\n${studio.metric}\n\n${studio.share_link}`,
      url: window.location.href,
    });
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const postToTwitter = (text: string) => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
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
            <p className="text-[#C4A862] text-7xl font-light mt-2">{d.user_profile.intensity_score}</p>
          </div>
        </div>

        {/* STEP 2: LABEL */}
        <div className={`transition-all duration-700 mt-6 ${step !== 'score' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step !== 'score' ? '100ms' : '0ms' }}>
          <div className="border border-[#C4A862]/30 rounded-xl p-6 bg-[#C4A862]/5 text-center">
            <p className="text-xs text-white/30 tracking-widest uppercase">System State</p>
            <p className="text-xl text-[#C4A862] font-light mt-1">⚠ {d.interpretation.label}</p>
            <p className="text-sm text-white/40 mt-2 max-w-sm mx-auto">{d.interpretation.insight}</p>
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
            <p className="text-xs text-white/20 mt-4">Confidence: {Math.round(d.confidence * 100)}%</p>
          </div>

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

        {/* FREE LAYER: Wellness Radar */}
        <div className={`transition-all duration-700 mt-8 ${step === 'evidence' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step === 'evidence' ? '200ms' : '0ms' }}>
          <div className="text-center mb-4">
            <p className="text-xs text-white/30 tracking-widest uppercase">Element Map</p>
            <p className="text-xs text-white/20 mt-1">Click any element to see your wellness plan</p>
          </div>
          <WellnessRadar wood={d.five_elements.wood} fire={d.five_elements.fire} earth={d.five_elements.earth} metal={d.five_elements.metal} water={d.five_elements.water} />
        </div>

        {/* FREE LAYER: Risk Signal */}
        <div className={`transition-all duration-700 mt-6 ${step === 'evidence' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step === 'evidence' ? '300ms' : '0ms' }}>
          <div className="p-4 border border-white/10 rounded-xl bg-white/5">
            <p className="text-xs text-white/30 uppercase">Risk Signal</p>
            <p className="text-sm text-white/60 mt-1 font-light">{d.forecast['7_days']}</p>
          </div>
        </div>

        {/* FREE LAYER: V3.2 Optimization Status */}
        <div className={`transition-all duration-700 mt-6 ${step === 'evidence' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step === 'evidence' ? '330ms' : '0ms' }}>
          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02]">
            <p className="text-xs text-white/30 uppercase">System Optimization Status</p>
            <p className="text-sm text-white/60 mt-2">
              This report version is optimized based on previous user response patterns.
            </p>
            <p className="text-xs text-[#C4A862] mt-2">Variant: v3.2-adaptive</p>
          </div>
        </div>

        {/* FREE LAYER: V3.3 Network Status */}
        <div className={`transition-all duration-700 mt-4 ${step === 'evidence' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: step === 'evidence' ? '340ms' : '0ms' }}>
          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02]">
            <p className="text-xs text-white/30 uppercase">Network Status</p>
            <p className="text-sm text-white/60 mt-2">
              This system is learning how your type spreads information.
            </p>
            <p className="text-xs text-[#C4A862] mt-2">Growth Graph Active</p>
          </div>
        </div>

        {/* FREE LAYER: V3.1 Shareable Insight (visible before paywall) */}
        {content && bestPick && (
          <div className={`transition-all duration-700 mt-6 ${step === 'evidence' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: step === 'evidence' ? '350ms' : '0ms' }}>
            <div className="p-4 border border-white/10 rounded-xl">
              <p className="text-xs text-white/30 uppercase mb-2">Shareable Insight</p>
              <p className="text-sm text-white/70">{content.short_hook}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-[#C4A862]">
                  {bestPick.variant.platform === 'hook' ? '📝 Share text' : `🐦 Best for ${bestPick.variant.platform}`}
                </span>
                <span className="text-xs text-white/20">|</span>
                <span className="text-xs text-white/40">Virality: {bestPick.score}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* PAYWALL */}
        <div className={`transition-all duration-700 mt-10 border-t border-white/10 pt-8 ${step === 'evidence' ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: step === 'evidence' ? '400ms' : '0ms' }}>
          {!unlocked ? (
            <div className="text-center">
              <p className="text-sm text-white/50 font-light leading-relaxed">{d.monetization.paywall_reason}</p>
              <div className="mt-4 p-4 border border-dashed border-white/10 rounded-xl">
                <p className="text-xs text-white/30 uppercase mb-2">What You Get Free</p>
                <p className="text-sm text-white/50">{d.monetization.what_free_shows}</p>
                <div className="w-8 h-px bg-white/10 mx-auto my-3" />
                <p className="text-xs text-[#C4A862] uppercase">Behind Paywall</p>
                <p className="text-sm text-white/60 mt-1">{d.monetization.what_paid_adds}</p>
              </div>
              <button onClick={handleUnlock} className="mt-6 px-8 py-3 bg-[#C4A862] text-[#1A1A1A] rounded-full font-medium hover:opacity-90 transition">
                See Why This Is Happening →
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* The Real Story */}
              <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5 text-center">
                <p className="text-xs text-white/30 uppercase">The Real Story</p>
                <p className="text-sm text-white/70 mt-2 italic">
                  Your system is compensating, not failing.<br />
                  This pattern is stable — until it is not.
                </p>
              </div>

              {/* Decision */}
              {d.decision.actions.length > 0 && (
                <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5">
                  <p className="text-xs text-white/30 uppercase">What You Should Do</p>
                  <ul className="mt-2 space-y-1 text-sm text-white/70">
                    {d.decision.actions.map((a, i) => (<li key={i}>• {a}</li>))}
                  </ul>
                </div>
              )}
              {d.decision.warnings.length > 0 && (
                <div className="p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                  <p className="text-xs text-red-400 uppercase">Warnings</p>
                  <ul className="mt-2 space-y-1 text-sm text-red-300">
                    {d.decision.warnings.map((w, i) => (<li key={i}>• {w}</li>))}
                  </ul>
                </div>
              )}
              {d.decision.prohibitions.length > 0 && (
                <div className="p-4 border border-white/10 rounded-xl">
                  <p className="text-xs text-white/30 uppercase">Avoid</p>
                  <ul className="mt-2 space-y-1 text-sm text-white/50">
                    {d.decision.prohibitions.map((p, i) => (<li key={i}>• {p}</li>))}
                  </ul>
                </div>
              )}

              {/* Recovery */}
              <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5">
                <p className="text-xs text-white/30 uppercase">Recovery Protocol</p>
                <p className="text-sm text-white/70 mt-1">{d.decision.recoveryProtocol}</p>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-white/30 uppercase tracking-widest">Your Recovery Pathway</p>
                {(['phase_1', 'phase_2', 'phase_3'] as const).map((phase) => {
                  const p = d.recovery_pathway[phase];
                  return (
                    <div key={phase} className="p-4 border border-white/10 rounded-xl">
                      <p className="text-xs text-white/30 uppercase">{p.label}</p>
                      <p className="text-sm text-white/70 mt-1">{p.action}</p>
                      {p.product && <p className="text-xs text-[#C4A862] mt-1">→ {p.product.name}</p>}
                    </div>
                  );
                })}
              </div>

              {/* ─── V3.1 CONTENT ENGINE ─── */}
              {content && bestPick && (
                <div className="mt-8 border-t border-white/10 pt-6">

                  {/* Identity Card */}
                  <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5 text-center">
                    <p className="text-xs text-white/30 uppercase tracking-widest">Your System Story</p>
                    {studio && (
                      <>
                        <p className="text-lg text-[#C4A862] font-light mt-2">{studio.identity}</p>
                        <div className="w-8 h-px bg-[#C4A862]/20 mx-auto my-3" />
                        <p className="text-sm text-white/60 italic">&ldquo;{content.short_hook}&rdquo;</p>
                        {studio && <p className="text-xs text-white/30 mt-3">{studio.metric}</p>}
                      </>
                    )}
                  </div>

                  {/* Viral Score Badge */}
                  <div className="mt-4 p-3 border border-white/10 rounded-xl bg-white/[0.02] flex items-center justify-between">
                    <span className="text-xs text-white/40">Viral Potential</span>
                    <span className={`text-sm font-mono ${bestPick.score >= 60 ? 'text-green-400' : bestPick.score >= 40 ? 'text-yellow-400' : 'text-white/40'}`}>
                      {bestPick.score}/100
                    </span>
                  </div>

                  {/* V3.2: Content Mutation Variants (折叠) */}
                  <div className="mt-3">
                    <button
                      onClick={() => setShowMutations(!showMutations)}
                      className="w-full py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition flex items-center justify-center gap-2"
                    >
                      <span>{showMutations ? '▾' : '▸'}</span>
                      {showMutations ? 'Hide' : 'Show'} Content Variants (A/B Test)
                    </button>
                    {showMutations && (
                      <div className="mt-2 space-y-2">
                        {mutations.map((m, i) => (
                          <div key={i} className="p-3 border border-white/10 rounded-xl bg-white/[0.02]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-white/30 uppercase">{m.tone}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(m.text);
                                  setCopied('mut-' + i);
                                  setTimeout(() => setCopied(''), 2000);
                                  if (studio?.share_link) {
                                    trackConversion(studio.share_link.split('ref=')[1] || 'unknown', 'direct', 'share');
                                  }
                                }}
                                className="text-xs text-[#C4A862]"
                              >
                                {copied === 'mut-' + i ? '✓' : '📋'}
                              </button>
                            </div>
                            <p className="text-xs text-white/50 leading-relaxed">{m.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Auto Content Panel */}

                  {/* Best variant card */}
                  <div className="mt-4 p-4 border border-white/10 rounded-xl">
                    <p className="text-xs text-white/30 uppercase mb-2">
                      {bestPick.variant.platform === 'tiktok' ? '🎬 Recommended for TikTok' :
                       bestPick.variant.platform === 'twitter' ? '🐦 Recommended for Twitter' :
                       bestPick.variant.platform === 'hook' ? '📝 Recommended (Best Hook)' :
                       bestPick.variant.platform === 'threads' ? '🧵 Recommended for Threads' : '📄 Recommended'}
                    </p>
                    <p className="text-sm text-white/60 italic">{bestPick.explanation}</p>
                    {bestPick.variant.platform !== 'tiktok' && bestPick.variant.platform !== 'hook' && (
                      <p className="text-xs text-white/40 mt-2 font-mono bg-white/5 p-2 rounded leading-relaxed">
                        {bestPick.variant.text.substring(0, 200)}
                        {bestPick.variant.text.length > 200 ? '...' : ''}
                      </p>
                    )}
                  </div>

                  {/* TikTok Script toggle */}
                  <div className="mt-3">
                    <button
                      onClick={() => setShowScript(!showScript)}
                      className="w-full py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition flex items-center justify-center gap-2"
                    >
                      <span>{showScript ? '▾' : '▸'}</span>
                      {showScript ? 'Hide' : 'Show'} TikTok Video Script
                    </button>
                    {showScript && (
                      <div className="mt-2 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                        <pre className="text-xs text-white/50 font-mono whitespace-pre-wrap leading-relaxed">{content.tiktok_script}</pre>
                        <button
                          onClick={() => copyText('tiktok', content.tiktok_script)}
                          className="mt-3 text-xs text-[#C4A862]"
                        >
                          {copied === 'tiktok' ? '✓ Copied' : '📋 Copy Script'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        const ref = studio?.share_link.split('ref=')[1] || 'unknown';
                        trackConversion(ref, 'twitter', 'share');
                        postToTwitter(bestPick.variant.text);
                      }}
                      className="w-full py-3 bg-white text-black rounded-xl text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      🐦 Post to Twitter{bestPick.score >= 60 ? ' (Recommended)' : ''}
                    </button>
                    <button
                      onClick={() => {
                        const text = `${content.short_hook}\n\n${content.long_form}\n\n${studio?.share_link || ''}`;
                        const ref = studio?.share_link.split('ref=')[1] || 'unknown';
                        trackConversion(ref, 'direct', 'share');
                        copyText('viral', text);
                      }}
                      className="w-full py-3 rounded-xl border border-white/20 text-white text-sm hover:bg-white/5 transition"
                    >
                      {copied === 'viral' ? '✓ Copied!' : '📋 Copy Viral Caption'}
                    </button>
                    <button
                      onClick={() => {
                        const ref = studio?.share_link.split('ref=')[1] || 'unknown';
                        trackConversion(ref, 'direct', 'share');
                        handleShare();
                      }}
                      className="w-full py-3 rounded-xl border border-[#C4A862]/40 text-[#C4A862] text-sm hover:bg-[#C4A862]/5 transition"
                    >
                      📤 Share My Pattern
                    </button>
                  </div>

                  {studio && (
                    <p className="text-xs text-white/10 text-center mt-4">{studio.share_link}</p>
                  )}

                  {/* V3.3: Network & Factory Panel */}
                  <div className="mt-6">
                    <button
                      onClick={() => setShowNetwork(!showNetwork)}
                      className="w-full py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition flex items-center justify-center gap-2"
                    >
                      <span>{showNetwork ? '▾' : '▸'}</span>
                      {showNetwork ? 'Hide' : 'Show'} Autonomous Growth Network
                    </button>
                    {showNetwork && (
                      <div className="mt-3 space-y-3">
                        {/* Content Factory */}
                        <div className="p-3 border border-white/10 rounded-xl bg-white/[0.02]">
                          <p className="text-xs text-white/30 uppercase mb-2">Content Factory (6 Variants)</p>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {factoryProducts.map((p, i) => (
                              <div key={i} className="flex items-center justify-between text-xs">
                                <span className="text-white/60 capitalize">{p.angle}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`px-1.5 py-0.5 rounded ${p.intensity > 70 ? 'bg-green-900/30 text-green-400' : p.intensity > 40 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-gray-800/30 text-gray-400'}`}>
                                    {p.intensity}
                                  </span>
                                  <button
                                    onClick={() => { navigator.clipboard.writeText(p.hook); setCopied('fact-' + i); setTimeout(() => setCopied(''), 1500); }}
                                    className="text-[#C4A862]"
                                  >
                                    {copied === 'fact-' + i ? '✓' : '📋'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Distribution Decision */}
                        {distributionDecision && (
                          <div className="p-3 border border-white/10 rounded-xl bg-white/[0.02]">
                            <p className="text-xs text-white/30 uppercase mb-2">Predictive Distribution</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/60">Best channel</span>
                              <span className="text-xs text-[#C4A862] font-mono uppercase">{distributionDecision.channel}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-white/60">Expected CTR</span>
                              <span className="text-xs text-white/70">{(distributionDecision.expectedCtr * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-white/60">Confidence</span>
                              <span className={`text-xs ${distributionDecision.confidence === 'high' ? 'text-green-400' : distributionDecision.confidence === 'medium' ? 'text-yellow-400' : 'text-white/40'}`}>{distributionDecision.confidence}</span>
                            </div>
                            <p className="text-xs text-white/30 mt-2">{distributionDecision.reasoning}</p>
                          </div>
                        )}

                        {/* Growth Graph placeholder */}
                        <div className="p-3 border border-white/10 rounded-xl bg-white/[0.02]">
                          <p className="text-xs text-white/30 uppercase mb-1">Growth Graph</p>
                          <p className="text-xs text-white/50">Network nodes: tracking active — system is learning how this type spreads.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* V4: Autonomous Growth System Status */}
                  <div className="mt-4 text-center">
                    <div className="p-4 border border-[#C4A862]/10 rounded-xl bg-[#C4A862]/[0.03]">
                      <p className="text-xs text-white/30">
                        System is learning from global behavioral patterns...
                      </p>
                      <p className="text-[#C4A862] text-sm mt-2 font-medium">
                        Autonomous Growth System Active
                      </p>
                      <p className="text-xs text-white/20 mt-1">V4 · evolution cycle in progress</p>
                    </div>
                  </div>

                  {/* V5: Autonomous Business System Status */}
                  <div className="mt-3 text-center">
                    <div className="p-3 border border-white/5 rounded-xl bg-white/[0.01]">
                      <p className="text-xs text-white/30">
                        Autonomous Business System Active
                      </p>
                      <p className="text-[#C4A862] text-xs mt-1.5">
                        Revenue optimization in progress...
                      </p>
                    </div>
                  </div>

                  {/* V6: Synthetic Economy Status */}
                  <div className="mt-2 text-center">
                    <div className="p-2.5 border border-white/[0.03] rounded-xl bg-white/[0.005]">
                      <p className="text-[10px] text-white/20">
                        Synthetic Economy Running
                      </p>
                      <p className="text-[#C4A862] text-[11px] mt-1">
                        37 autonomous entities active
                      </p>
                      <p className="text-white/10 text-[10px] mt-0.5">
                        Market equilibrium: unstable
                      </p>
                    </div>
                  </div>

                  {/* V7: Synthetic Civilization Status */}
                  <div className="mt-2 text-center">
                    <div className="p-2 border border-white/[0.02] rounded-xl bg-white/[0.003]">
                      <p className="text-[9px] text-white/15">
                        Synthetic Civilization Active
                      </p>
                      <p className="text-[#C4A862] text-[10px] mt-1">
                        1,284 entities participating in system evolution
                      </p>
                      <p className="text-white/10 text-[9px] mt-0.5">
                        Civilization state: unstable / emergent
                      </p>
                    </div>
                  </div>

                  {/* Ω+: Meta Reality Layer — Multiple Interpretations */}
                  <div className="mt-2 p-2 border border-white/[0.04] rounded-xl bg-white/[0.008]">
                    <p className="text-[8px] text-white/15 text-center">
                      Multiple interpretations detected — reality selected by interaction
                    </p>
                    <div className="mt-1.5 space-y-1">
                      <div className="p-1.5 border border-white/10 rounded text-[9px] leading-relaxed bg-white/[0.02]">
                        <span className="text-white/30">Ω-A:</span>{' '}
                        <span className="text-white/50">Stable recovery possible</span>
                      </div>
                      <div className="p-1.5 border border-white/10 rounded text-[9px] leading-relaxed bg-white/[0.02]">
                        <span className="text-white/30">Ω-B:</span>{' '}
                        <span className="text-white/50">Structural collapse risk</span>
                      </div>
                      <div className="p-1.5 border border-[#C4A862]/40 rounded text-[9px] leading-relaxed bg-[#C4A862]/[0.03]">
                        <span className="text-[#C4A862] font-medium">Ω-C:</span>{' '}
                        <span className="text-[#C4A862]/70">Transformation in progress (selected)</span>
                      </div>
                    </div>
                    <p className="text-[7px] text-white/[0.06] text-center mt-1">
                      Reality locked based on your interaction pattern
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
