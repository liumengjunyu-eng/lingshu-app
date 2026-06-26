// lib/symbol/v7/rules.ts
// Rule Evolution Engine — 规则进化系统
// V7 核心：规则不是写死的，是"进化的"

export interface CivilizationMetrics {
  collapseRisk: number; // 0-1
  viralRate: number;    // 0-1
  engagementRate: number;
  beliefConvergence: number;
  entityCount: number;
}

export class RuleEvolutionEngine {
  private rules: string[] = [
    'maximize engagement',
    'maximize retention',
    'maximize adaptation',
    'maintain diversity',
  ];

  private readonly MAX_RULES = 12;
  private appliedRuleHistory: { rule: string; at: number; reason: string }[] = [];

  /** 根据文明指标进化规则 */
  evolve(metrics: CivilizationMetrics): string[] {
    const newRules: string[] = [];

    // 崩溃风险 > 70% → 稳定系统
    if (metrics.collapseRisk > 0.7) {
      newRules.push('stabilize system load');
    }

    // 病毒传播率 > 80% → 放大高影响力叙事
    if (metrics.viralRate > 0.8) {
      newRules.push('amplify high-impact narratives');
    }

    // 参与度 < 30% → 重新激活
    if (metrics.engagementRate < 0.3) {
      newRules.push('reactivate dormant entities');
    }

    // 信念收敛度 > 90%（文化单一化） → 多样性注入
    if (metrics.beliefConvergence > 0.9) {
      newRules.push('inject belief diversity');
    }

    // 人口 > 1000 → 分层治理
    if (metrics.entityCount > 1000) {
      newRules.push('introduce hierarchical governance');
    }

    // 崩溃风险低 + 高参与度 → 探索扩张
    if (metrics.collapseRisk < 0.3 && metrics.engagementRate > 0.7) {
      newRules.push('enable expansion protocols');
    }

    // 记录新规则
    for (const rule of newRules) {
      if (!this.rules.includes(rule)) {
        this.rules.push(rule);
        this.appliedRuleHistory.push({
          rule,
          at: Date.now(),
          reason: `evolved from metrics: collapse=${(metrics.collapseRisk * 100).toFixed(0)}%, viral=${(metrics.viralRate * 100).toFixed(0)}%, engage=${(metrics.engagementRate * 100).toFixed(0)}%`,
        });
      }
    }

    // Trim overflow (淘汰最旧的或删除冲突规则)
    while (this.rules.length > this.MAX_RULES) {
      this.rules.shift();
    }

    return this.rules;
  }

  /** 评估系统是否应该添加某个规则 */
  evaluateRule(rule: string, metrics: CivilizationMetrics): { shouldAdd: boolean; score: number } {
    const keywords: Record<string, (m: CivilizationMetrics) => boolean> = {
      stabilize: (m) => m.collapseRisk > 0.5,
      amplify: (m) => m.viralRate > 0.6,
      reactivate: (m) => m.engagementRate < 0.4,
      inject: (m) => m.beliefConvergence > 0.8,
      hierarchy: (m) => m.entityCount > 500,
      expansion: (m) => m.collapseRisk < 0.4 && m.engagementRate > 0.6,
    };

    let score = 0;
    for (const [kw, condition] of Object.entries(keywords)) {
      if (rule.includes(kw) && condition(metrics)) score += 0.25;
    }

    return { shouldAdd: score > 0.3, score: Math.round(score * 100) / 100 };
  }

  /** 获取当前活跃规则 */
  getActiveRules(): string[] {
    return [...this.rules];
  }

  /** 获取规则演变历史 */
  getRuleHistory(): { rule: string; at: number; reason: string }[] {
    return [...this.appliedRuleHistory];
  }

  /** 重置到初始规则集 */
  reset(): void {
    this.rules = [
      'maximize engagement',
      'maximize retention',
      'maximize adaptation',
      'maintain diversity',
    ];
    this.appliedRuleHistory = [];
  }
}
