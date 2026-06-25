// components/RecoveryPath.tsx
'use client';

import { RecoveryStateLevel } from '@/lib/recovery/types';

const PATH_MAP: Record<
  RecoveryStateLevel,
  { label: string; position: 0 | 1 | 2 | 3; next: string }
> = {
  overloaded: { label: '过载期', position: 0, next: '进入减负阶段' },
  depleting:  { label: '消耗期', position: 1, next: '进入波动期' },
  unstable:   { label: '波动期', position: 2, next: '进入恢复期' },
  recovering: { label: '恢复期', position: 3, next: '进入稳定期' },
  stable:     { label: '稳定期', position: 3, next: '已恢复' },
};

const STAGES = ['消耗期', '波动期', '恢复期', '稳定期'];

interface RecoveryPathProps {
  state: RecoveryStateLevel;
}

export function RecoveryPath({ state }: RecoveryPathProps) {
  const current = PATH_MAP[state];
  const currentIndex = current?.position ?? 0;

  return (
    <div className="card">
      <p className="body-caption mb-5">你的恢复路径</p>

      <div className="relative">
        {/* 连接线 */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#EAE5DE] -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-[#4A7C49] -translate-y-1/2 transition-all duration-1000 ease-out"
          style={{ width: `${(currentIndex / 3) * 100}%` }}
        />

        {/* 节点 */}
        <div className="relative flex justify-between">
          {STAGES.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={stage} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    isCompleted
                      ? 'border-[#4A7C49] bg-[#4A7C49] text-white shadow-[0_2px_8px_rgba(74,124,73,0.2)]'
                      : 'border-[#EAE5DE] bg-white text-[#B0B0B0]'
                  } ${isCurrent && isCompleted ? 'ring-4 ring-[#4A7C49]/20' : ''}`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isCompleted ? 'text-[#1A1A1A]' : 'text-[#B0B0B0]'
                  }`}
                >
                  {stage}
                </span>
                {isCurrent && (
                  <span className="text-[10px] text-[#4A7C49] font-medium mt-0.5">
                    ｜当前位置
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#EAE5DE] text-center">
        <span className="text-sm text-[#4A4A4A]">
          当前位置：<span className="font-semibold text-[#1A1A1A]">{current?.label ?? '未知'}</span>
        </span>
        <span className="text-sm text-[#4A7C49] ml-2 font-medium">
          → {current?.next ?? ''}
        </span>
      </div>
    </div>
  );
}
