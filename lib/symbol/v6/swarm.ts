// lib/symbol/v6/swarm.ts
// Company Swarm Layer — 公司群体层
// V6: 不再是"一个系统"，而是"多个系统同时运行、竞争、进化"

export interface CompanyNode {
  id: string;
  strategy: string;
  revenue: number;
  growthRate: number;
  fitness: number;
  generation: number;
  birthTime: number;
}

const STRATEGIES = [
  'aggressive_acquisition',
  'high_retention',
  'low_price_volume',
  'premium_niche',
  'viral_content',
  'platform_arbitrage',
  'subscription_lock',
  'freemium_upsell',
];

function randomStrategy(): string {
  return STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];
}

export class CompanyNodeFactory {
  static create(id: string, generation: number = 0): CompanyNode {
    const growthRate = 0.3 + Math.random() * 0.7; // 0.3-1.0
    const revenue = Math.round(Math.random() * 10000 * 100) / 100;
    return {
      id,
      strategy: randomStrategy(),
      revenue,
      growthRate,
      fitness: revenue * growthRate,
      generation,
      birthTime: Date.now(),
    };
  }

  /** 从父节点变异出一个子节点 */
  static mutate(parent: CompanyNode, childId: string): CompanyNode {
    const mutatedGrowth = parent.growthRate + (Math.random() - 0.5) * 0.3;
    const mutatedRevenue = parent.revenue * (0.8 + Math.random() * 0.4);
    return {
      id: childId,
      strategy: Math.random() > 0.3 ? parent.strategy : randomStrategy(),
      revenue: Math.round(mutatedRevenue * 100) / 100,
      growthRate: Math.max(0.05, Math.min(1, mutatedGrowth)),
      fitness: mutatedRevenue * Math.max(0.05, Math.min(1, mutatedGrowth)),
      generation: parent.generation + 1,
      birthTime: Date.now(),
    };
  }
}

export class CompanySwarm {
  nodes: CompanyNode[] = [];
  private nodeCounter = 0;

  /** 生成初始种群 */
  spawn(n: number): void {
    for (let i = 0; i < n; i++) {
      this.nodes.push(CompanyNodeFactory.create(`node_${this.nodeCounter++}`));
    }
  }

  /** 按适应度排序，返回 top performers */
  compete(): CompanyNode[] {
    this.nodes.sort((a, b) => b.fitness - a.fitness);
    return this.nodes;
  }

  /** 获取前三强 */
  getTop(limit: number = 3): CompanyNode[] {
    return this.compete().slice(0, limit);
  }

  /** 进化：保留最优者，淘汰其余，繁殖下一代 */
  evolve(retainCount: number = 3, childrenCount: number = 5): void {
    const top = this.getTop(retainCount);
    const children: CompanyNode[] = [];

    for (const parent of top) {
      for (let c = 0; c < childrenCount; c++) {
        children.push(CompanyNodeFactory.mutate(parent, `node_${this.nodeCounter++}`));
      }
    }

    this.nodes = [...top, ...children];
  }

  /** 模拟一轮完整竞争 */
  simulateRound(): void {
    // 重新计算 fitness
    for (const node of this.nodes) {
      node.fitness = node.revenue * node.growthRate;
    }
    this.compete();
  }

  getStats(): {
    totalCompanies: number;
    avgRevenue: number;
    avgGrowth: number;
    avgFitness: number;
    topRevenue: number;
    topGrowth: number;
  } {
    const n = this.nodes.length || 1;
    return {
      totalCompanies: this.nodes.length,
      avgRevenue: Math.round(this.nodes.reduce((s, n) => s + n.revenue, 0) / n * 100) / 100,
      avgGrowth: Math.round(this.nodes.reduce((s, n) => s + n.growthRate, 0) / n * 100) / 100,
      avgFitness: Math.round(this.nodes.reduce((s, n) => s + n.fitness, 0) / n * 100) / 100,
      topRevenue: this.nodes.length > 0 ? this.nodes[0].revenue : 0,
      topGrowth: this.nodes.length > 0 ? this.nodes[0].growthRate : 0,
    };
  }
}
