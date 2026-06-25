// components/ShareCard.tsx
'use client';

import { forwardRef } from 'react';

interface ShareCardProps {
  title: string;
  mirror: string;
  score: number;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ title, mirror, score }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[500px] bg-cream p-12 rounded-none border border-cream/80"
        style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* 顶部标识 */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-forest/40 text-[10px] tracking-[0.2em] uppercase">
            Recovery Debt
          </span>
          <span className="text-forest/10 text-[10px] tracking-widest">LINGSHU</span>
        </div>

        {/* 分割线 */}
        <div className="w-full h-px bg-forest/5 mb-8" />

        {/* 身份（大） */}
        <h2 className="text-3xl font-bold text-ink tracking-tight leading-tight">
          {title}
        </h2>

        {/* 镜像句 */}
        <p className="text-ink/50 text-lg mt-2 font-light tracking-wide">
          {mirror}
        </p>

        {/* 分割线 */}
        <div className="w-12 h-0.5 bg-gold/30 my-6" />

        {/* 分数（极简） */}
        <div className="flex items-end gap-2">
          <span className="text-5xl font-light text-forest tracking-tight">{score}</span>
          <span className="text-ink/20 text-sm font-light mb-1">/ 100</span>
        </div>

        {/* 底部标识 */}
        <div className="mt-8 pt-6 border-t border-forest/5 flex justify-between items-center">
          <span className="text-ink/15 text-[10px] tracking-widest">RECOVERY INTELLIGENCE</span>
          <span className="text-ink/10 text-[10px] tracking-widest">LINGSHU.APP</span>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
