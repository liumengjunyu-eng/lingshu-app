// lib/symbol/v5/resource.ts
// Resource Allocation Engine — 资源分配系统
// V5 终极能力：系统自己决定"钱投哪里、渠道权重、测试预算"

export interface BusinessMetrics {
  roi: number;             // Return on investment (e.g., 1.5 = 150%)
  cpa: number;             // Cost per acquisition in USD
  retention: number;       // 0-1
  channelPerformance: Record<string, number>; // channel -> ROI
  totalBudget: number;     // Monthly budget in USD
  revenuePerUser: number;  // USD
}

export type AllocationDecision = 'cut_budget' | 'optimize_creative' | 'improve_product' | 'scale' | 'rebalance_channels';

export interface BudgetAllocation {
  tiktok: number;
  google: number;
  twitter: number;
  instagram: number;
  testing: number;
  total: number;
}

export interface AllocationResult {
  decision: AllocationDecision;
  reasoning: string;
  budget: BudgetAllocation;
  recommendations: string[];
}

export class ResourceAllocator {
  /** 根据商业指标决定资源分配策略 */
  allocate(metrics: BusinessMetrics): AllocationResult {
    let decision: AllocationDecision;
    const recs: string[] = [];

    if (metrics.roi < 1) {
      decision = 'cut_budget';
      recs.push('ROI below 1 — stop all paid acquisition until creative is refreshed');
      recs.push('Focus on organic channels (SEO, organic social)');
    } else if (metrics.cpa > 10) {
      decision = 'optimize_creative';
      recs.push(`CPA $${metrics.cpa.toFixed(2)} exceeds $10 threshold — refresh all ad creatives`);
      recs.push(`Test 3+ new hook variations per channel`);
    } else if (metrics.retention < 0.3) {
      decision = 'improve_product';
      recs.push(`Retention ${(metrics.retention * 100).toFixed(1)}% is low — pause acquisition spend`);
      recs.push('Add post-purchase engagement loop (7-day follow-up sequence)');
    } else {
      decision = 'scale';
      recs.push('All metrics healthy — scale budget proportionally');
      recs.push(`Allocate 10% of budget to experimental channels`);
    }

    // Rebalance channels based on performance
    const channelROI = metrics.channelPerformance;
    const totalChannelROI = Object.values(channelROI).reduce((a, b) => a + b, 0);
    if (totalChannelROI > 0 && metrics.roi >= 1) {
      recs.push('Rebalancing budget toward highest-ROI channels');
      const topChannel = Object.entries(channelROI).sort((a, b) => b[1] - a[1])[0];
      recs.push(`Top channel: ${topChannel[0]} (ROI ${(topChannel[1] * 100).toFixed(0)}%)`);
      if (metrics.cpa <= 10 && metrics.retention >= 0.3 && metrics.roi >= 1.5) {
        decision = 'scale';
      }
    }

    const budget = this.distributeBudget(metrics.totalBudget, decision);

    return { decision, reasoning: this._buildReasoning(decision, metrics), budget, recommendations: recs };
  }

  /** 预算分配 */
  distributeBudget(total: number, decision: AllocationDecision): BudgetAllocation {
    if (decision === 'cut_budget') {
      return {
        tiktok: 0,
        google: Math.round(total * 0.1),
        twitter: 0,
        instagram: 0,
        testing: 0,
        total: Math.round(total * 0.1),
      };
    }

    if (decision === 'improve_product') {
      return {
        tiktok: Math.round(total * 0.1),
        google: Math.round(total * 0.1),
        twitter: Math.round(total * 0.05),
        instagram: Math.round(total * 0.05),
        testing: Math.round(total * 0.1),
        total: Math.round(total * 0.4),
      };
    }

    // scale / optimize_creative / default
    return {
      tiktok: Math.round(total * 0.35),
      google: Math.round(total * 0.25),
      twitter: Math.round(total * 0.15),
      instagram: Math.round(total * 0.15),
      testing: Math.round(total * 0.1),
      total,
    };
  }

  private _buildReasoning(decision: AllocationDecision, metrics: BusinessMetrics): string {
    switch (decision) {
      case 'cut_budget':
        return `ROI ${(metrics.roi * 100).toFixed(0)}% below break-even. Reducing spend to ${Math.round(metrics.totalBudget * 0.1)}.`;
      case 'optimize_creative':
        return `CPA $${metrics.cpa.toFixed(2)} above $10 target. Holding budget but refreshing all creatives.`;
      case 'improve_product':
        return `Retention ${(metrics.retention * 100).toFixed(1)}% below 30% threshold. Reallocating 60% budget to product improvement.`;
      case 'rebalance_channels':
        return `Shifting budget toward best-performing channels based on ROI data.`;
      case 'scale':
      default:
        return `All metrics healthy: ROI ${(metrics.roi * 100).toFixed(0)}%, CPA $${metrics.cpa.toFixed(2)}, retention ${(metrics.retention * 100).toFixed(1)}%. Scaling full budget.`;
    }
  }
}
