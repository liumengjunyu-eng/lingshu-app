// components/HookLine.tsx
'use client';

export function HookLine() {
  return (
    <div className="text-center max-w-2xl mx-auto px-4">
      <div className="space-y-4">
        <p className="heading-display leading-[1.15] tracking-[-0.02em]">
          &ldquo;你不是累，
          <br />
          是你已经很久没有真正恢复过了。&rdquo;
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-[#D9B86C] opacity-40" />
          <p className="text-base font-medium text-[#4A7C49] tracking-wide">
            &ldquo;你不是懒，你是恢复系统正在重新启动。&rdquo;
          </p>
          <div className="h-px w-12 bg-[#D9B86C] opacity-40" />
        </div>
      </div>
    </div>
  );
}
