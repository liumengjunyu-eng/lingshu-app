// lib/symbol/omega/identity.ts
// Identity Reconstruction Engine — 身份重构系统
// Ω: 用户不再是"用户"，而是"可重写身份"

export interface UserSnapshot {
  identity: string;
  stress: number;
  energy: number;
  confusion: number;
  awareness: number;
  [key: string]: any;
}

export interface HiddenStructure {
  pattern: string;
  mismatch: number;        // gap between perceived and actual
  depth: 'surface' | 'structural' | 'core';
}

export interface FutureSelf {
  identity: string;
  probability: number;     // 0-1
  timeframe: string;
  requiredShift: string;
}

export interface ReconstructedIdentity {
  currentIdentity: string;
  hiddenStructure: HiddenStructure;
  nextPossibleSelf: FutureSelf[];
  identityInstability: number; // 0-1
}

const IDENTITY_PATTERNS: Array<(u: UserSnapshot) => HiddenStructure | null> = [
  (u) => {
    if (u.energy < 0.4 && u.stress > 0.5) {
      return { pattern: 'high-functioning instability', mismatch: Math.round((u.energy || 0) - (u.stress || 0) * 100) / 100, depth: 'structural' };
    }
    return null;
  },
  (u) => {
    if (u.confusion > 0.5 && u.awareness > 0.6) {
      return { pattern: 'aware confusion — transformation ready', mismatch: Math.round((u.awareness || 0) - (u.confusion || 0) * 100) / 100, depth: 'core' };
    }
    return null;
  },
  (u) => {
    if (u.stress < 0.3 && u.energy > 0.6) {
      return { pattern: 'stable coherence — low transformation pressure', mismatch: 0.05, depth: 'surface' };
    }
    return null;
  },
  () => ({ pattern: 'adaptive baseline — identity in maintenance mode', mismatch: 0.15, depth: 'surface' }),
];

const FUTURE_SELF_FACTORIES: Array<(u: UserSnapshot) => FutureSelf> = [
  (u) => ({
    identity: 'stabilized adaptive system',
    probability: Math.round(Math.min(0.9, (u.energy || 0.5) * 0.8 + 0.2) * 100) / 100,
    timeframe: u.energy > 0.6 ? 'next 2-4 weeks' : 'next 2-3 months',
    requiredShift: 'increase energy regulation capacity',
  }),
  (u) => ({
    identity: 'expanded perception model',
    probability: Math.round(Math.min(0.9, (u.awareness || 0.5) * 0.7 + 0.2) * 100) / 100,
    timeframe: u.awareness > 0.6 ? 'next 4-8 weeks' : 'next 3-6 months',
    requiredShift: 'integrate confusion as signal, not obstacle',
  }),
  (u) => ({
    identity: 'autonomous coherence state',
    probability: Math.round(Math.min(0.8, ((u.energy || 0.5) + (u.awareness || 0.5)) / 2 * 0.6 + 0.2) * 100) / 100,
    timeframe: '6-12 months',
    requiredShift: 'build sustainable energy-to-awareness feedback loop',
  }),
];

export class IdentityReconstructionEngine {
  /** 身份重构：从可见身份提取隐藏结构 + 生成可能性 */
  reconstruct(user: UserSnapshot): ReconstructedIdentity {
    const hidden = this.extractHidden(user);
    const futures = this.generateFutureSelf(user);

    // identity instability = distance between hidden mismatch and surface
    const instability = Math.round(Math.min(1, Math.abs(hidden.mismatch) * 1.5) * 100) / 100;

    return {
      currentIdentity: user.identity || 'undefined system state',
      hiddenStructure: hidden,
      nextPossibleSelf: futures,
      identityInstability: instability,
    };
  }

  /** 提取隐藏结构——用户自己不知道的模式 */
  extractHidden(user: UserSnapshot): HiddenStructure {
    for (const detector of IDENTITY_PATTERNS) {
      const result = detector(user);
      if (result) return result;
    }
    return { pattern: 'unclassified — insufficient signal', mismatch: 0, depth: 'surface' };
  }

  /** 生成未来可能自我——不是预测，而是身份选项 */
  generateFutureSelf(user: UserSnapshot): FutureSelf[] {
    return FUTURE_SELF_FACTORIES.map((factory) => factory(user));
  }

  /** 系统输出的身份改写建议 */
  getIdentityFriction(user: UserSnapshot): { label: string; description: string } {
    const { stress = 0.5, energy = 0.5, awareness = 0.5, confusion = 0.5 } = user;
    const friction = (stress + confusion) - (energy + awareness);
    if (friction > 0.5) {
      return { label: 'Identity Fragmentation', description: 'Current identity model is under structural strain. System recommends identity reassessment.' };
    }
    if (friction < -0.3) {
      return { label: 'Identity Coherence', description: 'Current identity model is stable. System observing for emergent patterns.' };
    }
    return { label: 'Identity Drift', description: 'Mild misalignment between perceived self and actual state. System monitoring.' };
  }

  /** 身份熵——当前身份有多不确定 */
  getIdentityEntropy(user: UserSnapshot): number {
    const { stress = 0.5, confusion = 0.5, energy = 0.5, awareness = 0.5 } = user;
    const variables = [stress, confusion, energy, awareness];
    let entropy = 0;
    for (const v of variables) {
      if (v > 0 && v < 1) {
        entropy -= v * Math.log2(v) + (1 - v) * Math.log2(1 - v);
      }
    }
    return Math.round(entropy / 4 * 100) / 100;
  }
}
