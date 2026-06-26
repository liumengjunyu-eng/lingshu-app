// lib/symbol/v4/evolution.ts
// Evolution Brain — 进化系统
// V4 最核心（终极）：系统开始自己改自己策略

export interface SystemState {
  conversion_rate: number;
  share_rate: number;
  channel_performance: number;
  content_engagement: number;
  return_rate: number;
}

export type MutationDirection = 'increase' | 'decrease' | 'stable';

export interface MutationDecision {
  content_weight: MutationDirection;
  emotional_intensity: MutationDirection;
  channel_bias: MutationDirection;
  paywall_aggressiveness: MutationDirection;
}

export interface EvolvedConfig {
  content_weight: number;
  emotional_intensity: number;
  channel_bias: number;
  paywall_aggressiveness: number;
  mutation_cycle: number;
  version: string;
  applied_at: string;
}

export class EvolutionBrain {
  private mutationHistory: MutationDecision[] = [];
  private currentConfig: EvolvedConfig = this._defaultConfig();

  private _defaultConfig(): EvolvedConfig {
    return {
      content_weight: 0.5,
      emotional_intensity: 0.5,
      channel_bias: 0.5,
      paywall_aggressiveness: 0.5,
      mutation_cycle: 0,
      version: 'v4-base',
      applied_at: new Date().toISOString(),
    };
  }

  /** 根据当前指标，决定系统策略该如何调整 */
  mutateSystem(state: SystemState): MutationDecision {
    const decision: MutationDecision = {
      content_weight: this.adjust(state.conversion_rate),
      emotional_intensity: this.adjust(state.share_rate),
      channel_bias: this.adjust(state.channel_performance),
      paywall_aggressiveness: this.adjust(state.return_rate),
    };
    this.mutationHistory.push(decision);
    return decision;
  }

  /** 单维度调整 */
  adjust(metric: number): MutationDirection {
    if (metric > 0.8) return 'increase';
    if (metric < 0.3) return 'decrease';
    return 'stable';
  }

  /** 执行进化：应用决策到配置 */
  evolve(state: SystemState): EvolvedConfig {
    const decision = this.mutateSystem(state);
    const applyDelta = (dir: MutationDirection, base: number): number => {
      if (dir === 'increase') return Math.min(1, base + 0.1);
      if (dir === 'decrease') return Math.max(0, base - 0.1);
      return base;
    };

    this.currentConfig = {
      content_weight: applyDelta(decision.content_weight, this.currentConfig.content_weight),
      emotional_intensity: applyDelta(decision.emotional_intensity, this.currentConfig.emotional_intensity),
      channel_bias: applyDelta(decision.channel_bias, this.currentConfig.channel_bias),
      paywall_aggressiveness: applyDelta(decision.paywall_aggressiveness, this.currentConfig.paywall_aggressiveness),
      mutation_cycle: this.currentConfig.mutation_cycle + 1,
      version: `v4-evolved-${this.currentConfig.mutation_cycle + 1}`,
      applied_at: new Date().toISOString(),
    };

    this._persist();
    return this.currentConfig;
  }

  getCurrentConfig(): EvolvedConfig {
    return { ...this.currentConfig };
  }

  getMutationHistory(): MutationDecision[] {
    return [...this.mutationHistory];
  }

  /** 建议状态：根据演进后的配置输出推荐行动 */
  getRecommendations(state: SystemState): string[] {
    const recs: string[] = [];
    if (state.conversion_rate < 0.3) recs.push('Increase paywall urgency triggers (what happens / do nothing)');
    if (state.share_rate < 0.3) recs.push('Boost emotional intensity in shareable content (fear / identity hooks)');
    if (state.channel_performance < 0.3) recs.push('Re-evaluate channel mix — current best channel underperforming');
    if (state.return_rate < 0.2) recs.push('Add return incentive to conversion flow (retention hooks)');
    if (recs.length === 0) recs.push('System is in healthy equilibrium — maintain current configuration');
    return recs;
  }

  // --- Persistence ---

  private STORAGE_KEY = 'v4_evolution_brain';

  private _persist(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        currentConfig: this.currentConfig,
        mutationHistory: this.mutationHistory,
      }));
    } catch { /* ignore */ }
  }

  load(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      this.currentConfig = data.currentConfig || this._defaultConfig();
      this.mutationHistory = data.mutationHistory || [];
    } catch { /* ignore */ }
  }

  static create(): EvolutionBrain {
    const brain = new EvolutionBrain();
    brain.load();
    return brain;
  }
}
