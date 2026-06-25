'use client';

import { useRouter } from 'next/navigation';

export default function PayPage() {
  const router = useRouter();

  const handleUnlock = () => {
    // 暂时标记为已付费
    const saved = localStorage.getItem('recovery_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.isPremium = true;
      localStorage.setItem('recovery_state', JSON.stringify(parsed));
    }
    router.push('/recovery');
  };

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧠</div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            解锁完整状态调节系统
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            不只是任务，是持续调整你的恢复状态
          </p>
        </div>

        <div className="card" style={{ marginTop: '24px', textAlign: 'left' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: 'var(--color-primary)', fontSize: '18px' }}>✔</span>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>状态预测</div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  未来 3 天恢复趋势预测
                </div>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: 'var(--color-primary)', fontSize: '18px' }}>✔</span>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>深层任务调节</div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  精准匹配你当前状态的恢复任务
                </div>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: 'var(--color-primary)', fontSize: '18px' }}>✔</span>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>恢复趋势图</div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  看到你的恢复状态变化轨迹
                </div>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: 'var(--color-primary)', fontSize: '18px' }}>✔</span>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>增强版洞察句</div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  更强认知替换，打破固有解释
                </div>
              </div>
            </li>
          </ul>
        </div>

        <button
          onClick={handleUnlock}
          className="btn-primary"
          style={{ marginTop: '24px' }}
        >
          解锁完整系统 · ¥69
        </button>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '12px' }}>
          一次购买，永久使用
        </p>
      </div>
    </main>
  );
}
