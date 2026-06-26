'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, saveSession, clearSession } from '@/lib/core/session';
import { buildCognitiveState, calculateLoadIndex } from '@/lib/v4/cognitiveEngine';
import { generateLayeredReport } from '@/lib/v4/reportGenerator';
import { detectConflict, getConflictNarrative } from '@/lib/v4/conflictEngine';
import { generateReport, WUXING_COLORS, WUXING_NAMES } from '@/lib/bazi-engine';
import { WELLNESS_MAP } from '@/lib/wellness-data';
import { runSymbolEngine, Element } from '@/lib/engine/symbolEngine';

const LOAD_MESSAGES = [
  'Listening to your system...',
  'Translating patterns...',
  'Mapping your energy...',
  'Reading the signals...',
  'Aligning with your birth chart...',
];

const PERSONA_STYLES: Record<string, { icon: string; gradient: string; accent: string }> = {
  'Cognitive Overload': { icon: '🌀', gradient: 'from-[#1A1525] to-[#0A0A0A]', accent: '#A084C8' },
  'Emotional Compression': { icon: '🌊', gradient: 'from-[#1A1520] to-[#0A0A0A]', accent: '#C8A084' },
  'Physical Depletion': { icon: '🔥', gradient: 'from-[#1A1510] to-[#0A0A0A]', accent: '#C8A060' },
  'Compensated System': { icon: '🌓', gradient: 'from-[#151A15] to-[#0A0A0A]', accent: '#88A088' },
  'Balanced System': { icon: '◈', gradient: 'from-[#1A1A1A] to-[#0A0A0A]', accent: '#5A8A6A' },
};

const RECOVERY_SENTENCES: Record<string, string[]> = {
  'Cognitive Overload': [
    'Your mind has been running in the background for so long you forgot it could be quiet.',
    'The thoughts are not the problem. The lack of a system to process them is.',
  ],
  'Emotional Compression': [
    'You carry things deep. Not because you are weak — but because you learned to absorb.',
    'Emotions are not leaking. They are being held in a container that is almost full.',
  ],
  'Physical Depletion': [
    'Your body has been sending signals. You just learned to turn down the volume.',
    'You are not lazy. You are running on a charge that stopped filling weeks ago.',
  ],
  'Compensated System': [
    'You are functional. But functional is not the same as whole.',
    'The systems that keep you going are the same ones pulling you down.',
  ],
  'Balanced System': [
    'You have found a rhythm. Not perfect — but sustainable.',
    'Balance is not a static state. It is the ability to adjust before breaking.',
  ],
};

const ELEMENT_EMOJI: Record<string, string> = { '木': '🌳', '火': '🔥', '土': '⛰️', '金': '⚔️', '水': '💧' };
const ELEMENT_NAME: Record<string, string> = { '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water' };
const ELEMENT_CYCLE: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const BAZI_LABELS = ['Year', 'Month', 'Day', 'Hour'] as const;
const BAZI_KEYS = ['year', 'month', 'day', 'hour'] as const;

const engElMap: Record<string, Element> = { '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water' };
const elementBarNames: Record<string, string> = {
  wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water'
};
const elementBarEmoji: Record<string, string> = {
  wood: '🌳', fire: '🔥', earth: '⛰️', metal: '⚔️', water: '💧'
};

