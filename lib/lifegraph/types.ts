// lib/lifegraph/types.ts
// Life Graph System — V4 骨架

export type ArchetypeState =
  | 'burned_fire_architect'
  | 'silent_performer'
  | 'drifter'
  | 'recovering_balanced'
  | 'overloaded_water'
  | 'grounded_earth';

export type SystemPhase =
  | 'system_overload'
  | 'active_recovery'
  | 'identity_shift'
  | 'stable_operation'
  | 'collapse_risk';

export type TrendDirection = 'declining' | 'stable' | 'improving' | 'volatile';

export interface LifeGraphNode {
  /** Unix ms timestamp */
  time: number;
  /** 人格原型 */
  state: ArchetypeState;
  /** 当前能量分 0-100 */
  energy: number;
  /** 恢复债务 0-100 */
  fatigue: number;
  /** 触发事件 */
  trigger?: string;
  /** 系统阶段 */
  phase: SystemPhase;
  /** 趋势 */
  trend: TrendDirection;
  /** 关联的 sessionId */
  sessionId: string;
  /** 节点唯一 ID */
  id: string;
}

export interface LifeGraphEdge {
  from: string;   // 源节点 ID
  to: string;     // 目标节点 ID
  trigger: string; // 状态变化原因
  duration: number; // 变化耗时 ms
}

export interface LifeGraph {
  nodes: LifeGraphNode[];
  edges: LifeGraphEdge[];
  sessionId: string;
  createdAt: number;
  updatedAt: number;
}

export interface LifeGraphSummary {
  duration: number;         // 总追踪时长 ms
  stateCount: number;       // 经历的阶段数
  dominantState: ArchetypeState;  // 最常见状态
  energyMin: number;
  energyMax: number;
  energyAvg: number;
  collapseRisks: number;    // 崩溃预警次数
  recoveryPeriods: number;  // 恢复周期数
}
