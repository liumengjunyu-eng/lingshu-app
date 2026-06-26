'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSession } from '@/lib/core/session';

const STEPS = [
  {
    id: 'body',
    question: 'Your body after a workday feels like:',
    options: ['Still capable', 'Tired but manageable', 'Disconnected from physical signals'],
  },
  {
    id: 'energy',
    question: 'Your energy level right now is:',
    options: ['Stable', 'Draining', 'Completely depleted'],
  },
  {
    id: 'stress',
    question: 'Your current stress mode is:',
    options: ['Situational', 'Constant', 'Numb to it'],
  },
  {
    id: 'recovery',
    question: 'Your sleep recovery is:',
    options: ['Solid', 'Interrupted', 'Almost never restores'],
  },
  {
    id: 'focus',
    question: 'Your focus mode is:',
    options: ['Sharp', 'Scattered', 'Almost impossible'],
  },
];

const SCORE_MAP: Record<string, number> = {
  'Still capable': 30,
  'Tired but manageable': 65,
  'Disconnected from physical signals': 85,
  'Stable': 25,
  'Draining': 60,
  'Completely depleted': 90,
  'Situational': 30,
  'Constant': 65,
  'Numb to it': 80,
  'Solid': 20,
  'Interrupted': 55,
  'Almost never restores': 85,
  'Sharp': 20,
  'Scattered': 60,
  'Almost impossible': 85,
};

const ZODIAC_SIGNS = [
  'Capricorn', 'Aquarius', 'Pisces', 'Aries',
  'Taurus', 'Gemini', 'Cancer', 'Leo',
  'Virgo', 'Libra', 'Scorpio', 'Sagittarius',
];

const BLOOD_TYPES = ['A', 'B', 'O', 'AB'];

