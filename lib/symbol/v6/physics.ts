// lib/symbol/v6/physics.ts
// Market Physics Engine — 市场物理引擎
// V6: 市场变成"可计算物理系统"——可以判断哪个市场在爆/在崩/可以进入

export interface MarketState {
  demand: number;
  supply: number;
  attention: number;
  volatility: number;
}

export interface SimulationStepResult {
  attention: number;
  equilibrium: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  phase: 'boom' | 'stagnation' | 'correction' | 'recovery';
}

export class MarketPhysicsEngine {
  demand: number;
  supply: number;
  attention: number;
  volatility: number;
  private history: MarketState[] = [];

  constructor(demand = 0.5, supply = 0.5, attention = 0.5, volatility = 0.05) {
    this.demand = demand;
    this.supply = supply;
    this.attention = attention;
    this.volatility = volatility;
  }

  /** 模拟一个市场周期 */
  simulateStep(): SimulationStepResult {
    // 注意力 = 供需差驱动
    this.attention += (this.demand - this.supply) * 0.1;

    // 供需随机波动
    this.demand *= 1 + (Math.random() - 0.5) * this.volatility;
    this.supply *= 1 + (Math.random() - 0.5) * this.volatility;

    // 夹紧范围
    this.demand = Math.max(0.1, Math.min(1, this.demand));
    this.supply = Math.max(0.1, Math.min(1, this.supply));
    this.attention = Math.max(0.1, Math.min(1.5, this.attention));

    const equilibrium = Math.abs(this.demand - this.supply);

    this.history.push({ demand: this.demand, supply: this.supply, attention: this.attention, volatility: this.volatility });

    return {
      attention: Math.round(this.attention * 100) / 100,
      equilibrium: Math.round(equilibrium * 100) / 100,
      direction: equilibrium < 0.05 ? 'neutral' : this.demand > this.supply ? 'bullish' : 'bearish',
      phase: this.isBubble() ? 'correction' : equilibrium < 0.1 ? 'stagnation' : this.demand > this.supply ? 'boom' : 'recovery',
    };
  }

  /** 是否泡沫 */
  isBubble(): boolean {
    return this.attention > 1.2;
  }

  /** 是否崩盘 */
  isCrash(): boolean {
    return this.attention < 0.2 || this.demand < 0.15;
  }

  /** 是否健康 */
  isHealthy(): boolean {
    return Math.abs(this.demand - this.supply) < 0.15 && this.attention > 0.4 && this.attention < 1.0;
  }

  /** 建议进入市场 */
  shouldEnter(): { enter: boolean; reason: string } {
    if (this.isHealthy() && !this.isBubble()) {
      return { enter: true, reason: 'Market is healthy with stable equilibrium.' };
    }
    if (this.isBubble()) {
      return { enter: false, reason: `Bubble detected (attention ${(this.attention * 100).toFixed(0)}%). Wait for correction.` };
    }
    if (this.isCrash()) {
      return { enter: true, reason: `Market bottom (attention ${(this.attention * 100).toFixed(0)}%). High upside potential.` };
    }
    return { enter: false, reason: `Market unstable (equilibrium ${(Math.abs(this.demand - this.supply) * 100).toFixed(0)}%). Monitor.` };
  }

  /** 多次模拟预测 */
  forecast(steps: number = 12): SimulationStepResult[] {
    const results: SimulationStepResult[] = [];
    const saved = { demand: this.demand, supply: this.supply, attention: this.attention };
    for (let s = 0; s < steps; s++) {
      results.push(this.simulateStep());
    }
    // Restore
    this.demand = saved.demand;
    this.supply = saved.supply;
    this.attention = saved.attention;
    return results;
  }

  getHistory(): MarketState[] {
    return [...this.history];
  }
}
