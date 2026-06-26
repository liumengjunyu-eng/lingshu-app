'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { V2Output } from '@/lib/symbol/v2/types';

const WellnessRadar = dynamic(() => import('@/components/WellnessRadar'), { ssr: false });

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

  const handleShare = () => {
    if (!data) return;
    navigator.share?.({
      title: 'My System Report',
      text: data.narrative_seed,
      url: window.location.href,
    });
  };

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

        {/* Score */}
        <div className="text-center">
          <h1 className="text-2xl font-light">Your System State</h1>
          <p className="text-[#C4A862] text-6xl font-light mt-2">{d.user_profile.intensity_score}</p>
          <p className="text-white/30 text-sm mt-1">System Load Index</p>
        </div>

        {/* 冲击标签 */}
        <div className="mt-6 border border-[#C4A862]/30 rounded-xl p-6 bg-[#C4A862]/5 text-center">
          <p className="text-xs text-white/30 tracking-widest uppercase">System State</p>
          <p className="text-xl text-[#C4A862] font-light mt-1">
            ⚠️ Compensated Collapse State
          </p>
          <p className="text-sm text-white/40 mt-2 max-w-sm mx-auto">
            You are still functioning. Your system is paying for it in the background.
          </p>
          <p className="text-xs text-white/20 mt-4 italic">
            This is a system pattern. It can be mapped — but not solved for free.
          </p>
          <p className="text-xs text-white/10 mt-1">
            You have not hit zero yet. But the cost curve is exponential.
          </p>
        </div>

        {/* 身体 + 情绪摘要 */}
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

        {/* 7天风险预告 */}
        <div className="mt-6 p-4 border border-white/10 rounded-xl bg-white/5">
          <p className="text-xs text-white/30 uppercase">Risk Signal</p>
          <p className="text-sm text-[#C4A862] mt-1 font-light">{d.forecast['7_days']}</p>
          <p className="text-xs text-white/20 mt-1">
            Your 7-day projection shows you are heading toward a recovery wall.
          </p>
        </div>

        {/* 六维调理图（免费层） */}
        <div className="mt-8">
          <div className="text-center mb-4">
            <p className="text-xs text-white/30 tracking-widest uppercase">Element Map</p>
            <p className="text-xs text-white/20 mt-1">Click any element to see your wellness plan</p>
          </div>
          <WellnessRadar
            wood={d.five_elements.wood}
            fire={d.five_elements.fire}
            earth={d.five_elements.earth}
            metal={d.five_elements.metal}
            water={d.five_elements.water}
          />
        </div>

        {/* ============================================================
        Paywall + Share 合体（V2.5核心）
        ============================================================ */}
        <div className="mt-10 border-t border-white/10 pt-8">

          {/* --- 未解锁：付费墙 --- */}
          {!unlocked ? (
            <div className="text-center">
              <h2 className="text-xl font-light">
                Free report shows <span className="text-white/60">WHAT</span> is happening.
              </h2>
              <p className="text-sm text-white/40 mt-2">
                Paid report shows <span className="text-[#C4A862]">WHY</span> it is happening — and what breaks next.
              </p>

              <button
                onClick={handleUnlock}
                className="mt-6 px-8 py-3 bg-[#C4A862] text-[#1A1A1A] rounded-full font-medium hover:opacity-90 transition"
              >
                Unlock Full System Map — $9.99 →
              </button>
            </div>
          ) : (
            /* --- 解锁后：决策 + 恢复路径 + 分享引擎（V2.5核心） --- */
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

              {/* recovery_pathway */}
              <div className="space-y-4">
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Your Recovery Pathway
                </p>

                {(['phase_1', 'phase_2', 'phase_3'] as const).map((phase) => {
                  const p = d.recovery_pathway[phase];
                  return (
                    <div key={phase} className="p-4 border border-white/10 rounded-xl">
                      <p className="text-xs text-white/30 uppercase">{p.label}</p>
                      <p className="text-sm text-white/70 mt-1">{p.action}</p>
                      {p.product && (
                        <p className="text-xs text-[#C4A862] mt-1">
                          → {p.product.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* V2.5 分享引擎（核心新增） */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs text-white/20 italic text-center">
                  Most people don&apos;t see this clearly about themselves.
                </p>

                {/* 叙事种子 + 身份角度 */}
                <div className="mt-4 p-4 border border-white/10 rounded-xl">
                  <p className="text-xs text-white/30 uppercase">Your Narrative</p>
                  <p className="text-sm text-white/70 mt-2">
                    {d.narrative_seed}
                  </p>
                  <p className="text-xs text-[#C4A862] mt-2">
                    {d.share_angle}
                  </p>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="mt-6 w-full px-8 py-3 bg-white text-black rounded-full font-medium hover:opacity-90 transition"
                >
                  Share My System Report →
                </button>

                {/* 底层传播结构提示 */}
                <div className="mt-4 p-3 border border-dashed border-white/5 rounded-xl">
                  <p className="text-[10px] text-white/20 leading-relaxed">
                    {d.share_angle}
                    <br />
                    {d.narrative_seed}
                    <br />
                    Load Index: {d.user_profile.intensity_score} · Pattern: Compensated Collapse State
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
