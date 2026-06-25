'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { track } from '@/lib/track';
import { getPersona, getHook } from '@/lib/persona';
import { ShareCard } from '@/components/ShareCard';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '50');
  const type = searchParams.get('type') || 'depleted';

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const persona = getPersona(type);
  const hook = getHook(type);

  useEffect(() => {
    track('result_view', { score, type, persona: persona.name });
  }, []);

  const handleShare = async () => {
    track('share_click', { score, type, hook: hook.id });

    if (!cardRef.current) return;
    setLoading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FBF9F6',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `lingshu_${type}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setSaved(true);
      track('share_success', { score, type, hook: hook.id });

      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const text = `${persona.name}\n\n\u201c${hook.text}\u201d\n\nScore: ${score}/100\n\nFind yours \u2192 lingshu.app`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* 隐藏的分享卡片 */}
        <div className="absolute left-[-9999px] top-0">
          <ShareCard ref={cardRef} score={score} type={type} />
        </div>

        {/* 结果显示 */}
        <div className="text-center">
          <div className="text-sm text-[#4A7C49] font-medium">{persona.name}</div>
          <div className="text-5xl font-bold text-[#1A1A1A] mt-2">{score}</div>
          <div className="text-sm text-[#8A8A8A]">/ 100</div>
          <div className="mt-4 text-xl font-medium text-[#1A1A1A]">{persona.label}</div>
          <p className="mt-2 text-[#4A4A4A]">{`\u201c${hook.text}\u201d`}</p>
        </div>

        {/* 分享按钮 */}
        <button
          onClick={handleShare}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#4A7C49] text-white font-medium hover:bg-[#3D6A3C] transition disabled:opacity-50"
        >
          {loading ? 'Generating…' : saved ? '✓ Saved' : '📸 Share my recovery type'}
        </button>

        {/* 复制文案 */}
        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl bg-white border border-[#EAE5DE] text-[#1A1A1A] font-medium hover:border-[#4A7C49] transition"
        >
          📋 Copy caption
        </button>

        <button
          onClick={() => router.push('/')}
          className="w-full py-3 text-sm text-[#8A8A8A] hover:text-[#1A1A1A] transition"
        >
          Back to home
        </button>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center text-[#8A8A8A]">Loading…</div>}>
      <ResultContent />
    </Suspense>
  );
}
