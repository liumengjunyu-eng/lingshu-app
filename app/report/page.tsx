'use client';

import { useState, useRef, useEffect } from 'react';
import { generateReport, WUXING_COLORS, WUXING_NAMES } from '@/lib/bazi-engine';
import { getWellnessPlan } from '@/lib/wellness-data';
import { getPersona, getHook } from '@/lib/persona';
import { runSymbolEngine, Element } from '@/lib/engine/symbolEngine';
import html2canvas from 'html2canvas';

const ELEMENT_CYCLE: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const ELEMENT_EMOJI: Record<string, string> = { '木': '🌳', '火': '🔥', '土': '⛰️', '金': '⚔️', '水': '💧' };
const ELEMENT_NAME: Record<string, string> = { '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water' };
const ELEMENT_ORDER: (keyof typeof ELEMENT_EMOJI)[] = ['木', '火', '土', '金', '水'];

// 从 diagnose 答案映射到 Symbol Engine 输入
const ENG_INPUT: Record<string, { fatigue: number; stress: number; sleep: number; motivation: number; digestion: number; social: number }> = {
  sleep_A: { fatigue: 75, stress: 60, sleep: 25, motivation: 50, digestion: 60, social: 50 },
  sleep_B: { fatigue: 70, stress: 55, sleep: 30, motivation: 40, digestion: 50, social: 45 },
  sleep_C: { fatigue: 80, stress: 65, sleep: 20, motivation: 35, digestion: 45, social: 55 },
  sleep_D: { fatigue: 65, stress: 50, sleep: 35, motivation: 55, digestion: 55, social: 50 },
  anxiety_A: { fatigue: 70, stress: 80, sleep: 40, motivation: 45, digestion: 50, social: 50 },
  anxiety_B: { fatigue: 75, stress: 75, sleep: 35, motivation: 40, digestion: 45, social: 45 },
  anxiety_C: { fatigue: 80, stress: 85, sleep: 30, motivation: 30, digestion: 40, social: 40 },
  anxiety_D: { fatigue: 60, stress: 70, sleep: 45, motivation: 55, digestion: 55, social: 50 },
  direction_A: { fatigue: 60, stress: 55, sleep: 50, motivation: 30, digestion: 60, social: 40 },
  direction_B: { fatigue: 55, stress: 60, sleep: 55, motivation: 25, digestion: 55, social: 35 },
  direction_C: { fatigue: 65, stress: 50, sleep: 45, motivation: 70, digestion: 50, social: 45 },
  direction_D: { fatigue: 60, stress: 45, sleep: 50, motivation: 35, digestion: 55, social: 40 },
  relationship_A: { fatigue: 70, stress: 65, sleep: 50, motivation: 50, digestion: 50, social: 75 },
  relationship_B: { fatigue: 65, stress: 60, sleep: 55, motivation: 45, digestion: 55, social: 60 },
  relationship_C: { fatigue: 75, stress: 70, sleep: 40, motivation: 55, digestion: 45, social: 70 },
  relationship_D: { fatigue: 60, stress: 55, sleep: 50, motivation: 40, digestion: 60, social: 55 },
  energy_A: { fatigue: 80, stress: 50, sleep: 40, motivation: 40, digestion: 55, social: 45 },
  energy_B: { fatigue: 85, stress: 60, sleep: 35, motivation: 30, digestion: 50, social: 50 },
  energy_C: { fatigue: 75, stress: 65, sleep: 45, motivation: 50, digestion: 45, social: 55 },
  energy_D: { fatigue: 90, stress: 55, sleep: 30, motivation: 25, digestion: 50, social: 40 },
};

