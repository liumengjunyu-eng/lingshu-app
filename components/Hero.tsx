'use client';

export function Hero() {
  return (
    <section className="relative min-h-dvh flex items-center justify-center px-6 overflow-hidden bg-[#FBF9F6]">
      {/* 装饰光斑 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-[#4A7C49]/20 animate-breath-slow" />
        <div className="absolute bottom-[25%] right-[10%] w-48 h-48 rounded-full bg-[#C9A96E]/25 animate-float-slow" />
        <div className="absolute top-[55%] left-[60%] w-32 h-32 rounded-full bg-[#4A7C49]/15 animate-pulse-slow" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="flex justify-center text-xs sm:text-sm text-[#4A7C49]/50 tracking-[0.2em] uppercase mb-8">
          <span>BaZi · Five Elements · TCM</span>
        </div>

        <h1 className="font-serif font-bold text-[#1A1A1A] text-3xl sm:text-4xl md:text-5xl leading-[1.2] tracking-[-0.01em]">
          Your energy pattern
          <br />
          <span className="text-[#4A7C49]">already knows the answer.</span>
        </h1>

        <p className="text-[#6B6B6B] text-base sm:text-lg max-w-md mx-auto mt-6 leading-relaxed">
          Enter your birth information for a complete BaZi analysis—five elements, body mapping, and personalized wellness insights.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center">
          <a
            href="/diagnose"
            className="px-12 py-4 bg-[#4A7C49] text-white rounded-full text-[15px] sm:text-base font-medium tracking-wide hover:bg-[#3D6A3C] transition-all duration-300 shadow-[0_8px_32px_rgba(74,124,73,0.15)] hover:shadow-[0_12px_48px_rgba(74,124,73,0.25)] hover:-translate-y-0.5"
          >
            Start Your Assessment →
          </a>
        </div>

        <p className="text-[#B0B0B0] text-xs sm:text-sm mt-8 tracking-wide">
          Free &middot; 5 questions &middot; 2 minutes
        </p>
      </div>
    </section>
  );
}
