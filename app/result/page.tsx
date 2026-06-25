'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BirthInfoForm from '../components/BirthInfoForm';

type RecoveryLevel = 'good' | 'light' | 'medium' | 'heavy';

const RECOVERY_MAP: Record<RecoveryLevel, { label: string; description: string }> = {
 good: { label: '恢复良好', description: '你的恢复速度跟上了消耗速度。' },
 light: { label: '轻度透支', description: '恢复速度开始落后，需要关注。' },
 medium: { label: '中度透支', description: '恢复速度已经落后消耗速度。' },
 heavy: { label: '重度透支', description: '恢复系统正在超负荷运行。' },
};

const IMPACT_SENTENCE = '你不是累，是恢复跟不上消耗。';

const INSIGHTS = [
 '明明休息了，但还是累。',
 '情绪容易被放大。',
 '精力恢复明显变慢。',
];

export default function ResultPage() {
 const router = useRouter();
 const [result, setResult] = useState<any>(null);
 const [feedback, setFeedback] = useState<boolean | null>(null);
 const [showBirthForm, setShowBirthForm] = useState(false);

 useEffect(() => {
 const stored = localStorage.getItem('diagnosis_result');
 if (!stored) {
 router.push('/');
 return;
 }
 setResult(JSON.parse(stored));
 }, [router]);

 const handleFeedback = (isAccurate: boolean) => {
 setFeedback(isAccurate);
 console.log('[灵枢] 用户反馈:', isAccurate ? '准' : '不准');
 };

 if (!result) {
 return (
 <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg)' }}>
 <p style={{ color: 'var(--color-text-muted)' }}>加载中...</p>
 </div>
 );
 }

 const recovery = RECOVERY_MAP[result.recoveryLevel as RecoveryLevel] || RECOVERY_MAP.medium;

 return (
 <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
 <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px 48px' }}>
 {/* ① 一句话命中 */}
 <div
 className="card-gold"
 style={{
 marginBottom: '20px',
 textAlign: 'center',
 padding: '28px 20px',
 }}
 >
 <p
 style={{
 fontSize: '22px',
 fontWeight: 600,
 lineHeight: 1.4,
 color: 'var(--color-text-primary)',
 letterSpacing: '-0.3px',
 }}
 >
 &ldquo;{IMPACT_SENTENCE}&rdquo;
 </p>
 </div>

 {/* ② 状态解释 */}
 <div className="card" style={{ marginBottom: '16px' }}>
 <p
 style={{
 fontSize: '32px',
 fontWeight: 700,
 color: 'var(--color-text-primary)',
 lineHeight: 1.2,
 }}
 >
 {recovery.label}
 </p>
 <p
 style={{
 fontSize: '16px',
 color: 'var(--color-text-secondary)',
 marginTop: '4px',
 lineHeight: 1.5,
 }}
 >
 {recovery.description}
 </p>
 <p
 style={{
 fontSize: '15px',
 color: 'var(--color-text-primary)',
 marginTop: '12px',
 lineHeight: 1.5,
 paddingTop: '12px',
 borderTop: '1px solid var(--color-border)',
 }}
 >
 身体还能坚持。但恢复已经开始掉队。
 </p>
 </div>

 {/* ③ 机制解释 */}
 <div className="card" style={{ marginBottom: '16px' }}>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
 {INSIGHTS.map((insight, index) => (
 <div
 key={index}
 style={{
 display: 'flex',
 alignItems: 'flex-start',
 gap: '10px',
 paddingBottom: index < INSIGHTS.length - 1 ? '12px' : 0,
 borderBottom: index < INSIGHTS.length - 1 ? '1px solid var(--color-border)' : 'none',
 }}
 >
 <span style={{ color: 'var(--color-primary)', fontSize: '18px', lineHeight: 1.4 }}>·</span>
 <span style={{ fontSize: '16px', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
 {insight}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* ④ 付费墙 + 完整报告入口 */}
 <div className="card" style={{ marginBottom: '16px', padding: '20px', textAlign: 'center' }}>
 <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
 免费查看完整报告
 </p>
 <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
 五行能量图、八字命理、血型分析、六维恢复方案
 </p>
 <button
 onClick={() => setShowBirthForm(true)}
 className="btn-primary"
 style={{ width: '100%' }}
 >
 免费完整报告
 </button>
 </div>

 {/* ⑤ 一个行动 */}
 <div style={{ marginTop: '8px' }}>
 <button
 onClick={() => setShowBirthForm(true)}
 style={{
  width: '100%',
  padding: '14px',
  fontSize: '16px',
  fontWeight: 500,
  color: 'var(--color-primary)',
  background: 'transparent',
  border: '1.5px dashed var(--color-border)',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s',
 }}
 >
 免费完整报告
 </button>
 <p
 style={{
 fontSize: '14px',
 color: 'var(--color-text-muted)',
 textAlign: 'center',
 marginTop: '10px',
 }}
 >
 填写出生信息，生成完整解析
 </p>
 </div>

 {/* 反馈埋点 */}
 <div
 style={{
 marginTop: '28px',
 paddingTop: '20px',
 borderTop: '1px solid var(--color-border)',
 display: 'flex',
 justifyContent: 'center',
 gap: '12px',
 }}
 >
 <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>这份结果像你吗？</span>
 <button
 onClick={() => handleFeedback(true)}
 style={{
 fontSize: '14px',
 color: 'var(--color-text-primary)',
 background: 'transparent',
 border: 'none',
 cursor: 'pointer',
 padding: '4px 8px',
 borderRadius: '6px',
 transition: 'background 0.2s',
 }}
 onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-light)')}
 onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
 >
 👍 像
 </button>
 <button
 onClick={() => handleFeedback(false)}
 style={{
 fontSize: '14px',
 color: 'var(--color-text-muted)',
 background: 'transparent',
 border: 'none',
 cursor: 'pointer',
 padding: '4px 8px',
 borderRadius: '6px',
 transition: 'background 0.2s',
 }}
 onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-border)')}
 onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
 >
 👎 不像
 </button>
 </div>
 {/* 出生信息表单弹窗 */}
 {showBirthForm && (
 <BirthInfoForm
 onSubmit={(data) => {
 const params = new URLSearchParams({
 name: data.name,
 gender: data.gender,
 year: data.birthYear.toString(),
 month: data.birthMonth.toString(),
 day: data.birthDay.toString(),
 hour: data.birthHour.toString(),
 bloodType: data.bloodType,
 });
 router.push(`/report?${params}`);
 }}
 onClose={() => setShowBirthForm(false)}
 />
 )}
 </div>
 </main>
 );
}
