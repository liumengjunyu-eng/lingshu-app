'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SHARE_SENTENCES = [
 "I didn't realize I was compensating until I saw the system map.",
 'My system is running on borrowed recovery.',
 'The diagnosis: high output, low restoration.',
 "I thought I was fine. My system disagreed.",
 'Recovery debt is real. I just checked mine.',
];

export default function SharePage() {
 const router = useRouter();
 const [state, setState] = useState<{ score: number; label: string } | null>(null);
 const [sentence, setSentence] = useState('');

 useEffect(() => {
 const raw = localStorage.getItem('diagnosis_data');
 if (raw) {
 const parsed = JSON.parse(raw);
 setState({
 score: parsed.score || 65,
 label: parsed.score > 70 ? 'Compensated Collapse State' : 'Delayed Stabilization Pattern',
 });
 }
 setSentence(SHARE_SENTENCES[Math.floor(Math.random() * SHARE_SENTENCES.length)]);
 }, []);

 if (!state) {
 return (
 <main className="min-h-screen bg-bg flex items-center justify-center px-6">
 <div className="text-white/20 text-meta">Loading...</div>
 </main>
 );
 }

 const shareText = `${state.label} — Load Index: ${state.score}\n\n"${sentence}"\n\nFind your system state → linglife.vercel.app`;

 return (
 <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
 <div className="max-w-xl w-full border border-white/10 rounded-2xl p-8 animate-fade-up">
 <p className="text-meta text-white/20 tracking-widest uppercase">System Type</p>
 <p className="text-title font-light text-gold mt-1">{state.label}</p>
 <p className="text-meta text-white/20 mt-2">Load Index: {state.score}</p>

 <div className="mt-6 pt-6 border-t border-white/5">
 <p className="text-body text-white/40 italic leading-relaxed">
 "{sentence}"
 </p>
 </div>
 </div>

 <div className="mt-8 flex flex-col gap-3 w-full max-w-xl">
 <button
 onClick={() => {
 navigator.clipboard.writeText(shareText);
 alert('Copied to clipboard!');
 }}
 className="w-full py-3 bg-white/5 border border-white/10 text-white/60 rounded-full hover:border-gold/30 hover:text-white/90 transition text-body"
 >
 Copy Identity
 </button>

 <button
 onClick={() => router.push('/')}
 className="w-full py-3 text-white/20 text-meta hover:text-white/40 transition"
 >
 Back to Home
 </button>
 </div>
 </main>
 );
}
