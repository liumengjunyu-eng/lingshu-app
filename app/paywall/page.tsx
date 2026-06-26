'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/core/session';
import { buildCognitiveState } from '@/lib/v4/cognitiveEngine';
import { generateLayeredReport } from '@/lib/v4/reportGenerator';
import { detectConflict, getConflictNarrative } from '@/lib/v4/conflictEngine';

export default function PaywallPage() {
 const router = useRouter();
 const [unlocked, setUnlocked] = useState(false);
 const [report, setReport] = useState<any>(null);
 const [conflict, setConflict] = useState<any>(null);
 const [loaded, setLoaded] = useState(false);

 useEffect(() => {
 const session = getSession();
 if (session) {
 const cognitive = buildCognitiveState(session.answers);
 const layeredReport = generateLayeredReport(cognitive);
 const conflictSignal = detectConflict(cognitive);
 setReport(layeredReport);
 setConflict(conflictSignal);
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

 if (unlocked && report) {
 return (
 <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
 <div className="max-w-xl w-full space-y-4 animate-fade-up">
 <h2 className="text-title font-light text-gold text-center">
 How Your System Evolved Into This State
 </h2>

 {/* Root Cause */}
 <div className="border border-gold/20 rounded-xl p-6 bg-gold/5">
 <p className="text-meta text-white/30 uppercase tracking-widest">Root Cause</p>
 <p className="text-body text-white/70 mt-2 leading-relaxed">
 {report.tertiary.find((t: any) => t.label === 'Root Cause')?.value ||
 'System is in a balanced state'}
 </p>
 </div>

 {/* Imbalance Pattern */}
 <div className="border border-white/5 rounded-xl p-6 space-y-3">
 <p className="text-meta text-white/30 uppercase tracking-widest">Imbalance Pattern</p>
 {report.secondary.map((item: any, i: number) => (
 <div key={i} className="flex justify-between text-body">
 <span className="text-white/60">{item.label}</span>
 <span className="text-white/40">{item.value}</span>
 </div>
 ))}
 </div>

 {/* Element Pattern */}
 <div className="border border-white/5 rounded-xl p-6 bg-white/5">
 <p className="text-meta text-white/30 uppercase tracking-widest">Element Pattern</p>
 <p className="text-body text-white/60 mt-2">
 {report.tertiary.find((t: any) => t.label === 'Element Pattern')?.value ||
 'Balanced'}
 </p>
 </div>

 {/* Conflict Layer */}
 {conflict && conflict.uncertainty > 30 && (
 <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
 <p className="text-meta text-white/15 text-center">
 {getConflictNarrative(conflict)}
 </p>
 </div>
 )}

 <button
 onClick={() => router.push('/share')}
 className="w-full py-3 bg-gold text-bg rounded-full font-medium hover:opacity-90 transition text-body mt-4"
 >
 Share Your System State →
 </button>
 </div>
 </main>
 );
 }

 return (
 <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
 <div className="max-w-xl w-full text-center">
 <h1 className="text-hero font-light text-white leading-tight">
 What you are seeing is only the <span className="text-gold">symptom layer.</span>
 </h1>

 <p className="text-body text-white/30 mt-4 leading-relaxed">
 The real causes are hidden behind behavioral and systemic feedback loops.
 <br />
 <span className="text-white/20 text-meta mt-2 block">
 Unlock to see how your system evolved into this state.
 </span>
 </p>

 <button
 onClick={() => setUnlocked(true)}
 className="mt-10 w-full py-3 bg-gold text-bg rounded-full font-medium hover:opacity-90 transition text-body"
 >
 Reveal my system breakdown
 </button>

 <p className="text-meta text-white/15 mt-4">One-time unlock · $9.99</p>
 </div>
 </main>
 );
}
