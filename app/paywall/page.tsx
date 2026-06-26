'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/core/session';

export default function PaywallPage() {
 const router = useRouter();
 const [unlocked, setUnlocked] = useState(false);
 const [score, setScore] = useState<number>(65);

 useEffect(() => {
 const session = getSession();
 if (session) {
 setScore(session.score);
 }
 }, []);

 if (unlocked) {
 return (
 <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
 <div className="max-w-xl w-full space-y-4 animate-fade-up">
 <h2 className="text-title font-light text-gold text-center">System Breakdown</h2>

 <div className="border border-white/5 rounded-xl p-5 space-y-3 bg-white/5">
 <div className="flex justify-between text-body text-white/60">
 <span>System Load</span>
 <span className="text-gold">{score}/100</span>
 </div>
 <div className="flex justify-between text-body text-white/60">
 <span>Recovery Protocol</span>
 <span className="text-white/40">72-hour reset</span>
 </div>
 <div className="flex justify-between text-body text-white/60">
 <span>Primary Imbalance</span>
 <span className="text-white/40">Fire overactive · Water depleted</span>
 </div>
 </div>

 <div className="border border-gold/20 rounded-xl p-5 bg-gold/5">
 <p className="text-body text-white/70">Recommended</p>
 <p className="text-body text-white/40 mt-1">Sleep reset · Liver regulation · Information load reduction</p>
 </div>

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
