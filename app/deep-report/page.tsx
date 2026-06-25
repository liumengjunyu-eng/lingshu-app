'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { runSymbolEngine } from '@/lib/symbol/engine';
import { generateDeepReport } from '@/lib/symbol/v3/deepReport';
import { runDecisionEngine, type DecisionDomain } from '@/lib/symbol/v3/decisionEngine';
import { createSnapshot, saveSnapshot, getMemory, analyzeEvolution } from '@/lib/symbol/v3/symbolMemory';
import { captureSignal } from '@/lib/symbol/v3/userSignals';
import { loadDiagnoseResult, mapToHumanInput, type DiagnoseResult } from '@/lib/symbol/v3/mapper';
import type { SymbolOutput } from '@/lib/symbol/types';
import html2canvas from 'html2canvas';

type LoadState = 'loading' | 'ready' | 'error';

// Tiny session ID
function sessionId(): string {
  let id = sessionStorage.getItem('ls_session');
  if (!id) { id = crypto.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(36).slice(2)}`; sessionStorage.setItem('ls_session', id); }
  return id;
}

// ---- Color scheme ----
const ELEM_COLORS: Record<string, string> = { wood: '#4A7C59', fire: '#C84B4B', earth: '#B8875A', metal: '#7A8B99', water: '#4B7B9E' };
const ELEM_LABEL: Record<string, string> = { wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water' };

function Bar({ label, value, color, max = 100 }: { label: string; value: number; color: string; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#8B8B8B', marginBottom: '4px' }}>
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div style={{ height: '6px', background: '#E8E4DD', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

function RiskMeter({ label, value, risk }: { label: string; value: number; risk: 'high' | 'medium' | 'low' }) {
  const color = risk === 'high' ? '#C84B4B' : risk === 'medium' ? '#B8875A' : '#4A7C59';
  return (
    <div style={{ padding: '12px 16px', background: '#F0EDE6', borderRadius: '10px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '14px', color: '#3C3C3C' }}>{label}</span>
        <span style={{ fontSize: '18px', fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: '4px', background: '#E0DCD5', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '2px' }} />
      </div>
    </div>
  );
}

function Section({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ marginBottom: '40px' }}>
      <h2 style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontSize: '20px', fontWeight: 600, color: '#2C2C2C', marginBottom: subtitle ? '4px' : '16px' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '16px' }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #D8D2C5, transparent)', margin: '32px 0' }} />;
}

// ============================================================
// Main Page
// ============================================================

export default function DeepReportPage() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>('loading');
  const [symbol, setSymbol] = useState<SymbolOutput | null>(null);
  const [report, setReport] = useState<any>(null);
  const [diagnose, setDiagnose] = useState<DiagnoseResult | null>(null);
  const [evolution, setEvolution] = useState<any>(null);
  const [domainIndex, setDomainIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const sid = sessionId();

  const DOMAINS: { key: DecisionDomain; label: string; icon: string }[] = [
    { key: 'career', label: 'Career', icon: '💼' },
    { key: 'relationship', label: 'Relationships', icon: '💞' },
    { key: 'health', label: 'Health', icon: '🌿' },
    { key: 'location', label: 'Environment', icon: '🏠' },
    { key: 'timing', label: 'Timing', icon: '⏳' },
  ];

  useEffect(() => {
    captureSignal(sid, 'result_view');

    try {
      const dr = loadDiagnoseResult();
      if (!dr) {
        setState('error');
        return;
      }
      setDiagnose(dr);

      // Map to V2 input & run engine
      const input = mapToHumanInput(dr);
      const sym = runSymbolEngine(input);
      setSymbol(sym);

      // Generate deep report
      const snap = createSnapshot(sym);
      const mem = getMemory(sid);
      const rep = generateDeepReport(sym, snap, mem);
      setReport(rep);

      // Evolution
      const evo = mem.length >= 2 ? analyzeEvolution(mem) : null;
      setEvolution(evo);

      // Save memory
      saveSnapshot(sid, snap);

      captureSignal(sid, 'report_generate');

      // Small delay for animation
      setTimeout(() => setState('ready'), 300);
    } catch (e) {
      console.error('[DeepReport]', e);
      setState('error');
    }
  }, []);

  const handleShare = async () => {
    if (!cardRef.current) return;
    captureSignal(sid, 'share_click');
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: '#F5F0E8', logging: false });
      const link = document.createElement('a');
      link.download = `lingshu_deep_report_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      captureSignal(sid, 'share_success');
    } catch { /* hush */ }
  };

  const handleEmail = async () => {
    if (!email || emailSent) return;
    captureSignal(sid, 'waitlist_join');
    setEmailSent(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'deep_report', sessionId: sid }),
      });
    } catch { /* offline ok */ }
  };

  if (state === 'loading') {
    return (
      <main style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>🧬</div>
          <p style={{ fontSize: '15px', color: '#8B8B8B' }}>Building your symbolic profile...</p>
        </div>
      </main>
    );
  }

  if (state === 'error' || !symbol || !report) {
    return (
      <main style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌀</div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#3C3C3C', marginBottom: '8px' }}>No diagnosis found</h1>
          <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '24px' }}>Complete a quick assessment first to unlock your deep report.</p>
          <button onClick={() => router.push('/')}
            style={{ padding: '12px 28px', background: '#2C2C2C', color: '#F5F0E8', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>
            Start Assessment
          </button>
        </div>
      </main>
    );
  }

  const f = symbol.fiveElements;
  const fatigueScore = Math.round(100 - (f.water * 0.4 + f.earth * 0.2));
  const decisionCtx = DOMAINS.map(d => ({ domain: d.key, result: runDecisionEngine({ domain: d.key as DecisionDomain, userId: sid, currentSymbol: symbol }) }));

  // Risk projection
  const risk7 = Math.min(98, Math.round(fatigueScore * 0.6 + (100 - f.water) * 0.3));
  const risk30 = Math.min(98, Math.round(fatigueScore * 0.5 + (100 - f.water) * 0.4));
  const riskExhaust = Math.min(98, Math.round(fatigueScore * 0.7 + (100 - f.water) * 0.2));

  return (
    <main style={{ minHeight: '100vh', background: '#F5F0E8', padding: '0 0 60px' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '13px', color: '#B8B2A5', letterSpacing: '0.5px' }}>LINGSHU</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleShare} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid #D8D2C5', borderRadius: '8px', fontSize: '13px', color: '#5C5C5C', cursor: 'pointer' }}>
              📤 Share
            </button>
          </div>
        </div>

        {/* === PART 1: Current State === */}
        <Section title="Your Current State" subtitle="Based on your 5 answers">
          {/* Recovery Debt */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '13px', color: '#8B8B8B', marginBottom: '8px' }}>Recovery Debt</div>
            <div style={{ fontSize: '56px', fontWeight: 700, color: fatigueScore > 60 ? '#C84B4B' : fatigueScore > 40 ? '#B8875A' : '#4A7C59', lineHeight: 1 }}>
              {fatigueScore}
            </div>
            <div style={{ height: '4px', maxWidth: '160px', margin: '12px auto', background: '#E8E4DD', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${fatigueScore}%`, background: fatigueScore > 60 ? '#C84B4B' : fatigueScore > 40 ? '#B8875A' : '#4A7C59', borderRadius: '2px' }} />
            </div>
          </div>

          {/* Main imbalance */}
          <div style={{ background: '#F0EDE6', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#8B8B8B', marginBottom: '12px' }}>Main Imbalance</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['water', f.water], ['fire', f.fire], ['wood', f.wood], ['earth', f.earth], ['metal', f.metal]]
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([el, v]) => (
                  <div key={el as string} style={{ textAlign: 'center', minWidth: '48px' }}>
                    <div style={{ fontSize: '22px', opacity: (v as number) < 40 ? 0.4 : (v as number) > 70 ? 1 : 0.7 }}>
                      {(v as number) < 30 ? '↓↓' : (v as number) < 45 ? '↓' : (v as number) > 65 ? '↑' : (v as number) > 80 ? '↑↑' : '–'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8B8B8B', textTransform: 'uppercase' }}>{ELEM_LABEL[el as string]}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: ELEM_COLORS[el as string] }}>{Math.round(v as number)}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Mirror line */}
          <p style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontSize: '16px', fontStyle: 'italic', color: '#5C5C5C', textAlign: 'center', lineHeight: 1.6 }}>
            &ldquo;{report.hook?.text || diagnose?.insights?.[0] || 'Your energy pattern reveals what words cannot express.'}&rdquo;
          </p>
        </Section>

        <Divider />

        {/* === PART 2: Why You're Like This === */}
        <Section title="Why You&rsquo;re Like This" subtitle="How the system sees your pattern">
          <div style={{ background: '#F0EDE6', borderRadius: '12px', padding: '16px' }}>
            {/* Archetype */}
            <div style={{ marginBottom: '16px', padding: '12px', background: '#E8E4DD', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#8B8B8B', marginBottom: '4px' }}>ARCHETYPE</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#2C2C2C' }}>{symbol.persona.primary}</div>
            </div>

            {/* Element bars */}
            {(['wood', 'fire', 'earth', 'metal', 'water'] as const).map(el => (
              <Bar key={el} label={ELEM_LABEL[el]} value={f[el]} color={ELEM_COLORS[el]} />
            ))}

            <div style={{ fontSize: '13px', color: '#5C5C5C', marginTop: '12px', padding: '12px', background: '#E8E4DD', borderRadius: '8px', lineHeight: 1.6 }}>
              {symbol.persona.description}
            </div>

            {/* Conflict detection from report */}
            {report.sections.filter((s: any) => s.title === 'Cross-System Conflicts').map((s: any, i: number) => (
              <div key={i} style={{ marginTop: '12px', padding: '12px', background: '#E8E4DD', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#8B8B8B', marginBottom: '8px' }}>{s.icon} {s.title}</div>
                {s.content.map((c: string, j: number) => (
                  <p key={j} style={{ fontSize: '13px', color: '#5C5C5C', lineHeight: 1.5, marginBottom: j < s.content.length - 1 ? '6px' : 0 }}>{c}</p>
                ))}
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* === PART 3: Risk Forecast === */}
        <Section title="Risk Forecast" subtitle="Projected trends based on your current state">
          <p style={{ fontSize: '13px', color: '#B8875A', marginBottom: '16px', padding: '8px 12px', background: '#F0EDE6', borderRadius: '8px' }}>
            🧭 Not a prediction. A projection of your current trajectory.
          </p>
          <RiskMeter label="Attention decline risk" value={risk7} risk={risk7 > 60 ? 'high' : risk7 > 40 ? 'medium' : 'low'} />
          <RiskMeter label="Emotional exhaustion risk" value={risk30} risk={risk30 > 50 ? 'high' : risk30 > 35 ? 'medium' : 'low'} />
          <RiskMeter label="Sleep quality deterioration risk" value={riskExhaust} risk={riskExhaust > 55 ? 'high' : riskExhaust > 40 ? 'medium' : 'low'} />

          {fatigueScore > 55 && (
            <p style={{ fontSize: '13px', color: '#C84B4B', marginTop: '12px', padding: '10px 14px', background: '#F0EDE6', borderRadius: '8px', lineHeight: 1.5 }}>
              ⚠ Your recovery debt ({fatigueScore}) is above the sustainable threshold. Without intervention, cognitive and emotional functions degrade progressively.
            </p>
          )}
        </Section>

        <Divider />

        {/* === PART 4: Decision Recommendations === */}
        <Section title="Decision Guide" subtitle="5 areas of life — matched to your system state">
          {/* Domain tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {DOMAINS.map((d, i) => (
              <button key={d.key} onClick={() => setDomainIndex(i)}
                style={{ flexShrink: 0, padding: '8px 14px', background: i === domainIndex ? '#2C2C2C' : '#F0EDE6', color: i === domainIndex ? '#F5F0E8' : '#5C5C5C', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {d.icon} {d.label}
              </button>
            ))}
          </div>

          {/* Domain content */}
          {decisionCtx[domainIndex] && (
            <div style={{ background: '#F0EDE6', borderRadius: '12px', padding: '16px' }}>
              {decisionCtx[domainIndex].result.topPick && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#2C2C2C', marginBottom: '4px' }}>
                    ✓ {decisionCtx[domainIndex].result.topPick.label}
                  </div>
                  <p style={{ fontSize: '13px', color: '#5C5C5C', lineHeight: 1.5 }}>{decisionCtx[domainIndex].result.topPick.reason}</p>
                </div>
              )}
              {decisionCtx[domainIndex].result.warning && (
                <p style={{ fontSize: '13px', color: '#C84B4B', marginTop: '8px', padding: '8px 12px', background: '#E8E4DD', borderRadius: '8px', lineHeight: 1.5 }}>
                  ⚠ {decisionCtx[domainIndex].result.warning}
                </p>
              )}
              {decisionCtx[domainIndex].result.options.slice(0, 3).map((opt: any, i: number) => (
                <div key={i} style={{ padding: '8px 0', borderTop: i > 0 ? '1px solid #E8E4DD' : 'none', marginTop: i > 0 ? '8px' : '0', paddingTop: i > 0 ? '8px' : '0' }}>
                  <div style={{ fontSize: '13px', color: '#5C5C5C', lineHeight: 1.5 }}>{opt.label}</div>
                  <div style={{ fontSize: '11px', color: '#8B8B8B', marginTop: '2px' }}>Score: {opt.score} · Confidence: {opt.confidence}</div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Divider />

        {/* === PART 5: Evolution / Next Stage === */}
        <Section title="You Are Becoming" subtitle={evolution ? 'Your system is tracking change' : 'Complete another assessment later to see your evolution'}>
          <div style={{ background: '#F0EDE6', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#8B8B8B', marginBottom: '8px' }}>CURRENT</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#2C2C2C', marginBottom: '16px' }}>{symbol.persona.primary}</div>

            {evolution ? (
              <>
                <div style={{ height: '2px', background: '#D8D2C5', margin: '0 auto 16px', width: '80px' }} />
                <div style={{ fontSize: '12px', color: '#8B8B8B', marginBottom: '8px' }}>TREND</div>
                <div style={{ fontSize: '14px', color: evolution.trend === 'improving' ? '#4A7C59' : evolution.trend === 'declining' ? '#C84B4B' : '#B8875A', marginBottom: '8px' }}>
                  {evolution.trend === 'improving' ? '↗ Improving' : evolution.trend === 'declining' ? '↘ Declining' : evolution.trend === 'unstable' ? '⇄ Cycling' : '→ Stable'}
                </div>
                <p style={{ fontSize: '13px', color: '#5C5C5C', fontStyle: 'italic', lineHeight: 1.5 }}>
                  {evolution.insight}
                </p>
              </>
            ) : (
              <>
                <div style={{ height: '2px', background: '#D8D2C5', margin: '0 auto 16px', width: '80px' }} />
                <div style={{ fontSize: '13px', color: '#B8B2A5', fontStyle: 'italic', lineHeight: 1.5 }}>
                  Your evolution tracking starts with your next visit. Return in 7–14 days to see how your system has shifted.
                </div>
              </>
            )}
          </div>
        </Section>

        <Divider />

        {/* === PART 6: Paywall / Email === */}
        <Section title="Unlock Your Full Life Map" subtitle="Get the complete decision guide + trends + personalized recovery path">
          <div style={{ background: '#2C2C2C', borderRadius: '16px', padding: '24px', color: '#F5F0E8' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>🔓 Deep Report Pro includes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '13px', color: '#B8B2A5' }}>
              {['90-day recovery roadmap', 'Full decision map (all 5 domains)', 'Complete symbolic profile (Wu Xing + Astrology)', 'Relationship & environment analysis', 'Career direction alignment'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#4A7C59' }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {!emailSent ? (
              <div>
                <p style={{ fontSize: '13px', color: '#B8B2A5', marginBottom: '10px' }}>Leave your email to get early access</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    style={{ flex: 1, padding: '10px 14px', background: '#F5F0E8', border: 'none', borderRadius: '8px', fontSize: '14px', color: '#2C2C2C', outline: 'none' }} />
                  <button onClick={handleEmail} disabled={!email}
                    style={{ padding: '10px 18px', background: email ? '#4A7C59' : '#5C5C5C', color: '#F5F0E8', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: email ? 'pointer' : 'not-allowed' }}>
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px', background: '#3C3C3C', borderRadius: '8px', fontSize: '14px', color: '#B8B2A5' }}>
                ✓ You&rsquo;re on the list.
              </div>
            )}
          </div>
        </Section>

        {/* Share card (hidden) */}
        <div ref={cardRef} style={{ position: 'absolute', left: '-9999px', width: '480px', padding: '32px', background: '#F5F0E8' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#B8B2A5', letterSpacing: '2px', marginBottom: '12px' }}>LINGSHU</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#2C2C2C', marginBottom: '8px' }}>{symbol.persona.primary}</div>
            <div style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '16px' }}>Recovery Debt: {fatigueScore}</div>
            <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#5C5C5C', lineHeight: 1.6 }}>&ldquo;{report.hook.text}&rdquo;</p>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              {(['wood', 'fire', 'earth', 'metal', 'water'] as const).map(el => (
                <div key={el} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: ELEM_COLORS[el] }}>{Math.round(f[el])}</div>
                  <div style={{ fontSize: '10px', color: '#B8B2A5' }}>{ELEM_LABEL[el]}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', fontSize: '11px', color: '#B8B2A5' }}>lingshu-app.vercel.app</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <button onClick={() => router.push('/')} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #D8D2C5', borderRadius: '8px', fontSize: '14px', color: '#5C5C5C', cursor: 'pointer' }}>
            ← Back to start
          </button>
        </div>
      </div>
    </main>
  );
}
