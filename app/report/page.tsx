"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateReport, WUXING_COLORS, WUXING_NAMES } from "@/lib/bazi-engine";
import { getWellnessPlan } from "@/lib/wellness-data";

function ReportContent() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const name = searchParams.get("name") || "You";
      const year = parseInt(searchParams.get("year") || "1990");
      const month = parseInt(searchParams.get("month") || "1");
      const day = parseInt(searchParams.get("day") || "1");
      const hour = parseInt(searchParams.get("hour") || "12");
      const gender = searchParams.get("gender") || "male";

      const reportData = generateReport({ name, birthYear: year, birthMonth: month, birthDay: day, birthHour: hour, gender });
      setReport(reportData);
    } catch (e: any) {
      setError("Failed to generate report: " + (e?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0D15]">
        <div className="text-center">
          <div className="text-2xl text-[#C9A96E] mb-4 font-bold">Consulting the Oracle...</div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-[#C9A96E] rounded-full animate-pulse"></div>
            <div className="text-[#A1A1A6]">Decoding your energy pattern</div>
            <div className="w-2 h-2 bg-[#C9A96E] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0D15]">
        <div className="text-center text-red-400 p-8 max-w-md">
          <div className="text-3xl mb-4">⚠️</div>
          <div className="text-xl mb-4 font-bold">{error || "Failed to generate report"}</div>
          <button 
            onClick={() => window.history.back()} 
            className="text-[#C9A96E] underline hover:text-[#E8D5A3] transition"
          >
            ← Go back and try again
          </button>
        </div>
      </main>
    );
  }

  const { name, bazi, naYin, shishen, lunarDate, zodiac, wuxing, insights } = report;
  const wellnessPlan = getWellnessPlan(wuxing.weakest);
  const dayLabel = ['年柱','月柱','日柱','时柱'];
  const baziKeys = ['year', 'month', 'day', 'hour'] as const;

  // 五行相生相克关系
  const wuxingRelations: Record<string, { generates: string; controlledBy: string }> = {
    '木': { generates: '火', controlledBy: '金' },
    '火': { generates: '土', controlledBy: '水' },
    '土': { generates: '金', controlledBy: '木' },
    '金': { generates: '水', controlledBy: '火' },
    '水': { generates: '木', controlledBy: '土' }
  };

  return (
    <main className="bg-[#0D0D15] text-[#F5F5F7]">
      {/* 第一屏：能量蓝图 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase font-semibold">Energy Blueprint</div>
        <h2 className="text-5xl font-bold text-[#C9A96E] mb-6">Your Five Elements</h2>
        <p className="text-lg text-[#A1A1A6] mb-2">{zodiac} · {lunarDate}</p>
        <p className="text-sm text-[#636366] mb-12">Welcome, {name}</p>

        {/* 五行能量条 - 改进版 */}
        <div className="w-full max-w-2xl space-y-6 mb-12">
          {Object.entries(wuxing.percentages).map(([element, percentage]: [string, any]) => (
            <div key={element} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: WUXING_COLORS[element] }}
                  ></span>
                  <span className="text-[#F5F5F7] font-medium">{WUXING_NAMES[element]}</span>
                </div>
                <span className="text-[#C9A96E] font-bold text-lg">{percentage}%</span>
              </div>
              <div className="w-full h-3 bg-[#1A1A2E] rounded-full overflow-hidden border border-[#333]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%`, backgroundColor: WUXING_COLORS[element] }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 八字柱 - 改进版 */}
        <div className="mb-8">
          <p className="text-xs text-[#636366] mb-4 text-center tracking-widest">BaZi Chart (Eight Characters)</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {baziKeys.map((key, i) => (
              <div key={key} className="text-center">
                <div className="text-xs text-[#636366] mb-2 font-semibold">{dayLabel[i]}</div>
                <div
                  className="w-20 h-20 rounded-xl bg-[#1A1A2E] flex flex-col items-center justify-center border-2 transition hover:border-[#C9A96E]"
                  style={{ borderColor: WUXING_COLORS[wuxing.strongest] }}
                >
                  <div className="text-xl font-bold text-[#F5F5F7]">{bazi[key]}</div>
                  <div className="text-xs text-[#C9A96E] mt-1">{shishen[key]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 能量总结 */}
        <div className="text-center bg-[#1A1A2E] rounded-xl p-6 border-l-4 border-[#C9A96E] max-w-lg">
          <p className="text-[#F5F5F7] leading-relaxed">
            Dominant <span className="text-[#C9A96E] font-bold">{WUXING_NAMES[wuxing.strongest]}</span> · 
            Needs more <span className="text-[#C9A96E] font-bold">{WUXING_NAMES[wuxing.weakest]}</span>
          </p>
        </div>
      </section>

      {/* 第二屏：内在能量 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-[#0D0D15] to-[#16162A]">
        <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase font-semibold">Inner Energy</div>
        <h2 className="text-5xl font-bold text-[#C9A96E] mb-16">How Your Elements Shape You</h2>

        <div className="w-full max-w-3xl space-y-6">
          {insights.map((text: string, i: number) => (
            <div key={i} className="bg-[#1A1A2E] rounded-xl p-8 border-l-4 border-[#C9A96E] hover:bg-[#242438] transition">
              <p className="text-[#F5F5F7] leading-relaxed text-lg">{text}</p>
            </div>
          ))}
        </div>

        {/* 五行相生相克说明 */}
        <div className="w-full max-w-3xl mt-12 bg-[#1A1A2E] rounded-xl p-8 border border-[#333]">
          <h3 className="text-[#C9A96E] font-bold mb-4">Five Element Dynamics</h3>
          <p className="text-[#A1A1A6] text-sm mb-6 leading-relaxed">
            Your dominant {WUXING_NAMES[wuxing.strongest]} element generates {WUXING_NAMES[wuxingRelations[wuxing.strongest].generates]}, 
            while your weaker {WUXING_NAMES[wuxing.weakest]} element is controlled by {WUXING_NAMES[wuxingRelations[wuxing.weakest].controlledBy]}. 
            Balancing these energies is key to your wellbeing.
          </p>
        </div>
      </section>

      {/* 第三屏：六维调理方案 */}
      {wellnessPlan && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase font-semibold">Wellness Plan</div>
          <h2 className="text-5xl font-bold text-[#C9A96E] mb-4">6-Dimension Wellness</h2>
          <p className="text-lg text-[#A1A1A6] mb-16">
            Strengthen your <span className="text-[#C9A96E] font-bold">{WUXING_NAMES[wuxing.weakest]}</span> element
          </p>

          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { emoji: '🎨', label: 'Wear', value: wellnessPlan.color },
              { emoji: '🧭', label: 'Direction', value: wellnessPlan.direction },
              { emoji: '🥗', label: 'Nutrition', value: wellnessPlan.food },
              { emoji: '🏃', label: 'Movement', value: wellnessPlan.exercise },
              { emoji: '💆', label: 'Acupoint', value: wellnessPlan.acupoint },
              { emoji: '😴', label: 'Rest', value: wellnessPlan.sleep },
            ].map(item => (
              <div key={item.label} className="bg-[#1A1A2E] rounded-xl p-6 text-center border border-[#333] hover:border-[#C9A96E] transition">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <div className="text-xs text-[#636366] mb-2 font-semibold tracking-widest uppercase">{item.label}</div>
                <div className="text-[#F5F5F7] text-base font-medium">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-3xl bg-[#1A1A2E] rounded-xl p-8 border-l-4 border-[#C9A96E]">
            <div className="text-sm text-[#C9A96E] mb-3 font-semibold">📜 Classic Wisdom</div>
            <p className="text-[#F5F5F7] italic leading-relaxed mb-4">{wellnessPlan.classic}</p>
            <p className="text-base text-[#A1A1A6]">{wellnessPlan.emotion}</p>
          </div>
        </section>
      )}

      {/* 第四屏：每日能量 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-[#0D0D15] to-[#16162A]">
        <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase font-semibold">Daily Energy</div>
        <h2 className="text-5xl font-bold text-[#C9A96E] mb-16">Today&apos;s Practice</h2>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DO */}
          <div className="bg-[#1A1A2E] rounded-xl p-8 border-l-4 border-green-500">
            <div className="text-lg text-green-400 mb-6 font-bold">✅ DO</div>
            <ul className="space-y-4 text-[#F5F5F7]">
              <li className="flex gap-3">
                <span className="text-green-400 font-bold">•</span>
                <span>Wear <span className="text-[#C9A96E]">{wellnessPlan?.color || 'balancing colors'}</span></span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 font-bold">•</span>
                <span>Face <span className="text-[#C9A96E]">{wellnessPlan?.direction || 'your auspicious direction'}</span></span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 font-bold">•</span>
                <span>Eat <span className="text-[#C9A96E]">{wellnessPlan?.food || 'nourishing foods'}</span></span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 font-bold">•</span>
                <span>Practice <span className="text-[#C9A96E]">{wellnessPlan?.exercise || 'gentle movement'}</span></span>
              </li>
            </ul>
          </div>

          {/* AVOID */}
          <div className="bg-[#1A1A2E] rounded-xl p-8 border-l-4 border-red-500">
            <div className="text-lg text-red-400 mb-6 font-bold">❌ AVOID</div>
            <ul className="space-y-4 text-[#F5F5F7]">
              <li className="flex gap-3">
                <span className="text-red-400 font-bold">•</span>
                <span>Overexertion when energy is low</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 font-bold">•</span>
                <span>Late nights (drains <span className="text-[#C9A96E]">{WUXING_NAMES[wuxing.weakest]}</span> energy)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 font-bold">•</span>
                <span>Cold/raw foods in excess</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 font-bold">•</span>
                <span>Rushing major decisions today</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 第五屏：付费墙 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-6xl mb-8">🔒</div>
        <h2 className="text-5xl font-bold text-[#C9A96E] mb-6">Unlock Full Analysis</h2>
        <p className="text-lg text-[#A1A1A6] mb-12 text-center max-w-2xl leading-relaxed">
          You&apos;ve seen a preview of your energy blueprint. Unlock the complete analysis with detailed BaZi interpretation, 10-year fortune cycles, and personalized guidance for only <span className="text-[#C9A96E] font-bold">$9.99</span>.
        </p>

        <div className="w-full max-w-md bg-gradient-to-br from-[#1A1A2E] to-[#242438] rounded-2xl p-10 text-center border border-[#C9A96E]/30 shadow-2xl">
          <div className="text-5xl font-bold text-[#C9A96E] mb-2">$9.99</div>
          <p className="text-sm text-[#A1A1A6] mb-8">One-time payment · Instant access</p>
          
          <ul className="space-y-4 text-left mb-10">
            {[
              'Full 8-character BaZi chart with NaYin',
              '10-year DaYun fortune cycles',
              'Year-by-year life guidance',
              'Relationship compatibility analysis',
              'Detailed element balancing strategies',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-[#F5F5F7]">
                <span className="text-[#C9A96E] font-bold mt-0.5">✓</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={async () => {
              const name = searchParams.get("name") || "You";
              const year = searchParams.get("year") || "1990";
              const month = searchParams.get("month") || "1";
              const day = searchParams.get("day") || "1";
              const hour = searchParams.get("hour") || "12";
              const gender = searchParams.get("gender") || "male";
              try {
                const res = await fetch("/api/create-checkout-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, birthYear: parseInt(year), birthMonth: parseInt(month), birthDay: parseInt(day), birthHour: parseInt(hour), gender }),
                });
                const data = await res.json();
                if (data.url) {
                  window.location.href = data.url;
                } else {
                  alert("Payment unavailable: " + (data.error || "Server error"));
                }
              } catch (e) {
                alert("Payment unavailable: Network error");
              }
            }}
            className="w-full py-4 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#0D0D15] font-bold text-lg rounded-xl hover:scale-105 transition shadow-lg"
          >
            Unlock Full Report →
          </button>
        </div>

        <p className="mt-10 text-xs text-[#636366] text-center max-w-md">
          Secure payment powered by Stripe. Your data is encrypted and protected.
        </p>
      </section>
    </main>
  );
}

function ReportLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0D15]">
      <div className="text-center">
        <div className="text-2xl text-[#C9A96E] mb-4 font-bold">Consulting the Oracle...</div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-[#C9A96E] rounded-full animate-pulse"></div>
          <div className="text-[#A1A1A6]">Decoding your energy pattern</div>
          <div className="w-2 h-2 bg-[#C9A96E] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<ReportLoading />}>
      <ReportContent />
    </Suspense>
  );
}
