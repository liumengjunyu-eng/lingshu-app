// components/EmotionMirror.tsx
'use client';

import { EmotionType, EMOTION_MIRROR, EMOTION_LABELS } from '@/lib/inference/types';

interface EmotionMirrorProps {
  emotion: EmotionType;
}

export function EmotionMirror({ emotion }: EmotionMirrorProps) {
  const data = EMOTION_MIRROR[emotion];
  const label = EMOTION_LABELS[emotion];

  return (
    <div className="card-gold relative overflow-hidden">
      {/* 装饰色块 */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#D9B86C]" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#F5EDE0] rounded-full opacity-40" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-[#8A8A8A] tracking-widest">情绪镜像</span>
          <span className="text-[10px] text-[#B0B0B0] bg-[#F5F0E8] px-2 py-0.5 rounded-full">
            {label}
          </span>
        </div>
        <p className="text-xl font-serif font-semibold text-[#1A1A1A] leading-relaxed">
          {data.insight}
        </p>
        <p className="text-[15px] text-[#4A4A4A] mt-3 leading-relaxed">
          {data.description}
        </p>
        <div className="mt-4 pt-4 border-t border-[#E8DCC8]">
          <p className="text-sm font-medium text-[#4A7C49]">
            → {data.recoveryFocus}
          </p>
        </div>
      </div>
    </div>
  );
}
