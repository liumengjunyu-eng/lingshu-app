'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmotionType, EMOTION_LABELS } from '@/lib/inference/types';
import { EmotionMirror } from '@/components/EmotionMirror';
import { HookLine } from '@/components/HookLine';
import { RecoveryPath } from '@/components/RecoveryPath';
import { Proverb } from '@/components/Proverb';
import { ShareButton } from '@/components/ShareButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type RecoveryLevel = 'good' | 'light' | 'medium' | 'heavy';

const RECOVERY_MAP: Record<RecoveryLevel, { label: string; description: string }> = {
  good: { label: '恢复良好', description: '你的恢复速度跟上了消耗速度。' },
  light: { label: '轻度透支', description: '恢复速度开始落后，需要关注。' },
  medium: { label: '中度透支', description: '恢复速度已经落后消耗速度。' },
  heavy: { label: '重度透支', description: '恢复系统正在超负荷运行。' },
};

const INSIGHTS = [
  '明明休息了，但还是累。',
  '情绪容易被放大。',
  '精力恢复明显变慢。',
];

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [showBirthForm, setShowBirthForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('diagnosis_result');
    if (!stored) { router.push('/diagnose'); return; }
    setResult(JSON.parse(stored));
  }, [router]);

  const handleFeedback = (isAccurate: boolean) => {
    setFeedback(isAccurate);
    console.log('[灵枢] 用户反馈:', isAccurate ? '准' : '不准');
  };

  if (!result) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>加载中...</p>
      </div>
    );
  }

  const recovery = RECOVERY_MAP[result.recoveryLevel as RecoveryLevel] || RECOVERY_MAP.medium;
  const emotion = result.emotion as EmotionType | undefined;
  const shareState: 'overloaded' | 'depleting' | 'unstable' | 'recovering' | 'stable' =
    result.recoveryLevel === 'good' ? 'stable'
    : result.recoveryLevel === 'light' ? 'unstable'
    : result.recoveryLevel === 'heavy' ? 'overloaded'
    : 'depleting';

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px 48px' }}>
        {/* ① 钉子句 */}
        <HookLine />

        {/* ② 情绪镜像（新增） */}
        {emotion && <EmotionMirror emotion={emotion} />}

        {/* ③ 状态解释 */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{recovery.label}</p>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>{recovery.description}</p>
          <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', marginTop: '12px', lineHeight: 1.5, paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
            身体还能坚持。但恢复已经开始掉队。
          </p>
        </div>

        {/* ④ 恢复路径图（新增） */}
        <RecoveryPath state={result.recoveryLevel === 'good' ? 'stable' : result.recoveryLevel === 'light' ? 'unstable' : result.recoveryLevel === 'heavy' ? 'overloaded' : 'depleting'} />

        {/* ⑤ 机制解释 */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(result.insights || INSIGHTS).map((insight: string, index: number) => (
              <div key={index} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                paddingBottom: index < (result.insights || INSIGHTS).length - 1 ? '12px' : 0,
                borderBottom: index < (result.insights || INSIGHTS).length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
                <span style={{ color: 'var(--color-primary)', fontSize: '18px', lineHeight: 1.4 }}>·</span>
                <span style={{ fontSize: '16px', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ⑥ 分享按钮（社交身份标签） */}
        <ShareButton state={shareState} locale="zh" />

        {/* ⑦ 免费完整报告入口 */}
        <div className="card" style={{ marginBottom: '16px', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>免费查看完整报告</p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
            五行能量图、八字命理、血型分析、六维恢复方案
          </p>
          <button onClick={() => setShowBirthForm(true)} className="btn-primary" style={{ width: '100%' }}>
            免费完整报告
          </button>
        </div>

        {/* ⑧ 今日箴言 */}
        <Proverb />

        {/* 反馈埋点 */}
        <div style={{
          marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>这份结果像你吗？</span>
          <button onClick={() => handleFeedback(true)} style={{
            fontSize: '14px', color: 'var(--color-text-primary)', background: 'transparent',
            border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
          }}>👍 像</button>
          <button onClick={() => handleFeedback(false)} style={{
            fontSize: '14px', color: 'var(--color-text-muted)', background: 'transparent',
            border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
          }}>👎 不像</button>
        </div>

        {/* 出生信息表单弹窗 */}
        {showBirthForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px',
          }}>
            <div style={{
              background: 'var(--color-bg-card)', borderRadius: '16px',
              padding: '28px 24px', maxWidth: '340px', width: '100%',
            }}>
              <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px', textAlign: 'center' }}>
                输入出生信息
              </p>
              <input type="text" placeholder="姓名" id="birth-name" style={{
                width: '100%', padding: '12px 14px', fontSize: '15px', borderRadius: '10px',
                border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                color: 'var(--color-text-primary)', marginBottom: '10px', boxSizing: 'border-box',
              }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <input type="number" placeholder="年" id="birth-year" style={{
                  padding: '12px 14px', fontSize: '15px', borderRadius: '10px',
                  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)', boxSizing: 'border-box',
                }} />
                <input type="number" placeholder="月" id="birth-month" style={{
                  padding: '12px 14px', fontSize: '15px', borderRadius: '10px',
                  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)', boxSizing: 'border-box',
                }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <input type="number" placeholder="日" id="birth-day" style={{
                  padding: '12px 14px', fontSize: '15px', borderRadius: '10px',
                  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)', boxSizing: 'border-box',
                }} />
                <input type="number" placeholder="时 (0-23)" id="birth-hour" style={{
                  padding: '12px 14px', fontSize: '15px', borderRadius: '10px',
                  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)', boxSizing: 'border-box',
                }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => {
                  const name = (document.getElementById('birth-name') as HTMLInputElement).value || '你';
                  const year = parseInt((document.getElementById('birth-year') as HTMLInputElement).value) || 1990;
                  const month = parseInt((document.getElementById('birth-month') as HTMLInputElement).value) || 1;
                  const day = parseInt((document.getElementById('birth-day') as HTMLInputElement).value) || 1;
                  const hour = parseInt((document.getElementById('birth-hour') as HTMLInputElement).value) || 12;
                  const params = new URLSearchParams({ name, gender: 'male', year: year.toString(), month: month.toString(), day: day.toString(), hour: hour.toString(), bloodType: '' });
                  router.push(`/report?${params}`);
                }} className="btn-primary" style={{ flex: 1 }}>生成报告</button>
                <button onClick={() => setShowBirthForm(false)} style={{
                  padding: '12px 16px', fontSize: '15px', borderRadius: '10px',
                  border: '1px solid var(--color-border)', background: 'transparent',
                  color: 'var(--color-text-muted)', cursor: 'pointer',
                }}>取消</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
