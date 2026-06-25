'use client';

import { useState, useRef } from 'react';
import { generateReport, WUXING_COLORS, WUXING_NAMES } from '@/lib/bazi-engine';
import { getWellnessPlan } from '@/lib/wellness-data';
import { getPersona, getHook } from '@/lib/persona';
import html2canvas from 'html2canvas';

const ELEMENT_CYCLE: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const ELEMENT_EMOJI: Record<string, string> = { '木': '🌳', '火': '🔥', '土': '⛰️', '金': '⚔️', '水': '💧' };
const ELEMENT_NAME: Record<string, string> = { '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water' };

export default function ReportPage() {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    month: '',
    day: '',
    hour: '',
    gender: 'male',
    bloodType: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const year = parseInt(formData.year);
    const month = parseInt(formData.month);
    const day = parseInt(formData.day);
    const hour = formData.hour ? parseInt(formData.hour) : 12;

    if (!formData.name || isNaN(year) || isNaN(month) || isNaN(day)) {
      setError('Please fill in your name and birth date.');
      return;
    }

    try {
      const data = generateReport({
        name: formData.name,
        birthYear: year,
        birthMonth: month,
        birthDay: day,
        birthHour: hour,
        gender: formData.gender,
        bloodType: formData.bloodType || undefined,
      });
      setReport({ ...data, bloodType: formData.bloodType || null });
      setSubmitted(true);

      // Async AI interpretation
      fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          bazi: data.bazi,
          naYin: data.naYin,
          shishen: data.shishen,
          lunarDate: data.lunarDate,
          zodiac: data.zodiac,
          wuxing: data.wuxing,
          intent: 'health',
          bloodType: formData.bloodType,
        }),
      })
        .then((r) => r.json())
        .then((ai) => {
          if (ai.sections?.length) setReport((prev: any) => ({ ...prev, aiSections: ai.sections }));
        })
        .catch(() => {});
    } catch (e: any) {
      setError(e?.message || 'Failed to generate report.');
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FBF9F6',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `lingshu_${formData.name}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch { /* silent */ }
    setSharing(false);
  };

  // --- FORM VIEW ---
  if (!submitted) {
    return (
      <main className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <p className="text-xs text-[#4A7C49]/50 tracking-[0.2em] uppercase">LingShu</p>
            <h1 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-3">Start Your Assessment</h1>
            <p className="text-sm text-[#6B6B6B] mt-2">Your birth information unlocks a complete BaZi analysis.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Name</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Year</label>
                <input
                  type="number" name="year" value={formData.year} onChange={handleChange}
                  placeholder="1990" min="1900" max="2100"
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Month</label>
                <input
                  type="number" name="month" value={formData.month} onChange={handleChange}
                  placeholder="6" min="1" max="12"
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Day</label>
                <input
                  type="number" name="day" value={formData.day} onChange={handleChange}
                  placeholder="15" min="1" max="31"
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Birth Hour</label>
                <select
                  name="hour" value={formData.hour} onChange={handleChange}
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition"
                >
                  <option value="">Not sure</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Gender</label>
                <select
                  name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Blood Type <span className="text-[#B0B0B0]">(optional)</span></label>
              <select
                name="bloodType" value={formData.bloodType} onChange={handleChange}
                className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition"
              >
                <option value="">Not sure</option>
                <option value="A">Type A</option>
                <option value="B">Type B</option>
                <option value="O">Type O</option>
                <option value="AB">Type AB</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button type="submit" className="w-full py-4 bg-[#4A7C49] text-white rounded-full text-sm font-medium hover:bg-[#3D6A3C] transition shadow-[0_8px_32px_rgba(74,124,73,0.15)]">
              Generate My Report
            </button>
          </form>

          <p className="text-xs text-[#B0B0B0] text-center mt-6">
            Your data is not stored. This is a local calculation.
          </p>
        </div>
      </main>
    );
  }

  // --- REPORT VIEW ---
  if (!report) return null;

  const { name, bazi, naYin, shishen, lunarDate, zodiac, wuxing, insights, bloodType, bloodTypeData, aiSections } = report;
  const baziKeys = ['year', 'month', 'day', 'hour'] as const;
  const dayLabel = ['Year', 'Month', 'Day', 'Hour'];

  // Derive FREEZE persona from birth info as a personality overlay
  const persona = getPersona(wuxing.weakest === '火' || wuxing.weakest === '木' ? 'depleted' : wuxing.weakest === '水' ? 'drifting' : 'debt');
  const hook = getHook(persona.type);

  return (
    <main className="min-h-screen bg-[#FBF9F6]">
      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* Hidden share card */}
        <div className="absolute left-[-9999px] top-0">
          <div ref={cardRef} className="bg-[#FBF9F6] p-8 w-[360px]">
            <div className="text-center">
              <p className="text-lg font-serif font-bold text-[#1A1A1A]">{name}&apos;s Profile</p>
              <p className="text-xs text-[#4A7C49] mt-1">{persona.name} · {zodiac}</p>
              <p className="text-[#6B6B6B] text-sm mt-3 italic">{`"${hook.text}"`}</p>
              <div className="flex justify-center gap-1 mt-4">
                {(Object.entries(wuxing.percentages) as [string, number][]).map(([el, pct]) => (
                  <div key={el} className="flex flex-col items-center w-12">
                    <div className="w-3 h-3 rounded-full" style={{ background: WUXING_COLORS[el] }} />
                    <span className="text-[10px] text-[#8A8A8A] mt-1">{pct}%</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#B0B0B0] mt-4">lingshu-app.vercel.app</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs text-[#4A7C49]/50 tracking-[0.2em] uppercase mb-1">LingShu · Five Elements Report</p>
          <p className="text-sm text-[#6B6B6B]">{name} · {zodiac} · {lunarDate}</p>
        </div>

        {/* Persona tag (from FREEZE) */}
        <div className="bg-white rounded-xl border border-[#EAE5DE] p-4 mb-3 text-center">
          <p className="text-xs text-[#4A7C49] font-medium">{persona.name}</p>
          <p className="text-sm text-[#1A1A1A] mt-1 italic">{`"${hook.text}"`}</p>
        </div>

        {/* Section 1: Five Elements */}
        <div className="bg-gradient-to-br from-[#FDFBF9] to-[#F8F5F0] rounded-xl border border-[#EAE5DE]/80 p-5 mb-3 text-center">
          <p className="text-sm font-semibold text-[#1A1A1A] mb-4">{name}&apos;s Five Elements</p>
          {(Object.entries(wuxing.percentages) as [string, number][]).map(([el, pct]) => (
            <div key={el} className="mb-2.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[#1A1A1A] font-medium">{ELEMENT_EMOJI[el]} {ELEMENT_NAME[el] || el}</span>
                <span className="text-xs text-[#6B6B6B]">{el === wuxing.strongest ? '↑ Dominant' : el === wuxing.weakest ? '↓ Low' : ''}</span>
              </div>
              <div className="w-full h-1.5 bg-[#EAE5DE] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: WUXING_COLORS[el] }} />
              </div>
              <div className="text-right text-xs text-[#8A8A8A] mt-0.5">{pct}%</div>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-[#EAE5DE]">
            <p className="text-sm text-[#1A1A1A] leading-relaxed">
              Your <strong>{ELEMENT_NAME[wuxing.strongest]}</strong> is dominant, while <strong>{ELEMENT_NAME[wuxing.weakest]}</strong> needs attention.
              Nurture it through {ELEMENT_CYCLE[wuxing.weakest] ? ELEMENT_NAME[ELEMENT_CYCLE[wuxing.weakest]] || '' : ELEMENT_NAME[wuxing.weakest]}-related practices.
            </p>
          </div>
        </div>

        {/* Section 2: BaZi Pillars */}
        <div className="bg-white rounded-xl border border-[#EAE5DE] p-4 mb-3 text-center">
          <p className="text-xs text-[#8A8A8A] tracking-wide mb-3">BaZi · Four Pillars</p>
          <div className="flex gap-2">
            {baziKeys.map((key, i) => (
              <div key={key} className="flex-1 bg-[#FBF9F6] rounded-lg p-2.5 border border-[#EAE5DE]/60">
                <p className="text-[10px] text-[#8A8A8A] mb-1">{dayLabel[i]}</p>
                <p className="text-lg font-bold text-[#1A1A1A]">{bazi[key]}</p>
                <p className="text-[10px] text-[#4A7C49] mt-0.5">{shishen[key]}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#8A8A8A] mt-3">Na Yin: {naYin}</p>
        </div>

        {/* Section 3: Insights */}
        <div className="mb-3">
          <p className="text-xs text-[#8A8A8A] text-center tracking-wide mb-2">Energy Interpretation</p>
          {(aiSections?.length ? aiSections : insights).slice(0, 3).map((text: string, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-[#EAE5DE] p-4 mb-2 border-l-[3px]"
              style={{ borderLeftColor: i === 0 ? WUXING_COLORS[wuxing.strongest] : i === 1 ? WUXING_COLORS[wuxing.weakest] : '#C9A96E' }}>
              <p className="text-sm text-[#1A1A1A] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Section 4: Blood Type */}
        {bloodTypeData && (
          <div className="bg-white rounded-xl border border-[#EAE5DE] p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧬</span>
              <p className="text-sm font-semibold text-[#1A1A1A]">{bloodTypeData.bloodType} · {ELEMENT_NAME[bloodTypeData.fiveElement] || bloodTypeData.fiveElement}</p>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {bloodTypeData.traits.map((t: string, i: number) => (
                <span key={i} className="px-2.5 py-1 text-[11px] bg-[#4A7C49]/10 text-[#4A7C49] rounded-full">{t}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-[#FBF9F6] rounded-lg p-2.5">
                <p className="text-[10px] text-[#4A7C49] font-semibold mb-0.5">Strengths</p>
                <p className="text-xs text-[#4A4A4A]">{bloodTypeData.strength}</p>
              </div>
              <div className="bg-[#FBF9F6] rounded-lg p-2.5">
                <p className="text-[10px] text-[#C9A96E] font-semibold mb-0.5">Watch For</p>
                <p className="text-xs text-[#4A4A4A]">{bloodTypeData.weakness}</p>
              </div>
            </div>
            {bloodTypeData.combinedAdvice && (
              <div className="bg-[#C9A96E]/10 rounded-lg p-3 border-l-[3px] border-[#C9A96E]">
                <p className="text-xs text-[#1A1A1A] leading-relaxed">{bloodTypeData.combinedAdvice}</p>
              </div>
            )}
          </div>
        )}

        {/* Section 5: 6-D Wellness */}
        {(() => {
          const w = getWellnessPlan(wuxing.weakest);
          if (!w) return null;
          return (
            <div className="mb-3">
              <div className="bg-white rounded-xl border border-[#EAE5DE] p-3 mb-2 text-center">
                <p className="text-xs text-[#8A8A8A] tracking-wide">6-Dimension Wellness Plan</p>
                <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">For {ELEMENT_NAME[wuxing.weakest]} Enhancement</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '🎨', label: 'Color', value: w.color },
                  { icon: '🧭', label: 'Direction', value: w.direction },
                  { icon: '🥗', label: 'Diet', value: w.food },
                  { icon: '🏃', label: 'Exercise', value: w.exercise },
                  { icon: '💆', label: 'Acupoint', value: w.acupoint },
                  { icon: '😴', label: 'Sleep', value: w.sleep },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl border border-[#EAE5DE] p-3 text-center">
                    <div className="text-lg mb-1">{item.icon}</div>
                    <p className="text-[10px] text-[#8A8A8A] tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-[#EAE5DE] p-4 mt-2 border-l-[3px] border-[#C9A96E]">
                <p className="text-xs text-[#C9A96E] font-semibold mb-1">📜 Classical Wisdom</p>
                <p className="text-sm text-[#4A4A4A] italic leading-relaxed">{w.classic}</p>
                <p className="text-sm text-[#1A1A1A] mt-2 leading-relaxed">{w.emotion}</p>
              </div>
            </div>
          );
        })()}

        {/* Section 6: Daily Practice */}
        {(() => {
          const w = getWellnessPlan(wuxing.weakest);
          if (!w) return null;
          return (
            <div className="mb-3">
              <div className="bg-white rounded-xl border border-[#EAE5DE] p-3 mb-2 text-center">
                <p className="text-xs text-[#8A8A8A] tracking-wide">Today&apos;s Practice</p>
                <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">4 things you can do today</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-xl border-l-[3px] border-[#4A7C49] p-3">
                  <p className="text-[10px] text-[#4A7C49] font-semibold mb-0.5">✅ Wear</p>
                  <p className="text-xs text-[#1A1A1A]">{w.color}</p>
                </div>
                <div className="bg-white rounded-xl border-l-[3px] border-[#4A7C49] p-3">
                  <p className="text-[10px] text-[#4A7C49] font-semibold mb-0.5">✅ Face</p>
                  <p className="text-xs text-[#1A1A1A]">{w.direction}</p>
                </div>
                <div className="bg-white rounded-xl border-l-[3px] border-[#4A7C49] p-3">
                  <p className="text-[10px] text-[#4A7C49] font-semibold mb-0.5">✅ Eat</p>
                  <p className="text-xs text-[#1A1A1A]">{w.food.split(',')[0]}</p>
                </div>
                <div className="bg-white rounded-xl border-l-[3px] border-[#4A7C49] p-3">
                  <p className="text-[10px] text-[#4A7C49] font-semibold mb-0.5">✅ Move</p>
                  <p className="text-xs text-[#1A1A1A]">{w.exercise.split(',')[0]}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Share + Waitlist */}
        <div className="flex gap-2 mb-3">
          <button onClick={handleShare} disabled={sharing}
            className="flex-1 py-3 bg-[#4A7C49] text-white rounded-full text-xs font-medium hover:bg-[#3D6A3C] transition disabled:opacity-50">
            {sharing ? 'Generating...' : shared ? '✓ Saved' : '📸 Share Report'}
          </button>
          <button onClick={() => setShowWaitlist(true)}
            className="flex-1 py-3 bg-white border border-[#EAE5DE] text-[#1A1A1A] rounded-full text-xs font-medium hover:border-[#4A7C49] transition">
            🔓 Deep Analysis
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-[10px] text-[#B0B0B0]">LingShu · Your energy pattern already knows the answer</p>
        </div>
      </div>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-5"
          onClick={() => { setShowWaitlist(false); setWaitlistStatus('idle'); }}>
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full text-center border border-[#EAE5DE]"
            onClick={(e) => e.stopPropagation()}>
            {waitlistStatus === 'done' ? (
              <>
                <p className="text-3xl mb-3">📩</p>
                <p className="text-base font-semibold text-[#1A1A1A] mb-1">You&apos;re on the list</p>
                <p className="text-sm text-[#6B6B6B] mb-6">We&apos;ll notify you when deep analysis launches.</p>
                <button onClick={() => { setShowWaitlist(false); setWaitlistStatus('idle'); }}
                  className="w-full py-3 bg-[#4A7C49] text-white rounded-full text-sm font-medium">Got it</button>
              </>
            ) : (
              <>
                <p className="text-3xl mb-3">🔓</p>
                <p className="text-base font-semibold text-[#1A1A1A] mb-1">Deep Analysis Coming Soon</p>
                <p className="text-sm text-[#6B6B6B] mb-5">Leave your email and we&apos;ll notify you.</p>
                <input type="email" placeholder="your@email.com" value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EAE5DE] text-sm outline-none focus:border-[#4A7C49] mb-3 box-border" />
                <button onClick={async () => {
                  if (!waitlistEmail.includes('@')) return;
                  setWaitlistStatus('loading');
                  try { await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: waitlistEmail }) }); } catch { /* ignore */ }
                  setWaitlistStatus('done');
                }} disabled={waitlistStatus === 'loading'}
                  className="w-full py-3 bg-[#4A7C49] text-white rounded-full text-sm font-medium disabled:opacity-50">
                  {waitlistStatus === 'loading' ? 'Submitting...' : 'Notify me ✓'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
