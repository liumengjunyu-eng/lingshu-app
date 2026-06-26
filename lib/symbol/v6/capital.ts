// lib/symbol/v6/capital.ts
// Autonomous Capital Flow Engine — 资本流动系统
// V6 核心：钱开始"自动流动"——投资、撤资、再分配全自动化

export interface CapitalAllocation {
  nodeId: string;
  allocation: number;
  share: number; // 0-1
}

export interface PortfolioItem {
  nodeId: string;
  allocation: number;
  returns: number;
  risk: number;
}

export class CapitalFlowEngine {
  private pool: number;

  constructor(initialPool: number = 100000) {
    this.pool = initialPool;
  }

  /** 按增长率分配资本（幂律分布） */
  allocate(nodes: { id: string; growthRate: number; revenue: number }[], totalCapital?: number): CapitalAllocation[] {
    const capital = totalCapital ?? this.pool;
    const ranked = [...nodes].sort((a, b) => b.growthRate - a.growthRate);

    return ranked.map((node, i) => {
      const share = Math.pow(0.5, i) / ranked.reduce((s, _, idx) => s + Math.pow(0.5, idx), 0);
      const allocation = Math.round(capital * share * 100) / 100;
      return { nodeId: node.id, allocation, share: Math.round(share * 10000) / 10000 };
    });
  }

  /** 再平衡投资组合 */
  rebalance(portfolio: PortfolioItem[], marketGrowth: number = 0.05): PortfolioItem[] {
    return portfolio.map((item) => ({
      ...item,
      allocation: Math.round(item.allocation * (1 + marketGrowth + (Math.random() - 0.5) * 0.1) * 100) / 100,
      returns: Math.round(item.allocation * (Math.random() * 0.3) * 100) / 100,
      risk: Math.round(Math.random() * 100) / 100,
    }));
  }

  /** 提取 ROI */
  extractROI(portfolio: PortfolioItem[], rate: number = 0.2): number {
    const roi = portfolio.reduce((sum, p) => sum + p.allocation * rate, 0);
    return Math.round(roi * 100) / 100;
  }

  /** 决定撤资：剔除表现最差的 N 个 */
  divest(portfolio: PortfolioItem[], keepCount: number): { kept: PortfolioItem[]; divested: PortfolioItem[]; recovered: number } {
    const sorted = [...portfolio].sort((a, b) => b.returns - a.returns);
    const kept = sorted.slice(0, keepCount);
    const divested = sorted.slice(keepCount);
    const recovered = Math.round(divested.reduce((s, i) => s + i.allocation * 0.7, 0) * 100) / 100;
    return { kept, divested, recovered };
  }

  /** 总资产价值 */
  getTotalValue(portfolio: PortfolioItem[]): number {
    return Math.round(portfolio.reduce((s, i) => s + i.allocation, 0) * 100) / 100;
  }

  getPool(): number {
    return this.pool;
  }

  setPool(amount: number): void {
    this.pool = amount;
  }
}
