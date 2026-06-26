'use client';

import { Hero } from '@/components/Hero';
import Link from 'next/link';

const recoveryStates = [
  {
    name: 'The Silent High Performer',
    emoji: '🔥',
    description: 'Looks stable from the outside. Internally, every system is running at 110%. The first to burn out, the last to admit it.',
    stat: 'Most common among 25-40 professionals',
  },
  {
    name: 'The Drifter',
    emoji: '🌊',
    description: 'Always recovering, never fully restored. Weekends are catch-up, not recharge. The treadmill keeps going even when you step off.',
    stat: 'Affects 1 in 3 knowledge workers',
  },
  {
    name: 'The Balanced One',
    emoji: '🌿',
    description: 'The state you\'re aiming for. Recovery is not an afterthought — it\'s built into the system. Energy is sustainable, not explosive.',
    stat: 'Only 18% of people reach this state naturally',
  },
];

const whatWeAnalyze = [
  { icon: '◐', label: 'Recovery Rhythm', desc: 'How your body cycles between output and restoration' },
  { icon: '◉', label: 'Energy Pattern', desc: 'Your unique energy signature across the day and week' },
  { icon: '◌', label: 'Stress Response', desc: 'How your nervous system handles pressure and uncertainty' },
  { icon: '◎', label: 'Emotional Recovery', desc: 'Your capacity to process and release emotional load' },
  { icon: '○', label: 'Behavior Cycles', desc: 'The habits that drain or restore your system' },
];

const recoveryPath = [
  { week: 'Week 1', title: 'Reset', items: ['Stop the output machine', 'Sleep restoration protocol', 'Information fast'], color: 'bg-forest' },
  { week: 'Week 2', title: 'Restore', items: ['Gentle movement reintroduction', 'Emotional release work', 'Environment rebalancing'], color: 'bg-forest/80' },
  { week: 'Week 3', title: 'Rebuild', items: ['Sustainable output system', 'Boundary architecture', 'Long-term energy planning'], color: 'bg-forest/60' },
];

