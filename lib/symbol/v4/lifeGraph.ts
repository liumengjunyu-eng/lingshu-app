// lib/symbol/v4/lifeGraph.ts
// Life Graph System — "人生轨迹图"
// 把 V3 SymbolMemory 的 snapshots 变成时间轴 + 状态转换图

export interface LifeGraphNode {
  timestamp: number;
  dateLabel: string;
  archetype: string;
  dominantElement: string;
  balanceScore: number;
  fatigue: number;
  emotionalState: string;
}

export interface LifeGraphTransition {
  fromIndex: number;
  toIndex: number;
  fromArchetype: string;
  toArchetype: string;
  trigger: string;
  timeDeltaDays: number;
}

export interface LifeGraph {
  nodes: LifeGraphNode[];
  transitions: LifeGraphTransition[];
  summary: {
    totalObservations: number;
    timeSpanDays: number;
    archetypeChanges: number;
    direction: string;
  };
}

// Format timestamp → readable date
function fmtDate(ts: number): string {
  const d = new Date(ts);
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${m}/${day}`;
}

// Determine what triggered a state change
function inferTrigger(from: LifeGraphNode, to: LifeGraphNode): string {
  const fatigueDelta = to.fatigue - from.fatigue;
  const balanceDelta = to.balanceScore - from.balanceScore;

  if (fatigueDelta > 15) return 'Fatigue accumulation';
  if (fatigueDelta < -15) return 'Recovery period';
  if (balanceDelta > 20 && to.archetype !== from.archetype) return 'Identity restructuring';
  if (balanceDelta < -20) return 'System imbalance';
  if (to.archetype !== from.archetype) return 'Symbolic shift';
  return 'Gradual evolution';
}

export function buildLifeGraph(allNodes: LifeGraphNode[]): LifeGraph {
  if (allNodes.length === 0) {
    return { nodes: [], transitions: [], summary: { totalObservations: 0, timeSpanDays: 0, archetypeChanges: 0, direction: 'unknown' } };
  }

  // Sort by time
  const nodes = [...allNodes].sort((a, b) => a.timestamp - b.timestamp);

  // Build transitions
  const transitions: LifeGraphTransition[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const timeDeltaMs = nodes[i + 1].timestamp - nodes[i].timestamp;
    transitions.push({
      fromIndex: i,
      toIndex: i + 1,
      fromArchetype: nodes[i].archetype,
      toArchetype: nodes[i + 1].archetype,
      trigger: inferTrigger(nodes[i], nodes[i + 1]),
      timeDeltaDays: Math.round(timeDeltaMs / 86400000),
    });
  }

  // Summary
  const timeSpanMs = nodes[nodes.length - 1].timestamp - nodes[0].timestamp;
  const archetypeChanges = transitions.filter(t => t.fromArchetype !== t.toArchetype).length;

  const firstFatigue = nodes[0].fatigue;
  const lastFatigue = nodes[nodes.length - 1].fatigue;
  let direction = 'stable';
  if (lastFatigue < firstFatigue - 10) direction = 'improving';
  else if (lastFatigue > firstFatigue + 10) direction = 'declining';

  return {
    nodes,
    transitions,
    summary: {
      totalObservations: nodes.length,
      timeSpanDays: Math.round(timeSpanMs / 86400000),
      archetypeChanges,
      direction,
    },
  };
}

// Convert MemorySnapshots from V3 → LifeGraphNodes
import type { MemorySnapshot } from '@/lib/symbol/v3/symbolMemory';

export function snapshotsToLifeGraph(snapshots: MemorySnapshot[]): LifeGraphNode[] {
  return snapshots.map(s => ({
    timestamp: s.timestamp,
    dateLabel: fmtDate(s.timestamp),
    archetype: s.archetype,
    dominantElement: s.dominantElement,
    balanceScore: s.balanceScore,
    fatigue: Math.round(s.fatigue),
    emotionalState: s.emotionalState,
  }));
}
