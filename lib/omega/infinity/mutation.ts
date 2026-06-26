// lib/omega/infinity/mutation.ts
// Feedback Mutation Loop — 反馈突变循环
// Ω∞: 用户行为 → 系统输出 → 用户重新理解 → 系统改写自身

import type { InfiniteState, InterpretationLayer } from './engine';

export interface MutationEvent {
  at: number;
  trigger: 'behavior_feedback' | 'reinterpretation' | 'external_input' | 'self_mutation';
  previousEntropy: number;
  newEntropy: number;
  mutationMagnitude: number;
  description: string;
}

export class FeedbackMutationEngine {
  private events: MutationEvent[] = [];
  private readonly MAX_EVENTS = 100;

  /** 注入用户行为反馈 → 系统自我突变 */
  injectFeedback(state: InfiniteState, behavior: { type: string; intensity: number }): { mutatedState: InfiniteState; event: MutationEvent } {
    const previousEntropy = state.entropy;
    const magnitude = this._calculateMutationMagnitude(behavior);
    const newEntropy = Math.min(1, Math.max(0.05, state.entropy + magnitude * (Math.random() * 2 - 1)));

    const event: MutationEvent = {
      at: Date.now(),
      trigger: 'behavior_feedback',
      previousEntropy: Math.round(previousEntropy * 100) / 100,
      newEntropy: Math.round(newEntropy * 100) / 100,
      mutationMagnitude: Math.round(magnitude * 100) / 100,
      description: this._describeMutation(magnitude),
    };

    this.events.push(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-50);
    }

    return {
      mutatedState: { ...state, entropy: newEntropy, version: state.version + 1 },
      event,
    };
  }

  /** 注入系统自我变异（无需外部输入） */
  selfMutate(state: InfiniteState): { mutatedState: InfiniteState; event: MutationEvent } {
    const previousEntropy = state.entropy;
    const magnitude = Math.random() * 0.25;
    const drift = magnitude * (Math.random() > 0.5 ? 1 : -1);
    const newEntropy = Math.min(1, Math.max(0.05, state.entropy + drift));

    const event: MutationEvent = {
      at: Date.now(),
      trigger: 'self_mutation',
      previousEntropy: Math.round(previousEntropy * 100) / 100,
      newEntropy: Math.round(newEntropy * 100) / 100,
      mutationMagnitude: Math.round(magnitude * 100) / 100,
      description: 'System mutated spontaneously — no external cause detected.',
    };

    this.events.push(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-50);
    }

    return {
      mutatedState: { ...state, entropy: newEntropy, version: state.version + 1 },
      event,
    };
  }

  /** 用户重新理解 → 系统改写自身 */
  reinterpret(state: InfiniteState, interpretation: InterpretationLayer): { mutatedState: InfiniteState; event: MutationEvent } {
    const previousEntropy = state.entropy;
    const magnitude = interpretation.confidence * 0.3 + 0.1;
    const newEntropy = Math.min(1, Math.max(0.05, state.entropy + magnitude * interpretation.entropy));

    const event: MutationEvent = {
      at: Date.now(),
      trigger: 'reinterpretation',
      previousEntropy: Math.round(previousEntropy * 100) / 100,
      newEntropy: Math.round(newEntropy * 100) / 100,
      mutationMagnitude: Math.round(magnitude * 100) / 100,
      description: `Interpretation (v${interpretation.version}) triggered system rewrite: "${interpretation.meaning.slice(0, 40)}..."`,
    };

    this.events.push(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-50);
    }

    return {
      mutatedState: { ...state, entropy: newEntropy, version: state.version + 1 },
      event,
    };
  }

  /** 获取最近的突变事件 */
  getRecentEvents(count: number = 10): MutationEvent[] {
    return this.events.slice(-count);
  }

  /** 突变率——单位时间内突变次数 */
  getMutationRate(timeWindowMs: number = 60000): number {
    const cutoff = Date.now() - timeWindowMs;
    const recent = this.events.filter((e) => e.at > cutoff);
    return Math.round((recent.length / (timeWindowMs / 60000)) * 100) / 100;
  }

  /** 突变方向——趋于稳定还是发散 */
  getMutationTrend(): { trending: 'stable' | 'diverging' | 'oscillating' } {
    if (this.events.length < 5) return { trending: 'stable' };

    const recent = this.events.slice(-10);
    const entropies = recent.map((e) => e.newEntropy);
    const mean = entropies.reduce((a, b) => a + b, 0) / entropies.length;
    const variance = entropies.reduce((sum, v) => sum + (v - mean) ** 2, 0) / entropies.length;

    if (variance > 0.05) return { trending: 'oscillating' };
    if (mean > 0.6) return { trending: 'diverging' };
    return { trending: 'stable' };
  }

  /** 重置 */
  reset(): void {
    this.events = [];
  }

  private _calculateMutationMagnitude(behavior: { type: string; intensity: number }): number {
    const typeFactor =
      behavior.type === 'share' ? 0.3 :
      behavior.type === 'deep_scroll' ? 0.2 :
      behavior.type === 'click' ? 0.15 :
      behavior.type === 'return' ? 0.25 : 0.1;
    return Math.min(0.7, typeFactor * behavior.intensity);
  }

  private _describeMutation(magnitude: number): string {
    if (magnitude > 0.4) return 'Major system rewiring — interpretation framework shifted significantly.';
    if (magnitude > 0.2) return 'Moderate mutation — reality model adjusting to new signal.';
    return 'Minor drift — system recalibrating within current frame.';
  }
}
