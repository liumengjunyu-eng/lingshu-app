'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/core/session';
import { buildCognitiveState } from '@/lib/v4/cognitiveEngine';
import { generateShareReport } from '@/lib/v4/reportGenerator';

export default function SharePage() {
 const router = useRouter();
 const [state, setState] = useState<{ label: string; score: number; sentence: string; fullReport: string } | null>(
 null
 );
 const [loaded, setLoaded] = useState(false);

 useEffect(() => {
 const session = getSession();
 if (session) {
 const cognitive = buildCognitiveState(session.answers);
 const report = generateShareReport(cognitive);
 setState(report);
 }
 setLoaded(true);
 }, []);

 if (!loaded) {
 return (
 <main className="min-h-screen bg-bg flex items-center justify-center">
 <div className="text-white/20 text-meta">Loading...</div>
 </main>
 );
 }

 if (!state) {
 return (
 <main className="min-h-screen bg-bg flex items-center justify-center px-6">
 <div className="text-center">
 <p className="text-white/40 text-body">No data found.</p>
 <button
 onClick={() => router.push('/')}
 className="mt-4 text-gold text-meta hover:underline"
 >
 Start over →
 </button>
 </div>
 </main>
 );
 }

 return (
 <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
 {/* 身份卡片 */}
 <div className="max-w-xl w-full border border-white/10 rounded-2xl p-8 animate-fade-up">
 <p className="text-meta text-white/20 tracking-widest uppercase">System Report</p>
 <p className="text-title font-light text-gold mt-2">{state.label}</p>
 <p className="text-meta text-white/20 mt-1">Load Index: {state.score}</p>

 <div className="mt-6 pt-6 border-t border-white/5">
 <p className="text-body text-white/40 italic leading-relaxed">
 &rdquo;{state.sentence}&ldquo;
 </p>
 </div>

 <div className="mt-4 pt-4 border-t border-white/5">
 <p className="text-meta text-white/15">linglife.vercel.app</p>
 </div>
 </div>

 {/* 按钮组 */}
 <div className="mt-8 flex flex-col gap-3 w-full max-w-xl">
 <button
 onClick={() => {
 navigator.clipboard.writeText(state.fullReport);
 alert('Copied to clipboard!');
 }}
 className="w-full py-3 bg-white/5 border border-white/10 text-white/60 rounded-full hover:border-gold/30 hover:text-white/90 transition text-body"
 >
 Copy System Report
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
