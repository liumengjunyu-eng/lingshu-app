'use client';

export function HookLine() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <p style={{
        fontSize: '24px',
        fontWeight: 700,
        color: '#2D2D2D',
        lineHeight: 1.4,
        letterSpacing: '-0.3px',
      }}>
        &ldquo;你不是累，<br />
        是你已经很久没有真正恢复过了。&rdquo;
      </p>
      <p style={{
        fontSize: '17px',
        color: '#5B8C5A',
        fontWeight: 500,
        marginTop: '10px',
        lineHeight: 1.5,
      }}>
        &ldquo;你不是懒，你是恢复系统正在重新启动。&rdquo;
      </p>
      <div style={{
        width: '40px',
        height: '2px',
        background: '#D4A853',
        margin: '16px auto 0',
        borderRadius: '1px',
      }} />
    </div>
  );
}
