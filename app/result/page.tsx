// app/result/page.tsx — MVP FREEZE 版
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type RecoveryLevel = 'good' | 'light' | 'medium' | 'heavy'

const RECOVERY_MAP: Record<RecoveryLevel, { label: string; color: string }> = {
  good: { label: '恢复良好', color: '#C9A96E' },
  light: { label: '轻度透支', color: '#E8D4A8' },
  medium: { label: '中度透支', color: '#D4A04A' },
  heavy: { label: '重度透支', color: '#A88B4A' },
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('diagnosis_result')
    if (!stored) {
      router.push('/')
      return
    }
    setResult(JSON.parse(stored))
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D15]">
        <p className="text-[#636366]">加载中...</p>
      </div>
    )
  }

  const recovery = RECOVERY_MAP[result.recoveryLevel as RecoveryLevel]

  return (
    <main className="min-h-screen bg-[#0D0D15] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* 页眉 */}
        <div className="text-center mb-8">
          <div className="text-sm text-[#C9A96E] tracking-widest">灵枢 · 诊断报告</div>
          <h1 className="text-2xl font-bold text-[#F5F5F7] mt-2">
            你的能量状态分析
          </h1>
        </div>

        {/* 恢复等级 */}
        <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-[#333] mb-6 text-center">
          <div className="text-sm text-[#636366]">当前恢复等级</div>
          <div
            className="text-3xl font-bold mt-2"
            style={{ color: recovery.color }}
          >
            {recovery.label}
          </div>
          <div className="flex justify-center gap-8 mt-4 text-sm">
            <div>
              <span className="text-[#636366]">能量</span>
              <span className="text-[#F5F5F7] ml-2">{result.scores.energy}</span>
            </div>
            <div>
              <span className="text-[#636366]">恢复</span>
              <span className="text-[#F5F5F7] ml-2">{result.scores.recovery}</span>
            </div>
            <div>
              <span className="text-[#636366]">压力</span>
              <span className="text-[#F5F5F7] ml-2">{result.scores.stress}</span>
            </div>
          </div>
        </div>

        {/* 人格 */}
        <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-[#333] mb-6">
          <div className="text-sm text-[#636366]">你的类型</div>
          <div className="text-2xl font-bold text-[#C9A96E] mt-1">
            {result.persona.name}
          </div>
          <div className="text-sm text-[#636366] mt-1">
            能量倾向 · {result.persona.element}
          </div>
          <p className="text-[#A1A1A6] text-sm mt-3">{result.persona.description}</p>
        </div>

        {/* 镜像 */}
        <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-[#C9A96E]/20 mb-6">
          <div className="text-sm text-[#636366] mb-2">灵枢观察</div>
          <p className="text-[#F5F5F7] text-lg leading-relaxed">{result.mirror}</p>
        </div>

        {/* 建议 */}
        <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-[#333] mb-6">
          <div className="text-sm text-[#636366] mb-3">今日建议</div>
          <ul className="space-y-2">
            {result.suggestions.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-[#F5F5F7]">
                <span className="text-[#C9A96E]">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* 观察指标 */}
        <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-[#333] mb-8">
          <div className="text-sm text-[#636366] mb-3">
            {result.observation.title}
          </div>
          <ul className="space-y-2">
            {result.observation.items.map((item: string, i: number) => (
              <li key={i} className="text-[#F5F5F7] text-sm">{i + 1}. {item}</li>
            ))}
          </ul>
        </div>

        {/* 反馈 */}
        <div className="text-center border-t border-[#333] pt-6">
          <p className="text-[#636366] text-sm mb-4">
            这段描述像你吗？
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => console.log('[灵枢] 反馈: 很像')}
              className="px-6 py-2 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] hover:border-[#C9A96E] transition"
            >
              👍 很像
            </button>
            <button
              onClick={() => console.log('[灵枢] 反馈: 一般')}
              className="px-6 py-2 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] hover:border-[#C9A96E] transition"
            >
              😐 一般
            </button>
            <button
              onClick={() => console.log('[灵枢] 反馈: 不像')}
              className="px-6 py-2 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] hover:border-[#C9A96E] transition"
            >
              👎 不像
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
