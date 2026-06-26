// lib/symbol/v3/distribution_v33.ts
// Predictive Distribution Engine — 预测分发系统
// V3.3 最核心能力：预测"这条内容应该发在哪里最赚钱/最爆"

export type Channel = 'tiktok' | 'twitter' | 'threads' | 'linkedin' | 'instagram' | 'direct';

export interface DistributionDecision {
  channel: Channel;
  expectedCtr: number;
  expectedConversionRate: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

// 渠道特征矩阵
const CHANNEL_PROFILES: Record<Channel, { highIntensityTolerance: boolean; bestAngles: string[]; baseCtr: number; baseConversion: number }> = {
  tiktok:    { highIntensityTolerance: true,  bestAngles: ['fear', 'reversal', 'contrast'], baseCtr: 0.12, baseConversion: 0.03 },
  twitter:   { highIntensityTolerance: false, bestAngles: ['insight', 'contrast'],         baseCtr: 0.07, baseConversion: 0.02 },
  threads:   { highIntensityTolerance: false, bestAngles: ['identity', 'insight'],          baseCtr: 0.08, baseConversion: 0.025 },
  linkedin:  { highIntensityTolerance: false, bestAngles: ['logic', 'insight'],             baseCtr: 0.05, baseConversion: 0.04 },
  instagram: { highIntensityTolerance: true,  bestAngles: ['identity', 'fear', 'reversal'],  baseCtr: 0.09, baseConversion: 0.015 },
  direct:    { highIntensityTolerance: false, bestAngles: ['identity', 'insight'],          baseCtr: 0.3,  baseConversion: 0.1 },
};

export interface ContentProfile {
  intensity: number;
  angle: string;
  shareText: string;
}

export function predictBestChannel(content: ContentProfile): DistributionDecision {
  const candidates: { channel: Channel; score: number; ctr: number; conversion: number }[] = [];

  for (const [channel, profile] of Object.entries(CHANNEL_PROFILES)) {
    let score = 0;

    // 强度匹配
    if (profile.highIntensityTolerance && content.intensity > 70) score += 0.3;
    if (!profile.highIntensityTolerance && content.intensity <= 70) score += 0.15;

    // 角度匹配
    if (profile.bestAngles.includes(content.angle)) score += 0.4;

    // base 分
    score += profile.baseCtr * 2;

    candidates.push({
      channel: channel as Channel,
      score,
      ctr: profile.baseCtr,
      conversion: profile.baseConversion,
    });
  }

  const best = candidates.sort((a, b) => b.score - a.score)[0];

  return {
    channel: best.channel,
    expectedCtr: best.ctr,
    expectedConversionRate: best.conversion,
    confidence: best.score > 0.6 ? 'high' : best.score > 0.35 ? 'medium' : 'low',
    reasoning: `Best match: ${best.channel} (intensity ${content.intensity}, angle "${content.angle}")`,
  };
}

export function distribute(content: ContentProfile, allResults: boolean = false): DistributionDecision | DistributionDecision[] {
  const decisions = (Object.keys(CHANNEL_PROFILES) as Channel[]).map((channel) =>
    predictBestChannel({ ...content }));

  if (allResults) {
    return decisions.sort((a, b) => b.expectedCtr - a.expectedCtr);
  }

  return decisions.sort((a, b) => b.expectedCtr - a.expectedCtr)[0];
}
