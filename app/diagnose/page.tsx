'use client';

import { useState } from 'react';
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

export default function DiagnosePage() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const initialInput = searchParams.get('input') || '';
 const [step, setStep] = useState(0);
 const [answers, setAnswers] = useState<number[]>([]);
 const [texts, setTexts] = useState<string[]>([]);

 const current = STEPS[step];

 const selectOption = (text: string) => {
 const score = SCORE_MAP[text] ?? 50;
 const newAnswers = [...answers, score];
 const newTexts = [...texts, text];
 setAnswers(newAnswers);
 setTexts(newTexts);

 if (step < STEPS.length - 1) {
 setTimeout(() => setStep(step + 1), 250);
 } else {
 const avg = newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length;
 saveSession({
 input: initialInput,
 answers: newAnswers,
 texts: newTexts,
 score: Math.round(avg),
 timestamp: Date.now(),
 });
 router.push('/result');
 }
 };

 return (
 <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
 <div className="max-w-xl w-full">
 {/* 进度条 */}
 <div className="flex gap-1 mb-6 justify-center">
 {STEPS.map((_, i) => (
 <div
 key={i}
 className={`h-1 w-8 rounded-full transition-all ${
 i <= step ? 'bg-gold' : 'bg-white/10'
 }`}
 />
 ))}
 </div>

 <p className="text-meta text-white/20 text-center mb-2">
 {step + 1} / {STEPS.length}
 </p>

 <h2 className="text-title font-light text-white text-center leading-relaxed">
 {current.question}
 </h2>

 <div className="mt-6 space-y-2">
 {current.options.map((opt) => (
 <button
 key={opt}
 onClick={() => selectOption(opt)}
 className="w-full p-4 text-body text-white/60 border border-white/5 rounded-xl hover:border-gold/30 hover:text-white/90 transition text-left"
 >
 {opt}
 </button>
 ))}
 </div>
 </div>
 </main>
 );
}
