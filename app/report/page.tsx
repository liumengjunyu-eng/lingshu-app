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
      const name = searchParams.get('name') || '你';
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

      // 异步获取 AI 解读（不阻塞）
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
      setError(e?.message || '生成报告失败');
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔮</div>
          <p style={{ color: 'var(--color-text-muted)' }}>正在推算你的能量图谱...</p>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '24px', maxWidth: '400px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>生成失败</p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>{error || '请返回重试'}</p>
          <button onClick={() => window.history.back()} className="btn-primary">返回重试</button>
        </div>
      </main>
    );
  }

  const { name, bazi, naYin, shishen, lunarDate, zodiac, wuxing, insights, bloodType, bloodTypeData, aiSections } = report;
  const baziKeys = ['year', 'month', 'day', 'hour'] as const;
  const dayLabel = ['年柱', '月柱', '日柱', '时柱'];

  // 五行相生成
  const wuxingCycle: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px 48px' }}>
        {/* 页头 */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
            灵枢 · 五行能量报告
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {name} · {zodiac} · {lunarDate}
          </p>
        </div>

        {/* ====== 第一屏：五行能量图 ====== */}
        <div className="card-gold" style={{ marginBottom: '12px', textAlign: 'center', padding: '24px 20px' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            {name}的五行能量
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            你的八字 · {bazi.year} {bazi.month} {bazi.day} {bazi.hour}
          </p>

          {/* 五行能量条 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(Object.entries(wuxing.percentages as Record<string, number>)).map(([element, pct]) => (
              <div key={element}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: WUXING_COLORS[element], display: 'inline-block' }} />
                    <span style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{element}</span>
                    {element === wuxing.strongest && <span style={{ fontSize: '11px', color: 'var(--color-warning)' }}>↑ 主</span>}
                    {element === wuxing.weakest && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>↓ 弱</span>}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{pct}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: WUXING_COLORS[element], borderRadius: '3px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* 五行总结 */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              {wuxing.strongest}元素偏旺，{wuxing.weakest}元素偏弱。{wuxingCycle[wuxing.weakest] ? wuxingCycle[wuxing.weakest] + '生' + wuxing.weakest + '，可以通过补充' + wuxingCycle[wuxing.weakest] + '来平衡' + wuxing.weakest : wuxing.weakest + '元素需要关注平衡'}
            </p>
          </div>
        </div>

        {/* ====== 第二屏：八字四柱 ====== */}
        <div className="card" style={{ marginBottom: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '14px', letterSpacing: '1px' }}>
            八字排盘 · 八字四柱
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
            纳音 · {naYin}
          </p>
        </div>

        {/* ====== 第三屏：内在能量解读（AI） ====== */}
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px', textAlign: 'center', letterSpacing: '1px' }}>
            内在能量解读
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(aiSections && aiSections.length >= 3 ? aiSections : (insights || [])).slice(0, 3).map((text: string, i: number) => (
              <div key={i} className="card" style={{ padding: '16px 20px', borderLeft: `3px solid ${i === 0 ? WUXING_COLORS[wuxing.strongest] : i === 1 ? WUXING_COLORS[wuxing.weakest] : 'var(--color-gold)'}` }}>
                <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ====== 第四屏：血型分析 ====== */}
        {bloodType && bloodTypeData && (
          <div className="card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>🧬</span>
              <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                血型 {bloodTypeData.bloodType} · {bloodTypeData.fiveElement}元素
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
                <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '2px' }}>优势</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{bloodTypeData.strength}</p>
              </div>
              <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: '10px' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 600, marginBottom: '2px' }}>注意</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{bloodTypeData.weakness}</p>
              </div>
            </div>

            {bloodTypeData.combinedAdvice && (
              <div style={{ padding: '12px', background: 'var(--color-gold-light)', borderRadius: '10px', borderLeft: '3px solid var(--color-gold)' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gold)', marginBottom: '4px' }}>血型 + 五行</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{bloodTypeData.combinedAdvice}</p>
              </div>
            )}
          </div>
        )}

        {/* ====== 第五屏：六维调理方案 ====== */}
        {(() => {
          const wellness = getWellnessPlan(wuxing.weakest);
          if (!wellness) return null;
          return (
            <div style={{ marginBottom: '12px' }}>
              <div className="card" style={{ textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>
                  六维调理方案
                </p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  针对 {wuxing.weakest}元素偏弱的调理建议
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { icon: '🎨', label: '穿戴', value: wellness.color },
                  { icon: '🧭', label: '方向', value: wellness.direction },
                  { icon: '🥗', label: '饮食', value: wellness.food },
                  { icon: '🏃', label: '运动', value: wellness.exercise },
                  { icon: '💆', label: '穴位', value: wellness.acupoint },
                  { icon: '😴', label: '作息', value: wellness.sleep },
                ].map((item) => (
                  <div key={item.label} className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>{item.label}</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="card" style={{ marginTop: '8px', borderLeft: '3px solid var(--color-gold)' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '4px' }}>📜 典籍智慧</p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>{wellness.classic}</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', marginTop: '8px', lineHeight: 1.5 }}>{wellness.emotion}</p>
              </div>
            </div>
          );
        })()}

        {/* ====== 第六屏：每日练习 ====== */}
        {(() => {
          const wellness = getWellnessPlan(wuxing.weakest);
          if (!wellness) return null;
          return (
            <div style={{ marginBottom: '12px' }}>
              <div className="card" style={{ textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>
                  今日练习
                </p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  今天可以做这 4 件事
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="card" style={{ borderLeft: '3px solid var(--color-success)', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '4px' }}>✅ 穿着</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{wellness.color}</p>
                </div>
                <div className="card" style={{ borderLeft: '3px solid var(--color-success)', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '4px' }}>✅ 朝向</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>面朝{wellness.direction}</p>
                </div>
                <div className="card" style={{ borderLeft: '3px solid var(--color-success)', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '4px' }}>✅ 多吃</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{wellness.food.split(',')[0]}</p>
                </div>
                <div className="card" style={{ borderLeft: '3px solid var(--color-success)', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '4px' }}>✅ 运动</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{wellness.exercise.split(',')[0]}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ====== 第七屏：付费墙 ====== */}
        <div className="card" style={{ marginBottom: '12px', textAlign: 'center', padding: '24px 20px' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            以上就是你的免费报告内容
          </p>
          <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '16px' }}>
            解锁完整深度分析，获得持续跟踪与个性化建议
          </p>
          <button
            onClick={() => setShowPayModal(true)}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            深度分析 ¥69
          </button>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            包含 DeepSeek AI 深度解读 + 七日跟踪 + PDF 报告
          </p>
        </div>

        {/* 页脚 */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            灵枢 · 你的能量模式已经告诉了我答案
          </p>
        </div>
      </div>

      {/* 深度分析付费意向弹窗 */}
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
                  已登记
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
                  上线后第一时间通知你。
                </p>
                <button
                  onClick={() => { setShowPayModal(false); setPayStatus('idle'); setPayEmail(''); }}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  知道了
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔓</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  深度分析即将上线
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  留下邮箱，上线后通知你。
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
                  {payStatus === 'loading' ? '提交中...' : '通知我 ✓'}
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
        <p style={{ color: 'var(--color-text-muted)' }}>加载中...</p>
      </main>
    }>
      <ReportContent />
    </Suspense>
  );
}
