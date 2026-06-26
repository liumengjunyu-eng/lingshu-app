'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { runSymbolEngineV2 } from '@/lib/symbol/v2/engine';
import type { SymptomInput } from '@/lib/symbol/v2/types';

const QUESTIONS = [
  {
    id: 'body',
    label: 'Your body at the end of a workday…',
    options: [
      { value: 80, text: 'Feels like I could run a few more rounds' },
      { value: 50, text: 'Heavy but functional' },
      { value: 20, text: "I don't feel it — I just hear it complain" },
    ],
  },
  {
    id: 'sleep',
    label: 'When you close your eyes, what happens?',
    options: [
      { value: 80, text: "I'm out within minutes" },
      { value: 50, text: "I lie there for a while, but it's fine" },
      { value: 20, text: "My brain doesn't stop. I'm still working in my dreams." },
    ],
  },
  {
    id: 'stress',
    label: 'How do you handle unexpected pressure?',
    options: [
      { value: 80, text: 'I adapt quickly' },
      { value: 50, text: 'I get tense but manage' },
      { value: 20, text: 'I freeze internally while looking fine outside' },
    ],
  },
  {
    id: 'emotion',
    label: 'After a difficult conversation, you:',
    options: [
      { value: 80, text: 'Shake it off in 10 minutes' },
      { value: 50, text: 'Carry it for a few hours' },
      { value: 20, text: "Replay it in your head for the rest of the day" },
    ],
  },
  {
    id: 'focus',
    label: 'Your typical focus window is:',
    options: [
      { value: 80, text: 'I can lock in for hours' },
      { value: 50, text: '45 minutes, then I need a break' },
      { value: 20, text: "I'm context-switching all day" },
    ],
  },
];

export default function Diagnose() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const handleSelect = (value: number) => {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    if (isLast) {
      // 映射 answer → SymptomInput
      const input: SymptomInput = {
        sleepQuality: newAnswers.sleep ?? 50,
        energyLevel: newAnswers.body ?? 50,
        stressLevel: 100 - (newAnswers.stress ?? 50),
        moodStability: newAnswers.emotion ?? 50,
        focusLevel: newAnswers.focus ?? 50,
      };
      const result = runSymbolEngineV2(input);
      localStorage.setItem('v2_result', JSON.stringify(result));
      router.push(`/result?v=2`);
    } else {
      setStep(step + 1);
    }
  };

  const progress = ((step + 1) / QUESTIONS.length) * 100;
  const section = step < 2 ? 'Body' : step < 4 ? 'Mind' : 'System';

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        {/* 分段指示器 */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#C4A862] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-white/30 min-w-[4rem] text-right">{section}</span>
        </div>

        {/* 问题 */}
        <div key={current.id}>
          <p className="text-sm text-white/40 mb-2">{step + 1}/{QUESTIONS.length}</p>
          <h2 className="text-xl font-light leading-snug">{current.label}</h2>

          <div className="mt-6 space-y-3">
            {current.options.map((opt) => (
              <button
                key={opt.text}
                onClick={() => handleSelect(opt.value)}
                className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 
                  hover:border-[#C4A862]/40 hover:bg-[#C4A862]/5 transition text-sm text-white/70"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
