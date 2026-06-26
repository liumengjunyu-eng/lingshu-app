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

      {/* ===== 背景光晕（升级：增加呼吸动画） ===== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D6B36A]/5 rounded-full blur-3xl animate-breath-glow" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#D6B36A]/3 rounded-full blur-3xl animate-breath-glow-delayed" />

      {/* HERO */}
      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        {/* ===== 品牌标识（带符号） ===== */}
        <div 
          className="flex items-center justify-center gap-3 mb-8"
          style={{ 
            opacity: loaded ? 1 : 0, 
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out 0ms'
          }}
        >
          <div className="w-8 h-8 rounded-full border border-[#D6B36A]/30 flex items-center justify-center">
            <span className="text-[#D6B36A] text-xs">◈</span>
          </div>
          <span className="text-[#D6B36A] text-sm tracking-[0.2em] font-light">LINGSHU</span>
          <span className="text-[#4A4A4A] text-xs tracking-[0.2em]">·</span>
          <span className="text-[#6A6A6A] text-sm tracking-[0.2em] font-light">SYSTEM ANALYSIS</span>
        </div>

        {/* ===== 主标题（增加进入感） ===== */}
        <h1 
          className="font-serif text-[clamp(40px,5.5vw,64px)] font-light leading-[1.08] tracking-tight"
          style={{ 
            opacity: loaded ? 1 : 0, 
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out 200ms'
          }}
        >
          Your system is
          <br />
          <span className="text-[#D6B36A]">always speaking.</span>
        </h1>

        {/* ===== 副标题 ===== */}
        <p 
          className="text-white/50 text-[clamp(16px,1.8vw,20px)] font-light mt-6 max-w-xl mx-auto leading-relaxed"
          style={{ 
            opacity: loaded ? 1 : 0, 
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out 400ms'
          }}
        >
          We help you listen.
        </p>

        {/* ===== CTA ===== */}
        <div 
          className="mt-10"
          style={{ 
            opacity: loaded ? 1 : 0, 
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out 600ms'
          }}
        >
          <button
            onClick={() => router.push('/diagnose')}
            className="px-12 py-4 bg-[#D6B36A] text-[#0A0A0A] rounded-full font-medium hover:bg-[#B38A3D] transition-all duration-300 text-sm tracking-wide hover:scale-105"
          >
            Start Free Check
          </button>
          <p className="text-white/30 text-sm mt-5 font-light tracking-wider">
            Free · 2 minutes
          </p>
        </div>
      </div>

      {/* ===== 滚动指示器（增强视觉信号） ===== */}
      <div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ 
          opacity: loaded ? 1 : 0, 
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease-out 800ms'
        }}
      >
        <span className="text-white/20 text-[10px] tracking-widest">SCROLL</span>
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#D6B36A]/30 to-transparent rounded-full overflow-hidden">
          <div className="w-full h-1/2 bg-[#D6B36A]/50 animate-scroll-indicator" />
        </div>
      </div>

      {/* 分隔 */}
      <div className="absolute top-full w-full mt-12 border-t border-white/5 pt-10 space-y-6 px-6">

        {/* What we analyze */}
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-[14px] text-white/40 mb-3 tracking-wide">
            What we analyze
          </h2>

          <p className="text-[14px] text-white/60 leading-relaxed">
            Body recovery · Mental load · Emotional pressure
          </p>

          <p className="text-[12px] text-white/25 mt-2">
            Not personality. Not fortune telling. System patterns.
          </p>
        </div>

        {/* difference */}
        <div className="max-w-xl mx-auto">
          <h2 className="text-[14px] text-white/40 mb-3 tracking-wide text-center">
            Why this feels different
          </h2>

          <div className="grid grid-cols-3 gap-2 text-[12px] text-white/50">
            <div className="border border-white/5 rounded-lg p-3 text-center">
              Labels you
            </div>
            <div className="border border-white/5 rounded-lg p-3 text-center">
              Describes you
            </div>
            <div className="border border-[#D6B36A]/20 rounded-lg p-3 text-[#D6B36A] text-center">
              Maps your system
            </div>
          </div>
        </div>

        {/* preview card */}
        <div className="max-w-xl mx-auto border border-white/10 rounded-xl p-5 bg-white/[0.02]">
          <h2 className="text-[14px] text-white/40 mb-4 text-center">
            Your result preview
          </h2>

          <div className="space-y-2 text-[13px] font-mono text-white/60">
            <p>System Load: <span className="text-[#D6B36A]">72</span></p>
            <p>Primary Pattern: Compensated State</p>
            <p>Main Signal: High output / Low recovery</p>
            <p>Element trend: Fire ↑ Water ↓</p>
          </div>
        </div>

        {/* final CTA */}
        <div className="max-w-xl mx-auto pb-20">
          <button
            onClick={() => router.push('/diagnose')}
            className="w-full py-3 rounded-full border border-[#D6B36A]/30 text-[#D6B36A] hover:bg-[#D6B36A] hover:text-black transition"
          >
            Reveal My System
          </button>
        </div>

      </div>

      {/* ===== CSS 动画 ===== */}
      <style jsx>{`
        @keyframes breath-glow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.05); }
        }
        .animate-breath-glow {
          animation: breath-glow 6s ease-in-out infinite;
        }
        .animate-breath-glow-delayed {
          animation: breath-glow 8s ease-in-out infinite 2s;
        }

        @keyframes scroll-indicator {
          0% { transform: translateY(0); opacity: 0.2; }
          100% { transform: translateY(30px); opacity: 1; }
        }
        .animate-scroll-indicator {
          animation: scroll-indicator 2.5s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
