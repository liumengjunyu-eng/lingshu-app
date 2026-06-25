'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  calculateState,
  getStateLabel,
  getStateInsight,
  getStateEmoji,
  calculateNextScore,
} from '@/lib/recovery/engine';
import { getCurrentTask } from '@/lib/recovery/tasks';
import { generateInsight, generateStreakInsight } from '@/lib/recovery/insights';
import { UserScore, RecoveryStateLevel } from '@/lib/recovery/types';

const DEFAULT_SCORE: UserScore = {
  fatigue: 60,
  inputLoad: 65,
  recoveryRate: 35,
  stability: 50,
  streak: 0,
  isPremium: false,
};

export default function RecoveryPage() {
  const router = useRouter();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [currentState, setCurrentState] = useState<RecoveryStateLevel | null>(null);
  const [task, setTask] = useState<any>(null);
  const [feedback, setFeedback] = useState<'done' | 'partial' | 'skip' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [insight, setInsight] = useState('');
  const [streakMessage, setStreakMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('recovery_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserScore(parsed);
      const state = calculateState(parsed);
      setCurrentState(state);
      setTask(getCurrentTask(state));
    } else {
      // 首次进入，使用默认值
      setUserScore(DEFAULT_SCORE);
      const state = calculateState(DEFAULT_SCORE);
      setCurrentState(state);
      setTask(getCurrentTask(state));
    }
  }, []);

  const handleSubmit = async () => {
    if (!feedback || !userScore || !currentState || !task) return;

    const newScore = calculateNextScore(userScore, feedback);
    const newState = calculateState(newScore);
    const newInsight = generateInsight(currentState, feedback);
    const streakMsg = generateStreakInsight(newScore.streak);

    localStorage.setItem('recovery_state', JSON.stringify(newScore));
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
      // 静默失败，不影响用户体验
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFeedback(null);
    // 重新加载任务
    if (userScore) {
      const state = calculateState(userScore);
      setCurrentState(state);
      setTask(getCurrentTask(state));
    }
  };

  if (!currentState || !task || !userScore) {
    return (
      <main style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>加载中...</p>
        </div>
      </main>
    );
  }

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
        {userScore.streak > 0 && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500 }}>
              🔥 连续 {userScore.streak} 天
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
              {!userScore.isPremium && (
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
