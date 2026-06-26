'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
 const router = useRouter();
 const [loaded, setLoaded] = useState(false);

 useEffect(() => {
 setLoaded(true);
 }, []);

 return (
 <main className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

 {/* 背景呼吸光 */}
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-[280px] h-[280px] rounded-full bg-[#D6B36A]/10 blur-3xl animate-pulse-slow" />
 </div>

 {/* HERO */}
 <div className="max-w-xl w-full text-center relative z-10">

 {/* 呼吸圆 */}
 <div className="w-16 h-16 mx-auto mb-10 rounded-full border border-[#D6B36A]/20 animate-breath" />

 {/* 主标题 */}
 <h1 className="text-[32px] md:text-[42px] leading-tight font-light tracking-tight text-white">
 Your system is always speaking.
 </h1>

 {/* 副标题 */}
 <p className="mt-4 text-white/60 text-[15px] leading-relaxed">
 We help you listen.
 </p>

 {/* CTA */}
 <button
 onClick={() => router.push('/diagnose')}
 className="mt-10 w-full py-3 rounded-full bg-[#D6B36A] text-black font-medium hover:opacity-90 transition"
 >
 Start Free Check
 </button>

 <p className="text-[12px] text-white/30 mt-3">
 Free · 2 minutes
 </p>

 {/* 分隔 */}
 <div className="mt-12 border-t border-white/5 pt-10 space-y-6">

 {/* What we analyze */}
 <div>
 <h2 className="text-[14px] text-white/50 mb-3 tracking-wide">
 What we analyze
 </h2>

 <p className="text-[14px] text-white/70 leading-relaxed">
 Body recovery · Mental load · Emotional pressure
 </p>

 <p className="text-[12px] text-white/30 mt-2">
 Not personality. Not fortune telling. System patterns.
 </p>
 </div>

 {/* difference */}
 <div>
 <h2 className="text-[14px] text-white/50 mb-3 tracking-wide">
 Why this feels different
 </h2>

 <div className="grid grid-cols-3 gap-2 text-[12px] text-white/60">
 <div className="border border-white/5 rounded-lg p-3">
 Labels you
 </div>
 <div className="border border-white/5 rounded-lg p-3">
 Describes you
 </div>
 <div className="border border-[#D6B36A]/20 rounded-lg p-3 text-[#D6B36A]">
 Maps your system
 </div>
 </div>
 </div>

 {/* preview card */}
 <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
 <h2 className="text-[14px] text-white/50 mb-4">
 Your result preview
 </h2>

 <div className="space-y-2 text-[13px] font-mono text-white/70">
 <p>System Load: <span className="text-[#D6B36A]">72</span></p>
 <p>Primary Pattern: Compensated State</p>
 <p>Main Signal: High output / Low recovery</p>
 <p>Element trend: Fire ↑ Water ↓</p>
 </div>
 </div>

 {/* final CTA */}
 <button
 onClick={() => router.push('/diagnose')}
 className="w-full py-3 rounded-full border border-[#D6B36A]/30 text-[#D6B36A] hover:bg-[#D6B36A] hover:text-black transition"
 >
 Reveal My System
 </button>

 </div>
 </div>
 </main>
 );
}
