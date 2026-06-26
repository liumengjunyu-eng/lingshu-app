'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/core/session';
import { buildCognitiveState } from '@/lib/v4/cognitiveEngine';
import { generateLayeredReport } from '@/lib/v4/reportGenerator';
import { createProfile, updateProfile, describeTrend } from '@/lib/v4/profileEngine';
import { saveSession } from '@/lib/core/session';
import { detectConflict, getConflictNarrative } from '@/lib/v4/conflictEngine';

const LOAD_MESSAGES = [
  'Listening to your system...',
  'Translating patterns...',
  'Mapping your energy...',
  'Reading the signals...',
];

const getLoadLevel = (score: number) => {
  if (score < 35) return { label: 'Low Load', desc: 'Your system is operating within recovery capacity.', color: '#5A8A6A' };
  if (score < 55) return { label: 'Moderate Load', desc: 'Some systems are showing strain. Recovery is working but not optimal.', color: '#8A9A5A' };
  if (score < 75) return { label: 'High Load', desc: 'Your system is compensating. Recovery gaps are accumulating.', color: '#C4A862' };
  return { label: 'Critical Load', desc: 'All systems are over capacity. Recovery intervention is needed.', color: '#C46A5A' };
};

const PERSONA_STYLES: Record<string, { icon: string; background: string; accent: string }> = {
  'Cognitive Overload': { icon: '🌀', background: 'from-[#1A1525] to-[#0A0A0A]', accent: '#A084C8' },
  'Emotional Compression': { icon: '🌊', background: 'from-[#1A1520] to-[#0A0A0A]', accent: '#C8A084' },
  'Physical Depletion': { icon: '🔥', background: 'from-[#1A1510] to-[#0A0A0A]', accent: '#C8A060' },
  'Compensated System': { icon: '🌓', background: 'from-[#151A15] to-[#0A0A0A]', accent: '#88A088' },
  'Balanced System': { icon: '◈', background: 'from-[#1A1A1A] to-[#0A0A0A]', accent: '#5A8A6A' },
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

export default function ResultPage() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [conflict, setConflict] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadMsgIdx((prev) => (prev + 1) % LOAD_MESSAGES.length);
    }, 800);
    const timer = setTimeout(() => {
      const session = getSession();
      if (session) {
        const cognitive = buildCognitiveState(session.answers);
        const layeredReport = generateLayeredReport(cognitive);
        const conflictSignal = detectConflict(cognitive);

        const existingProfile = session.profile ? session.profile : null;
        let newProfile;
        if (existingProfile) {
          newProfile = updateProfile(existingProfile, cognitive);
        } else {
          newProfile = createProfile('user_' + Date.now(), cognitive);
        }

        saveSession({ ...session, profile: newProfile });

        setReport(layeredReport);
        setProfile(newProfile);
        setConflict(conflictSignal);
      }
      setLoaded(true);
      clearInterval(interval);
    }, 1600);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#D6B36A]/5 rounded-full">
          <div className="w-full h-full border border-[#D6B36A]/10 rounded-full animate-ping-slow" />
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

  if (!report) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border border-[#4A4A4A]/30 flex items-center justify-center mb-4">
            <span className="text-[#4A4A4A] text-lg">—</span>
          </div>
          <p className="text-[#6A6A6A] text-body font-light">No data found.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-[#D6B36A] text-sm hover:underline font-light"
          >
            Start over →
          </button>
        </div>
      </main>
    );
  }

  const loadLevel = getLoadLevel(report.score);
  const personaKey = Object.keys(PERSONA_STYLES).find(k => report.primary.label.includes(k)) || 'Compensated System';
  const persona = PERSONA_STYLES[personaKey] || PERSONA_STYLES['Compensated System'];
  const recoverySentences = RECOVERY_SENTENCES[personaKey] || RECOVERY_SENTENCES['Compensated System'];
  const recoverySentence = recoverySentences[Math.floor(Math.random() * recoverySentences.length)];
  const hasBirthInfo = getSession()?.birthInfo;

  return (
    <main className={`min-h-screen bg-gradient-to-b ${persona.background} flex flex-col items-center px-6 py-16`}>
      <div className="max-w-xl w-full animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">{persona.icon}</span>
            <span className="text-[#D6B36A] text-xs tracking-[0.2em] font-light">SYSTEM ANALYSIS</span>
          </div>
          <h1 className="font-serif text-[clamp(28px,5vw,42px)] font-light leading-[1.1] text-[#F5F5F5] tracking-tight">
            {report.primary.label}
          </h1>
        </div>

        {/* Score ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="58" fill="none" stroke="#1A1A1A" strokeWidth="2" />
              <circle
                cx="64" cy="64" r="58"
                fill="none"
                stroke={persona.accent}
                strokeWidth="2"
                strokeDasharray={`${(report.score / 100) * 364.4} 364.4`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[40px] font-light leading-none tracking-tight" style={{ color: persona.accent }}>
                {report.score}
              </span>
              <span className="text-[9px] text-[#4A4A4A] tracking-widest mt-1">LOAD INDEX</span>
            </div>
          </div>
        </div>

        {/* Load level */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium" style={{ color: loadLevel.color }}>{loadLevel.label}</p>
          <p className="text-[#6A6A6A] text-sm font-light mt-1 leading-relaxed">{loadLevel.desc}</p>
        </div>

        {/* Recovery sentence */}
        <div className="border-t border-b border-[#1A1A1A] py-6 my-6">
          <p className="text-[#8A8A8A] text-base leading-relaxed text-center italic font-light">
            &ldquo;{recoverySentence}&rdquo;
          </p>
        </div>

        {/* How it manifests */}
        <div className="space-y-4">
          <p className="text-[#4A4A4A] text-xs tracking-[0.2em] uppercase">How it shows up</p>
          {report.secondary.slice(0, 3).map((item: any, i: number) => (
            <div key={i} className="border border-[#1A1A1A] rounded-xl p-4 bg-[#121212]">
              <p className="text-[#B0B0B0] text-sm leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Root */}
        <div className="border border-[#D6B36A]/10 rounded-xl p-5 mt-6 bg-[#D6B36A]/3">
          <p className="text-[#4A4A4A] text-xs tracking-[0.2em] uppercase mb-2">Root Pattern</p>
          <p className="text-[#C4A862] text-sm leading-relaxed">
            {report.tertiary.find((t: any) => t.label === 'Root Cause')?.value || 'System is in a stable state'}
          </p>
        </div>

        {/* Conflict / uncertainty */}
        {conflict && conflict.intensity > 0 && conflict.uncertainty > 30 && (
          <div className="mt-4 border border-[#1A1A1A] rounded-xl p-4 bg-[#121212]">
            <p className="text-[#6A6A6A] text-xs italic leading-relaxed">
              {getConflictNarrative(conflict)}
            </p>
          </div>
        )}

        {/* Trust footer */}
        <p className="text-[#4A4A4A] text-xs text-center mt-8 font-light">
          Not a diagnostic tool. A self-reflection framework.
        </p>

        {/* Deep report CTA */}
        <button
          onClick={() => router.push('/paywall')}
          className="mt-6 w-full py-3 border border-[#D6B36A]/30 text-[#D6B36A] rounded-full hover:bg-[#D6B36A] hover:text-[#0A0A0A] transition text-sm tracking-wide"
        >
          {hasBirthInfo ? 'What Your Birth Chart Reveals →' : 'Complete Your Birth Profile →'}
        </button>

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
    </main>
  );
}
