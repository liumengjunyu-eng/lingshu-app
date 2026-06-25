"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateReport, WUXING_COLORS, WUXING_NAMES } from "@/lib/bazi-engine";
import { getWellnessPlan } from "@/lib/wellness-data";
import Paywall from "@/components/Paywall";

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
      const bloodType = searchParams.get("bloodType") || "";
      const intent = searchParams.get("intent") || "health";

      const reportData = generateReport({ name, birthYear: year, birthMonth: month, birthDay: day, birthHour: hour, gender, bloodType });

      // 尝试获取 AI 解读（失败不影响页面渲染）
      fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bazi: reportData.bazi,
          naYin: reportData.naYin,
          shishen: reportData.shishen,
          lunarDate: reportData.lunarDate,
          zodiac: reportData.zodiac,
          wuxing: reportData.wuxing,
          intent,
          bloodType,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.sections && data.sections.length > 0) {
            setReport({ ...reportData, intent, insights: data.sections });
          } else {
            setReport({ ...reportData, intent });
          }
        })
        .catch(() => {
          // AI 解读失败，使用规则引擎 fallback
          setReport({ ...reportData, intent });
        });
    } catch (e: any) {
      setError("Failed to generate report: " + (e?.message || "Unknown error"));
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

  const { name, bazi, naYin, shishen, lunarDate, zodiac, wuxing, insights, bloodType, bloodTypeData, intent } = report;

  const intentConfig: Record<string, { icon: string; label: string }> = {
    health: { icon: '🌿', label: 'Body & Energy Focus' },
    career: { icon: '🧭', label: 'Life Direction Focus' },
    relationship: { icon: '💞', label: 'Relationships Focus' },
  };
  const activeIntent = intentConfig[intent as string] || intentConfig.health;
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
        <p className="text-sm text-[#636366] mb-2">Welcome, {name}</p>
        <div className="mb-12 inline-block bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full px-4 py-1.5 text-xs text-[#C9A96E]">
          {activeIntent.icon} {activeIntent.label}
        </div>

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

      {/* 第四屏：血型分析 */}
      {bloodType && bloodTypeData && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-[#0D0D15] to-[#111122]">
          <div className="text-xs text-[#636366] mb-2 tracking-widest uppercase font-semibold">Personality Profile</div>
          <h2 className="text-5xl font-bold text-[#C9A96E] mb-6">Blood Type Analysis</h2>
          <p className="text-lg text-[#A1A1A6] mb-12">Type {bloodType} · Element {bloodTypeData.fiveElement}</p>

          <div className="w-full max-w-4xl">
            {/* 血型基本信息卡片 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-[#C9A96E]/20 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">🧬</span>
                <div>
                  <h3 className="text-2xl font-bold text-[#C9A96E]">Type {bloodType} Personality</h3>
                  <p className="text-sm text-[#636366]">Based on blood type psychology research</p>
                </div>
                <span className="ml-auto text-3xl font-bold text-[#C9A96E]/30">{bloodType}</span>
              </div>

              {/* 性格标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {bloodTypeData.traits.map((trait: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-[#C9A96E]/10 text-[#C9A96E] rounded-full text-sm">
                    {trait}
                  </span>
                ))}
              </div>

              {/* 四宫格详情 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0D0D15]/50 p-4 rounded-xl">
                  <div className="text-xs text-[#636366] mb-1">💪 Strengths</div>
                  <p className="text-[#F5F5F7] text-sm">{bloodTypeData.strength}</p>
                </div>
                <div className="bg-[#0D0D15]/50 p-4 rounded-xl">
                  <div className="text-xs text-[#636366] mb-1">⚠️ Watch Out</div>
                  <p className="text-[#F5F5F7] text-sm">{bloodTypeData.weakness}</p>
                </div>
                <div className="bg-[#0D0D15]/50 p-4 rounded-xl">
                  <div className="text-xs text-[#636366] mb-1">💼 Work Style</div>
                  <p className="text-[#F5F5F7] text-sm">{bloodTypeData.workStyle}</p>
                </div>
                <div className="bg-[#0D0D15]/50 p-4 rounded-xl">
                  <div className="text-xs text-[#636366] mb-1">💕 Love Style</div>
                  <p className="text-[#F5F5F7] text-sm">{bloodTypeData.loveStyle}</p>
                </div>
              </div>

              {/* 健康与沟通 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0D0D15]/50 p-4 rounded-xl border-l-2 border-green-500/50">
                  <div className="text-xs text-green-400 mb-1">🏥 Health Tendency</div>
                  <p className="text-[#F5F5F7] text-sm">{bloodTypeData.healthTendency}</p>
                </div>
                <div className="bg-[#0D0D15]/50 p-4 rounded-xl border-l-2 border-blue-500/50">
                  <div className="text-xs text-blue-400 mb-1">💬 Communication</div>
                  <p className="text-[#F5F5F7] text-sm">{bloodTypeData.communication}</p>
                </div>
              </div>

              {/* 五行联动建议 */}
              {bloodTypeData.combinedAdvice && (
                <div className="bg-gradient-to-r from-[#C9A96E]/10 to-transparent p-5 rounded-xl border-l-4 border-[#C9A96E]">
                  <div className="text-sm text-[#C9A96E] font-semibold mb-2">💡 Blood Type + Five Elements</div>
                  <p className="text-[#F5F5F7] text-sm leading-relaxed">{bloodTypeData.combinedAdvice}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 第五屏：每日能量 */}
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
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#0D0D15]">
        <Paywall reportId={report?.id} userName={report?.name} />
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
