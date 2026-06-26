// lib/lifegraph/forecast.ts
// Symbolic Forecast Engine — V4 模块四

import { LifeGraphNode, LifeGraph, SystemPhase } from './types';

// ─── 类型定义 ────────────────────────────────────────

export interface ForecastWindow {
  energyTrend: 'declining' | 'stable' | 'improving' | 'volatile';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskLabel: string;
  recommendedAction: string;
  identityShiftProbability: number; // 0-1
}

export interface SymbolicForecast {
  next7Days: ForecastWindow;
  next30Days: ForecastWindow;
  next90Days: ForecastWindow;
  summary: string;
  basedOn: {
    fatigue: number;
    energy: number;
    state: string;
    phase: SystemPhase;
  };
}

// ─── 五行周期推断 ────────────────────────────────────

const PHASE_CYCLE: Record<SystemPhase, {
  next7: { trend: string; risk: string; action: string };
  next30: { trend: string; risk: string; action: string };
  next90: { trend: string; risk: string; action: string };
}> = {
  system_overload: {
    next7: { trend: 'declining', risk: 'critical', action: 'Stop all non-essential output. Sleep 8+ hours. Cancel 50% of commitments.' },
    next30: { trend: 'volatile', risk: 'high', action: 'If rest is taken now, recovery begins in 7-10 days. If ignored, collapse within 30 days.' },
    next90: { trend: 'declining', risk: 'high', action: 'Without intervention, system will enter forced reset. Identity reconstruction likely.' },
  },
  active_recovery: {
    next7: { trend: 'improving', risk: 'medium', action: 'Maintain low output. Focus on restorative routines. Avoid high-stimulation environments.' },
    next30: { trend: 'improving', risk: 'low', action: 'Gradual return to 60-70% capacity. Introduce gentle social and creative activities.' },
    next90: { trend: 'stable', risk: 'low', action: 'New baseline established. Good window for strategic decisions.' },
  },
  identity_shift: {
    next7: { trend: 'volatile', risk: 'medium', action: 'You are in transition. Do not make permanent decisions this week. Observe your patterns.' },
    next30: { trend: 'improving', risk: 'medium', action: 'New identity forming. Test small commitments to see what fits your new energy baseline.' },
    next90: { trend: 'improving', risk: 'low', action: 'Transformation phase completion. Your new operating system is online.' },
  },
  stable_operation: {
    next7: { trend: 'stable', risk: 'low', action: 'Maintain current balance. Use this window for creative or strategic work.' },
    next30: { trend: 'stable', risk: 'low', action: 'Good period for long-term planning. Your decision quality is at peak.' },
    next90: { trend: 'stable', risk: 'medium', action: 'Watch for complacency. Stable periods can mask gradual decline. Schedule a check-in at day 60.' },
  },
  collapse_risk: {
    next7: { trend: 'declining', risk: 'critical', action: 'EMERGENCY PROTOCOL: Disconnect from work and social obligations for 72 hours. Immediate rest required.' },
    next30: { trend: 'declining', risk: 'high', action: 'System approaching forced reset point. Professional support recommended.' },
    next90: { trend: 'declining', risk: 'high', action: 'Recovery will require 3-6 months. Identity reconstruction is unavoidable.' },
  },
};

// ─── 趋势推断 ────────────────────────────────────────

/**
 * 根据能量趋势和相位调整风险级别
 */
function adjustRisk(phase: SystemPhase, fatigue: number): 'low' | 'medium' | 'high' | 'critical' {
  if (fatigue > 85) return 'critical';
  if (fatigue > 70) return 'high';
  if (fatigue > 50) return 'medium';
  if (phase === 'system_overload' || phase === 'collapse_risk') return 'medium';
  return 'low';
}

function parseTrend(trend: string): 'declining' | 'stable' | 'improving' | 'volatile' {
  if (trend === 'declining' || trend === 'stable' || trend === 'improving' || trend === 'volatile') return trend;
  return 'stable';
}

function parseRisk(risk: string): 'low' | 'medium' | 'high' | 'critical' {
  if (risk === 'low' || risk === 'medium' || risk === 'high' || risk === 'critical') return risk;
  return 'medium';
}

// ─── 主预测函数 ──────────────────────────────────────