const YEARS = Array.from({ length: 90 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);

type ScreenType = 'intro' | 'question' | 'personal' | 'complete';

export default function DiagnosePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialInput = searchParams.get('input') || '';

  const [screen, setScreen] = useState<ScreenType>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [texts, setTexts] = useState<string[]>([]);

  // personal info
  const [birthYear, setBirthYear] = useState<number>(1990);
  const [birthMonth, setBirthMonth] = useState<number>(1);
  const [birthDay, setBirthDay] = useState<number>(1);
  const [birthHour, setBirthHour] = useState<number>(12);
  const [bloodType, setBloodType] = useState<string>('');

  // visual feedback
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [progressDirection, setProgressDirection] = useState<'forward' | 'backward'>('forward');

  const current = STEPS[step];

  const selectOption = useCallback((text: string, idx: number) => {
    const score = SCORE_MAP[text] ?? 50;
    const newAnswers = [...answers, score];
    const newTexts = [...texts, text];

    setSelectedIdx(idx);
    setAnswers(newAnswers);
    setTexts(newTexts);

    setTimeout(() => {
      setSelectedIdx(null);
      if (step < STEPS.length - 1) {
        setProgressDirection('forward');
        setStep(step + 1);
      } else {
        setScreen('personal');
      }
    }, 300);
  }, [answers, texts, step]);

  const submitPersonalInfo = useCallback(() => {
    const avg = answers.reduce((a, b) => a + b, 0) / answers.length;
    saveSession({
      input: initialInput,
      answers,
      texts,
      score: Math.round(avg),
      timestamp: Date.now(),
      birthInfo: {
        year: birthYear,
        month: birthMonth,
        day: birthDay,
        hour: birthHour,
      },
      birthType: bloodType || undefined,
    });
    setScreen('complete');
    setTimeout(() => router.push('/result'), 400);
  }, [answers, texts, initialInput, birthYear, birthMonth, birthDay, birthHour, bloodType, router]);

  const startDiagnose = useCallback(() => {
    setScreen('question');
  }, []);

  const getZodiac = (m: number, d: number) => {
    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 23, 22, 22];
    const index = dates.findIndex((threshold, i) => {
      if (i + 1 === m) return d < threshold;
      return false;
    });
    const adjusted = index >= 0 ? index - 1 : (m + 9) % 12;
    return ZODIAC_SIGNS[adjusted < 0 ? 0 : adjusted % 12];
  };

  // ============================================================
  // INTRO SCREEN — emotional hook before starting
  // ============================================================
  if (screen === 'intro') {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-[#D6B36A]/4 rounded-full blur-3xl animate-breath" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-[#D6B36A]/2 rounded-full blur-3xl animate-breath-delayed" />

        <div className="max-w-lg w-full text-center relative z-10">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-12 h-12 mx-auto rounded-full border border-[#D6B36A]/20 flex items-center justify-center">
              <span className="text-2xl text-[#D6B36A]">◈</span>
            </div>
          </div>

          {/* Hook */}
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-light leading-[1.1] tracking-tight text-[#F5F5F5]">
            Your system is always speaking.
          </h1>

          <p className="text-[#B0B0B0] text-lg font-light mt-4 leading-relaxed max-w-sm mx-auto">
            It shows up in how your body feels after work. In the way you reach for your phone before sleep. In the decisions that feel heavier than they should.
          </p>

          <p className="text-[#6A6A6A] text-base mt-4 leading-relaxed max-w-sm mx-auto">
            These 5 questions will reveal the hidden pattern. Then your birth chart will give us the context — the deeper architecture underneath.
          </p>

          <button
            onClick={startDiagnose}
            className="mt-10 px-12 py-4 bg-[#D6B36A] text-[#0A0A0A] rounded-full font-medium hover:bg-[#B38A3D] transition-all text-sm tracking-wide hover:scale-[1.02]"
          >
            Begin Analysis
          </button>

          <p className="text-[#4A4A4A] text-sm mt-5 font-light">
            ~2 min · Just 5 questions + your birth info
          </p>
        </div>
      </main>
    );
  }

  // ============================================================
  // PERSONAL INFO SCREEN
  // ============================================================
  if (screen === 'personal') {
    const inferredZodiac = getZodiac(birthMonth, birthDay);

    return (
      <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#D6B36A]/3 rounded-full blur-3xl animate-breath" />

        <div className="max-w-md w-full relative z-10 animate-fade-up">
          {/* Step indicator */}
          <div className="text-center mb-6">
            <p className="text-[#D6B36A] text-sm tracking-[0.2em] font-light">
              YOUR ARCHITECTURE
            </p>
            <p className="text-[#6A6A6A] text-sm mt-1 font-light">
              One more thing — your birth info adds the context layer
            </p>
          </div>

          {/* Info Card */}
          <div className="border border-[#D6B36A]/10 rounded-2xl p-6 bg-[#121212] space-y-4">
            {/* Year */}
            <div>
              <label className="text-[#B0B0B0] text-xs tracking-widest block mb-1.5">
                YEAR OF BIRTH
              </label>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#D6B36A]/40 transition"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Month + Day */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#B0B0B0] text-xs tracking-widest block mb-1.5">MONTH</label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#D6B36A]/40 transition"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#B0B0B0] text-xs tracking-widest block mb-1.5">DAY</label>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#D6B36A]/40 transition"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hour */}
            <div>
              <label className="text-[#B0B0B0] text-xs tracking-widest block mb-1.5">
                HOUR OF BIRTH <span className="text-[#4A4A4A] font-light">(approximate is fine)</span>
              </label>
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(Number(e.target.value))}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#D6B36A]/40 transition"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>

            {/* Blood Type */}
            <div>
              <label className="text-[#B0B0B0] text-xs tracking-widest block mb-1.5">
                BLOOD TYPE <span className="text-[#4A4A4A] font-light">(optional)</span>
              </label>
              <div className="flex gap-2">
                {BLOOD_TYPES.map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setBloodType(bloodType === bt ? '' : bt)}
                    className={`flex-1 p-3 rounded-xl border text-sm transition ${
                      bloodType === bt
                        ? 'border-[#D6B36A]/40 bg-[#D6B36A]/10 text-[#D6B36A]'
                        : 'border-[#2A2A2A] bg-[#1A1A1A] text-[#6A6A6A] hover:border-[#4A4A4A]'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {birthYear && birthMonth && birthDay && (
              <div className="pt-3 border-t border-[#1A1A1A]">
                <p className="text-xs text-[#4A4A4A]">
                  {inferredZodiac} · Age {new Date().getFullYear() - birthYear}{bloodType ? ` · Type ${bloodType}` : ''}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={submitPersonalInfo}
            className="mt-6 w-full py-3 bg-[#D6B36A] text-[#0A0A0A] rounded-full font-medium hover:bg-[#B38A3D] transition text-sm tracking-wide"
          >
            Reveal My System
          </button>
        </div>
      </main>
    );
  }

  // ============================================================
  // COMPLETE — brief transition
  // ============================================================
  if (screen === 'complete') {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#D6B36A]/30 flex items-center justify-center">
            <span className="text-[#D6B36A] text-sm animate-spin">◈</span>
          </div>
          <p className="text-[#6A6A6A] text-sm font-light">Reading your system...</p>
        </div>
      </main>
    );
  }

  // ============================================================
  // QUESTIONS
  // ============================================================
  const progress = ((step + 1) / STEPS.length) * 100;
  const emoji = step === 0 ? '💪' : step === 1 ? '⚡' : step === 2 ? '🌀' : step === 3 ? '🌙' : '🎯';

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D6B36A]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-1 h-0.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D6B36A] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[#4A4A4A] text-xs font-mono">{step + 1}/{STEPS.length}</span>
        </div>

        {/* Step counter */}
        <p className="text-[#D6B36A] text-sm tracking-[0.2em] font-light mb-1">
          QUESTION {step + 1}
        </p>

        {/* Emoji + Question */}
        <div className="flex items-start gap-4">
          <span className="text-2xl mt-0.5">{emoji}</span>
          <h2 className="font-serif text-[clamp(24px,4vw,32px)] font-light leading-[1.2] text-[#F5F5F5]">
            {current.question}
          </h2>
        </div>

        {/* Options */}
        <div className="mt-8 space-y-2.5">
          {current.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={opt}
                onClick={() => !isSelected && selectOption(opt, idx)}
                className={`w-full p-4 text-left text-base rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-[#D6B36A]/40 bg-[#D6B36A]/8 text-[#D6B36A] scale-[0.98]'
                    : 'border-[#1A1A1A] bg-[#121212] text-[#8A8A8A] hover:border-[#D6B36A]/20 hover:text-[#B0B0B0]'
                }`}
              >
                <span className="text-sm">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Subtle prompt */}
        <p className="text-[#4A4A4A] text-xs text-center mt-8 font-light">
          Pick the option that resonates — there are no wrong answers
        </p>
      </div>
    </main>
  );
}
