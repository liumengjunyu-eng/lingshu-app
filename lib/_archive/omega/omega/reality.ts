// lib/symbol/omega/reality.ts
// Reality Probability Engine — 现实概率引擎
// Ω 终极能力：不预测未来，而是计算"你正在经历哪种现实"

export interface IndividualState {
  stress: number;     // 0-1
  confusion: number;  // 0-1
  awareness: number;  // 0-1
  energy: number;     // 0-1
  fatigue: number;    // 0-1
  anxiety: number;    // 0-1
  [key: string]: any;
}

export interface RealityProbabilities {
  collapseProbability: number;
  transformationProbability: number;
  stabilityProbability: number;
}

export interface DominantReality {
  name: string;
  description: string;
  probability: number;
  expectedDuration: string;
}

export interface RealityAnalysis {
  rawState: IndividualState;
  probabilities: RealityProbabilities;
  dominantReality: DominantReality;
  alternativeRealities: DominantReality[];
  certaintyLevel: number; // 0-1 how confident the engine is
}

const REALITY_DEFINITIONS: Array<{
  name: string;
  description: string;
  condition: (p: RealityProbabilities) => boolean;
  duration: string;
}> = [
  {
    name: 'Breakdown Reality',
    description: 'System signals indicate imminent structural reorganization. What appears as failure is system recalibration.',
    condition: (p) => p.collapseProbability > 0.6,
    duration: '2-6 weeks',
  },
  {
    name: 'Transformation Reality',
    description: 'System is undergoing rapid upgrade. Confusion and instability are side effects of expansion.',
    condition: (p) => p.transformationProbability > 0.6,
    duration: '4-12 weeks',
  },
  {
    name: 'Integration Reality',
    description: 'System is consolidating prior gains. Low external activity masks deep internal processing.',
    condition: (p) => p.stabilityProbability > 0.5 && p.collapseProbability < 0.3 && p.transformationProbability < 0.5,
    duration: '2-8 weeks',
  },
  {
    name: 'Threshold Reality',
    description: 'System is balanced between stability and transformation. Current state is inherently temporary.',
    condition: () => true, // fallback
    duration: '1-4 weeks',
  },
];

export class RealityProbabilityEngine {
  /** 计算用户正在经历哪种现实 */
  calculate(state: IndividualState): RealityAnalysis {
    const probs = this.getProbabilities(state);

    // Find dominant reality
    const candidates = REALITY_DEFINITIONS.map((def) => {
      const prob = this._getRealityProbability(def.condition, probs);
      return {
        name: def.name,
        description: def.description,
        probability: prob,
        expectedDuration: def.duration,
        priority: def.name === 'Breakdown Reality' ? 4 : def.name === 'Transformation Reality' ? 3 : def.name === 'Integration Reality' ? 2 : 1,
      } as DominantReality;
    });

    const sorted = [...candidates].sort((a, b) => b.probability - a.probability);
    const dominant = sorted[0];
    const alternatives = sorted.slice(1, 4);

    return {
      rawState: { ...state },
      probabilities: probs,
      dominantReality: dominant,
      alternativeRealities: alternatives,
      certaintyLevel: Math.round(Math.max(probs.collapseProbability, probs.transformationProbability, probs.stabilityProbability) * 100) / 100,
    };
  }

  /** 三种现实概率 */
  getProbabilities(state: IndividualState): RealityProbabilities {
    return {
      collapseProbability: Math.round(this._collapse(state) * 100) / 100,
      transformationProbability: Math.round(this._transform(state) * 100) / 100,
      stabilityProbability: Math.round(this._stability(state) * 100) / 100,
    };
  }

  /** 崩溃概率 */
  private _collapse(state: IndividualState): number {
    let prob = 0.2;
    if ((state.stress || 0) > 0.8) prob += 0.5;
    if ((state.stress || 0) > 0.6) prob += 0.2;
    if ((state.fatigue || 0) > 0.7 && (state.energy || 1) < 0.3) prob += 0.15;
    if ((state.anxiety || 0) > 0.7) prob += 0.1;
    if ((state.awareness || 0) > 0.7) prob -= 0.2; // awareness is protective
    return Math.max(0.05, Math.min(0.95, prob));
  }

  /** 转型概率 */
  private _transform(state: IndividualState): number {
    let prob = 0.3;
    if ((state.awareness || 0) > 0.6) prob += 0.35;
    if ((state.confusion || 0) > 0.5 && (state.awareness || 0) > 0.4) prob += 0.2;
    if ((state.stress || 0) > 0.5 && (state.energy || 0) > 0.4) prob += 0.15;
    if ((state.fatigue || 0) > 0.7) prob -= 0.15; // too tired to transform
    if ((state.energy || 0) < 0.3) prob -= 0.2;
    return Math.max(0.05, Math.min(0.9, prob));
  }

  /** 稳定概率 */
  private _stability(state: IndividualState): number {
    const stress = state.stress || 0;
    const confusion = state.confusion || 0;
    const composite = (stress + confusion) / 2;
    return Math.max(0.05, Math.round((1 - composite) * 100) / 100);
  }

  private _getRealityProbability(condition: (p: RealityProbabilities) => boolean, probs: RealityProbabilities): number {
    if (!condition(probs)) return 0.1;
    if (probs.collapseProbability > 0.6) return probs.collapseProbability;
    if (probs.transformationProbability > 0.6) return probs.transformationProbability;
    return probs.stabilityProbability;
  }

  /** 现实重构风险——系统对现实的解释可能出错 */
  getMisinterpretationRisk(state: IndividualState): { risk: number; reason: string } {
    const { confusion = 0.5, awareness = 0.5, stress = 0.5 } = state;
    if (confusion > 0.7 && awareness < 0.3) {
      return { risk: 0.75, reason: 'High confusion with low awareness — system lacks calibration data for accurate reality classification.' };
    }
    if (stress > 0.8 && awareness < 0.2) {
      return { risk: 0.85, reason: 'High stress with minimal awareness — perceived reality likely distorted by survival mode.' };
    }
    return { risk: Math.round(Math.max(0.05, confusion * 0.4) * 100) / 100, reason: 'Within acceptable misinterpretation range.' };
  }
}
