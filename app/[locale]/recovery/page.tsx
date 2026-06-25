'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state';
import {
  calculateState,
  getStateLabel,
  getStateInsight,
  getStateEmoji,
  calculateNextScore,
} from '@/lib/recovery/engine';
import { getTask, clearTaskCache } from '@/lib/behavior';
import { generateInsight, generateStreakInsight } from '@/lib/recovery/insights';
import { UserScore, RecoveryStateLevel } from '@/lib/recovery/types';

export default function RecoveryPage() {
  const router = useRouter();
  const { state: appState, updateState, ready } = useAppState();

  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [currentState, setCurrentState] = useState<RecoveryStateLevel | null>(null);
  const [task, setTask] = useState<any>(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [feedback, setFeedback] = useState<'done' | 'partial' | 'skip' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [insight, setInsight] = useState('');
  const [streakMessage, setStreakMessage] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  // 从全局状态加载恢复数据 + AI 生成任务
  useEffect(() => {
    if (!ready) return;

    const recovery = appState.recovery;
    const premium = appState.premium;

    // 转换 AppState.recovery 为 UserScore 格式
    const score: UserScore = {
      fatigue: recovery.fatigueLevel * 10 + 20,
      inputLoad: 50 + recovery.fatigueLevel * 5,
      recoveryRate: recovery.recoveryScore * 10 + 10,
      stability: 40 + recovery.stage * 8,
      streak: recovery.streak,
      isPremium: premium.isPremium,
    };

    setUserScore(score);
    setIsPremium(premium.isPremium);

    const state = calculateState(score);
    setCurrentState(state);

    // AI 动态任务生成
    const fullState = {
      recovery: recovery,
      premium: premium,
    };
    setTaskLoading(true);

    getTask(fullState as any).then((t: any) => {
      setTask(t);
      setTaskLoading(false);
    });
  }, [ready, appState]);

  const handleSubmit = async () => {
    if (!feedback || !userScore || !currentState || !task) return;

    const newScore = calculateNextScore(userScore, feedback);
    const newState = calculateState(newScore);
    const newInsight = generateInsight(currentState, feedback);
    const streakMsg = generateStreakInsight(newScore.streak);

    // 更新全局状态
    updateState({
      recovery: {
        fatigueLevel: Math.round((newScore.fatigue - 20) / 10),
        recoveryScore: Math.round((newScore.recoveryRate - 10) / 10),
        stage: ['overloaded', 'depleting', 'unstable', 'recovering', 'stable'].indexOf(
          newState
        ),
        streak: newScore.streak,
        lastTaskId: task.id,
      },
    });

    setUserScore(newScore);
    setCurrentState(newState);
    setInsight(newInsight);
    setStreakMessage(streakMsg);
    setSubmitted(true);

    try {
      await fetch('/api/recovery/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: currentState,
          feedback,
          newState,
          score: newScore,
        }),
      });
    } catch (e) {
      // 静默失败
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFeedback(null);
    clearTaskCache();
    if (userScore) {
      const state = calculateState(userScore);
      setCurrentState(state);
      const fullState = {
        recovery: appState.recovery,
        premium: appState.premium,
      };
      setTaskLoading(true);
      getTask(fullState as any).then((t: any) => {
        setTask(t);
        setTaskLoading(false);
      });
    }
  };

  if (!ready || !currentState || !userScore) {
    return (
      <main style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
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
        {userScore.streak > 0 && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500 }}>
              🔥 连续 {userScore.streak} 天
            </span>
          </div>
        )}

        {/* 付费状态 */}
        {isPremium && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-gold)' }}>⭐ 已解锁完整版</span>
          </div>
        )}

        {/* AI 生成任务卡片 */}
        <div className="card" style={{ marginTop: '24px' }}>
          {taskLoading ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
                🧠 正在为你生成任务...
              </p>
            </div>
          ) : task ? (
            <>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {task.title}
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.7 }}>
                {task.instruction}
              </p>
              {task.reasoning && (
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '12px', fontStyle: 'italic' }}>
                  {task.reasoning}
                </p>
              )}
            </>
          ) : null}
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
              disabled={!feedback || taskLoading}
              className="btn-primary"
              style={{ marginTop: '16px', opacity: feedback && !taskLoading ? 1 : 0.5 }}
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
                “{insight}”
              </p>
              {streakMessage && (
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '10px' }}>
                  {streakMessage}
                </p>
              )}
            </div>

            {/* 状态变化提示 */}
            {currentState !== calculateState(userScore) && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  background: 'var(--color-bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  状态正在从 <strong>{getStateLabel(currentState)}</strong>{' '}
                  转向 <strong style={{ color: 'var(--color-primary)' }}>
                    {getStateLabel(calculateState(userScore))}
                  </strong>
                </p>
              </div>
            )}

            {/* 按钮组 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={handleReset}
                className="btn-primary"
              >
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
