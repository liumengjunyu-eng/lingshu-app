'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state';
import {
  getStateLabel,
  getStateInsight,
  getStateEmoji,
} from '@/lib/recovery/engine';
import { getCurrentTask } from '@/lib/recovery/tasks';
import { generateInsight, generateStreakInsight } from '@/lib/recovery/insights';
import { RecoveryStateLevel } from '@/lib/recovery/types';

function deriveLevel(fatigueLevel: number): RecoveryStateLevel {
  if (fatigueLevel >= 8) return 'overloaded';
  if (fatigueLevel >= 6) return 'depleting';
  if (fatigueLevel >= 4) return 'unstable';
  if (fatigueLevel >= 2) return 'recovering';
  return 'stable';
}

export default function RecoveryPage() {
  const router = useRouter();
  const { state, updateState, ready } = useAppState();
  const [feedback, setFeedback] = useState<'done' | 'partial' | 'skip' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentState = useMemo(() => deriveLevel(state.recovery.fatigueLevel), [state.recovery.fatigueLevel]);
  const task = useMemo(() => getCurrentTask(currentState), [currentState]);
  const isPremium = state.premium.isPremium;

  const handleSubmit = () => {
    if (!feedback) return;

    const delta = feedback === 'done' ? -2 : feedback === 'partial' ? -1 : 1;
    const scoreDelta = feedback === 'done' ? 1 : feedback === 'partial' ? 0 : -1;
    const newStreak = feedback === 'done' ? state.recovery.streak + 1 : 0;

    updateState({
      recovery: {
        ...state.recovery,
        fatigueLevel: Math.max(1, Math.min(10, state.recovery.fatigueLevel + delta)),
        recoveryScore: Math.max(0, state.recovery.recoveryScore + scoreDelta),
        streak: newStreak,
        lastTaskId: task?.id ?? null,
      },
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFeedback(null);
  };

  if (!ready) {
    return (
      <main style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>加载中...</p>
        </div>
      </main>
    );
  }

  if (!task) return null;

  const streakMsg = generateStreakInsight(state.recovery.streak);
  const insightText = submitted ? generateInsight(currentState, feedback!) : '';

  const prevLevel = deriveLevel(
    submitted
      ? state.recovery.fatigueLevel
      : currentState === 'overloaded' ? 8 : currentState === 'depleting' ? 6 : currentState === 'unstable' ? 4 : 2
  );

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
        {/* 状态展示 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '4px' }}>{getStateEmoji(currentState)}</div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', letterSpacing: '2px' }}>
            当前恢复状态
          </p>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>
            {getStateLabel(currentState)}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            {getStateInsight(currentState)}
          </p>
        </div>

        {/* 连续完成天数 */}
        {state.recovery.streak > 0 && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500 }}>
              🔥 连续 {state.recovery.streak} 天
            </span>
          </div>
        )}

        {/* 任务卡片 */}
        <div className="card" style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {task.title}
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.7 }}>
            {task.instruction}
          </p>
        </div>

        {/* 反馈区 */}
        {!submitted ? (
          <>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '20px' }}>
              今天完成了吗？
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              {[
                { value: 'done', label: '✅ 完成了' },
                { value: 'partial', label: '🔄 做了一部分' },
                { value: 'skip', label: '⏭️ 今天没做' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFeedback(opt.value as any)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: '10px',
                    border:
                      feedback === opt.value
                        ? '2px solid var(--color-primary)'
                        : '1px solid var(--color-border)',
                    background:
                      feedback === opt.value
                        ? 'var(--color-primary-light)'
                        : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!feedback}
              className="btn-primary"
              style={{ marginTop: '16px', opacity: feedback ? 1 : 0.5 }}
            >
              提交反馈
            </button>
          </>
        ) : (
          <div style={{ marginTop: '24px' }}>
            {/* Insight */}
            <div
              style={{
                padding: '20px',
                background: 'var(--color-primary-light)',
                borderRadius: '16px',
                border: '1px solid var(--color-primary)',
              }}
            >
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                💡 恢复洞察
              </p>
              <p style={{ fontSize: '16px', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>
                “{insightText}”
              </p>
              {streakMsg && (
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '10px' }}>
                  {streakMsg}
                </p>
              )}
            </div>

            {/* 按钮组 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <button onClick={handleReset} className="btn-primary">
                明天继续 →
              </button>
              <button
                onClick={() => router.push('/')}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--color-text-muted)',
                }}
              >
                回到首页
              </button>
              {!isPremium && (
                <button
                  onClick={() => router.push('/pay')}
                  style={{
                    padding: '12px 20px',
                    background: 'var(--color-gold)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  🔓 解锁完整状态调节系统
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
