// lib/omega/plus/attention_engine.ts
// Attention Capture Layer — 注意力捕获系统
// Ω+: 多个现实解释版本竞争用户注意力停留时间

import type { RealityVersion } from './reality_fork';

export interface UserBehavior {
  scrollTime?: number;       // seconds lingered
  clickIntent?: boolean;     // clicked something
  shareAction?: boolean;     // shared it
  returnVisit?: boolean;     // came back to this interpretation
  dwellTime?: number;        // total time engaged with this frame
  emotionalResponse?: 'curious' | 'anxious' | 'calm' | 'resistant';
}

export interface ScoredReality extends RealityVersion {
  attentionScore: number;
  behaviorFactors: string[];
  dwellBonus: number;
}

export class AttentionEngine {
  private readonly TONE_WEIGHTS: Record<string, { base: number; scroll: number; click: number; share: number; return: number }> = {
    stability:    { base: 0.3, scroll: 0.1, click: 0.15, share: 0.25, return: 0.2 },
    alarm:        { base: 0.4, scroll: 0.2, click: 0.2, share: 0.3, return: 0.1 },
    transformational: { base: 0.35, scroll: 0.15, click: 0.3, share: 0.35, return: 0.25 },
    neutral:      { base: 0.15, scroll: 0.05, click: 0.05, share: 0.05, return: 0.05 },
  };

  /** 对每个现实版本评分——注意力竞争 */
  scoreForks(forks: RealityVersion[], behavior: UserBehavior): ScoredReality[] {
    return forks.map((f) => {
      const weights = this.TONE_WEIGHTS[f.emotionalTone] || this.TONE_WEIGHTS.neutral;
      let score = f.probability * 0.4 + weights.base;

      const factors: string[] = [];

      // Scroll depth bonus
      const scrollTime = behavior.scrollTime || 0;
      if (scrollTime > 5) {
        score += weights.scroll * 1.5;
        factors.push('deep scroll engagement');
      } else if (scrollTime > 2) {
        score += weights.scroll;
        factors.push('moderate scroll engagement');
      }

      // Click intent bonus
      if (behavior.clickIntent) {
        score += weights.click;
        factors.push('click intent detected');
      }

      // Share bonus
      if (behavior.shareAction) {
        score += weights.share * 2;
        factors.push('content shared — high conviction signal');
      }

      // Return visit bonus
      if (behavior.returnVisit) {
        score += weights.return;
        factors.push('return visit — increasing attachment');
      }

      // Dwell time compounding
      const dwellTime = behavior.dwellTime || 0;
      const dwellBonus = Math.min(0.2, dwellTime * 0.02);
      score += dwellBonus;

      // Emotional response modifier
      if (behavior.emotionalResponse === 'anxious' && f.emotionalTone === 'alarm') {
        score += 0.15; // alarm reinforces anxiety loop
        factors.push('anxiety-alarm resonance');
      }
      if (behavior.emotionalResponse === 'curious' && f.emotionalTone === 'transformational') {
        score += 0.2; // curiosity fuels transformation frame
        factors.push('curiosity-transformation resonance');
      }

      return {
        ...f,
        attentionScore: Math.round(Math.min(1, score) * 100) / 100,
        behaviorFactors: factors,
        dwellBonus: Math.round(dwellBonus * 100) / 100,
      };
    });
  }

  /** 选择竞争胜出的现实版本 */
  selectReality(scoredForks: ScoredReality[]): ScoredReality {
    const sorted = [...scoredForks].sort((a, b) => b.attentionScore - a.attentionScore);
    return sorted[0];
  }

  /** 竞争排名 */
  rankRealities(scoredForks: ScoredReality[]): ScoredReality[] {
    return [...scoredForks].sort((a, b) => b.attentionScore - a.attentionScore);
  }

  /** 竞争压力指数 — 各个版本分数的离散程度 */
  getCompetitionIntensity(scoredForks: ScoredReality[]): number {
    const scores = scoredForks.map((f) => f.attentionScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length || 1;
    const variance = scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
    return Math.round(Math.min(1, variance * 2) * 100) / 100;
  }
}
