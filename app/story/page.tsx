'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RECOVERY_TYPE_MAP } from '@/lib/share/types';
import { getViralCaption, getHookLine, getSocialLabel, getSocialComparison } from '@/lib/share/captions';
import { trackShare } from '@/lib/share/analytics';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [ready, setReady] = useState(false);
  const locale = (params.locale as string) || 'zh';
  const safeLocale = (['zh', 'en', 'zh-TW', 'ja', 'ko'].includes(locale) ? locale : 'zh') as 'zh' | 'en';

  useEffect(() => {
    // 优先从 query 参数读取（通过分享链接进入）
    const urlParams = new URLSearchParams(window.location.search);
    const fromQuery = urlParams.get('state');
    const fromScore = parseInt(urlParams.get('score') || '0');

    if (fromQuery && RECOVERY_TYPE_MAP[fromQuery as keyof typeof RECOVERY_TYPE_MAP]) {
      setState(fromQuery);
      setScore(fromScore);
      setReady(true);
      trackShare(fromQuery, 'direct_link');
      return;
    }

    // 无 query 时尝试从 localStorage 读
    const stored = localStorage.getItem('diagnosis_result');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const level: string = data.recoveryLevel || '';
        const mapped =
          level === 'good' ? 'stable'
          : level === 'light' ? 'unstable'
          : level === 'heavy' ? 'overloaded'
          : 'depleting';
        setState(mapped);
        setScore(data.recoveryScore || 0);
        setReady(true);
        trackShare(mapped, 'story_page');
        return;
      } catch {
        // fall through
      }
    }

    // 无数据，引导回首页
    setReady(false);
  }, []);

  if (!ready || !state) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#F5F0E8', gap: '16px',
      }}>
        <p style={{ fontSize: 18, color: '#4A4A4A' }}>未找到诊断结果</p>
        <button
          onClick={() => router.push(`/${locale}/diagnose`)}
          style={{
            padding: '12px 28px', borderRadius: '12px',
            background: '#1A1A1A', color: '#F5F0E8',
            fontSize: 16, border: 'none', cursor: 'pointer',
          }}
        >
          去做测评
        </button>
      </div>
    );
  }

  const data = RECOVERY_TYPE_MAP[state as keyof typeof RECOVERY_TYPE_MAP];
  const hookLine = getHookLine(state as any, safeLocale);
  const caption = getViralCaption(state as any, safeLocale);
  const socialLabel = getSocialLabel(state as any, safeLocale);
  const comparison = getSocialComparison(state as any, safeLocale);

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      background: '#F5F0E8',
    }}>
      {/* 9:16 卡片容器 */}
      <div
        id="story-card"
        style={{
          width: 'min(400px, 92vw)',
          aspectRatio: '9 / 16',
          maxHeight: '90vh',
          marginTop: '24px',
          borderRadius: '24px',
          background: '#FFFFFF',
          boxShadow: '0 8px 40px rgba(26,26,26,0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '36px 28px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 顶部装饰色块 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '6px',
          background: `linear-gradient(90deg, ${data.color}88, ${data.color})`,
        }} />

        {/* 1. HOOK - 1秒抓住注意力 */}
        <div>
          <div style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            fontWeight: 800,
            color: data.color,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}>
            &ldquo;{hookLine}&rdquo;
          </div>
        </div>

        {/* 2. LABEL + COMPARISON */}
        <div>
          <div style={{
            fontSize: 'clamp(22px, 5.5vw, 34px)',
            fontWeight: 700,
            color: '#1A1A1A',
            lineHeight: 1.2,
          }}>
            {socialLabel}
          </div>
          <div style={{
            fontSize: 'clamp(13px, 3.2vw, 16px)',
            color: '#8A8A8A',
            marginTop: '8px',
            lineHeight: 1.4,
          }}>
            {comparison}
          </div>
        </div>

        {/* 3. SCORE */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '8px',
        }}>
          <span style={{
            fontSize: 'clamp(48px, 12vw, 72px)',
            fontWeight: 700,
            color: data.color,
            lineHeight: 1,
          }}>
            {score || '—'}
          </span>
          <span style={{
            fontSize: 'clamp(18px, 4.5vw, 26px)',
            color: '#B0B0B0',
            fontWeight: 500,
          }}>
            / 100
          </span>
        </div>

        {/* 4. CTA */}
        <div style={{
          fontSize: 'clamp(16px, 4vw, 22px)',
          color: data.color,
          fontWeight: 500,
        }}>
          Find yours &rarr; lingshu.app
        </div>
      </div>

      {/* 底部操作栏 */}
      <div style={{
        width: 'min(400px, 92vw)',
        marginTop: '16px', marginBottom: '32px',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>
        <button
          onClick={async () => {
            trackShare(state, 'story_page');
            try {
              await navigator.clipboard.writeText(caption + '\n\nlingshu.app');
              alert('文案已复制 ✓');
            } catch {
              alert('复制失败，请手动复制');
            }
          }}
          style={{
            padding: '14px', borderRadius: '12px',
            background: '#1A1A1A', color: '#F5F0E8',
            fontSize: '16px', fontWeight: 600,
            border: 'none', cursor: 'pointer',
          }}
        >
          复制分享文案
        </button>
        <button
          onClick={() => router.push(`/${locale}/result`)}
          style={{
            padding: '14px', borderRadius: '12px',
            background: 'transparent', color: '#4A4A4A',
            fontSize: '15px', border: '1px solid #EAE5DE',
            cursor: 'pointer',
          }}
        >
          查看完整结果
        </button>
      </div>
    </div>
  );
}