export default function HomePage() {
  return (
    <main className="bg-cream">
      <Hero />

      {/* Screen 2: Why Rest Isn't Working */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-forest/30 text-xs tracking-[0.2em] uppercase mb-4">The Problem</div>
          <h2 className="font-sans font-bold text-ink text-4xl sm:text-5xl leading-tight">
            Why Rest Isn&rsquo;t Working
          </h2>
          <div className="w-12 h-0.5 bg-gold/30 mx-auto my-8" />
          <p className="text-ink/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Sleep is biological. <span className="text-ink/80 font-medium">Recovery is systemic.</span>
          </p>
          <p className="text-ink/40 text-base leading-relaxed mt-6 max-w-xl mx-auto">
            You can sleep 8 hours and still wake up exhausted. Because rest ≠ sleep. Rest is when your system actually repairs — and most people haven&rsquo;t built a recovery system that works.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              { label: 'Sleep quality', value: 'Only 27%', sub: 'of people wake up refreshed' },
              { label: 'Recovery debt', value: '76%', sub: 'carry chronic recovery deficit' },
              { label: 'Burnout risk', value: '2.3x', sub: 'higher for high-output personalities' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-forest/5">
                <div className="text-forest/30 text-xs mb-1">{s.label}</div>
                <div className="text-3xl font-bold text-ink">{s.value}</div>
                <div className="text-xs text-ink/20 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen 3: Three Recovery States */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-forest/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-forest/30 text-xs tracking-[0.2em] uppercase mb-4">Your State</div>
            <h2 className="font-sans font-bold text-ink text-4xl sm:text-5xl leading-tight">
              Three Recovery States
            </h2>
            <p className="text-ink/40 text-base mt-4 max-w-xl mx-auto">
              Everyone falls into one of these three patterns. The first step is knowing which one is yours.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recoveryStates.map((state, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-forest/5 hover:border-forest/20 transition-all duration-300">
                <div className="text-4xl mb-4">{state.emoji}</div>
                <h3 className="font-sans font-bold text-ink text-xl mb-3">{state.name}</h3>
                <p className="text-ink/50 text-sm leading-relaxed">{state.description}</p>
                <div className="mt-4 text-xs text-ink/20 italic">{state.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen 4: What We Analyze */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-forest/30 text-xs tracking-[0.2em] uppercase mb-4">The System</div>
          <h2 className="font-sans font-bold text-ink text-4xl sm:text-5xl leading-tight">
            What We Analyze
          </h2>
          <p className="text-ink/40 text-base mt-4 max-w-xl mx-auto">
            Your recovery is not one thing. It&rsquo;s five interconnected systems.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 text-left">
            {whatWeAnalyze.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-forest/5 flex items-start gap-4">
                <span className="text-forest text-xl mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium text-ink">{item.label}</div>
                  <div className="text-xs text-ink/40 mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen 5: Result Preview */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-forest/[0.02]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-forest/30 text-xs tracking-[0.2em] uppercase mb-4">Your Result</div>
          <h2 className="font-sans font-bold text-ink text-4xl sm:text-5xl leading-tight">
            You Are Not a Score.
          </h2>
          <p className="text-ink/40 text-base mt-4 max-w-md mx-auto">
            We don&rsquo;t give you a number. We give you an identity.
          </p>

          {/* Preview card */}
          <div className="bg-white rounded-2xl p-8 border border-forest/5 mt-10 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-forest/5 flex items-center justify-center mx-auto">
              <span className="text-2xl">🌀</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-forest/30 tracking-wider uppercase">Recovery Identity</div>
              <div className="font-sans font-bold text-ink text-2xl mt-1 leading-tight">
                The Fire-Wood Overdriver
              </div>
            </div>
            <div className="w-8 h-0.5 bg-gold/30 mx-auto my-4" />
            <p className="text-ink/50 text-sm leading-relaxed">
              &ldquo;You look productive from the outside. From the inside, it feels different.&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-ink/20 text-xs">Recovery Debt</span>
              <span className="text-forest font-semibold text-2xl">68</span>
              <span className="text-ink/10 text-xs">/ 100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Screen 6: Recovery Path */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-forest/30 text-xs tracking-[0.2em] uppercase mb-4">Your Path</div>
            <h2 className="font-sans font-bold text-ink text-4xl sm:text-5xl leading-tight">
              Recovery Is a System
            </h2>
            <p className="text-ink/40 text-base mt-4 max-w-xl mx-auto">
              Three weeks to rebuild your recovery architecture.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recoveryPath.map((phase, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-forest/5 relative">
                {/* Week indicator */}
                <div className={`absolute top-0 left-8 right-8 h-1 ${phase.color} rounded-full opacity-30`} />
                <div className="text-xs text-forest/30 tracking-wider uppercase mb-2">{phase.week}</div>
                <h3 className="font-sans font-bold text-ink text-2xl mb-4">{phase.title}</h3>
                <ul className="space-y-3">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-ink/50">
                      <span className="text-forest mt-1">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen 7: Emotional Mirror */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-forest/[0.02]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-forest/30 text-xs tracking-[0.2em] uppercase mb-4">Emotional Mirror</div>
          <h2 className="font-sans font-bold text-ink text-4xl sm:text-5xl leading-tight max-w-lg mx-auto">
            Your Result Is Worth Sharing
          </h2>
          <p className="text-ink/40 text-base mt-4 max-w-md mx-auto">
            Not a &ldquo;score&rdquo; — a mirror sentence that says exactly how you feel.
          </p>

          <div className="bg-white rounded-2xl p-10 border border-forest/5 mt-10 max-w-md mx-auto">
            <div className="text-ink/80 text-lg leading-relaxed font-light italic">
              &ldquo;You look productive from the outside.
            </div>
            <div className="text-ink/60 text-lg leading-relaxed font-light italic">
              From the inside, it feels different.&rdquo;
            </div>
            <div className="w-10 h-0.5 bg-gold/30 mx-auto my-6" />
            <div className="text-forest/30 text-xs tracking-wider">&mdash; Recovery Identity &mdash;</div>
            <div className="text-ink font-medium text-sm mt-2">The Fire-Wood Overdriver</div>
          </div>

          <div className="mt-6 text-xs text-ink/20">
            Tap to copy &middot; Share to your story &middot; It resonates deeper than you think
          </div>

          {/* CTA */}
          <div className="mt-12">
            <Link
              href="/diagnose"
              className="inline-flex px-10 py-4 bg-forest text-white rounded-full text-base font-medium tracking-wide hover:bg-forest/90 transition-all duration-300 shadow-[0_8px_32px_rgba(35,65,50,0.15)]"
            >
              See What&rsquo;s Draining Me
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
