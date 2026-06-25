// app/diagnose/page.tsx — MVP FREEZE 版
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type PrimaryIssue = 'sleep' | 'anxiety' | 'direction' | 'relationship' | 'energy'
type FollowUpChoice = 'A' | 'B' | 'C' | 'D'

const ISSUE_OPTIONS: { value: PrimaryIssue; label: string }[] = [
  { value: 'sleep', label: '最近总是睡不好' },
  { value: 'anxiety', label: '经常焦虑和内耗' },
  { value: 'direction', label: '感觉没有方向' },
  { value: 'relationship', label: '关系让我困扰' },
  { value: 'energy', label: '精力越来越差' },
]

const FOLLOW_UP_MAP: Record<PrimaryIssue, { value: FollowUpChoice; label: string }[]> = {
  sleep: [
    { value: 'A', label: '一直想事情停不下来' },
    { value: 'B', label: '总想把事情做到最好' },
    { value: 'C', label: '情绪波动比较大' },
    { value: 'D', label: '容易担心未来' },
  ],
  anxiety: [
    { value: 'A', label: '反复回想过去的错误' },
    { value: 'B', label: '担心未来最坏的情况' },
    { value: 'C', label: '心跳加速、坐立不安' },
    { value: 'D', label: '想逃避、什么都不想面对' },
  ],
  direction: [
    { value: 'A', label: '想太多，迟迟无法决定' },
    { value: 'B', label: '害怕选错，希望有人给答案' },
    { value: 'C', label: '凭直觉快速做了再说' },
    { value: 'D', label: '列清单理性分析' },
  ],
  relationship: [
    { value: 'A', label: '优先满足对方需求' },
    { value: 'B', label: '避免冲突、压抑自己' },
    { value: 'C', label: '直接表达但容易伤到人' },
    { value: 'D', label: '理性沟通、不表达情绪' },
  ],
  energy: [
    { value: 'A', label: '硬撑继续做事' },
    { value: 'B', label: '心里着急但身体动不了' },
    { value: 'C', label: '容易烦躁、失去耐心' },
    { value: 'D', label: '直接躺平、什么也不做' },
  ],
}

export default function DiagnosePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [primaryIssue, setPrimaryIssue] = useState<PrimaryIssue | null>(null)
  const [followUpChoice, setFollowUpChoice] = useState<FollowUpChoice | null>(null)

  const handleIssueSelect = (issue: PrimaryIssue) => {
    setPrimaryIssue(issue)
    setStep(2)
  }

  const handleFollowUpSelect = async (choice: FollowUpChoice) => {
    setFollowUpChoice(choice)
    setLoading(true)

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryIssue, followUpChoice: choice }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '诊断失败')
      }

      localStorage.setItem('diagnosis_result', JSON.stringify(data.data))
      router.push('/result')
    } catch (error) {
      console.error('[诊断错误]', error)
      alert('诊断失败，请重试')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D15]">
        <div className="text-center">
          <div className="text-4xl mb-4">🌀</div>
          <p className="text-[#F5F5F7]">正在分析你的状态...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D15] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-[#F5F5F7] text-center mb-6">
              你最困扰的是什么？
            </h1>
            <div className="space-y-3">
              {ISSUE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleIssueSelect(option.value)}
                  className="w-full text-left px-6 py-4 bg-[#1A1A2E] border border-[#333] rounded-xl text-[#F5F5F7] hover:border-[#C9A96E] transition"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && primaryIssue && (
          <div>
            <button
              onClick={() => setStep(1)}
              className="text-[#636366] text-sm mb-4 hover:text-[#F5F5F7] transition"
            >
              ← 返回
            </button>
            <h1 className="text-xl font-bold text-[#F5F5F7] text-center mb-6">
              具体来说，你更像哪一种？
            </h1>
            <div className="space-y-3">
              {FOLLOW_UP_MAP[primaryIssue].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFollowUpSelect(option.value)}
                  className="w-full text-left px-6 py-4 bg-[#1A1A2E] border border-[#333] rounded-xl text-[#F5F5F7] hover:border-[#C9A96E] transition"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
