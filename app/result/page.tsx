'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/core/session';
import { buildCognitiveState } from '@/lib/v4/cognitiveEngine';
import { generateLayeredReport } from '@/lib/v4/reportGenerator';
import { createProfile, updateProfile, describeTrend } from '@/lib/v4/profileEngine';
import { saveSession } from '@/lib/core/session';
import { detectConflict, getConflictNarrative } from '@/lib/v4/conflictEngine';

export default function ResultPage() {
 const router = useRouter();
 const [report, setReport] = useState<any>(null);
 const [profile, setProfile] = useState<any>(null);
 const [conflict, setConflict] = useState<any>(null);
 const [loaded, setLoaded] = useState(false);

 useEffect(() => {
 const session = getSession();
 if (session) {
 const cognitive = buildCognitiveState(session.answers);
 const layeredReport = generateLayeredReport(cognitive);
 const conflictSignal = detectConflict(cognitive);

 // 创建/更新用户画像（存储到 session 扩展）
 const existingProfile = session.profile ? session.profile : null;
 let newProfile;
 if (existingProfile) {
 newProfile = updateProfile(existingProfile, cognitive);
 } else {
 newProfile = createProfile('user_' + Date.now(), cognitive);
 }

 // 保存画像回 session
 saveSession({
 ...session,
 profile: newProfile,
 });

 setReport(layeredReport);
 setProfile(newProfile);
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

 if (!report) {
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
 {/* 分数 */}
 <p className="text-[72px] font-light text-gold leading-none tracking-tight">
 {report.score}
 </p>
 <p className="text-meta text-white/20 mt-1">System Load Index</p>

 {/* 趋势（如果有历史） */}
 {profile && profile.history.length > 1 && (
 <p className="text-meta text-white/15 mt-2">
 {describeTrend(profile.evolutionTrend)}
 </p>
 )}

 {/* Primary Layer */}
 <div className="mt-8 border border-gold/20 rounded-xl p-6 bg-gold/5">
 <p className="text-meta text-white/30 uppercase tracking-widest">Primary Layer</p>
 <p className="text-title font-light text-[#C4A862] mt-1">
 {report.primary.label}
 </p>
 <p className="text-body text-white/40 mt-2 leading-relaxed">
 {report.primary.description}
 </p>
 </div>

 {/* Secondary Layer */}
 <div className="mt-4 border border-white/5 rounded-xl p-5">
 <p className="text-meta text-white/30 uppercase tracking-widest">Secondary Layer</p>
 {report.secondary.map((item: any, i: number) => (
 <p key={i} className="text-body text-white/60 mt-1">
 {item.value}
 </p>
 ))}
 </div>

 {/* Tertiary Layer */}
 <div className="mt-4 border border-white/5 rounded-xl p-5">
 <p className="text-meta text-white/30 uppercase tracking-widest">Root Analysis</p>
 {report.tertiary.map((item: any, i: number) => (
 <p key={i} className="text-body text-white/40 mt-1">
 {item.label}: {item.value}
 </p>
 ))}
 </div>

 {/* Conflict Layer（V4.1 新增） */}
 {conflict && conflict.intensity > 0 && (
 <div className="mt-4 border border-white/10 rounded-xl p-5 bg-white/[0.02]">
 <p className="text-meta text-white/20 uppercase tracking-widest">Signal Confidence</p>
 <p className="text-body text-white/30 mt-2 leading-relaxed">
 {getConflictNarrative(conflict)}
 </p>
 {conflict.uncertainty > 50 && (
 <p className="text-meta text-white/15 mt-2 italic">
 — Uncertainty: {conflict.uncertainty}%
 </p>
 )}
 </div>
 )}

 {/* Conflict */}
 <div className="mt-6 border border-gold/20 rounded-xl p-6 bg-gold/5">
 <p className="text-body text-white/70 italic leading-relaxed">
 &ldquo;{report.conflict}&rdquo;
 </p>
 </div>

 {/* Trust Anchor */}
 <p className="text-meta text-white/15 mt-6 max-w-sm mx-auto leading-relaxed">
 {report.trustAnchor}
 </p>

 {/* CTA */}
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
