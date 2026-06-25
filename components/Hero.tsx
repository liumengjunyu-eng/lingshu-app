'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden bg-cream">
      {/* CSS 模糊球 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative w-[500px] h-[500px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-forest/15 via-gold/5 to-transparent blur-3xl animate-breath-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-forest/5 blur-2xl animate-pulse-slow" />
          <div className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full bg-gold/10 blur-xl animate-float-slow" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center gap-2 text-sm text-forest/30 tracking-[0.2em] uppercase mb-8">
          <span>Recovery Intelligence</span>
          <span className="text-gold">&middot;</span>
          <span>v1.0</span>
        </div>

        <h1 className="font-sans font-bold text-ink text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-[-0.02em]">
          You&rsquo;re not tired.
          <br />
          <span className="text-forest">You&rsquo;re in Recovery Debt.</span>
        </h1>

        <p className="text-ink/50 text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          You sleep. You rest. You take weekends off.
          <br />
          <span className="text-ink/70">Yet you still feel exhausted.</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/diagnose"
            className="px-10 py-4 bg-forest text-white rounded-full text-base font-medium tracking-wide hover:bg-forest/90 transition-all duration-300 shadow-[0_8px_32px_rgba(35,65,50,0.15)] hover:shadow-[0_12px_48px_rgba(35,65,50,0.25)] hover:-translate-y-0.5"
          >
            See What&rsquo;s Draining Me
          </Link>
        </div>

        <p className="text-ink/20 text-sm mt-8 tracking-wide">
          Free &middot; 2 minutes &middot; No signup required
        </p>
      </div>
    </section>
  );
}
