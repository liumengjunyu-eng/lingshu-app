// app/page.tsx — 极简首页（MVP Freeze 版）
'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D15] px-6 text-center">
      <div className="max-w-md">
        <div className="text-4xl mb-6">🌀</div>
        <h1 className="text-3xl font-bold text-[#F5F5F7] mb-3">
          灵枢
        </h1>
        <p className="text-[#636366] mb-8 leading-relaxed">
          三个问题，了解你的能量状态
        </p>
        <button
          onClick={() => router.push('/diagnose')}
          className="px-8 py-3 bg-[#C9A96E] text-[#0D0D15] font-semibold rounded-xl text-lg hover:bg-[#E8D5A3] transition"
        >
          开始诊断
        </button>
        <p className="text-[#636366] text-xs mt-6">
          不需要注册 · 不需要输入任何个人信息 · 耗时约 30 秒
        </p>
      </div>
    </main>
  )
}
