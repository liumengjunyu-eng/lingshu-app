import { HookLine } from '@/components/HookLine';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <HookLine />

        <p className="body-large max-w-md mx-auto">
          用 1 分钟了解你当前的真实状态，找到适合你的恢复节奏。
        </p>

        <a
          href="/diagnose"
          className="btn-primary inline-flex w-auto px-12 py-4 mx-auto text-lg"
        >
          开始免费诊断 →
        </a>

        <p className="body-caption mt-6">
          1 分钟 · 免费 · 已帮助 200+ 人了解自己的恢复状态
        </p>
      </div>
    </main>
  );
}
