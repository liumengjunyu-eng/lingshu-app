// lib/symbol/v3/growth.ts
// Growth Intelligence Engine — 系统开始"看数据做决策"
// V3.2: 计算哪种表达方式最容易让用户付费/传播

export interface ContentMetric {
  impressions: number;
  clicks: number;
  shares: number;
  saves: number;
  conversions: number;
}

export interface GrowthScoreResult {
  score: number;
  breakdown: {
    clicksWeight: number;
    sharesWeight: number;
    savesWeight: number;
    conversionsWeight: number;
  };
}

export function calculateGrowthScore(m: ContentMetric): GrowthScoreResult {
  const impressions = Math.max(m.impressions, 1);
  const clicksWeight = m.clicks * 1;
  const sharesWeight = m.shares * 3;
  const savesWeight = m.saves * 2;
  const conversionsWeight = m.conversions * 5;
  const score = (clicksWeight + sharesWeight + savesWeight + conversionsWeight) / impressions;

  return {
    score,
    breakdown: { clicksWeight, sharesWeight, savesWeight, conversionsWeight },
  };
}

export interface PatternResult {
  variantId: string;
  text: string;
  metrics: ContentMetric;
  growthScore: GrowthScoreResult;
}

export function selectWinningPattern(results: PatternResult[]): PatternResult | null {
  if (results.length === 0) return null;
  return [...results].sort(
    (a, b) => calculateGrowthScore(b.metrics).score - calculateGrowthScore(a.metrics).score
  )[0];
}

// Adaptive variant label — tells user this was optimized
export function getOptimizationLabel(score: number): string {
  if (score > 0.5) return 'v3.2-adaptive (high confidence)';
  if (score > 0.2) return 'v3.2-adaptive (medium confidence)';
  return 'v3.2-adaptive (initial)';
}