export default function ResultPage() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [baziReport, setBaziReport] = useState<any>(null);
  const [symbolOutput, setSymbolOutput] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const cardRef = useRef<HTMLDivElement>(null);
  const session = getSession();

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setLoadMsgIdx((prev) => (prev + 1) % LOAD_MESSAGES.length);
    }, 800);

    const timer = setTimeout(() => {
      const s = getSession();
      if (!s) { setLoaded(true); return; }

      // 1) V4 cognitive report (always)
      const cognitive = buildCognitiveState(s.answers);
      const layeredReport = generateLayeredReport(cognitive);
      const conflictSignal = detectConflict(cognitive);
      setReport({ ...layeredReport, conflict: conflictSignal });

      // 2) BaZi + Symbol report (if birth info present)
      if (s.birthInfo) {
        try {
          const bazi = generateReport({
            name: s.input || 'You',
            birthYear: s.birthInfo.year,
            birthMonth: s.birthInfo.month,
            birthDay: s.birthInfo.day,
            birthHour: s.birthInfo.hour,
            gender: 'male',
            bloodType: s.birthType || undefined,
          });
          setBaziReport(bazi);

          // Map diagnose answers to Symbol Engine input
          const avg = s.answers.reduce((a, b) => a + b, 0) / s.answers.length;
          const so = runSymbolEngine({
            fatigueLevel: Math.min(100, avg + 10),
            stressLevel: Math.min(100, avg + 5),
            sleepQuality: Math.max(0, 100 - s.answers[3] || 50),
            motivation: Math.max(0, 100 - avg),
            digestion: 65 - (s.answers[2] || 50) * 0.2,
            socialLoad: 50 + (s.answers[1] || 50) * 0.3,
          });
          setSymbolOutput(so);
        } catch { /* bazi failed silently */ }
      }

      setLoaded(true);
      clearInterval(msgInterval);
    }, 1800);

    return () => { clearTimeout(timer); clearInterval(msgInterval); };
  }, []);

  // ============ LOADING ============
  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
          <div className="w-full h-full border border-[#D6B36A]/5 rounded-full animate-ping-slow" />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border border-[#D6B36A]/20 flex items-center justify-center mb-4">
            <span className="text-[#D6B36A] text-sm animate-spin-slow">◈</span>
          </div>
          <p className="text-[#6A6A6A] text-sm font-light">{LOAD_MESSAGES[loadMsgIdx]}</p>
        </div>
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
          <button onClick={() => router.push('/')} className="mt-4 text-[#D6B36A] text-sm hover:underline font-light">
            Start over →
          </button>
        </div>
      </main>
    );
  }

  const personaKey = Object.keys(PERSONA_STYLES).find(k => report.primary.label.includes(k)) || 'Compensated System';
  const persona = PERSONA_STYLES[personaKey];
  const recoverySentences = RECOVERY_SENTENCES[personaKey] || RECOVERY_SENTENCES['Compensated System'];
  const recoverySentence = recoverySentences[Math.floor(Math.random() * recoverySentences.length)];
  const name = session?.input || 'You';
  const hasBazi = !!baziReport;

  // ============ FULL RESULT PAGE ============
  return (
    <main className={`min-h-screen bg-gradient-to-b ${persona.gradient}`}>
      <div className="max-w-xl mx-auto px-5 py-12 pb-24">

        {/* ============ SECTION ①: HOOK (score + persona) ============ */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">{persona.icon}</span>
            <span className="text-[#D6B36A] text-xs tracking-[0.2em] font-light">SYSTEM ANALYSIS</span>
          </div>
          <h1 className="font-serif text-[clamp(28px,5vw,42px)] font-light leading-[1.1] text-[#F5F5F5]">
            {report.primary.label}
          </h1>
        </div>

        {/* Score ring */}
        <div className="flex justify-center mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
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

        {/* Recovery sentence */}
        <div className="text-center mb-10 border-t border-b border-[#1A1A1A] py-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <p className="text-[#8A8A8A] text-base leading-relaxed italic font-light">
            &ldquo;{recoverySentence}&rdquo;
          </p>
        </div>

        {/* How it shows up */}
        <div className="space-y-3 mb-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <p className="text-[#4A4A4A] text-xs tracking-[0.2em] uppercase">How it shows up</p>
          {report.secondary.slice(0, 3).map((item: any, i: number) => (
            <div key={i} className="border border-[#1A1A1A] rounded-xl p-4 bg-[#121212]">
              <p className="text-[#B0B0B0] text-sm leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Root pattern */}
        <div className="border border-[#D6B36A]/10 rounded-xl p-5 mb-8 bg-[#D6B36A]/3 animate-fade-up" style={{ animationDelay: '400ms' }}>
          <p className="text-[#4A4A4A] text-xs tracking-[0.2em] uppercase mb-2">Root Pattern</p>
          <p className="text-[#C4A862] text-sm leading-relaxed">
            {report.tertiary?.find((t: any) => t.label === 'Root Cause')?.value || 'System is in a stable state'}
          </p>
        </div>

        {/* ============ SECTION ②: BAZI + FULL REPORT (if available) ============ */}
        {hasBazi && (
          <div className="animate-fade-up" style={{ animationDelay: '500ms' }}>

            {/* Divider */}
            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 h-px bg-[#1A1A1A]" />
              <span className="text-[#4A4A4A] text-[10px] tracking-[0.2em]">DEEPER LAYER</span>
              <div className="flex-1 h-px bg-[#1A1A1A]" />
            </div>

            {/* Dual Engine Cross-Reference */}
            {symbolOutput && (
              <div className="border border-[#D6B36A]/10 rounded-xl p-5 mb-4 bg-[#D6B36A]/3">
                <p className="text-[#6A6A6A] text-xs tracking-wide text-center mb-4">Energy Profile · Cross-Reference</p>
                <div className="flex items-center justify-center gap-5 mb-3">
                  <div className="text-center">
                    <p className="text-2xl">{elementBarEmoji[symbolOutput.element]}</p>
                    <p className="text-[10px] text-[#6A6A6A] mt-0.5">Symptom</p>
                    <p className="text-sm font-medium text-[#F5F5F5]">{elementBarNames[symbolOutput.element]}</p>
                  </div>
                  <span className="text-[#4A4A4A] text-lg">↔</span>
                  <div className="text-center">
                    <p className="text-2xl">{ELEMENT_EMOJI[baziReport.wuxing.strongest]}</p>
                    <p className="text-[10px] text-[#6A6A6A] mt-0.5">BaZi</p>
                    <p className="text-sm font-medium text-[#F5F5F5]">{ELEMENT_NAME[baziReport.wuxing.strongest]}</p>
                  </div>
                </div>
                <p className="text-[#8A8A8A] text-xs text-center leading-relaxed">
                  {symbolOutput.element === engElMap[baziReport.wuxing.strongest]
                    ? 'Your symptoms and birth chart point to the same element. This is a strong signal — your body knows what your chart predicts.'
                    : `Your symptoms show ${elementBarNames[symbolOutput.element]} (how you feel), while your BaZi shows ${ELEMENT_NAME[baziReport.wuxing.strongest]} (how you're built). The gap is where the work is.`}
                </p>
              </div>
            )}

            {/* 5 Elements Bar Chart */}
            <div className="border border-[#1A1A1A] rounded-xl p-5 mb-4 bg-[#121212]">
              <div className="text-center mb-5">
                <p className="text-[#D6B36A] text-xs tracking-[0.2em]">{name}·s BaZi Elements</p>
              </div>
              {(Object.entries(baziReport.wuxing.percentages) as [string, number][]).map(([el, pct]) => {
                const isStrong = el === baziReport.wuxing.strongest;
                const isWeak = el === baziReport.wuxing.weakest;
                return (
                  <div key={el} className="mb-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{ELEMENT_EMOJI[el]}</span>
                        <span className="text-sm text-[#F5F5F5]">{ELEMENT_NAME[el]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isStrong && <span className="text-[10px] text-[#D6B36A]">↑ Dominant</span>}
                        {isWeak && <span className="text-[10px] text-[#6A8AAA]">↓ Needs care</span>}
                        <span className="text-xs text-[#6A6A6A] font-mono">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: WUXING_COLORS[el] }} />
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 pt-4 border-t border-[#1A1A1A] text-center">
                <p className="text-[#8A8A8A] text-xs leading-relaxed">
                  Your <span style={{ color: WUXING_COLORS[baziReport.wuxing.strongest] }}>{ELEMENT_NAME[baziReport.wuxing.strongest]}</span> is dominant,
                  {' '}<span style={{ color: WUXING_COLORS[baziReport.wuxing.weakest] }}>{ELEMENT_NAME[baziReport.wuxing.weakest]}</span> needs attention.
                  Nurture through {ELEMENT_NAME[ELEMENT_CYCLE[baziReport.wuxing.weakest]]}-related practices.
                </p>
              </div>
            </div>

            {/* BaZi Four Pillars */}
            <div className="border border-[#1A1A1A] rounded-xl p-5 mb-4 bg-[#121212] text-center">
              <p className="text-[#D6B36A] text-xs tracking-[0.2em] mb-4">BaZi · Four Pillars</p>
              <div className="flex gap-2">
                {BAZI_KEYS.map((key, i) => (
                  <div key={key} className="flex-1 bg-[#0A0A0A] rounded-lg p-2.5 border border-[#1A1A1A]">
                    <p className="text-[10px] text-[#6A6A6A] mb-1">{BAZI_LABELS[i]}</p>
                    <p className="text-lg font-bold text-[#F5F5F5]">{baziReport.bazi[key]}</p>
                    <p className="text-[10px] text-[#D6B36A]/60 mt-0.5">{baziReport.shishen[key]}</p>
                  </div>
                ))}
              </div>
              <p className="text-[#6A6A6A] text-[10px] mt-3">{baziReport.zodiac} · {baziReport.lunarDate}</p>
            </div>

            {/* Insights */}
            <div className="mb-4 space-y-2">
              <p className="text-[#D6B36A] text-xs tracking-[0.2em] text-center mb-3">Energy Interpretation</p>
              {(baziReport.humanInsights || baziReport.insights || []).slice(0, 3).map((text: string, i: number) => (
                <div key={i} className="border border-[#1A1A1A] rounded-xl p-4 bg-[#121212] border-l-[3px]"
                  style={{ borderLeftColor: i === 0 ? WUXING_COLORS[baziReport.wuxing.strongest] : i === 1 ? WUXING_COLORS[baziReport.wuxing.weakest] : '#C4A862' }}>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* Blood Type */}
            {baziReport.bloodTypeData && (
              <div className="border border-[#1A1A1A] rounded-xl p-5 mb-4 bg-[#121212]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🧬</span>
                  <p className="text-sm font-medium text-[#F5F5F5]">Type {baziReport.bloodTypeData.bloodType}</p>
                  <span className="text-[#6A6A6A] text-xs">· {ELEMENT_NAME[baziReport.bloodTypeData.fiveElement] || baziReport.bloodTypeData.fiveElement}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {baziReport.bloodTypeData.traits.map((t: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 text-[11px] bg-[#D6B36A]/10 text-[#D6B36A] rounded-full">{t}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-[#0A0A0A] rounded-lg p-2.5 border border-[#1A1A1A]">
                    <p className="text-[10px] text-[#5A8A6A] font-medium mb-0.5">Strengths</p>
                    <p className="text-xs text-[#B0B0B0]">{baziReport.bloodTypeData.strength}</p>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-lg p-2.5 border border-[#1A1A1A]">
                    <p className="text-[10px] text-[#C46A5A] font-medium mb-0.5">Watch For</p>
                    <p className="text-xs text-[#B0B0B0]">{baziReport.bloodTypeData.weakness}</p>
                  </div>
                </div>
                {baziReport.bloodTypeData.combinedAdvice && (
                  <div className="bg-[#D6B36A]/5 rounded-lg p-3 border-l-[2px] border-[#D6B36A]">
                    <p className="text-xs text-[#C4A862] leading-relaxed">{baziReport.bloodTypeData.combinedAdvice}</p>
                  </div>
                )}
              </div>
            )}

            {/* Symbol Engine Recommendations */}
            {symbolOutput && (
              <div className="mb-4">
                <p className="text-[#D6B36A] text-xs tracking-[0.2em] text-center mb-3">Personalized Recommendations</p>
                <p className="text-center text-[#8A8A8A] text-sm mb-3 font-light">For {elementBarNames[symbolOutput.element]} type</p>
                {[
                  { icon: '🥗', label: 'Food', value: symbolOutput.recommendations.food.slice(0, 3).join(', ') },
                  { icon: '🎨', label: 'Colors', value: symbolOutput.recommendations.colors.join(', ') },
                  { icon: '🏠', label: 'Environment', value: symbolOutput.recommendations.environment.slice(0, 2).join(', ') },
                  { icon: '🏃', label: 'Movement', value: symbolOutput.recommendations.movement.slice(0, 2).join(', ') },
                  { icon: '🌙', label: 'Daily Rhythm', value: symbolOutput.recommendations.dailyRoutine.slice(0, 2).join(', ') },
                  { icon: '🧘', label: 'Practice', value: symbolOutput.recommendations.spiritualPractice.slice(0, 2).join(', ') },
                ].map((item) => (
                  <div key={item.label} className="border border-[#1A1A1A] rounded-xl p-3 mb-1.5 bg-[#121212]">
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-[10px] text-[#6A6A6A] tracking-wide mb-0.5">{item.label}</p>
                        <p className="text-xs text-[#B0B0B0] leading-relaxed">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6D Wellness Plan */}
            {(() => {
              const w = WELLNESS_MAP[baziReport.wuxing.weakest];
              if (!w) return null;
              return (
                <div className="mb-4">
                  <p className="text-[#D6B36A] text-xs tracking-[0.2em] text-center mb-3">6-D Wellness Plan</p>
                  <p className="text-center text-[#8A8A8A] text-sm mb-3 font-light">For {ELEMENT_NAME[baziReport.wuxing.weakest]} Enhancement</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: '🎨', label: 'Color', value: w.color.split(',')[0] },
                      { icon: '🧭', label: 'Direction', value: w.direction },
                      { icon: '🥗', label: 'Diet', value: w.food.split(',')[0] },
                      { icon: '🏃', label: 'Exercise', value: w.exercise.split(',')[0] },
                      { icon: '💆', label: 'Acupoint', value: w.acupoint.split(',')[0] },
                      { icon: '😴', label: 'Rest', value: w.sleep },
                    ].map((item) => (
                      <div key={item.label} className="border border-[#1A1A1A] rounded-xl p-3 text-center bg-[#121212]">
                        <div className="text-lg mb-1">{item.icon}</div>
                        <p className="text-[10px] text-[#6A6A6A] tracking-wide mb-0.5">{item.label}</p>
                        <p className="text-xs text-[#B0B0B0] leading-relaxed font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border border-[#D6B36A]/10 rounded-xl p-4 mt-2 bg-[#D6B36A]/3">
                    <p className="text-[10px] text-[#D6B36A] font-medium mb-1.5">📜 Classical Wisdom</p>
                    <p className="text-xs text-[#8A8A8A] italic leading-relaxed">{w.classic.split('.')[0]}.</p>
                    <p className="text-xs text-[#B0B0B0] mt-2 leading-relaxed">{w.emotion}</p>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* ============ SECTION ③: CTA ============ */}
        <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: '600ms' }}>
          {/* Conflict / uncertainty note */}
          {report.conflict && report.conflict.uncertainty > 30 && (
            <div className="border border-[#1A1A1A] rounded-xl p-3 mb-4 bg-[#121212]">
              <p className="text-[#6A6A6A] text-xs italic leading-relaxed">
                {getConflictNarrative(report.conflict)}
              </p>
            </div>
          )}

          {/* Trust */}
          <p className="text-[#4A4A4A] text-xs mb-6 font-light">
            Not a diagnostic tool. A self-reflection framework.
          </p>

          {hasBazi ? (
            <button
              onClick={() => setShowPaywall(true)}
              className="w-full py-3 border border-[#D6B36A]/30 text-[#D6B36A] rounded-full hover:bg-[#D6B36A] hover:text-[#0A0A0A] transition text-sm tracking-wide"
            >
              Unlock Complete Daily Guidance →
            </button>
          ) : (
            <button
              onClick={() => router.push('/diagnose')}
              className="w-full py-3 border border-[#D6B36A]/30 text-[#D6B36A] rounded-full hover:bg-[#D6B36A] hover:text-[#0A0A0A] transition text-sm tracking-wide"
            >
              Add Your Birth Info for Deeper Analysis →
            </button>
          )}

          {/* Conflict */}
          {report.conflict && report.conflict.intensity > 80 && (
            <div className="border border-[#1A1A1A] rounded-xl p-3 mt-4 bg-[#121212]">
              <p className="text-[#6A6A6A] text-xs italic leading-relaxed">
                {getConflictNarrative(report.conflict)}
              </p>
            </div>
          )}<div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => router.push('/share')}
              className="text-[#4A4A4A] text-xs hover:text-[#6A6A6A] transition"
            >
              Share this →
            </button>
            <span className="text-[#1A1A1A]">|</span>
            <button
              onClick={() => { clearSession(); router.push('/diagnose'); }}
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
          <div className="bg-[#121212] rounded-t-2xl p-7 max-w-xl w-full border-t border-[#D6B36A]/20"
            onClick={(e) => e.stopPropagation()}>

            {waitlistStatus === 'done' ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-3">📩</p>
                <p className="text-base font-medium text-[#F5F5F5] mb-1">You·re on the list</p>
                <p className="text-sm text-[#6A6A6A] mb-6">We·ll notify you when deep analysis launches.</p>
                <button onClick={() => { setShowPaywall(false); setWaitlistStatus('idle'); }}
                  className="w-full py-3 border border-[#D6B36A]/30 text-[#D6B36A] rounded-full text-sm font-medium hover:bg-[#D6B36A] hover:text-[#0A0A0A] transition">
                  Got it
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-5">
                  <p className="text-3xl mb-3">🔓</p>
                  <p className="text-lg font-medium text-[#F5F5F5] mb-1">You·ve seen 60%</p>
                  <p className="text-sm text-[#6A6A6A] leading-relaxed">
                    Daily energy tips, tracking history, and personalized routines are coming soon.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] rounded-xl p-4 mb-4 border border-[#1A1A1A]">
                  <div className="flex items-center gap-2 text-sm text-[#B0B0B0] mb-1">
                    <span className="text-[#5A8A6A]">✓</span> Daily energy predictions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B0B0B0] mb-1">
                    <span className="text-[#5A8A6A]">✓</span> Progress tracking dashboard
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B0B0B0] mb-1">
                    <span className="text-[#5A8A6A]">✓</span> Personalized daily routines
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B0B0B0]">
                    <span className="text-[#5A8A6A]">✓</span> 7-day recovery plan
                  </div>
                </div>

                <input type="email" placeholder="your@email.com" value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] text-sm text-[#F5F5F5] outline-none focus:border-[#D6B36A]/30 mb-3 box-border placeholder:text-[#4A4A4A]" />

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
                  className="w-full py-3 bg-[#D6B36A] text-[#0A0A0A] rounded-full text-sm font-medium disabled:opacity-50 hover:bg-[#B38A3D] transition">
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

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-up { animation: fade-up 0.6s ease-out forwards; opacity: 0; }
        .animate-ping-slow { animation: ping-slow 3s ease-out infinite; }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
      `}</style>
    </main>
  );
}