export function generateForecast(node: LifeGraphNode, graph?: LifeGraph): SymbolicForecast {
  const phase = node.phase;
  const base = PHASE_CYCLE[phase];
  const fatigue = node.fatigue;

  // 如果不是严格匹配的相位，fallback 到 energy 级别
  const cycle = base || {
    next7: {
      trend: fatigue > 60 ? 'declining' : 'stable',
      risk: fatigue > 70 ? 'critical' : fatigue > 40 ? 'medium' : 'low',
      action: fatigue > 60 ? 'Prioritize rest. Reduce workload.' : 'Maintain current balance.',
    },
    next30: {
      trend: fatigue > 60 ? 'volatile' : 'stable',
      risk: fatigue > 70 ? 'high' : fatigue > 40 ? 'medium' : 'low',
      action: fatigue > 60 ? 'Recovery plan needed. Consider professional support.' : 'Sustained performance with moderation.',
    },
    next90: {
      trend: fatigue > 50 ? 'declining' : 'stable',
      risk: fatigue > 60 ? 'high' : 'medium',
      action: fatigue > 50 ? 'System reset probable. Prepare for identity shift.' : 'Gradual growth sustainable with boundaries.',
    },
  };

  const identityShiftProb = fatigue > 75 ? 0.85
    : fatigue > 60 ? 0.65
    : fatigue > 40 ? 0.35
    : 0.1;

  function buildWindow(
    w: { trend: string; risk: string; action: string }
  ): ForecastWindow {
    const adjustedRisk = adjustRisk(phase, fatigue);
    return {
      energyTrend: parseTrend(w.trend),
      riskLevel: adjustedRisk,
      riskLabel: adjustedRisk === 'critical' ? 'Red alert'
        : adjustedRisk === 'high' ? 'Warning'
        : adjustedRisk === 'medium' ? 'Caution'
        : 'Stable',
      recommendedAction: w.action,
      identityShiftProbability: identityShiftProb,
    };
  }

  // 摘要文案
  const summary = generateSummary(phase, fatigue, node.state);

  return {
    next7Days: buildWindow(cycle.next7),
    next30Days: buildWindow(cycle.next30),
    next90Days: buildWindow(cycle.next90),
    summary,
    basedOn: {
      fatigue: node.fatigue,
      energy: node.energy,
      state: node.state,
      phase: node.phase,
    },
  };
}

function generateSummary(phase: SystemPhase, fatigue: number, state: string): string {
  if (fatigue > 80) {
    return `Your system is in ${phase.replace(/_/g, ' ')}. The forecast indicates a critical restructuring window ahead. The next 7 days will determine whether you enter a forced reset or begin recovery. Your ${state.replace(/_/g, ' ')} archetype is under maximum pressure.`;
  }
  if (fatigue > 60) {
    return `You are in ${phase.replace(/_/g, ' ')}. The forecast shows a high-stress window for the next 30 days. Your ${state.replace(/_/g, ' ')} energy pattern is declining but recoverable with deliberate action.`;
  }
  if (fatigue > 40) {
    return `Your system is in ${phase.replace(/_/g, ' ')}. The forecast suggests a manageable trajectory with moderate risk. The ${state.replace(/_/g, ' ')} pattern is active but not dominant.`;
  }
  return `Your system is ${phase.replace(/_/g, ' ')}. The forecast shows stable energy with low risk. Your ${state.replace(/_/g, ' ')} archetype is operating at sustainable capacity.`;
}

/**
 * 获取付费建议（仅付费用户展示）
 */
export function getPremiumForecastInsight(node: LifeGraphNode): string {
  const phase = node.phase;
  const base = PHASE_CYCLE[phase] || PHASE_CYCLE.stable_operation;

  const insights: Record<string, string> = {
    system_overload: 'Premium Insight: Your five-element chart shows a Water deficiency. The overload is not just fatigue — it is a systemic imbalance. Replenishing Water energy (rest, silence, night-time sleep before 11pm) will restore balance 2.3x faster than general rest alone.',
    active_recovery: 'Premium Insight: Your Earth element is stabilizing. This is the optimal window for dietary and lifestyle changes. The body is in a receptive state — changes made now have 3x higher adherence probability.',
    identity_shift: 'Premium Insight: Your Metal element is rising. This signals a purification phase. Relationships and habits that no longer serve you will naturally fall away. Do not resist this process.',
    stable_operation: 'Premium Insight: Your energy pattern shows a potential Fire excess developing. Without preventive balance, this could lead to burnout within 60-90 days. Proactive Wood element cultivation (morning movement, creative expression) is recommended.',
    collapse_risk: 'Premium Insight: Your system is experiencing a Five-Element cascade failure. All elements are depleted. This is not a simple rest issue — it requires structural rebuilding. A 21-day recovery protocol with professional support is strongly recommended.',
  };

  return insights[phase] || 'Premium Insight: Your energy signature shows unique patterns. A full symbolic analysis would reveal your optimal recovery pathway.';
}
