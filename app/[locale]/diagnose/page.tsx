'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/i18n/context';
import { EmotionType, EMOTION_LABELS } from '@/lib/inference/types';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type PrimaryIssue = 'sleep' | 'anxiety' | 'direction' | 'relationship' | 'energy';
type FollowUpChoice = 'A' | 'B' | 'C' | 'D';

const ISSUE_OPTIONS: { value: PrimaryIssue; emoji: string }[] = [
  { value: 'sleep', emoji: '😴' },
  { value: 'anxiety', emoji: '😰' },
  { value: 'direction', emoji: '🧭' },
  { value: 'relationship', emoji: '💔' },
  { value: 'energy', emoji: '⚡' },
];

const FOLLOW_UP_MAP: Record<PrimaryIssue, { value: FollowUpChoice; emoji: string }[]> = {
  sleep: [
    { value: 'A', emoji: '🤔' },
    { value: 'B', emoji: '🎯' },
    { value: 'C', emoji: '😤' },
    { value: 'D', emoji: '😰' },
  ],
  anxiety: [
    { value: 'A', emoji: '🔄' },
    { value: 'B', emoji: '😨' },
    { value: 'C', emoji: '💓' },
    { value: 'D', emoji: '🙈' },
  ],
  direction: [
    { value: 'A', emoji: '🤯' },
    { value: 'B', emoji: '😟' },
    { value: 'C', emoji: '⚡' },
    { value: 'D', emoji: '📋' },
  ],
  relationship: [
    { value: 'A', emoji: '🤲' },
    { value: 'B', emoji: '🤐' },
    { value: 'C', emoji: '💥' },
    { value: 'D', emoji: '🧊' },
  ],
  energy: [
    { value: 'A', emoji: '🏋️' },
    { value: 'B', emoji: '😫' },
    { value: 'C', emoji: '😤' },
    { value: 'D', emoji: '🛌' },
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
  const t = useTranslations('diagnose');
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
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
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
              {t('step1')}
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
                  {t(`options.${option.value}`)}
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
              {t('step2')}
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
              {t('step3')}
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
