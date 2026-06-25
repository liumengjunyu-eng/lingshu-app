'use client';

import { EmotionType, EMOTION_MIRROR, EMOTION_LABELS } from '@/lib/inference/types';

interface EmotionMirrorProps {
  emotion: EmotionType;
}

export function EmotionMirror({ emotion }: EmotionMirrorProps) {
  const data = EMOTION_MIRROR[emotion];
  const label = EMOTION_LABELS[emotion];

  return (
    <div className="card" style={{ padding: '24px 20px', borderLeft: '3px solid var(--color-primary)', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', color: '#8A8A8A' }}>💭 情绪镜像</span>
        <span style={{ fontSize: '11px', color: '#8A8A8A', padding: '2px 8px', background: '#E8E3DA', borderRadius: '20px' }}>
          {label}
        </span>
      </div>
      <p style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D', lineHeight: 1.5, marginBottom: '8px' }}>
        <q>{data.insight}</q>
      </p>
      <p style={{ fontSize: '14px', color: '#5A5A5A', lineHeight: 1.7 }}>
        {data.description}
      </p>
      <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #D4A85320' }}>
        <p style={{ fontSize: '14px', color: '#5B8C5A', fontWeight: 500 }}>
          → {data.recoveryFocus}
        </p>
      </div>
    </div>
  );
}
