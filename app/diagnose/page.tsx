'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmotionType } from '@/lib/inference/types';

// 5题答案 → Symbol Engine 输入翻译
const ISSUE_TO_ENGINE: Record<string, { fatigueLevel: number; stressLevel: number; sleepQuality: number; motivation: number; digestion: number; socialLoad: number }> = {
  'sleep_A': { fatigueLevel: 75, stressLevel: 60, sleepQuality: 25, motivation: 50, digestion: 60, socialLoad: 50 },
  'sleep_B': { fatigueLevel: 70, stressLevel: 55, sleepQuality: 30, motivation: 40, digestion: 50, socialLoad: 45 },
  'sleep_C': { fatigueLevel: 80, stressLevel: 65, sleepQuality: 20, motivation: 35, digestion: 45, socialLoad: 55 },
  'sleep_D': { fatigueLevel: 65, stressLevel: 50, sleepQuality: 35, motivation: 55, digestion: 55, socialLoad: 50 },
  'anxiety_A': { fatigueLevel: 70, stressLevel: 80, sleepQuality: 40, motivation: 45, digestion: 50, socialLoad: 50 },
  'anxiety_B': { fatigueLevel: 75, stressLevel: 75, sleepQuality: 35, motivation: 40, digestion: 45, socialLoad: 45 },
  'anxiety_C': { fatigueLevel: 80, stressLevel: 85, sleepQuality: 30, motivation: 30, digestion: 40, socialLoad: 40 },
  'anxiety_D': { fatigueLevel: 60, stressLevel: 70, sleepQuality: 45, motivation: 55, digestion: 55, socialLoad: 50 },
  'direction_A': { fatigueLevel: 60, stressLevel: 55, sleepQuality: 50, motivation: 30, digestion: 60, socialLoad: 40 },
  'direction_B': { fatigueLevel: 55, stressLevel: 60, sleepQuality: 55, motivation: 25, digestion: 55, socialLoad: 35 },
  'direction_C': { fatigueLevel: 65, stressLevel: 50, sleepQuality: 45, motivation: 70, digestion: 50, socialLoad: 45 },
  'direction_D': { fatigueLevel: 60, stressLevel: 45, sleepQuality: 50, motivation: 35, digestion: 55, socialLoad: 40 },
  'relationship_A': { fatigueLevel: 70, stressLevel: 65, sleepQuality: 50, motivation: 50, digestion: 50, socialLoad: 75 },
  'relationship_B': { fatigueLevel: 65, stressLevel: 60, sleepQuality: 55, motivation: 45, digestion: 55, socialLoad: 60 },
  'relationship_C': { fatigueLevel: 75, stressLevel: 70, sleepQuality: 40, motivation: 55, digestion: 45, socialLoad: 70 },
  'relationship_D': { fatigueLevel: 60, stressLevel: 55, sleepQuality: 50, motivation: 40, digestion: 60, socialLoad: 55 },
  'energy_A': { fatigueLevel: 80, stressLevel: 50, sleepQuality: 40, motivation: 40, digestion: 55, socialLoad: 45 },
  'energy_B': { fatigueLevel: 85, stressLevel: 60, sleepQuality: 35, motivation: 30, digestion: 50, socialLoad: 50 },
  'energy_C': { fatigueLevel: 75, stressLevel: 65, sleepQuality: 45, motivation: 50, digestion: 45, socialLoad: 55 },
  'energy_D': { fatigueLevel: 90, stressLevel: 55, sleepQuality: 30, motivation: 25, digestion: 50, socialLoad: 40 },
};

type PrimaryIssue = 'sleep' | 'anxiety' | 'direction' | 'relationship' | 'energy';
type FollowUpChoice = 'A' | 'B' | 'C' | 'D';

const ISSUE_OPTIONS: { value: PrimaryIssue; emoji: string; label: string }[] = [
  { value: 'sleep', emoji: '😴', label: "I haven't been sleeping well" },
  { value: 'anxiety', emoji: '😰', label: 'I feel anxious and drained' },
  { value: 'direction', emoji: '🧭', label: 'I feel lost' },
  { value: 'relationship', emoji: '💔', label: 'Relationships have been difficult' },
  { value: 'energy', emoji: '⚡', label: "My energy keeps dropping" },
];

