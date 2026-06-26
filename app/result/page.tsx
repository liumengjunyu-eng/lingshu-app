'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/core/session';

export default function ResultPage() {
 const router = useRouter();
 const [data, setData] = useState<{ score: number; label: string; description: string } | null>(null);
 const [loaded, setLoaded] = useState(false);

 useEffect(() => {
 const session = getSession();
 if (session) {
 const score = session.score;
 setData({
 score,
 label: score > 70 ? 'Compensated Collapse State' : 'Delayed Stabilization Pattern',
 description: score > 70
 ? 'You are still functioning. But the system is no longer self-sustaining.'
 : 'Your system is recovering, but at a slower rate than your output.',
 });
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

 if (!data) {
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
 <div className="max-w-xl w-full text-center animate-fade-up">
 <p className="text-[72px] font-light text-gold leading-none tracking-tight">
 {data.score}
 </p>
 <p className="text-meta text-white/20 mt-1">System Load Index</p>

 <div className="mt-10 border border-gold/20 rounded-xl p-8 bg-gold/5">
 <p className="text-title font-light text-gold">{data.label}</p>
 <p className="text-body text-white/40 mt-3 leading-relaxed">
 {data.description}
 </p>
 </div>

 {/* ⭐ 信任锚点（新增） */}
 <p className="text-meta text-white/15 mt-4 max-w-sm mx-auto leading-relaxed">
 This is not a personality test. It is a system pattern recognition model.
 </p>

 <button
 onClick={() => router.push('/paywall')}
 className="mt-8 w-full py-3 border border-gold/30 text-gold rounded-full hover:bg-gold hover:text-bg transition text-body"
 >
 What lies beneath →
 </button>

 <p className="text-meta text-white/15 mt-4">Free diagnosis · 2 min</p>
 </div>
 </main>
 );
}
