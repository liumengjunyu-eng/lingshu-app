'use client';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FBF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
          灵枢
        </h1>
        <p style={{ fontSize: '17px', color: '#4A4A4A', marginTop: '16px' }}>
          基于身体状态，帮你找到恢复节奏
        </p>
        <a
          href="/diagnose"
          style={{
            display: 'inline-block',
            marginTop: '32px',
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: 500,
            color: 'white',
            background: '#4A7C49',
            borderRadius: '12px',
            textDecoration: 'none',
          }}
        >
          开始免费诊断 →
        </a>
      </div>
    </main>
  );
}
