'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import type { V2Output } from '@/lib/symbol/v2/types';

export default function Result() {
  const [data, setData] = useState<V2Output | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('v2_result');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
    setLoading(false);
  }, []);

  const handleUnlock = () => setUnlocked(true);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#C4A862] animate-pulse text-sm">Loading report...</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white/40 text-sm">No report found. Please take the assessment first.</p>
          <Link href="/diagnose" className="mt-4 inline-block text-[#C4A862]">
            Go to Assessment →
          </Link>
        </div>
      </main>
    );
  }

  const d = data;

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* ============================================================
        免费层：冲击诊断
        ============================================================ */}

        {/* A. System Load Index */}
        <div className="text-center">
          <h1 className="text-2xl font-light">Your System State</h1>
          <p className="text-[#C4A862] text-6xl font-light mt-2">{d.user_profile.intensity_score}</p>
          <p className="text-white/30 text-sm mt-1">System Load Index</p>
        </div>

        {/* B. 冲击诊断标签 */}
        <div className="mt-6 border border-[#C4A862]/30 rounded-xl p-6 bg-[#C4A862]/5 text-center">
          <p className="text-xs text-white/30 tracking-widest uppercase">System State</p>
          <p className="text-xl text-[#C4A862] font-light mt-1">
            ⚠️ Compensated Collapse State
          </p>
          <p className="text-sm text-white/40 mt-2 max-w-sm mx-auto">
            You are still functioning. Your system is paying for it in the background.
          </p>
          {/* ⭐ V2.3 Patch 1: 控制感出口 */}
          <p className="text-xs text-white/20 mt-4 italic">
            This is a system pattern. It can be mapped — but not solved for free.
          </p>
          <p className="text-xs text-white/10 mt-1">
            You have not hit zero yet. But the cost curve is exponential.
          </p>
        </div>

        {/* C. 身体 + 情绪摘要 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 rounded-xl">
            <p className="text-xs text-white/30 uppercase">Body</p>
            <p className="text-sm mt-1 text-white/70 capitalize">{d.body_system.energy_level} energy</p>
            <p className="text-xs text-white/40 mt-0.5">{d.body_system.fatigue_type.replace(/_/g, ' ')}</p>
          </div>
          <div className="p-4 border border-white/10 rounded-xl">
            <p className="text-xs text-white/30 uppercase">Emotion</p>
            <p className="text-sm mt-1 text-white/70">{d.emotion_system.dominant_state.replace(/_/g, ' ')}</p>
            <p className="text-xs text-white/40 mt-0.5 capitalize">{d.emotion_system.volatility} volatility</p>
          </div>
        </div>

        {/* D. 7天风险预告 */}
        <div className="mt-6 p-4 border border-white/10 rounded-xl bg-white/5">
          <p className="text-xs text-white/30 uppercase">Risk Signal</p>
          <p className="text-sm text-[#C4A862] mt-1 font-light">{d.forecast['7_days']}</p>
          <p className="text-xs text-white/20 mt-1">
            Your 7-day projection shows you are heading toward a recovery wall.
          </p>
        </div>

        {/* ============================================================
        付费锁定层
        ============================================================ */}
        <div className="mt-10 border-t border-white/10 pt-8">
          {!unlocked ? (
            /* --- 锁定状态 --- */
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="w-8 h-8 text-[#C4A862]/40" />
              </div>
              <h2 className="text-xl font-light text-white/80">
                What Happens If You Do Nothing
              </h2>
              <p className="text-white/40 text-sm mt-2 max-w-sm mx-auto">
                Your 7-day, 30-day, and 90-day trajectory. See the full recovery pathway.
              </p>
              {/* ⭐ V2.3 Patch 2: 对比结构 */}
              <p className="text-xs text-white/20 mt-3 italic leading-relaxed max-w-xs mx-auto">
                Free report shows WHAT is happening.
                <br />
                Paid report shows WHY it is happening — and what breaks next.
              </p>
              <button
                onClick={handleUnlock}
                className="mt-6 px-8 py-3 bg-[#C4A862] text-[#1A1A1A] rounded-full font-medium hover:opacity-90 transition"
              >
                See What Will Happen Next If You Do Nothing →
              </button>
              <p className="text-xs text-white/20 mt-3">One-time payment. No subscription.</p>
            </div>
          ) : (
            /* --- 解锁后：决策 + 恢复路径 + 产品 --- */
            <div className="space-y-6">
              {/* 决策建议 */}
              {d.decision.actions.length > 0 && (
                <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5">
                  <p className="text-xs text-white/30 uppercase">What You Should Do</p>
                  <ul className="mt-2 space-y-1 text-sm text-white/70">
                    {d.decision.actions.map((a: string, i: number) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 警告 */}
              {d.decision.warnings.length > 0 && (
                <div className="p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                  <p className="text-xs text-red-400 uppercase">Warnings</p>
                  <ul className="mt-2 space-y-1 text-sm text-red-300">
                    {d.decision.warnings.map((w: string, i: number) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 禁忌 */}
              {d.decision.prohibitions.length > 0 && (
                <div className="p-4 border border-white/10 rounded-xl">
                  <p className="text-xs text-white/30 uppercase">Avoid</p>
                  <ul className="mt-2 space-y-1 text-sm text-white/50">
                    {d.decision.prohibitions.map((p: string, i: number) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 恢复协议 */}
              <div className="p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5">
                <p className="text-xs text-white/30 uppercase">Recovery Protocol</p>
                <p className="text-sm text-white/70 mt-1">{d.decision.recoveryProtocol}</p>
              </div>

              {/* ⭐ V2.2核心：恢复路径 + 产品（null 安全） */}
              <div className="space-y-4">
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Your Recovery Pathway
                </p>

                {/* Phase 1 */}
                <div className="p-4 border border-white/10 rounded-xl">
                  <p className="text-xs text-white/30 uppercase">{d.recovery_pathway.phase_1.label}</p>
                  <p className="text-sm text-white/70 mt-1">{d.recovery_pathway.phase_1.action}</p>
                  {d.recovery_pathway.phase_1.product && (
                    <p className="text-xs text-[#C4A862] mt-1">
                      → {d.recovery_pathway.phase_1.product.name}
                    </p>
                  )}
                </div>

                {/* Phase 2 */}
                <div className="p-4 border border-white/10 rounded-xl">
                  <p className="text-xs text-white/30 uppercase">{d.recovery_pathway.phase_2.label}</p>
                  <p className="text-sm text-white/70 mt-1">{d.recovery_pathway.phase_2.action}</p>
                  {d.recovery_pathway.phase_2.product && (
                    <p className="text-xs text-[#C4A862] mt-1">
                      → {d.recovery_pathway.phase_2.product.name}
                    </p>
                  )}
                </div>

                {/* Phase 3 */}
                <div className="p-4 border border-white/10 rounded-xl">
                  <p className="text-xs text-white/30 uppercase">{d.recovery_pathway.phase_3.label}</p>
                  <p className="text-sm text-white/70 mt-1">{d.recovery_pathway.phase_3.action}</p>
                  {d.recovery_pathway.phase_3.product && (
                    <p className="text-xs text-[#C4A862] mt-1">
                      → {d.recovery_pathway.phase_3.product.name}
                    </p>
                  )}
                </div>
              </div>

              {/* ⭐ V2.4 Share Engine View */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs text-white/20 italic text-center">
                  Most people don&apos;t see this clearly about themselves.
                </p>

                {/* Identity Card Preview */}
                <div className="mt-4 p-4 border border-[#C4A862]/20 rounded-xl bg-[#C4A862]/5">
                  <p className="text-xs text-white/30 uppercase tracking-widest">Share Identity</p>
                  <p className="text-sm text-white/70 mt-2">
                    {d.share?.card.title}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {d.share?.card.subtitle}
                  </p>
                  <p className="text-xs text-[#C4A862] mt-1">
                    Load Index: {d.share?.card.score}
                  </p>
                </div>

                {/* Copy Actions */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(d.share?.twitter.text ?? '')}
                    className="w-full py-2 rounded-xl border border-white/10 text-white text-sm hover:border-white/20 transition"
                  >
                    📋 Copy X Post
                  </button>

                  <button
                    onClick={() => navigator.clipboard.writeText(`Hook: ${d.share?.tiktok.hook}\n\n${d.share?.tiktok.body}\n\n${d.share?.tiktok.closing}`)}
                    className="w-full py-2 rounded-xl border border-white/10 text-white text-sm hover:border-white/20 transition"
                  >
                    📋 Copy TikTok Script
                  </button>

                  <button
                    onClick={() => navigator.clipboard.writeText(d.share?.instagram.caption ?? '')}
                    className="w-full py-2 rounded-xl border border-white/10 text-white text-sm hover:border-white/20 transition"
                  >
                    📋 Copy IG Caption
                  </button>

                  <button
                    onClick={() => {/* 后续接入 canvas-to-image */}}
                    className="w-full py-2 bg-[#C4A862] text-black rounded-xl text-sm font-medium hover:opacity-90 transition"
                  >
                    💾 Save Identity Card
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
