'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import type { RecoveryStateLevel } from '@/lib/recovery/types';
import { getViralCaption, getSocialComparison, getSocialLabel } from '@/lib/share/captions';
import { RECOVERY_TYPE_MAP } from '@/lib/share/types';
import { trackShare } from '@/lib/share/analytics';

interface ShareButtonProps {
  state: RecoveryStateLevel;
  locale?: string;
}

const LOCALES = ['zh', 'en', 'zh-TW', 'ja', 'ko'] as const;

export function ShareButton({ state, locale }: ShareButtonProps) {
  const params = useParams();
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  const safeLocale = (locale && (LOCALES as readonly string[]).includes(locale))
    ? (locale as 'zh' | 'en')
    : 'zh';
  const caption = getViralCaption(state, safeLocale);
  const socialLabel = getSocialLabel(state, safeLocale);
  const comparison = getSocialComparison(state, safeLocale);
  const meta = RECOVERY_TYPE_MAP[state];

  const handleCopy = async () => {
    trackShare(state, 'share_button');
    try {
      await navigator.clipboard.writeText(caption + '\n\nlingshu.app');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = caption + '\n\nlingshu.app';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {meta?.emoji} 分享你的状态
        </span>
        <button
          onClick={() => setShowPanel(!showPanel)}
          style={{
            fontSize: '13px', padding: '6px 14px', borderRadius: '8px',
            border: '1px solid var(--color-border)', background: 'transparent',
            color: 'var(--color-text-secondary)', cursor: 'pointer',
          }}
        >
          {showPanel ? '收起' : '分享'}
        </button>
      </div>

      {showPanel && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '15px', color: meta?.color, fontWeight: 600 }}>
              {socialLabel}
            </span>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              {comparison}
            </p>
          </div>

          {/* Caption 预览 */}
          <div style={{
            background: 'var(--color-bg)', borderRadius: '10px', padding: '14px',
            marginBottom: '12px', whiteSpace: 'pre-line', lineHeight: 1.6,
            fontSize: '14px', color: 'var(--color-text-primary)',
          }}>
            {caption}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              onClick={handleCopy}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              {copied ? '✓ 已复制' : '复制文案'}
            </button>
            <button
              onClick={() => {
                trackShare(state, 'share_button');
                const text = encodeURIComponent(caption + '\n\nlingshu.app');
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener');
              }}
              style={{
                padding: '12px 16px', fontSize: '14px', borderRadius: '10px',
                border: '1px solid var(--color-border)', background: 'transparent',
                color: 'var(--color-text-primary)', cursor: 'pointer',
              }}
            >
              X
            </button>
            <button
              onClick={() => {
                trackShare(state, 'share_button');
                const text = encodeURIComponent(caption + '\n\nlingshu.app');
                window.open(`https://t.me/share/url?url=https://lingshu.app&text=${text}`, '_blank', 'noopener');
              }}
              style={{
                padding: '12px 16px', fontSize: '14px', borderRadius: '10px',
                border: '1px solid var(--color-border)', background: 'transparent',
                color: 'var(--color-text-primary)', cursor: 'pointer',
              }}
            >
              Telegram
            </button>
          </div>

          {/* Story 卡片入口 */}
          <a
            href={`/${params?.locale || 'zh'}/story`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px', borderRadius: '10px',
              background: '#F5F0E8', color: '#1A1A1A',
              fontSize: '14px', fontWeight: 500, textDecoration: 'none',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '18px' }}>🖼</span>
            生成可分享卡片（9:16）
          </a>
        </>
      )}
    </div>
  );
}