export default function ReportPage() {
  const [formData, setFormData] = useState({
    name: '', year: '', month: '', day: '', hour: '', gender: 'male', bloodType: '',
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

  // Diagnose-bridged data
  const [diagnosisData, setDiagnosisData] = useState<any>(null);
  const [symbolOutput, setSymbolOutput] = useState<any>(null);

  // Load diagnosis data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('diagnosis_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDiagnosisData(parsed);

        // Run Symbol Engine client-side
        if (parsed.engineInput) {
          const { fatigueLevel, stressLevel, sleepQuality, motivation, digestion, socialLoad } = parsed.engineInput;
          const so = runSymbolEngine({ fatigueLevel, stressLevel, sleepQuality, motivation, digestion, socialLoad });
          setSymbolOutput(so);
        }

        // Pre-fill name if available from diagnose
        if (parsed.diagnoseResult?.persona) {
          // Don't pre-fill name, just note we have data
        }
      }
    } catch { /* ignore */ }
  }, []);

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
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: '#FBF9F6', logging: false });
      const link = document.createElement('a');
      link.download = `lingshu_${formData.name || 'me'}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch { /* silent */ }
    setSharing(false);
  };

  // ---------- FORM VIEW ----------
  if (!submitted) {
    return (
      <main className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <p className="text-xs text-[#4A7C49]/50 tracking-[0.2em] uppercase">LingShu</p>
            <h1 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-3">Your Complete Assessment</h1>
            <p className="text-sm text-[#6B6B6B] mt-2">Birth info unlocks your full BaZi profile and combined analysis.</p>
          </div>

          {/* Diagnosis bridge banner */}
          {diagnosisData && symbolOutput && (
            <div className="bg-gradient-to-r from-[#4A7C49]/10 to-[#C9A96E]/10 rounded-xl border border-[#4A7C49]/20 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-[#4A7C49] text-white px-2 py-0.5 rounded-full font-medium">Already analyzed</span>
                <span className="text-xs text-[#6B6B6B]">from your diagnosis</span>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium">Your energy type: <span className="text-[#4A7C49]">{symbolOutput.element.charAt(0).toUpperCase() + symbolOutput.element.slice(1)}</span></p>
              <p className="text-xs text-[#6B6B6B] mt-1">{symbolOutput.dominantDescription}</p>
              {diagnosisData.diagnoseResult?.persona && (
                <p className="text-xs text-[#6B6B6B] mt-1">Recovery pattern: {diagnosisData.diagnoseResult.persona}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="1990" min={1900} max={2100}
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Month</label>
                <input type="number" name="month" value={formData.month} onChange={handleChange} placeholder="6" min={1} max={12}
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Day</label>
                <input type="number" name="day" value={formData.day} onChange={handleChange} placeholder="15" min={1} max={31}
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Birth Hour</label>
                <select name="hour" value={formData.hour} onChange={handleChange}
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition">
                  <option value="">Not sure</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">Blood Type <span className="text-[#B0B0B0]">(optional)</span></label>
              <select name="bloodType" value={formData.bloodType} onChange={handleChange}
                className="w-full px-3 py-3 rounded-xl border border-[#EAE5DE] bg-white text-[#1A1A1A] text-sm outline-none focus:border-[#4A7C49] transition">
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

          <p className="text-xs text-[#B0B0B0] text-center mt-6">Your data is not stored. This is a local calculation.</p>
        </div>
      </main>
    );
  }

  // ---------- REPORT VIEW ----------
  if (!report) return null;

  const { name, bazi, naYin, shishen, lunarDate, zodiac, wuxing, insights, bloodType, bloodTypeData, aiSections } = report;
  const baziKeys = ['year', 'month', 'day', 'hour'] as const;
  const dayLabel = ['Year', 'Month', 'Day', 'Hour'];

  // Derive FREEZE persona
  const persona = getPersona(
    wuxing.weakest === '火' || wuxing.weakest === '木' ? 'depleted' :
    wuxing.weakest === '水' ? 'drifting' : 'debt'
  );
  const hook = getHook(persona.type);

  // Map Chinese element key to Symbol Engine Element type
  const engElMap: Record<string, Element> = { '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water' };
  const elementBarColors: Record<string, string> = {
    wood: '#4CAF50', fire: '#FF5722', earth: '#FFC107', metal: '#B0B0B0', water: '#2196F3'
  };
  const elementBarNames: Record<string, string> = {
    wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water'
  };
  const elementBarEmoji: Record<string, string> = {
    wood: '🌳', fire: '🔥', earth: '⛰️', metal: '⚔️', water: '💧'
  };

  // Cross-reference: BaZi dominant element vs Symbol Engine dominant element
  const baziDominantEng = engElMap[wuxing.strongest] || 'earth';
  const symbolEl = symbolOutput?.element;

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
              <div className="flex justify-center gap-3 mt-4">
                {ELEMENT_ORDER.map((el) => (
                  <div key={el} className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full" style={{ background: WUXING_COLORS[el] }} />
                    <span className="text-[10px] text-[#8A8A8A] mt-1">{wuxing.percentages[el]}%</span>
                  </div>
                ))}
              </div>
              {symbolOutput && (
                <p className="text-[10px] text-[#C9A96E] mt-2">Symptom type: {symbolOutput.element}</p>
              )}
              <p className="text-[10px] text-[#B0B0B0] mt-3">lingshu-app.vercel.app</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs text-[#4A7C49]/50 tracking-[0.2em] uppercase mb-1">LingShu · Complete Analysis</p>
          <p className="text-sm text-[#6B6B6B]">{name} · {zodiac} · {lunarDate}</p>
        </div>

        {/* Tag: persona */}
        <div className="bg-white rounded-xl border border-[#EAE5DE] p-4 mb-3 text-center">
          <p className="text-xs text-[#4A7C49] font-medium">{persona.name}</p>
          <p className="text-sm text-[#1A1A1A] mt-1 italic">{`"${hook.text}"`}</p>
        </div>

        {/* Dual Engine Section: Symptom Type (Symbol) + BaZi Dominant */}
        {symbolOutput && (
          <div className="bg-gradient-to-br from-[#FDFBF9] to-[#F8F5F0] rounded-xl border border-[#EAE5DE]/80 p-5 mb-3">
            <p className="text-xs text-[#8A8A8A] text-center tracking-wide mb-3">Your Energy Profile · Cross-Reference</p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-center">
                <p className="text-lg">{elementBarEmoji[symbolOutput.element]}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">Symptom</p>
                <p className="text-sm font-semibold text-[#1A1A1A]">{elementBarNames[symbolOutput.element]}</p>
              </div>
              <div className="text-[#EAE5DE] text-lg">↔</div>
              <div className="text-center">
                <p className="text-lg">{ELEMENT_EMOJI[wuxing.strongest]}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">BaZi</p>
                <p className="text-sm font-semibold text-[#1A1A1A]">{ELEMENT_NAME[wuxing.strongest]}</p>
              </div>
            </div>
            <p className="text-xs text-[#4A4A4A] text-center leading-relaxed">
              {symbolOutput.element === baziDominantEng
                ? 'Your symptoms and birth chart point to the same element. This is a strong signal — your body knows what your chart predicts.'
                : `Your symptoms show ${elementBarNames[symbolOutput.element]} (how you feel), while your BaZi shows ${ELEMENT_NAME[wuxing.strongest]} (how you're built). The gap is where the work is.`}
            </p>
          </div>
        )}

        {/* Symbol Engine: TCM & Emotional Pattern */}
        {symbolOutput && (
          <div className="mb-3">
            <div className="bg-white rounded-xl border border-[#EAE5DE] p-4 mb-2">
              <p className="text-xs text-[#8A8A8A] tracking-wide mb-2">🧬 TCM Body Map</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(symbolOutput.tcm) as [string, string][]).map(([organ, state]) => (
                  <div key={organ} className="flex items-center justify-between bg-[#FBF9F6] rounded-lg px-3 py-2">
                    <span className="text-xs text-[#1A1A1A] capitalize">{organ}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      state === 'balanced' ? 'bg-[#4A7C49]/10 text-[#4A7C49]' :
                      state === 'overactive' || state === 'depleted' ? 'bg-[#C9A96E]/10 text-[#C9A96E]' :
                      'bg-[#EAE5DE] text-[#8A8A8A]'
                    }`}>{state}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#EAE5DE] p-4">
              <p className="text-xs text-[#8A8A8A] tracking-wide mb-1">💭 Emotional Pattern</p>
              <p className="text-sm text-[#1A1A1A]">{symbolOutput.emotionalPattern}</p>
              <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">{symbolOutput.dominantDescription}</p>
            </div>
          </div>
        )}

        {/* Section: Five Elements from BaZi */}
        <div className="bg-gradient-to-br from-[#FDFBF9] to-[#F8F5F0] rounded-xl border border-[#EAE5DE]/80 p-5 mb-3 text-center">
          <p className="text-sm font-semibold text-[#1A1A1A] mb-4">{name}&apos;s BaZi Elements</p>
          {(Object.entries(wuxing.percentages) as [string, number][]).map(([el, pct]) => (
            <div key={el} className="mb-2.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[#1A1A1A] font-medium">{ELEMENT_EMOJI[el]} {ELEMENT_NAME[el]}</span>
                <span className="text-xs text-[#6B6B6B]">{el === wuxing.strongest ? '↑ Dom' : el === wuxing.weakest ? '↓ Low' : ''}</span>
              </div>
              <div className="w-full h-1.5 bg-[#EAE5DE] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: WUXING_COLORS[el] }} />
              </div>
              <div className="text-right text-xs text-[#8A8A8A] mt-0.5">{pct}%</div>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-[#EAE5DE]">
            <p className="text-sm text-[#1A1A1A] leading-relaxed">
              Your <strong>{ELEMENT_NAME[wuxing.strongest]}</strong> is dominant, <strong>{ELEMENT_NAME[wuxing.weakest]}</strong> needs attention.
              Nurture through {ELEMENT_CYCLE[wuxing.weakest] ? ELEMENT_NAME[ELEMENT_CYCLE[wuxing.weakest]] || '' : ELEMENT_NAME[wuxing.weakest]}-related practices.
            </p>
          </div>
        </div>

        {/* Section: BaZi Pillars */}
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

        {/* Section: AI Insights */}
        <div className="mb-3">
          <p className="text-xs text-[#8A8A8A] text-center tracking-wide mb-2">Energy Interpretation</p>
          {(aiSections?.length ? aiSections : insights).slice(0, 3).map((text: string, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-[#EAE5DE] p-4 mb-2 border-l-[3px]"
              style={{ borderLeftColor: i === 0 ? WUXING_COLORS[wuxing.strongest] : i === 1 ? WUXING_COLORS[wuxing.weakest] : '#C9A96E' }}>
              <p className="text-sm text-[#1A1A1A] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Section: Blood Type */}
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

        {/* Section: Symbol Engine Life Recommendations */}
        {symbolOutput && (
          <div className="mb-3">
            <div className="bg-white rounded-xl border border-[#EAE5DE] p-3 mb-2 text-center">
              <p className="text-xs text-[#8A8A8A] tracking-wide">Personalized Recommendations</p>
              <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">For {elementBarNames[symbolOutput.element]} type</p>
            </div>
            {[
              { icon: '🥗', label: 'Food', value: symbolOutput.recommendations.food.slice(0, 3).join(', ') },
              { icon: '🎨', label: 'Colors', value: symbolOutput.recommendations.colors.join(', ') },
              { icon: '🏠', label: 'Environment', value: symbolOutput.recommendations.environment.slice(0, 2).join(', ') },
              { icon: '❤️', label: 'Relationships', value: symbolOutput.recommendations.relationship.slice(0, 2).join(', ') },
              { icon: '🏃', label: 'Movement', value: symbolOutput.recommendations.movement.slice(0, 2).join(', ') },
              { icon: '🌙', label: 'Daily Rhythm', value: symbolOutput.recommendations.dailyRoutine.slice(0, 2).join(', ') },
              { icon: '🧘', label: 'Practice', value: symbolOutput.recommendations.spiritualPractice.slice(0, 2).join(', ') },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-[#EAE5DE] p-3 mb-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-[10px] text-[#8A8A8A] tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section: 6-D Wellness */}
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

        {/* Share + Waitlist */}
        <div className="flex gap-2 mb-3 mt-4">
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
