// lib/lifegraph/simulation.ts
// Life Simulation Engine — V4 模块二

import { LifeGraphNode, ArchetypeState, SystemPhase } from './types';

export interface SimulationPath {
  label: string;
  outcome: string;
  timeline: string;
  energyProjection: number[];   // 未来 7 天能量预测
  fatigueProjection: number[];
  riskLevel: 'low' | 'medium' | 'high';
  identityShift: boolean;
}

export interface SimulationResult {
  current: {
    state: ArchetypeState;
    phase: SystemPhase;
    energy: number;
    fatigue: number;
  };
  paths: SimulationPath[];
}

/**
 * 基于当前节点生成 3 条未来路径
 */
export function simulateLifePath(node: LifeGraphNode): SimulationResult {
  const fatigue = node.fatigue;
  const energy = node.energy;

  // 路径 A：继续当前行为
  const pathA: SimulationPath = {
    label: 'Continue Current Pattern',
    outcome: fatigue > 65
      ? 'Burnout risk within 21–45 days. System will force a reset.'
      : 'Gradual energy decline. No breakthrough without change.',
    timeline: fatigue > 65 ? '21–45 days' : '60–90 days',
    energyProjection: projectTrend(energy, -2, -5, 7),
    fatigueProjection: projectTrend(fatigue, 3, 6, 7),
    riskLevel: fatigue > 65 ? 'high' : 'medium',
    identityShift: false,
  };

  // 路径 B：调整（降低消耗）
  const pathB: SimulationPath = {
    label: 'Reduce Recovery Debt',
    outcome: fatigue > 65
      ? 'Recovery in 7–14 days. Significant energy return.'
      : 'Stabilization in 5–10 days. Room for growth.',
    timeline: fatigue > 65 ? '7–14 days' : '5–10 days',
    energyProjection: projectTrend(energy, 3, 8, 7),
    fatigueProjection: projectTrend(fatigue, -4, -10, 7),
    riskLevel: 'low',
    identityShift: false,
  };

  // 路径 C：系统重置
  const pathC: SimulationPath = {
    label: 'System Reset',
    outcome: 'Identity shift + stability gain. Requires 3–7 days of full disconnection.',
    timeline: '3–7 days reset → 14–21 days new baseline',
    energyProjection: projectTrend(energy, 5, 15, 7),
    fatigueProjection: projectTrend(fatigue, -8, -20, 7),
    riskLevel: 'medium',
    identityShift: true,
  };

  return {
    current: {
      state: node.state,
      phase: node.phase,
      energy: node.energy,
      fatigue: node.fatigue,
    },
    paths: [pathA, pathB, pathC],
  };
}

/**
 * 简易趋势投影
 * @param current 当前值
 * @param minChange 每日最小变化
 * @param maxChange 每日最大变化
 * @param days 天数
 */
function projectTrend(current: number, minChange: number, maxChange: number, days: number): number[] {
  const result: number[] = [current];
  let val = current;
  for (let i = 1; i < days; i++) {
    const change = minChange + Math.random() * (maxChange - minChange);
    // 确保每个 step 有方向性累积
    const step = minChange >= 0
      ? minChange + Math.abs(change)
      : minChange - Math.abs(change);
    val = val + step;
    val = Math.max(0, Math.min(100, val));
    result.push(Math.round(val));
  }
  return result;
}

/**
 * 根据诊断类型生成模拟文字
 */
export function getSimulationAdvice(state: ArchetypeState): string {
  const adviceMap: Record<string, string> = {
    burned_fire_architect: 'Your fire element is overdriven. The system is warning you: continued output without recovery will trigger a forced shutdown. The only way through is rest — real rest, not Netflix.',
    silent_performer: 'You appear stable because you do not express strain. But your internal load is accumulating. The simulation shows a 68% probability of emotional crash within 6 weeks if no outlet is introduced.',
    drifter: 'You have been in recovery mode for so long that recovery has become your identity. The simulation suggests: a structured routine of 3 weeks could shift you from drifting to rebuilding.',
    recovering_balanced: 'Your system is in a positive trajectory. The simulation recommends: increase social load gradually. Your current solitude is protection but will become limitation.',
    overloaded_water: 'You absorb everything around you. The simulation detects a pattern of emotional saturation. Without boundaries, your system will flood within 30 days.',
    grounded_earth: 'Your stability is your strength. The simulation suggests: this is the right time to take calculated risks. Your foundation can absorb the impact.',
  };
  return adviceMap[state] || 'Your system is in transition. The simulation recommends: observe before deciding.';
}
