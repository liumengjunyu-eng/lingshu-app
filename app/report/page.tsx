"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateReport, WUXING_COLORS, WUXING_NAMES } from "@/lib/bazi-engine";
import { getWellnessPlan } from "@/lib/wellness-data";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 URL 参数获取表单数据
    const name = searchParams.get("name") || "You";
    const year = parseInt(searchParams.get("year") || "1990");
    const month = parseInt(searchParams.get("month") || "1");
    const day = parseInt(searchParams.get("day") || "1");
    const hour = parseInt(searchParams.get("hour") || "12");
    const gender = searchParams.get("gender") || "male";

    // 生成报告
    const reportData = generateReport({ name, birthYear: year, birthMonth: month, birthDay: day, birthHour: hour, gender });
    setReport(reportData);
    setLoading(false);
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

  if (!report) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0D15]">
        <div className="text-center text-red-500">Failed to generate report. Please try again.</div>
      </main>
    );
  }

  const { name, bazi, wuxing } = report;
  const wellnessPlan = getWellnessPlan(wuxing.weakest);

  return (
    <main className="bg-[#0D0D15] text-[#F5F5F7]">
      {/* 第一屏：能量蓝图 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <h2 className="text-4xl font-bold text-[#C9A96E] mb-2">Your Energy Blueprint</h2>
        <p className="text-[#A1A1A6] mb-12">The unique pattern of your Five Elements</p>

        {/* 雷达图（简化版 - 用进度条代替） */}
        <div className="w-full max-w-md space-y-4 mb-12">
          {Object.entries(wuxing.percentages).map(([element, percentage]: [string, any]) => (
            <div key={element}>
              <div className="flex justify-between text-sm mb-1">
                <span>{WUXING_NAMES[element] || element}</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full h-3 bg-[#1A1A2E] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: WUXING_COLORS[element]
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 八字柱 */}
        <div className="flex gap-4 mb-8">
          {Object.entries(bazi).map(([pillar, gz]: [string, any]) => (
            <div key={pillar} className="text-center">
              <div className="text-xs text-[#636366] mb-1 capitalize">{pillar}</div>
              <div className="w-16 h-16 rounded-full bg-[#1A1A2E] flex items-center justify-center text-lg font-bold" style={{ borderColor: WUXING_COLORS[wuxing.strongest], borderWidth: 2 }}>
                {gz}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-[#A1A1A6]">
          <p>Your <span className="text-[#C9A96E]">{WUXING_NAMES[wuxing.strongest] || wuxing.strongest}</span> element is dominant</p>
        </div>
      </section>

      {/* 第二屏：内在能量团队 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-[#0D0D15] to-[#1A1A2E]">
        <h2 className="text-4xl font-bold text-[#C9A96E] mb-2">Your Inner Energy Team</h2>
        <p className="text-[#A1A1A6] mb-12">How your elements shape your personality</p>

        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-[#1A1A2E] rounded-lg p-6">
            <h3 className="text-xl text-[#C9A96E] mb-3">Strengths</h3>
            <p className="text-[#F5F5F7] leading-relaxed">
              With {WUXING_NAMES[wuxing.strongest] || wuxing.strongest} as your dominant element, you naturally possess {wuxing.strongest === '木' ? 'growth-oriented leadership' : wuxing.strongest === '火' ? 'radiant charisma' : wuxing.strongest === '土' ? 'grounded stability' : wuxing.strongest === '金' ? 'clear discernment' : 'adaptable wisdom'}. Your energy blueprint suggests someone who {wuxing.strongest === '木' ? 'thrives on expansion and new beginnings' : wuxing.strongest === '火' ? 'inspires others with warmth and enthusiasm' : wuxing.strongest === '土' ? 'provides unwavering support and nourishment' : wuxing.strongest === '金' ? 'sees the truth with remarkable clarity' : 'flows gracefully through lifes changes'}.
            </p>
          </div>

          <div className="bg-[#1A1A2E] rounded-lg p-6">
            <h3 className="text-xl text-[#C9A96E] mb-3">Growth Areas</h3>
            <p className="text-[#F5F5F7] leading-relaxed">
              Your {WUXING_NAMES[wuxing.weakest] || wuxing.weakest} element needs nurturing. When this energy is balanced, youll gain {wuxing.weakest === '木' ? 'flexibility and resilience' : wuxing.weakest === '火' ? 'emotional warmth and connection' : wuxing.weakest === '土' ? 'stability and groundedness' : wuxing.weakest === '金' ? 'clarity and healthy boundaries' : 'wisdom and adaptability'}. Focus on the wellness plan below to strengthen this element.
            </p>
          </div>
        </div>
      </section>

      {/* 第三屏：六维调理方案 */}
      {wellnessPlan && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <h2 className="text-4xl font-bold text-[#C9A96E] mb-2">Your 6-Dimension Wellness Plan</h2>
          <p className="text-[#A1A1A6] mb-12">
            Personalized for your <span className="text-[#C9A96E]">{WUXING_NAMES[wuxing.weakest] || wuxing.weakest}</span> element
          </p>

          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <div className="text-sm text-[#636366] mb-2">Wear</div>
              <div className="text-[#C9A96E]">{wellnessPlan.color}</div>
            </div>

            <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🧭</div>
              <div className="text-sm text-[#636366] mb-2">Direction</div>
              <div className="text-[#C9A96E]">{wellnessPlan.direction}</div>
            </div>

            <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🥗</div>
              <div className="text-sm text-[#636366] mb-2">Nutrition</div>
              <div className="text-[#C9A96E]">{wellnessPlan.food}</div>
            </div>

            <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🏃</div>
              <div className="text-sm text-[#636366] mb-2">Movement</div>
              <div className="text-[#C9A96E]">{wellnessPlan.exercise}</div>
            </div>

            <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">💆</div>
              <div className="text-sm text-[#636366] mb-2">Acupoint</div>
              <div className="text-[#C9A96E]">{wellnessPlan.acupoint}</div>
            </div>

            <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">😴</div>
              <div className="text-sm text-[#636366] mb-2">Rest</div>
              <div className="text-[#C9A96E]">{wellnessPlan.sleep}</div>
            </div>
          </div>

          {/* 经典启示 */}
          <div className="w-full max-w-4xl mt-8 bg-[#1A1A2E] rounded-lg p-6 border-l-4 border-[#C9A96E]">
            <div className="text-sm text-[#C9A96E] mb-2">📜 Classic Wisdom</div>
            <p className="text-[#F5F5F7] italic leading-relaxed">{wellnessPlan.classic}</p>
            <p className="text-sm text-[#A1A1A6] mt-4">{wellnessPlan.emotion}</p>
          </div>
        </section>
      )}

      {/* 第四屏：每日能量提示 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-[#0D0D15] to-[#1A1A2E]">
        <h2 className="text-4xl font-bold text-[#C9A96E] mb-2">Todays Energy Tips</h2>
        <p className="text-[#A1A1A6] mb-12">Align with your energy pattern today</p>

        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A2E] rounded-lg p-6">
            <div className="text-sm text-[#636366] mb-2">✅ DO</div>
            <ul className="space-y-2 text-[#F5F5F7]">
              <li>Wear {wellnessPlan?.color || 'colors that nourish you'}</li>
              <li>Face {wellnessPlan?.direction || 'your auspicious direction'} when working</li>
              <li>Eat {wellnessPlan?.food || 'balancing foods'}</li>
              <li>Practice {wellnessPlan?.exercise || 'gentle movement'}</li>
            </ul>
          </div>

          <div className="bg-[#1A1A2E] rounded-lg p-6">
            <div className="text-sm text-[#636366] mb-2">❌ AVOID</div>
            <ul className="space-y-2 text-[#F5F5F7]">
              <li>Overexertion when energy is low</li>
              <li>Staying up late (drains {WUXING_NAMES[wuxing.weakest] || wuxing.weakest} energy)</li>
              <li>Eating cold/raw foods (harms digestion)</li>
              <li>Making big decisions when out of balance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 第五屏：付费墙 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-4xl font-bold text-[#C9A96E] mb-4">Unlock Your Full Report</h2>
        <p className="text-[#A1A1A6] mb-8 text-center max-w-md">
          Youre seeing 30% of your Energy Blueprint. Get the complete Life Compass Report for just $9.99.
        </p>

        <div className="w-full max-w-md bg-[#1A1A2E] rounded-lg p-8 text-center">
          <div className="text-3xl font-bold text-[#C9A96E] mb-6">$9.99</div>
          <ul className="space-y-3 text-left mb-8">
            <li className="flex items-center gap-2">
              <span className="text-[#C9A96E]">✓</span>
              <span>Complete 8-character BaZi chart analysis</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C9A96E]">✓</span>
              <span>10-year fortune cycle predictions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C9A96E]">✓</span>
              <span>Personalized daily guidance for 1 year</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C9A96E]">✓</span>
              <span>Compatibility analysis with others</span>
            </li>
          </ul>
          <button
            onClick={() => alert("Stripe payment integration coming soon!")}
            className="w-full py-4 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#0D0D15] font-bold text-lg rounded-lg hover:scale-105 transition"
          >
            Unlock Full Report →
          </button>
          <p className="text-xs text-[#636366] mt-4">One-time payment. Instant access. No subscription.</p>
        </div>
      </section>
    </main>
  );
}