const FOLLOW_UP_MAP: Record<PrimaryIssue, { value: FollowUpChoice; emoji: string; label: string }[]> = {
  sleep: [
    { value: 'A', emoji: '🤔', label: "Can't stop thinking" },
    { value: 'B', emoji: '🎯', label: 'Waking up at night' },
    { value: 'C', emoji: '😤', label: 'Waking too early' },
    { value: 'D', emoji: '😰', label: "Can't fall asleep" },
  ],
  anxiety: [
    { value: 'A', emoji: '🔄', label: 'Replaying the same worry' },
    { value: 'B', emoji: '😨', label: 'Vague sense of fear' },
    { value: 'C', emoji: '💓', label: 'Heart racing' },
    { value: 'D', emoji: '🙈', label: 'Want to avoid everything' },
  ],
  direction: [
    { value: 'A', emoji: '🤯', label: 'Too much input' },
    { value: 'B', emoji: '😟', label: 'Overthinking, not acting' },
    { value: 'C', emoji: '⚡', label: 'Acting, then regretting' },
    { value: 'D', emoji: '📋', label: "Lists I don't follow" },
  ],
  relationship: [
    { value: 'A', emoji: '🤲', label: 'Over-giving' },
    { value: 'B', emoji: '🤐', label: 'Going silent' },
    { value: 'C', emoji: '💥', label: 'Emotional outbursts' },
    { value: 'D', emoji: '🧊', label: 'Going cold' },
  ],
  energy: [
    { value: 'A', emoji: '🏋️', label: 'Tired after exercise' },
    { value: 'B', emoji: '😫', label: "Body feels heavy" },
    { value: 'C', emoji: '😤', label: 'Irritable' },
    { value: 'D', emoji: '🛌', label: 'Just want to lie down' },
  ],
};

const EMOTION_OPTIONS: { value: EmotionType; emoji: string; label: string }[] = [
  { value: 'exhausted', emoji: '😩', label: 'Constant exhaustion' },
  { value: 'uncomfortable', emoji: '😐', label: "Off, but I can't name it" },
  { value: 'no_motivation', emoji: '😑', label: 'No drive toward the future' },
  { value: 'no_interest', emoji: '😕', label: "Nothing feels interesting" },
  { value: 'never_rested', emoji: '😪', label: 'Always want rest, never rested' },
];

const PROGRESS_STEPS = [
  'Analyzing your recovery state...',
  'Identifying your behavior pattern...',
  'Matching your archetype...',
  'Generating your observations...',
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
      if (!res.ok) throw new Error(data.error || 'Diagnosis failed');

      const engineKey = `${primaryIssue}_${followUpChoice}`;
      const engineInput = ISSUE_TO_ENGINE[engineKey];
      const symbolData = { 
        engineInput, 
        diagnoseResult: { ...data.data, emotion: emo },
        primaryIssue,
        followUpChoice,
      };
      localStorage.setItem('diagnosis_result', JSON.stringify(symbolData));
      router.push('/deep-report');
    } catch (error) {
      console.error('[Diagnosis error]', error);
      alert('Diagnosis failed. Please try again.');
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
    <main className="relative" style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '24px 20px' }}>
      <div style={{ minHeight: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '28px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: step >= s ? 'var(--color-primary)' : 'var(--color-border)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Step 1: Primary issue */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '24px' }}>
              What&apos;s been bothering you lately?
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

        {/* Step 2: Follow-up */}
        {step === 2 && primaryIssue && (
          <div>
            <button onClick={handleBack} style={{
              background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
              fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              ← Back
            </button>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '24px' }}>
              When sleep is off, which fits you more:
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
                  <span style={{ fontWeight: 600, color: 'var(--color-text-muted)', minWidth: '24px' }}>{option.value}</span>
                  <span style={{ fontSize: '18px' }}>{option.emoji}</span>
                  <span style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Emotion */}
        {step === 3 && (
          <div>
            <button onClick={handleBack} style={{
              background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
              fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              ← Back
            </button>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '8px' }}>
              What emotion have you been feeling most recently?
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '24px' }}>
              Pick the closest one. There&apos;s no right or wrong.
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
                    <span style={{ fontWeight: 500 }}>{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
