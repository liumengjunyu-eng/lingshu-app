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
          <div className="text-2xl text-[#C9A96E] mb-4">Consulting the Oracle...</div>
          <div className="animate-pulse text-[#A1A1A6]">Decoding your energy pattern</div>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0D15]">
        <div className="text-center text-red-400 p-8">
          <div className="text-xl mb-4">⚠️ {error || "Failed to generate report"}</div>
          <button onClick={() => window.history.back()} className="text-[#C9A96E] underline">← Go back</button>
        </div>
      </main>
    );
  }

  const { name, bazi, naYin, shishen, lunarDate, zodiac, wuxing, insights } = report;
  const wellnessPlan = getWellnessPlan(wuxing.weakest);
  const dayLabel = ['年柱','月柱','日柱','时柱'];
  const baziKeys = ['year', 'month', 'day', 'hour'] as const;

  return (
    <main className="bg-[#0D0D15] text-[#F5F5F7]">
      {/* 第一屏：能量蓝图 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase">Energy Blueprint</div>
        <h2 className="text-4xl font-bold text-[#C9A96E] mb-2">Your Five Elements</h2>
        <p className="text-[#A1A1A6] mb-2">{zodiac} · {lunarDate}</p>

        {/* 五行能量条 */}
        <div className="w-full max-w-lg space-y-4 mb-12 mt-6">
          {Object.entries(wuxing.percentages).map(([element, percentage]: [string, any]) => (
            <div key={element}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#F5F5F7]">{WUXING_NAMES[element] || element}</span>
                <span className="text-[#C9A96E]">{percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#1A1A2E] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%`, backgroundColor: WUXING_COLORS[element] }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 八字柱 */}
        <div className="flex gap-3 mb-6">
          {baziKeys.map((key, i) => (
            <div key={key} className="text-center">
              <div className="text-xs text-[#636366] mb-1">{dayLabel[i]}</div>
              <div
                className="w-14 h-14 rounded-xl bg-[#1A1A2E] flex flex-col items-center justify-center"
                style={{ borderBottom: `3px solid ${WUXING_COLORS[wuxing.strongest]}` }}
              >
                <div className="text-lg font-bold text-[#F5F5F7]">{bazi[key]}</div>
                <div className="text-xs text-[#C9A96E]">{shishen[key]}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-[#A1A1A6]">
          <p>Dominant <span className="text-[#C9A96E]">{WUXING_NAMES[wuxing.strongest]}</span> · Needs more <span className="text-[#C9A96E]">{WUXING_NAMES[wuxing.weakest]}</span></p>
        </div>
      </section>

      {/* 第二屏：内在能量 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-[#0D0D15] to-[#16162A]">
        <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase">Inner Energy</div>
        <h2 className="text-4xl font-bold text-[#C9A96E] mb-12">How Your Elements Shape You</h2>

        <div className="w-full max-w-2xl space-y-6">
          {insights.map((text: string, i: number) => (
            <div key={i} className="bg-[#1A1A2E] rounded-xl p-6 border-l-4 border-[#C9A96E]">
              <p className="text-[#F5F5F7] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 第三屏：六维调理方案 */}
      {wellnessPlan && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase">Wellness Plan</div>
          <h2 className="text-3xl font-bold text-[#C9A96E] mb-2">6-Dimension Wellness</h2>
          <p className="text-[#A1A1A6] mb-10">
            For your <span className="text-[#C9A96E]">{WUXING_NAMES[wuxing.weakest]}</span> element
          </p>

          <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: '🎨', label: 'Wear', value: wellnessPlan.color },
              { emoji: '🧭', label: 'Direction', value: wellnessPlan.direction },
              { emoji: '🥗', label: 'Nutrition', value: wellnessPlan.food },
              { emoji: '🏃', label: 'Movement', value: wellnessPlan.exercise },
              { emoji: '💆', label: 'Acupoint', value: wellnessPlan.acupoint },
              { emoji: '😴', label: 'Rest', value: wellnessPlan.sleep },
            ].map(item => (
              <div key={item.label} className="bg-[#1A1A2E] rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <div className="text-xs text-[#636366] mb-1">{item.label}</div>
                <div className="text-[#F5F5F7] text-sm">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-4xl mt-6 bg-[#1A1A2E] rounded-xl p-6 border-l-4 border-[#C9A96E]">
            <div className="text-sm text-[#C9A96E] mb-2">📜 Classic Wisdom</div>
            <p className="text-[#F5F5F7] italic leading-relaxed">{wellnessPlan.classic}</p>
            <p className="text-sm text-[#A1A1A6] mt-3">{wellnessPlan.emotion}</p>
          </div>
        </section>
      )}

      {/* 第四屏：每日能量 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-[#0D0D15] to-[#16162A]">
        <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase">Daily Energy</div>
        <h2 className="text-3xl font-bold text-[#C9A96E] mb-10">Today&apos;s Practice</h2>

        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A2E] rounded-xl p-6">
            <div className="text-sm text-green-400 mb-4">✅ DO</div>
            <ul className="space-y-3 text-[#F5F5F7]">
              <li>Wear {wellnessPlan?.color || 'balancing colors'}</li>
              <li>Face {wellnessPlan?.direction || 'your auspicious direction'}</li>
              <li>Eat {wellnessPlan?.food || 'nourishing foods'}</li>
              <li>Practice {wellnessPlan?.exercise || 'gentle movement'}</li>
            </ul>
          </div>

          <div className="bg-[#1A1A2E] rounded-xl p-6">
            <div className="text-sm text-red-400 mb-4">❌ AVOID</div>
            <ul className="space-y-3 text-[#F5F5F7]">
              <li>Overexertion when energy is low</li>
              <li>Late nights (drains {WUXING_NAMES[wuxing.weakest]} energy)</li>
              <li>Cold/raw foods in excess</li>
              <li>Rushing major decisions today</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 第五屏：付费墙 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-4xl font-bold text-[#C9A96E] mb-4">Unlock Full Analysis</h2>
        <p className="text-[#A1A1A6] mb-10 text-center max-w-md">
          You see 30% of your Blueprint. The complete BaZi analysis + 10-year fortune cycles — $9.99.
        </p>

        <div className="w-full max-w-md bg-[#1A1A2E] rounded-2xl p-8 text-center">
          <div className="text-4xl font-bold text-[#C9A96E] mb-6">$9.99</div>
          <ul className="space-y-3 text-left mb-8">
            {[
              'Full 8-character BaZi chart with NaYin',
              '10-year DaYun fortune cycles',
              'Year-by-year life guidance',
              'Relationship compatibility analysis',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-[#F5F5F7]">
                <span className="text-[#C9A96E]">✓</span>{item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => alert("Stripe integration coming soon!")}
            className="w-full py-4 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#0D0D15] font-bold text-lg rounded-xl hover:scale-105 transition"
          >
            Unlock Full Report →
          </button>
          <p className="text-xs text-[#636366] mt-4">One-time payment · Instant access</p>
        </div>
      </section>
    </main>
  );
}

function ReportLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0D15]">
      <div className="text-center">
        <div className="text-2xl text-[#C9A96E] mb-4">Consulting the Oracle...</div>
        <div className="animate-pulse text-[#A1A1A6]">Decoding your energy pattern</div>
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
