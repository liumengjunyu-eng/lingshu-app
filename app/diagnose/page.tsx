'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmotionType, EMOTION_LABELS } from '@/lib/inference/types';

type PrimaryIssue = 'sleep' | 'anxiety' | 'direction' | 'relationship' | 'energy';
type FollowUpChoice = 'A' | 'B' | 'C' | 'D';

const ISSUE_OPTIONS: { value: PrimaryIssue; label: string; emoji: string }[] = [
  { value: 'sleep', label: '最近总是睡不好', emoji: '😴' },
  { value: 'anxiety', label: '经常焦虑和内耗', emoji: '😰' },
  { value: 'direction', label: '感觉没有方向', emoji: '🧭' },
  { value: 'relationship', label: '关系让我困扰', emoji: '💔' },
  { value: 'energy', label: '精力越来越差', emoji: '⚡' },
];

const FOLLOW_UP_MAP: Record<PrimaryIssue, { value: FollowUpChoice; label: string; emoji: string }[]> = {
  sleep: [
    { value: 'A', label: '一直想事情停不下来', emoji: '🤔' },
    { value: 'B', label: '总想把事情做到最好', emoji: '🎯' },
    { value: 'C', label: '情绪波动比较大', emoji: '😤' },
    { value: 'D', label: '容易担心未来', emoji: '😰' },
  ],
  anxiety: [
    { value: 'A', label: '反复回想过去的错误', emoji: '🔄' },
    { value: 'B', label: '担心未来最坏的情况', emoji: '😨' },
    { value: 'C', label: '心跳加速、坐立不安', emoji: '💓' },
    { value: 'D', label: '想逃避、什么都不想面对', emoji: '🙈' },
  ],
  direction: [
    { value: 'A', label: '想太多，迟迟无法决定', emoji: '🤯' },
    { value: 'B', label: '害怕选错，希望有人给答案', emoji: '😟' },
    { value: 'C', label: '凭直觉快速做了再说', emoji: '⚡' },
    { value: 'D', label: '列清单理性分析', emoji: '📋' },
  ],
  relationship: [
    { value: 'A', label: '优先满足对方需求', emoji: '🤲' },
    { value: 'B', label: '避免冲突、压抑自己', emoji: '🤐' },
    { value: 'C', label: '直接表达但容易伤到人', emoji: '💥' },
    { value: 'D', label: '理性沟通、不表达情绪', emoji: '🧊' },
  ],
  energy: [
    { value: 'A', label: '硬撑继续做事', emoji: '🏋️' },
    { value: 'B', label: '心里着急但身体动不了', emoji: '😫' },
    { value: 'C', label: '容易烦躁、失去耐心', emoji: '😤' },
    { value: 'D', label: '直接躺平、什么也不做', emoji: '🛌' },
  ],
};

const EMOTION_OPTIONS: { value: EmotionType; emoji: string }[] = [
  { value: 'exhausted', emoji: '😩' },
  { value: 'uncomfortable', emoji: '😐' },
  { value: 'no_motivation', emoji: '😑' },
  { value: 'no_interest', emoji: '😕' },
  { value: 'never_rested', emoji: '😪' },
];

const PROGRESS_STEPS = [
  '正在分析恢复状态...',
  '正在识别行为模式...',
  '正在匹配人格原型...',
  '正在生成观察指标...',
];

export default function DiagnosePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [primaryIssue, setPrimaryIssue] = useState<PrimaryIssue | null>(null);
  const [followUpChoice, setFollowUpChoice] = useState<FollowUpChoice | null>(null);
  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [progressStep, setProgressStep] = useState(0);

  useEffect(() => {
    if (!loading) { setProgressStep(0); return; }
    const interval = setInterval(() => {
      setProgressStep((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [loading]);

  const handleIssueSelect = (issue: PrimaryIssue) => {
    setPrimaryIssue(issue);
    setStep(2);
  };

  const handleFollowUpSelect = (choice: FollowUpChoice) => {
    setFollowUpChoice(choice);
    setStep(3);
  };

  const handleEmotionSelect = async (emo: EmotionType) => {
    setEmotion(emo);
    setLoading(true);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryIssue, followUpChoice, emotion: emo }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '诊断失败');

      // 储存结果 + 情绪
      const result = { ...data.data, emotion: emo };
      localStorage.setItem('diagnosis_result', JSON.stringify(result));
      router.push('/result');
    } catch (error) {
      console.error('[诊断错误]', error);
      alert('诊断失败，请重试');
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 3) { setStep(2); return; }
    if (step === 2) { setStep(1); setFollowUpChoice(null); return; }
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '36px', marginBottom: '20px' }}>🔮</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
            {PROGRESS_STEPS.map((label, index) => (
              <div key={index} style={{
                fontSize: '15px', color: index <= progressStep ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                opacity: index <= progressStep ? 1 : 0.3, transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <span style={{ display: 'inline-block', width: '16px' }}>{index <= progressStep ? '✓' : '○'}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '28px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: step >= s ? 'var(--color-primary)' : 'var(--color-border)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Step 1: 主问题 */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '24px' }}>
              你最近最困扰什么？
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ISSUE_OPTIONS.map((option) => (
                <button key={option.value} onClick={() => handleIssueSelect(option.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                    padding: '16px 20px', background: 'var(--color-bg-card)',
                    border: '1.5px solid var(--color-border)', borderRadius: '12px',
                    fontSize: '16px', color: 'var(--color-text-primary)', cursor: 'pointer',
                    textAlign: 'left', transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 细分 */}
        {step === 2 && primaryIssue && (
          <div>
            <button onClick={handleBack} style={{
              background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
              fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              ← 返回
            </button>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '24px' }}>
              {
                primaryIssue === 'sleep' && '睡不好的时候，你更像：'
                || primaryIssue === 'anxiety' && '焦虑的时候，你更常：'
                || primaryIssue === 'direction' && '面对选择时，你更常：'
                || primaryIssue === 'relationship' && '在关系中，你更常：'
                || primaryIssue === 'energy' && '精力不足时，你更常：'
              }
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FOLLOW_UP_MAP[primaryIssue].map((option) => (
                <button key={option.value} onClick={() => handleFollowUpSelect(option.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                    padding: '16px 20px', background: 'var(--color-bg-card)',
                    border: '1.5px solid var(--color-border)', borderRadius: '12px',
                    fontSize: '16px', color: 'var(--color-text-primary)', cursor: 'pointer',
                    textAlign: 'left', transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                >
                  <span style={{ fontWeight: 500, color: 'var(--color-text-muted)', minWidth: '24px' }}>{option.value}</span>
                  <span style={{ fontSize: '18px' }}>{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 情绪选择 */}
        {step === 3 && (
          <div>
            <button onClick={handleBack} style={{
              background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
              fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              ← 返回
            </button>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '8px' }}>
              你更常感觉到哪种情绪？
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '24px' }}>
              选一个最接近的，没有对错
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {EMOTION_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => handleEmotionSelect(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
                    padding: '16px 20px', background: 'var(--color-bg-card)',
                    border: '1.5px solid var(--color-border)', borderRadius: '12px',
                    fontSize: '16px', color: 'var(--color-text-primary)', cursor: 'pointer',
                    textAlign: 'left', transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{opt.emoji}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 500 }}>{EMOTION_LABELS[opt.value]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
