// lib/symbol/v5/revenue.ts
// Revenue Brain — 收入大脑
// V5: 系统开始"优化赚钱方式"——定价、订阅、涨价、降价全部自动决策

export type PricingModel = 'one_time' | 'subscription' | 'tiered' | 'dynamic';

export interface RevenueData {
  conversionRate: number;  // 0-1
  churnRate: number;       // 0-1
  avgRevenue: number;      // USD
  activeUsers: number;
  lifetimeValue: number;
}

export type PricingDecision = 'reduce_price' | 'increase_value_density' | 'scale_acquisition' | 'stable' | 'introduce_subscription' | 'tier_products';

export interface RevenueScenario {
  low: number;
  base: number;
  high: number;
  recommendation: string;
}

export class RevenueBrain {
  pricingModels: PricingModel[] = ['one_time', 'subscription', 'tiered', 'dynamic'];

  /** 根据数据自动决策定价策略 */
  optimizePricing(data: RevenueData): { decision: PricingDecision; reasoning: string; model: PricingModel } {
    const { conversionRate, churnRate, avgRevenue, lifetimeValue } = data;

    // 转化率太低 → 降价
    if (conversionRate < 0.05) {
      return { decision: 'reduce_price', reasoning: `Conversion rate ${(conversionRate * 100).toFixed(1)}% is below threshold — reducing price improves entry.`, model: 'one_time' };
    }
    // 流失率太高 → 增加价值密度
    if (churnRate > 0.3) {
      return { decision: 'increase_value_density', reasoning: `Churn ${(churnRate * 100).toFixed(1)}% is high — need more ongoing value to retain.`, model: 'subscription' };
    }
    // ARPU > $50 → 可以扩张获客
    if (avgRevenue > 50 && lifetimeValue > 100) {
      return { decision: 'scale_acquisition', reasoning: `Avg revenue $${avgRevenue} with LTV $${lifetimeValue} supports scaling acquisition spend.`, model: 'tiered' };
    }
    // 高转化+低流失 → 引入订阅
    if (conversionRate > 0.2 && churnRate < 0.1) {
      return { decision: 'introduce_subscription', reasoning: 'Healthy conversion and retention — ready for recurring revenue.', model: 'subscription' };
    }

    return { decision: 'stable', reasoning: 'Metrics within acceptable range — maintain current model.', model: 'one_time' };
  }

  /** 模拟不同定价场景 */
  simulateRevenueScenario(basePrice: number): RevenueScenario {
    return {
      low: Math.round(basePrice * 0.8 * 100) / 100,
      base: basePrice,
      high: Math.round(basePrice * 1.5 * 100) / 100,
      recommendation: `Recommended range: $${(basePrice * 0.8).toFixed(2)} – $${(basePrice * 1.5).toFixed(2)}. Start at $${basePrice.toFixed(2)} and test upward.`,
    };
  }

  /** 估算未来收入 */
  projectRevenue(data: RevenueData, months: number): { month: number; revenue: number }[] {
    const projections: { month: number; revenue: number }[] = [];
    let users = data.activeUsers;
    for (let m = 1; m <= months; m++) {
      const netNew = users * data.conversionRate * (1 - data.churnRate);
      users += netNew;
      projections.push({
        month: m,
        revenue: Math.round(users * data.avgRevenue * 100) / 100,
      });
    }
    return projections;
  }
}
