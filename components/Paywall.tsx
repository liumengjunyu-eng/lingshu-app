// components/Paywall.tsx
'use client';

import { useState } from 'react';

interface PaywallProps {
  reportId?: string;
  userName?: string;
}

export default function Paywall({ reportId, userName }: PaywallProps) {
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    // 调用 Stripe Checkout API
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          plan: isAnnual ? 'annual' : 'monthly',
        }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment unavailable: ' + (data.error || 'Server error'));
      }
    } catch (e) {
      alert('Payment unavailable: Network error');
    } finally {
      setLoading(false);
    }
  };

  const monthlyPrice = 9.99;
  const annualPrice = 99;

  return (
    <div className="mt-16 w-full max-w-2xl mx-auto">
      {/* 分隔装饰 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />
        <span className="text-[#C9A96E] text-sm tracking-widest">— 灵枢 · 深度优化 —</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />
      </div>

      {/* 主卡片 */}
      <div className="relative bg-gradient-to-b from-[#1A1A2E]/80 to-[#0D0D15]/90 rounded-2xl border border-[#C9A96E]/20 p-8 md:p-10 overflow-hidden">
        {/* 背景光晕 */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C9A96E]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#C9A96E]/5 rounded-full blur-3xl" />

        {/* 头部 */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs text-[#C9A96E] tracking-wider">✨ 完整版已生成</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-[#F5F5F7]">
            {userName ? `${userName}，你的` : '你的'}
            <span className="text-[#C9A96E]"> 完整人生优化方案</span>
          </h3>
          <p className="text-[#636366] text-sm mt-2 max-w-md mx-auto">
            免费报告已给出核心结论。付费解锁完整的行动路径与深度解读
          </p>
        </div>

        {/* 权益列表 */}
        <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[
            '完整身体结构分析（脏腑+经络）',
            '30天详细行动清单（每日可执行）',
            '定制饮食方案（7天食谱+忌口）',
            '运动方案（八段锦/太极具体动作）',
            '穿戴建议（每日颜色+材质+饰品）',
            '家居风水方案（方位+摆件+植物）',
            '职业方向 + 九紫离火行业指引',
            'PDF下载 + 永久访问',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm">
              <span className="text-[#C9A96E] flex-shrink-0">✓</span>
              <span className="text-[#F5F5F7]/80">{item}</span>
            </div>
          ))}
        </div>

        {/* 价格方案切换 */}
        <div className="relative z-10 mt-6 flex justify-center">
          <div className="inline-flex bg-[#0D0D15]/60 rounded-full p-1 border border-[#333]">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-1.5 rounded-full text-sm transition ${
                !isAnnual
                  ? 'bg-[#C9A96E] text-[#0D0D15] font-medium'
                  : 'text-[#636366] hover:text-[#F5F5F7]'
              }`}
            >
              单次
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-1.5 rounded-full text-sm transition flex items-center gap-2 ${
                isAnnual
                  ? 'bg-[#C9A96E] text-[#0D0D15] font-medium'
                  : 'text-[#636366] hover:text-[#F5F5F7]'
              }`}
            >
              年度
              <span className="text-[10px] bg-[#C9A96E]/20 px-1.5 py-0.5 rounded-full">
                省40%
              </span>
            </button>
          </div>
        </div>

        {/* 价格 + CTA */}
        <div className="relative z-10 mt-6 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-4xl font-bold text-[#F5F5F7]">
              ${isAnnual ? annualPrice : monthlyPrice}
            </span>
            <span className="text-[#636366] text-sm">
              {isAnnual ? '/年' : ''}
            </span>
          </div>
          {isAnnual && (
            <p className="text-[#C9A96E] text-xs mt-0.5">
              ￥{Math.round(annualPrice * 7.2)} 约合 ￥{Math.round((annualPrice / 12) * 7.2)}/月
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 px-10 py-3.5 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#0D0D15] font-bold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto shadow-[0_0_40px_rgba(201,169,110,0.15)]"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> 处理中...
              </>
            ) : (
              <>
                🔓 {isAnnual ? '解锁年度完整方案 →' : '解锁完整方案 →'}
              </>
            )}
          </button>
          <p className="text-[#636366]/40 text-xs mt-3">
            🔒 安全支付 · 30天不满意可退款 · 永久访问
          </p>
        </div>
      </div>

      {/* 底部信任增强 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#636366]/50">
        <span>✔ 基于《黄帝内经》</span>
        <span className="w-px h-3 bg-[#333]" />
        <span>✔ AI + 八字排盘</span>
        <span className="w-px h-3 bg-[#333]" />
        <span>✔ 10000+ 用户验证</span>
        <span className="w-px h-3 bg-[#333]" />
        <span>✔ 无自动续费</span>
      </div>
    </div>
  );
}
