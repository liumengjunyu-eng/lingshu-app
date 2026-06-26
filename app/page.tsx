'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EXAMPLE_INPUTS = [
  'Running on empty',
  "Can't switch off at night",
  'Everything feels delayed',
];

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // 打字切换效果
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_INPUTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    if (input.trim()) {
      router.push(`/diagnose?input=${encodeURIComponent(input)}`);
    }
  };

  return (
    <main className="bg-[#0A0A0A] text-[#F5F5F5] min-h-screen">

      {/* ============================================================
      SECTION 1：Hero（全屏 · 无输入框）
      ============================================================ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

        {/* 背景光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D6B36A]/5 rounded-full blur-3xl animate-breath-glow" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#D6B36A]/3 rounded-full blur-3xl animate-breath-glow-delayed" />

        {/* 微纹理 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">

          {/* 品牌标识 */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0ms' }}>
            <div className="w-8 h-8 rounded-full border border-[#D6B36A]/30 flex items-center justify-center">
              <span className="text-[#D6B36A] text-xs">◈</span>
            </div>
            <span className="text-[#D6B36A] text-sm tracking-[0.2em] font-light">LINGSHU</span>
            <span className="text-[#4A4A4A] text-xs">/</span>
            <span className="text-[#6A6A6A] text-sm tracking-[0.2em] font-light">SYSTEM ANALYSIS</span>
          </div>

          {/* 主标题 */}
          <h1 className="font-serif text-[clamp(44px,6vw,68px)] font-light leading-[1.05] tracking-tight animate-fade-in" style={{ animationDelay: '200ms' }}>
            Your Life Is A System.
            <br />
            <span className="text-[#D6B36A]">Health, Energy, Relationships,</span>
            <br />
            <span className="text-[#F5F5F5]">Decisions — </span>
            <span className="text-[#D6B36A]">They Are Connected.</span>
          </h1>

          {/* 副标题 */}
          <p className="text-[#B0B0B0] text-[clamp(18px,2vw,22px)] font-light mt-6 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '400ms' }}>
            Ancient Wisdom <span className="text-[#4A4A4A]">+</span> AI Pattern Recognition
            <br />
            <span className="text-[#8A8A8A] font-normal">Discover the hidden patterns shaping your life.</span>
          </p>

          {/* CTA */}
          <div className="mt-10 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <button
              onClick={() => router.push('/diagnose')}
              className="px-12 py-4 bg-[#D6B36A] text-[#0A0A0A] rounded-full font-medium transition-all duration-300 text-sm tracking-wide relative overflow-hidden group hover:scale-[1.02]"
            >
              <span className="relative z-10">Start Free Analysis</span>
              <div className="absolute inset-0 bg-[#B38A3D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <p className="text-[#4A4A4A] text-sm mt-5 font-light tracking-wider">
              Free · 2 minutes · No signup
            </p>
          </div>

        </div>

        {/* 滚动指示器 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <span className="text-[#4A4A4A] text-[10px] tracking-widest">SCROLL</span>
          <div className="w-0.5 h-12 bg-gradient-to-b from-[#D6B36A]/30 to-transparent rounded-full overflow-hidden">
            <div className="w-full h-1/2 bg-[#D6B36A]/50 animate-scroll-indicator" />
          </div>
        </div>

      </section>


      {/* ============================================================
      SECTION 2：What We Analyze
      ============================================================ */}
      <section className="py-24 px-6 border-t border-[#1A1A1A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#D6B36A] text-sm tracking-[0.2em] font-light">WHAT WE ANALYZE</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mt-3 text-[#F5F5F5]">
              Five Layers of Your Life
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '○', label: 'Health', sub: 'Body Recovery' },
              { icon: '◇', label: 'Energy', sub: 'Mental Load' },
              { icon: '△', label: 'Relationships', sub: 'Emotional Patterns' },
              { icon: '□', label: 'Career', sub: 'Decision Quality' },
              { icon: '☆', label: 'Environment', sub: 'Life Alignment' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 text-center border border-[#1A1A1A] rounded-xl hover:border-[#D6B36A]/20 transition bg-[#121212] group"
              >
                <div className="text-2xl text-[#D6B36A]/30 group-hover:text-[#D6B36A]/60 transition mb-3">
                  {item.icon}
                </div>
                <h3 className="text-sm font-medium text-[#F5F5F5]">{item.label}</h3>
                <p className="text-xs text-[#6A6A6A] mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================================
      SECTION 3：差异化
      ============================================================ */}
      <section className="py-24 px-6 border-t border-[#1A1A1A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#D6B36A] text-sm tracking-[0.2em] font-light">HOW WE'RE DIFFERENT</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mt-3 text-[#F5F5F5]">
              Most Systems Analyze Symptoms.
              <br />
              <span className="text-[#D6B36A]">We Analyze Patterns.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Generic',
                items: ['Surface-level', 'One-dimensional', 'No integration'],
              },
              {
                title: 'Surface Level',
                items: ['Symptom-based', 'Fragmented', 'No root cause'],
              },
              {
                title: 'LingShu',
                items: ['Health + Energy + Behavior + Environment', 'Pattern-based', 'Systemic integration'],
                highlight: true,
              },
            ].map((col) => (
              <div
                key={col.title}
                className={`p-8 rounded-xl border ${
                  col.highlight
                    ? 'border-[#D6B36A]/20 bg-[#D6B36A]/5'
                    : 'border-[#1A1A1A] bg-[#121212]'
                }`}
              >
                <h3 className={`text-sm font-medium ${
                  col.highlight ? 'text-[#D6B36A]' : 'text-[#6A6A6A]'
                }`}>
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-[#B0B0B0]">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className={col.highlight ? 'text-[#D6B36A]' : 'text-[#4A4A4A]'}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================================
      SECTION 4：五行
      ============================================================ */}
      <section className="py-24 px-6 border-t border-[#1A1A1A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#D6B36A] text-sm tracking-[0.2em] font-light">ANCIENT FRAMEWORK</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mt-3 text-[#F5F5F5]">
              The Five Element System
            </h2>
            <p className="text-[#6A6A6A] text-base font-light mt-2">
              A 2000-year framework for understanding human balance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Wood', color: '#6A9A6A', desc: 'Growth · Decision' },
              { name: 'Fire', color: '#D6A06A', desc: 'Emotion · Expression' },
              { name: 'Earth', color: '#B8A87A', desc: 'Stability · Grounding' },
              { name: 'Metal', color: '#B0B0B0', desc: 'Boundary · Structure' },
              { name: 'Water', color: '#6A8AAA', desc: 'Recovery · Depth' },
            ].map((el) => (
              <div
                key={el.name}
                className="p-6 text-center border border-[#1A1A1A] rounded-xl bg-[#121212] hover:border-[#D6B36A]/10 transition group"
              >
                <div className="w-8 h-8 rounded-full mx-auto mb-3" style={{ background: el.color }} />
                <h3 className="text-base font-medium text-[#F5F5F5]">{el.name}</h3>
                <p className="text-xs text-[#6A6A6A] mt-1">{el.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================================
      SECTION 5：报告预览
      ============================================================ */}
      <section className="py-24 px-6 border-t border-[#1A1A1A] bg-[#121212]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#D6B36A] text-sm tracking-[0.2em] font-light">REAL REPORT PREVIEW</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mt-3 text-[#F5F5F5]">
              What You'll Discover
            </h2>
          </div>

          <div className="border border-[#D6B36A]/10 rounded-2xl p-8 md:p-10 bg-[#0A0A0A] max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#6A6A6A] text-sm tracking-widest">SYSTEM LOAD</span>
              <span className="text-3xl font-light text-[#D6B36A]">78</span>
            </div>

            <div className="border-t border-[#1A1A1A] py-4">
              <p className="text-[#6A6A6A] text-xs tracking-widest">PRIMARY PATTERN</p>
              <p className="text-[#F5F5F5] text-lg font-light mt-1">Compensated Collapse</p>
            </div>

            <div className="border-t border-[#1A1A1A] py-4">
              <p className="text-[#6A6A6A] text-xs tracking-widest">ROOT CAUSE</p>
              <p className="text-[#B0B0B0] text-sm mt-1">High output · Low recovery</p>
            </div>

            <div className="border-t border-[#1A1A1A] py-4">
              <p className="text-[#6A6A6A] text-xs tracking-widest">ELEMENT IMBALANCE</p>
              <div className="flex items-center gap-6 mt-2">
                <span className="text-[#D6A06A] text-sm">Fire ↑</span>
                <span className="text-[#6A8AAA] text-sm">Water ↓</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#1A1A1A] text-center">
              <span className="text-[#6A6A6A] text-sm font-light">Complete analysis includes all 5 elements + decision patterns</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/diagnose')}
              className="px-10 py-3 border border-[#D6B36A]/30 text-[#D6B36A] rounded-full hover:bg-[#D6B36A] hover:text-[#0A0A0A] transition text-sm"
            >
              Reveal My Pattern →
            </button>
          </div>
        </div>
      </section>


      {/* ============================================================
      SECTION 6：信任锚点
      ============================================================ */}
      <section className="py-24 px-6 border-t border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F5F5]">
            Not Fortune Telling.
            <br />
            <span className="text-[#D6B36A]">Pattern Recognition.</span>
          </h2>

          <p className="text-[#6A6A6A] text-base font-light mt-6 max-w-2xl mx-auto leading-relaxed">
            Our analysis is designed for self-reflection and planning.
            It should never replace medical, legal or financial advice.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-[#4A4A4A]">
            <span>• 2000+ years of wisdom</span>
            <span>• AI-driven pattern analysis</span>
            <span>• Not a diagnostic tool</span>
          </div>
        </div>
      </section>


      {/* ============================================================
      SECTION 7：最终 CTA
      ============================================================ */}
      <section className="py-20 px-6 border-t border-[#1A1A1A] bg-[#121212]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#D6B36A] text-sm tracking-[0.2em] font-light mb-4">BEGIN YOUR ANALYSIS</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#F5F5F5]">
            See What Your System Is Missing
          </h2>

          <button
            onClick={() => router.push('/diagnose')}
            className="mt-8 px-14 py-4 bg-[#D6B36A] text-[#0A0A0A] rounded-full font-medium hover:bg-[#B38A3D] transition text-base tracking-wide hover:scale-[1.02]"
          >
            Reveal My Pattern
          </button>

          <p className="text-[#4A4A4A] text-sm mt-5 font-light">Free · 2 minutes · No signup</p>
        </div>
      </section>


      {/* ============================================================
      全局动画样式
      ============================================================ */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

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
