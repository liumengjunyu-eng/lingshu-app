'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/track';

const QUESTIONS = [
 'How often do you feel rested after a full night\'s sleep?',
 'How often do you feel mentally drained by midday?',
 'How often do you feel irritable or short-tempered?',
 'How often do you feel disconnected from yourself?',
 'How often do you feel like you are just surviving?',
];

const OPTIONS = [
 { label: 'Almost never', value: 5 },
 { label: 'Rarely', value: 4 },
 { label: 'Sometimes', value: 3 },
 { label: 'Often', value: 2 },
 { label: 'Almost always', value: 1 },
];

export default function TestPage() {
 const router = useRouter();
 const [step, setStep] = useState(0);
 const [answers, setAnswers] = useState<number[]>([]);

 const handleAnswer = (value: number) => {
 const next = [...answers, value];
 setAnswers(next);

 if (step < QUESTIONS.length - 1) {
 setStep(step + 1);
 return;
 }

 // 完成测试
 const total = next.reduce((a, b) => a + b, 0);
 const score = Math.round((total / 25) * 100);

 // 4种人格类型
 let type = 'depleted';
 if (score <= 25) type = 'debt';
 else if (score <= 50) type = 'depleted';
 else if (score <= 75) type = 'drifting';
 else type = 'restored';

 track('test_complete', { score, type, answers: JSON.stringify(next) });
 router.push(`/result?score=${score}&type=${type}`);
 };

 return (
 <main className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center px-6 py-12">
 <div className="max-w-md w-full">
 {/* 进度 */}
 <div className="flex gap-1.5 mb-8">
 {QUESTIONS.map((_, i) => (
 <div
 key={i}
 className={`h-1 flex-1 rounded-full transition ${
 i <= step ? 'bg-[#4A7C49]' : 'bg-[#EAE5DE]'
 }`}
 />
 ))}
 </div>

 {/* 题目计数 */}
 <div className="text-xs text-[#8A8A8A] mb-2">
 {step + 1} / {QUESTIONS.length}
 </div>

 {/* 题目 */}
 <h2 className="text-xl font-semibold text-[#1A1A1A] mb-8 leading-relaxed">
 {QUESTIONS[step]}
 </h2>

 {/* 选项 */}
 <div className="space-y-3">
 {OPTIONS.map((opt) => (
 <button
 key={opt.value}
 onClick={() => handleAnswer(opt.value)}
 className="w-full py-3.5 px-5 rounded-xl bg-white border border-[#EAE5DE] text-left text-[#1A1A1A] font-medium hover:border-[#4A7C49] hover:bg-[#F0F7EF] transition"
 >
 {opt.label}
 </button>
 ))}
 </div>
 </div>
 </main>
 );
}
