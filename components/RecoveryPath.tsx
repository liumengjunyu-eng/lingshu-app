'use client';

type RecoveryState = 'overloaded' | 'depleting' | 'unstable' | 'recovering' | 'stable';

const STAGES = ['消耗期', '波动期', '恢复期', '稳定期'];

const STATE_MAP: Record<RecoveryState, { position: number; next: string }> = {
  overloaded: { position: 0, next: '进入减负阶段' },
  depleting:  { position: 0, next: '进入波动期' },
  unstable:   { position: 1, next: '进入恢复期' },
  recovering: { position: 2, next: '进入稳定期' },
  stable:     { position: 3, next: '已恢复' },
};

interface RecoveryPathProps {
  state: RecoveryState;
}

export function RecoveryPath({ state }: RecoveryPathProps) {
  const current = STATE_MAP[state];
  const pos = current?.position ?? 0;

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
      <p style={{ fontSize: '13px', color: '#8A8A8A', marginBottom: '16px' }}>你的恢复路径</p>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        {/* 背景线 */}
        <div style={{
          position: 'absolute',
          top: '16px', left: '20px', right: '20px',
          height: '2px',
          background: '#E8E3DA',
        }} />
        {/* 进度线 */}
        <div style={{
          position: 'absolute',
          top: '16px', left: '20px',
          height: '2px',
          background: '#5B8C5A',
          transition: 'width 0.8s ease',
          width: `${pos === 0 ? 0 : pos === 1 ? '33%' : pos === 2 ? '66%' : pos === 3 ? '100%' : '0%'}`,
        }} />

        {STAGES.map((stage, i) => (
          <div key={stage} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '34px', height: '34px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 600,
              border: `2px solid ${i <= pos ? '#5B8C5A' : '#E8E3DA'}`,
              background: i <= pos ? '#5B8C5A' : '#FAF8F4',
              color: i <= pos ? '#fff' : '#8A8A8A',
              transition: 'all 0.3s',
            }}>
              {i <= pos ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '6px' }}>{stage}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#2D2D2D' }}>
        当前位置：<strong>{STAGES[pos]}</strong>
        {pos < 3 && (
          <span style={{ color: '#5B8C5A', marginLeft: '6px' }}>→ {current?.next}</span>
        )}
      </div>
    </div>
  );
}
