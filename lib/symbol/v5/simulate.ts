// lib/symbol/v5/simulate.ts
// Market Simulation Engine — 市场模拟系统
// V5 核心：系统在发布之前就知道"这条内容会不会赚钱"

export interface ContentForSim {
  hook?: string;
  urgency?: boolean;
  depth?: 'low' | 'medium' | 'high';
  angle?: string;
  intensity?: number;
}

export interface SimulationResult {
  viral_probability: number;
  conversion_probability: number;
  retention_probability: number;
  overall_score: number;
  verdict: 'scale' | 'test' | 'rework';
  breakdown: {
    virality_factors: string[];
    conversion_factors: string[];
    retention_factors: string[];
  };
}

export class MarketSimulationEngine {
  /** 模拟用户对一条内容的市场响应 */
  simulateUserResponse(content: ContentForSim): SimulationResult {
    const hook = content.hook || '';
    const urgency = content.urgency || false;
    const depth = content.depth || 'medium';
    const intensity = content.intensity || 50;

    // Calc virality
    const vScore = this.calcVirality(hook, intensity);
    const cScore = this.calcConversion(urgency, intensity, depth);
    const rScore = this.calcRetention(depth);

    const votes = [vScore, cScore, rScore];
    const overall = Math.round(votes.reduce((a, b) => a + b, 0) / votes.length * 100) / 100;

    return {
      viral_probability: Math.round(vScore * 100) / 100,
      conversion_probability: Math.round(cScore * 100) / 100,
      retention_probability: Math.round(rScore * 100) / 100,
      overall_score: Math.round(overall * 100) / 100,
      verdict: overall > 0.6 ? 'scale' : overall > 0.35 ? 'test' : 'rework',
      breakdown: {
        virality_factors: this._getViralityFactors(hook, intensity),
        conversion_factors: this._getConversionFactors(urgency, intensity),
        retention_factors: this._getRetentionFactors(depth),
      },
    };
  }

  private calcVirality(hook: string, intensity: number): number {
    let score = intensity / 200; // base from intensity 0-100 -> 0-0.5
    if (hook.toLowerCase().includes('not tired')) score += 0.3;
    if (hook.toLowerCase().includes('system')) score += 0.4;
    if (hook.toLowerCase().includes('pattern')) score += 0.25;
    if (hook.toLowerCase().includes('misaligned')) score += 0.3;
    if (hook.toLowerCase().includes('burnout')) score += 0.2;
    return Math.min(score, 0.95);
  }

  private calcConversion(urgency: boolean, intensity: number, depth: string): number {
    let base = urgency ? 0.7 : 0.4;
    if (intensity > 70) base += 0.1;
    if (depth === 'high') base += 0.1;
    if (depth === 'low') base -= 0.1;
    return Math.max(0, Math.min(base, 0.95));
  }

  private calcRetention(depth: string): number {
    switch (depth) {
      case 'high': return 0.8;
      case 'medium': return 0.6;
      case 'low': return 0.35;
      default: return 0.5;
    }
  }

  private _getViralityFactors(hook: string, intensity: number): string[] {
    const factors: string[] = [];
    if (intensity > 70) factors.push('High emotional intensity drives shares');
    if (hook.toLowerCase().includes('system')) factors.push('"System" framing triggers identity engagement');
    if (hook.toLowerCase().includes('pattern')) factors.push('Pattern recognition hooks drive curiosity');
    if (intensity <= 50) factors.push('Low intensity may limit viral spread');
    return factors;
  }

  private _getConversionFactors(urgency: boolean, intensity: number): string[] {
    const factors: string[] = [];
    if (urgency) factors.push('Urgency framing increases conversion by ~75%');
    if (intensity > 70) factors.push('High intensity correlates with purchase intent');
    if (!urgency) factors.push('No urgency trigger — consider adding time-sensitive framing');
    return factors;
  }

  private _getRetentionFactors(depth: string): string[] {
    const factors: string[] = [];
    if (depth === 'high') factors.push('Deep content drives long-term retention');
    if (depth === 'medium') factors.push('Moderate depth — supplement with follow-up content');
    if (depth === 'low') factors.push('Shallow content — high churn risk');
    return factors;
  }
}
