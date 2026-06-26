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

      {/* ===== 背景光晕（双层呼吸） ===== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D6B36A]/5 rounded-full blur-3xl animate-breath-glow" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#D6B36A]/3 rounded-full blur-3xl animate-breath-glow-delayed" />

      {/* ===== 微纹理 ===== */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* HERO */}
      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        {/* ===== 品牌标识 + 符号 ===== */}
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
          <span className="text-[#4A4A4A] text-xs">·</span>
          <span className="text-[#6A6A6A] text-sm tracking-[0.2em] font-light">SYSTEM ANALYSIS</span>
        </div>

        {/* ===== 主标题（金色词单独强调） ===== */}
        <h1 
          className="font-serif text-[clamp(44px,5.5vw,68px)] font-light leading-[1.08] tracking-tight"
          style={{ 
            opacity: loaded ? 1 : 0, 
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out 200ms'
          }}
        >
          Your Life Is A System.
          <br />
          <span className="text-[#D6B36A]">Health, Energy, Relationships,</span>
          <br />
          <span className="text-white/90">Decisions — </span>
          <span className="text-[#D6B36A]">They Are Connected.</span>
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
          Ancient Wisdom <span className="text-white/20">+</span> AI Pattern Recognition
          <br />
          <span className="text-white/30">Discover the hidden patterns shaping your life.</span>
        </p>

        {/* ===== CTA（微交互增强） ===== */}
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
            className="px-12 py-4 bg-[#D6B36A] text-[#0A0A0A] rounded-full font-medium transition-all duration-300 text-sm tracking-wide relative overflow-hidden group hover:scale-105"
          >
            <span className="relative z-10">Start Free Analysis</span>
            <div className="absolute inset-0 bg-[#B38A3D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <p className="text-white/25 text-sm mt-5 font-light tracking-wider">
            Free · 2 minutes · No signup
          </p>
        </div>
      </div>

      {/* ===== 滚动指示器 ===== */}
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
