'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
 const router = useRouter();

 return (
 <main
 style={{
 minHeight: '100vh',
 background: 'var(--color-bg)',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '24px 20px',
 }}
 >
 <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
 <h1
 style={{
 fontSize: '32px',
 fontWeight: 700,
 lineHeight: 1.2,
 color: 'var(--color-text-primary)',
 marginBottom: '8px',
 }}
 >
 睡觉解决不了疲惫。
 <br />
 恢复才能。
 </h1>

 <p
 style={{
 fontSize: '16px',
 color: 'var(--color-text-secondary)',
 marginTop: '12px',
 lineHeight: 1.5,
 }}
 >
 用 1 分钟了解你当前的真实状态，找到适合你的恢复节奏。
 </p>

 <button
 onClick={() => router.push('/diagnose')}
 className="btn-primary"
 style={{ marginTop: '28px' }}
 >
 开始免费诊断
 </button>

 <p
 style={{
 fontSize: '13px',
 color: 'var(--color-text-muted)',
 marginTop: '16px',
 }}
 >
 1 分钟 · 免费 · 已帮助 200+ 人了解自己的恢复状态
 </p>
 </div>
 </main>
 );
}
