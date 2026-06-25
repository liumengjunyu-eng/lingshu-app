'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateReport, WUXING_COLORS, WUXING_NAMES, BLOOD_TYPE_MAP, getBloodTypeAnalysis } from '@/lib/bazi-engine';
import { getWellnessPlan } from '@/lib/wellness-data';

function ReportContent() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payEmail, setPayEmail] = useState('');
  const [payStatus, setPayStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const name = searchParams.get('name') || 'You';
      const year = parseInt(searchParams.get('year') || '1990');
      const month = parseInt(searchParams.get('month') || '1');
      const day = parseInt(searchParams.get('day') || '1');
      const hour = parseInt(searchParams.get('hour') || '12');
      const gender = searchParams.get('gender') || 'male';
      const bloodType = searchParams.get('bloodType') || '';

      const reportData = generateReport({
        name,
        birthYear: year,
        birthMonth: month,
        birthDay: day,
        birthHour: hour,
        gender,
        bloodType: bloodType || undefined,
      });

      setReport({ ...reportData, bloodType });
      setLoading(false);

      // Async AI interpretation (non-blocking)
      fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bazi: reportData.bazi,
          naYin: reportData.naYin,
          shishen: reportData.shishen,
          lunarDate: reportData.lunarDate,
          zodiac: reportData.zodiac,
          wuxing: reportData.wuxing,
          intent: 'health',
          bloodType,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.sections && data.sections.length > 0) {
            setReport((prev: any) => prev ? { ...prev, aiSections: data.sections } : prev);
          }
        })
        .catch(() => {});
    } catch (e: any) {
      setError(e?.message || 'Failed to generate report');
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔮</div>
          <p style={{ color: 'var(--color-text-muted)' }}>Calculating your energy profile...</p>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '24px', maxWidth: '400px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Generation Failed</p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>{error || 'Please try again'}</p>
          <button onClick={() => window.history.back()} className="btn-primary">Try Again</button>
        </div>
      </main>
    );
  }

  const { name, bazi, naYin, shishen, lunarDate, zodiac, wuxing, insights, bloodType, bloodTypeData, aiSections } = report;
  const baziKeys = ['year', 'month', 'day', 'hour'] as const;
  const dayLabel = ['Year', 'Month', 'Day', 'Hour'];

  // Element generation cycle
  const wuxingCycle: Record<string, string> = { '\u6728': '\u706b', '\u706b': '\u571f', '\u571f': '\u91d1', '\u91d1': '\u6c34', '\u6c34': '\u6728' };

  const elementEmoji: Record<string, string> = {
    '\u6728': '🌳', '\u706b': '🔥', '\u571f': '⛰️', '\u91d1': '⚔️', '\u6c34': '💧',
  };

  const getElementNames: Record<string, string> = {
    '\u6728': 'Wood', '\u706b': 'Fire', '\u571f': 'Earth', '\u91d1': 'Metal', '\u6c34': 'Water',
  };

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px 48px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
            LingShu · Five Elements Report
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {name} · {zodiac} · {lunarDate}
          </p>
        </div>

        {/* Section 1: Five Elements Energy */}
        <div className="card-gold" style={{ marginBottom: '12px', textAlign: 'center', padding: '24px 20px' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            {name}&apos;s Five Elements
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            Your BaZi · {bazi.year} {bazi.month} {bazi.day} {bazi.hour}
          </p>

          {/* Element bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(Object.entries(wuxing.percentages as Record<string, number>)).map(([element, pct]) => (
              <div key={element}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: WUXING_COLORS[element], display: 'inline-block' }} />
                    <span style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{elementEmoji[element] || ''} {getElementNames[element] || element}</span>
                    {element === wuxing.strongest && <span style={{ fontSize: '11px', color: 'var(--color-warning)' }}>↑ Dominant</span>}
                    {element === wuxing.weakest && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>↓ Low</span>}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{pct}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: WUXING_COLORS[element], borderRadius: '3px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Element summary */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              Your <strong>{getElementNames[wuxing.strongest] || wuxing.strongest}</strong> element is dominant, while <strong>{getElementNames[wuxing.weakest] || wuxing.weakest}</strong> is low.
              {wuxingCycle[wuxing.weakest] ? (
                <> {getElementNames[wuxingCycle[wuxing.weakest]] || wuxingCycle[wuxing.weakest]} nurtures {getElementNames[wuxing.weakest] || wuxing.weakest} — try strengthening it through {getElementNames[wuxingCycle[wuxing.weakest]]?.toLowerCase() || wuxingCycle[wuxing.weakest]}-related practices.</>
              ) : (
                <> Balance is key — focus on {getElementNames[wuxing.weakest] || wuxing.weakest}-supporting activities.</>
              )}
            </p>
          </div>
        </div>

        {/* Section 2: BaZi Four Pillars */}
        <div className="card" style={{ marginBottom: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '14px', letterSpacing: '1px' }}>
            BaZi · Four Pillars
          </p>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {baziKeys.map((key, i) => (
              <div
                key={key}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  background: 'var(--color-bg)',
                  borderRadius: '10px',
                  border: `1.5px solid ${WUXING_COLORS[wuxing.strongest]}30`,
                }}
              >
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{dayLabel[i]}</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{bazi[key]}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{shishen[key]}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '12px', lineHeight: 1.4 }}>
            Na Yin: {naYin}
          </p>
        </div>

        {/* Section 3: Inner Energy Interpretation (AI) */}
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px', textAlign: 'center', letterSpacing: '1px' }}>
            Energy Interpretation
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(aiSections && aiSections.length >= 3 ? aiSections : (insights || [])).slice(0, 3).map((text: string, i: number) => (
              <div key={i} className="card" style={{ padding: '16px 20px', borderLeft: `3px solid ${i === 0 ? WUXING_COLORS[wuxing.strongest] : i === 1 ? WUXING_COLORS[wuxing.weakest] : 'var(--color-gold)'}` }}>
                <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Blood Type Analysis */}
        {bloodType && bloodTypeData && (
          <div className="card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>🧬</span>
              <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Type {bloodTypeData.bloodType} · {getElementNames[bloodTypeData.fiveElement] || bloodTypeData.fiveElement} Element
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
              {bloodTypeData.traits.map((trait: string, i: number) => (
                <span key={i} style={{ padding: '3px 10px', fontSize: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '20px' }}>
                  {trait}
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: '10px' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '2px' }}>Strengths</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{bloodTypeData.strength}</p>
              </div>
              <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: '10px' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 600, marginBottom: '2px' }}>Watch For</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{bloodTypeData.weakness}</p>
              </div>
            </div>

            {bloodTypeData.combinedAdvice && (
              <div style={{ padding: '12px', background: 'var(--color-gold-light)', borderRadius: '10px', borderLeft: '3px solid var(--color-gold)' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gold)', marginBottom: '4px' }}>Blood Type + Elements</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{bloodTypeData.combinedAdvice}</p>
              </div>
            )}
          </div>
        )}

        {/* Section 5: 6-Dimension Wellness Plan */}
        {(() => {
          const wellness = getWellnessPlan(wuxing.weakest);
          if (!wellness) return null;
          return (
            <div style={{ marginBottom: '12px' }}>
              <div className="card" style={{ textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>
                  6-Dimension Wellness Plan
                </p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Targeted for {getElementNames[wuxing.weakest] || wuxing.weakest} Enhancement
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { icon: '🎨', label: 'Wear', value: wellness.color },
                  { icon: '🧭', label: 'Direction', value: wellness.direction },
                  { icon: '🥗', label: 'Eat', value: wellness.food },
                  { icon: '🏃', label: 'Exercise', value: wellness.exercise },
                  { icon: '💆', label: 'Acupoint', value: wellness.acupoint },
                  { icon: '😴', label: 'Sleep', value: wellness.sleep },
                ].map((item) => (
                  <div key={item.label} className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>{item.label}</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="card" style={{ marginTop: '8px', borderLeft: '3px solid var(--color-gold)' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '4px' }}>📜 Classical Wisdom</p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>{wellness.classic}</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', marginTop: '8px', lineHeight: 1.5 }}>{wellness.emotion}</p>
              </div>
            </div>
          );
        })()}

        {/* Section 6: Daily Practice */}
        {(() => {
          const wellness = getWellnessPlan(wuxing.weakest);
          if (!wellness) return null;
          return (
            <div style={{ marginBottom: '12px' }}>
              <div className="card" style={{ textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>
                  Today&apos;s Practice
                </p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  4 things you can do today
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="card" style={{ borderLeft: '3px solid var(--color-success)', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '4px' }}>✅ Wear</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{wellness.color}</p>
                </div>
                <div className="card" style={{ borderLeft: '3px solid var(--color-success)', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '4px' }}>✅ Face</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>Face {wellness.direction}</p>
                </div>
                <div className="card" style={{ borderLeft: '3px solid var(--color-success)', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '4px' }}>✅ Eat</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{wellness.food.split(',')[0]}</p>
                </div>
                <div className="card" style={{ borderLeft: '3px solid var(--color-success)', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '4px' }}>✅ Move</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{wellness.exercise.split(',')[0]}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Section 7: Waitlist */}
        <div className="card" style={{ marginBottom: '12px', textAlign: 'center', padding: '24px 20px' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            This is your free report preview
          </p>
          <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '16px' }}>
            Deep analysis launching soon. Join the waitlist.
          </p>
          <button
            onClick={() => setShowPayModal(true)}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Join the Waitlist
          </button>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            We&apos;ll notify you when it launches
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            LingShu · Your energy pattern already knows the answer
          </p>
        </div>
      </div>

      {/* Waitlist Modal */}
      {showPayModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => { setShowPayModal(false); setPayStatus('idle'); setPayEmail(''); }}
        >
          <div
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: '16px',
              padding: '28px 24px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              border: '1px solid var(--color-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {payStatus === 'done' ? (
              <>
                <p style={{ fontSize: '36px', marginBottom: '12px' }}>📩</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  You&apos;re on the list
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
                  We&apos;ll notify you as soon as it launches.
                </p>
                <button
                  onClick={() => { setShowPayModal(false); setPayStatus('idle'); setPayEmail(''); }}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Got it
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔓</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  Deep Analysis Coming Soon
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Leave your email and we&apos;ll notify you.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={payEmail}
                  onChange={(e) => setPayEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '15px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    marginBottom: '12px',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={async () => {
                    if (!payEmail || !payEmail.includes('@')) return;
                    setPayStatus('loading');
                    try {
                      await fetch('/api/waitlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: payEmail }),
                      });
                      setPayStatus('done');
                    } catch {
                      setPayStatus('idle');
                    }
                  }}
                  className="btn-primary"
                  style={{ width: '100%' }}
                  disabled={payStatus === 'loading'}
                >
                  {payStatus === 'loading' ? 'Submitting...' : 'Notify me ✓'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </main>
    }>
      <ReportContent />
    </Suspense>
  );
}
