// lib/omega/plus/reality_fork.ts
// Reality Fork Engine — 现实分叉系统
// Ω+: 同一个用户状态 → 多个"现实解释版本"竞争

export interface RealityVersion {
  id: string;
  name: string;
  label: string;
  interpretation: string;
  emotionalTone: 'stability' | 'alarm' | 'transformational' | 'neutral';
  probability: number;      // 0-1 该版本解释的理论置信度
  riskLevel: 'low' | 'moderate' | 'high';
  recommendedActions: string[];
}

export interface UserState {
  stress: number;
  energy: number;
  confusion: number;
  awareness: number;
  fatigue: number;
  anxiety: number;
  [key: string]: any;
}

export class RealityForkEngine {
  /** 同一个用户状态 → 生成多个现实解释版本 */
  fork(state: UserState): RealityVersion[] {
    return [
      this.versionA(state),
      this.versionB(state),
      this.versionC(state),
      this.versionD(state),
    ];
  }

  /** Ω-A: 稳定恢复版本 */
  private versionA(state: UserState): RealityVersion {
    const stress = state.stress || 0.5;
    const energy = state.energy || 0.5;
    const recoverability = energy / Math.max(0.1, stress);
    const probability = Math.min(0.85, recoverability * 0.6 + 0.2);

    return {
      id: 'omega_A',
      name: 'Stable Recovery Frame',
      label: 'Ω-A: Stable recovery possible',
      interpretation: `Your system shows ${stress > 0.6 ? 'elevated load' : 'manageable load'} with ${energy > 0.4 ? 'adequate' : 'limited'} reserve capacity. Recovery trajectory is viable within current configuration.`,
      emotionalTone: 'stability',
      probability: Math.round(probability * 100) / 100,
      riskLevel: stress > 0.7 && energy < 0.3 ? 'moderate' : 'low',
      recommendedActions: [
        'Maintain current rhythm with minor adjustments',
        'Prioritize sleep and nutrition consistency',
        'Reduce non-essential cognitive load by 20%',
      ],
    };
  }

  /** Ω-B: 结构性崩溃版本 */
  private versionB(state: UserState): RealityVersion {
    const stress = state.stress || 0.5;
    const fatigue = state.fatigue || 0.5;
    const energy = state.energy || 0.5;
    const collapseSignal = (stress * 0.4 + fatigue * 0.4 + (1 - energy) * 0.3);
    const probability = Math.min(0.9, collapseSignal);

    return {
      id: 'omega_B',
      name: 'Structural Collapse Frame',
      label: 'Ω-B: Structural collapse risk',
      interpretation: `Stress (${(stress * 100).toFixed(0)}%) and fatigue (${(fatigue * 100).toFixed(0)}%) exceed sustainable thresholds. Current operating model is approaching structural failure point. Immediate intervention recommended.`,
      emotionalTone: 'alarm',
      probability: Math.round(probability * 100) / 100,
      riskLevel: collapseSignal > 0.6 ? 'high' : 'moderate',
      recommendedActions: [
        'Immediate reduction of all non-essential commitments',
        '24-48 hour full recovery window if possible',
        'Consider professional support if available',
      ],
    };
  }

  /** Ω-C: 转型升级版本 */
  private versionC(state: UserState): RealityVersion {
    const awareness = state.awareness || 0.5;
    const confusion = state.confusion || 0.5;
    const stress = state.stress || 0.5;
    const upgradeSignal = (awareness * 0.4 + confusion * 0.3 + stress * 0.3);
    const probability = Math.min(0.85, upgradeSignal + 0.15);

    return {
      id: 'omega_C',
      name: 'Transformational Upgrade Frame',
      label: 'Ω-C: Transformation in progress',
      interpretation: `The combination of heightened awareness (${(awareness * 100).toFixed(0)}%) and system load (${(stress * 100).toFixed(0)}%) indicates an active upgrade cycle. Discomfort is not damage — it is structural reconfiguration.`,
      emotionalTone: 'transformational',
      probability: Math.round(probability * 100) / 100,
      riskLevel: stress > 0.8 && awareness < 0.3 ? 'high' : 'moderate',
      recommendedActions: [
        'Journal current patterns — they represent a transient state',
        'Reduce external inputs to allow internal reorganization',
        'Trust the process: upgrade cycles are inherently uncomfortable',
      ],
    };
  }

  /** Ω-D: 中性观察版本 */
  private versionD(state: UserState): RealityVersion {
    return {
      id: 'omega_D',
      name: 'Neutral Observation Frame',
      label: 'Ω-D: All data below threshold — neutral observation',
      interpretation: 'Current signals are within normal variance. No dominant interpretation yields statistical significance. System is in baseline observation mode.',
      emotionalTone: 'neutral',
      probability: 0.35,
      riskLevel: 'low',
      recommendedActions: [
        'Continue current trajectory',
        'Recheck in 24-48 hours for pattern emergence',
        'No immediate intervention indicated',
      ],
    };
  }

  /** 获取某个具体版本 */
  getVersion(id: string, state: UserState): RealityVersion | undefined {
    return this.fork(state).find((v) => v.id === id);
  }

  /** 分叉多样性指数 — 版本之间有多大差异 */
  getForkDiversity(forks: RealityVersion[]): number {
    const tones = new Set(forks.map((f) => f.emotionalTone)).size;
    const riskLevels = new Set(forks.map((f) => f.riskLevel)).size;
    return Math.round((tones + riskLevels) / 7 * 100) / 100;
  }
}
