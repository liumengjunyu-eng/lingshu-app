// lib/omega/plusplus/path_gen.ts
// Path Generation Engine — 路径生成系统
// Ω++: 从当前状态生成多个未来路径（现实树）

export interface FuturePath {
  id: string;
  name: string;
  label: string;
  probability: number;   // 0-1
  outcome: string;
  timeline: string;      // expected duration
  cost: number;          // 0-1 estimated energy/stress cost
  risk: 'low' | 'moderate' | 'high';
  signals: string[];     // what to watch for
}

export interface CurrentStateInput {
  stress: number;
  energy: number;
  confusion: number;
  awareness: number;
  fatigue: number;
  anxiety: number;
  [key: string]: any;
}

export class PathGenerationEngine {
  /** 从当前状态生成 4 条未来路径 */
  generate(state: CurrentStateInput): FuturePath[] {
    return [
      this.stablePath(state),
      this.collapsePath(state),
      this.transformPath(state),
      this.resetPath(state),
    ];
  }

  /** Path A: Stable Recovery — 平稳恢复 */
  private stablePath(state: CurrentStateInput): FuturePath {
    const stress = state.stress || 0.5;
    const energy = state.energy || 0.5;
    const fatigue = state.fatigue || 0.5;
    const recoveryCapacity = energy / Math.max(0.1, stress + fatigue);
    const probability = Math.min(0.7, Math.round((recoveryCapacity * 0.5 + 0.15) * 100) / 100);

    return {
      id: 'path_stable',
      name: 'Stable Recovery',
      label: 'A — Stable Recovery',
      probability,
      outcome: 'Gradual normalization over 14 days. System load decreases as recovery protocols engage. Requires consistent energy management.',
      timeline: '10-18 days',
      cost: Math.round(Math.min(0.6, (1 - energy) * 0.5 + 0.1) * 100) / 100,
      risk: stress > 0.7 ? 'moderate' : 'low',
      signals: [
        'Energy levels stabilize within 3-4 days',
        'Sleep quality improves as stress response downregulates',
        'Cognitive load feels manageable again',
        'Minor setbacks are normal — each recovery wave is shorter',
      ],
    };
  }

  /** Path B: Functional Collapse — 功能性崩溃 */
  private collapsePath(state: CurrentStateInput): FuturePath {
    const stress = state.stress || 0.5;
    const fatigue = state.fatigue || 0.5;
    const anxiety = state.anxiety || 0.5;
    const energy = state.energy || 0.5;
    const collapseSignal = (stress * 0.35 + fatigue * 0.35 + anxiety * 0.2 + (1 - energy) * 0.2);
    const probability = Math.round(Math.min(0.8, Math.max(0.05, collapseSignal)) * 100) / 100;

    return {
      id: 'path_collapse',
      name: 'Functional Collapse',
      label: 'B — Functional Collapse',
      probability,
      outcome: 'Energy depletion accelerates. Decision fatigue compounds. Daily functioning becomes increasingly difficult. External obligations begin to slip.',
      timeline: '3-7 days',
      cost: Math.round(Math.min(0.9, (stress + fatigue) / 2 + 0.2) * 100) / 100,
      risk: collapseSignal > 0.5 ? 'high' : 'moderate',
      signals: [
        'Decision-making slows significantly',
        'Small tasks feel disproportionately heavy',
        'Irritability increases as energy reserves deplete',
        'Avoidance behaviors become more frequent',
      ],
    };
  }

  /** Path C: Transformation Spike — 转型跃升 */
  private transformPath(state: CurrentStateInput): FuturePath {
    const awareness = state.awareness || 0.5;
    const confusion = state.confusion || 0.5;
    const stress = state.stress || 0.5;
    const energy = state.energy || 0.5;
    const transformSignal = (awareness * 0.4 + confusion * 0.2 + stress * 0.2 + energy * 0.2);
    const probability = Math.round(Math.min(0.65, Math.max(0.05, transformSignal * 0.6 + 0.1)) * 100) / 100;

    return {
      id: 'path_transform',
      name: 'Transformation Spike',
      label: 'C — Transformation Spike',
      probability,
      outcome: 'Rapid identity restructuring. Discomfort peaks as old patterns break down. New operating system integrates. High short-term cost, high long-term gain.',
      timeline: '2-4 weeks',
      cost: Math.round(Math.min(0.85, (stress + confusion) / 2 + 0.15) * 100) / 100,
      risk: energy < 0.3 ? 'high' : 'moderate',
      signals: [
        'Heightened emotional sensitivity — everything feels significant',
        'Sudden insights followed by disorientation',
        'Sleep patterns become irregular (vivid dreams, early waking)',
        'Desire for isolation during integration phases',
      ],
    };
  }

  /** Path D: Full System Reset — 系统重启 */
  private resetPath(state: CurrentStateInput): FuturePath {
    const fatigue = state.fatigue || 0.5;
    const stress = state.stress || 0.5;
    const energy = state.energy || 0.5;
    const resetSignal = (fatigue * 0.3 + stress * 0.3 + (1 - energy) * 0.4);
    const probability = Math.round(Math.min(0.5, Math.max(0.03, resetSignal * 0.6)) * 100) / 100;

    return {
      id: 'path_reset',
      name: 'Full System Reset',
      label: 'D — Full System Reset',
      probability,
      outcome: 'Forced rest or external shutdown. Body takes control. All non-essential systems power down. Requires complete disengagement from obligations.',
      timeline: '5-10 days',
      cost: Math.round(Math.min(0.95, (fatigue + (1 - energy)) / 2 + 0.2) * 100) / 100,
      risk: 'high',
      signals: [
        'Body overrides willpower — sleep becomes non-negotiable',
        'Digestive system slows or becomes sensitive',
        'Emotional flatness as energy is conserved',
        'Return to baseline only after full discharge cycle',
      ],
    };
  }

  /** 路径之间差异度 */
  getPathDiversity(paths: FuturePath[]): number {
    const outcomes = new Set(paths.map((p) => p.outcome.slice(0, 20))).size;
    const risks = new Set(paths.map((p) => p.risk)).size;
    return Math.round((outcomes + risks) / 5 * 100) / 100;
  }

  /** 针对某条路径的详细展开 */
  expandPath(id: string, state: CurrentStateInput): FuturePath | undefined {
    return this.generate(state).find((p) => p.id === id);
  }

  /** 根据用户行为调整路径概率 */
  adjustProbabilities(paths: FuturePath[], behavior: { selectedId?: string; feedback?: string }): FuturePath[] {
    return paths.map((p) => {
      let adj = p.probability;
      if (p.id === behavior.selectedId) {
        adj = Math.min(0.95, adj * 1.3); // selected path becomes more likely
      }
      if (behavior.feedback === 'dismiss' && p.id === behavior.selectedId) {
        adj = adj * 0.5; // dismissed path halves
      }
      return { ...p, probability: Math.round(adj * 100) / 100 };
    });
  }
}
