// lib/lifegraph/store.ts
// Life Graph — localStorage 持久化层

import { LifeGraph, LifeGraphNode, LifeGraphEdge, LifeGraphSummary } from './types';

const STORAGE_KEY = 'ls_lifegraph';

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadGraph(): LifeGraph | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LifeGraph;
  } catch {
    return null;
  }
}

export function saveGraph(graph: LifeGraph): void {
  if (typeof window === 'undefined') return;
  try {
    graph.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
  } catch { /* silent */ }
}

/** 创建空图（首次使用） */
export function createGraph(sessionId: string): LifeGraph {
  const now = Date.now();
  const graph: LifeGraph = {
    nodes: [],
    edges: [],
    sessionId,
    createdAt: now,
    updatedAt: now,
  };
  saveGraph(graph);
  return graph;
}

/** 添加节点 + 自动生成边 */
export function addNode(
  sessionId: string,
  node: Omit<LifeGraphNode, 'id' | 'sessionId' | 'time'>
): { graph: LifeGraph; node: LifeGraphNode } {
  let graph = loadGraph();
  if (!graph) graph = createGraph(sessionId);

  const newNode: LifeGraphNode = {
    ...node,
    id: generateId(),
    sessionId,
    time: Date.now(),
  };

  // 自动生成边（如果有前置节点）
  if (graph.nodes.length > 0) {
    const lastNode = graph.nodes[graph.nodes.length - 1];
    const edge: LifeGraphEdge = {
      from: lastNode.id,
      to: newNode.id,
      trigger: `State shift: ${lastNode.state} → ${node.state}`,
      duration: newNode.time - lastNode.time,
    };
    graph.edges.push(edge);
  }

  graph.nodes.push(newNode);
  saveGraph(graph);
  return { graph, node: newNode };
}

/** 从诊断结果生成初始节点 */
export function createInitialNode(
  sessionId: string,
  options: { score: number; type: string; phase?: string }
): LifeGraph {
  let graph = loadGraph();
  if (!graph) graph = createGraph(sessionId);

  // 如果已有节点，不重复创建
  if (graph.nodes.length > 0) return graph;

  const archetypeMap: Record<string, string> = {
    performer: 'burned_fire_architect',
    drifter: 'drifter',
    balanced: 'recovering_balanced',
  };

  const state = (archetypeMap[options.type] || 'burned_fire_architect') as any;
  const fatigue = Math.min(options.score, 100);
  const energy = Math.max(100 - options.score, 0);
  const phase = fatigue > 70 ? 'system_overload'
    : fatigue > 50 ? 'active_recovery'
    : fatigue > 30 ? 'identity_shift'
    : 'stable_operation';

  const node: LifeGraphNode = {
    id: generateId(),
    time: Date.now(),
    state,
    energy,
    fatigue,
    phase,
    trend: fatigue > 50 ? 'declining' : 'improving',
    trigger: 'Initial diagnosis',
    sessionId,
  };

  graph.nodes.push(node);
  saveGraph(graph);
  return graph;
}

export function computeSummary(graph: LifeGraph): LifeGraphSummary {
  const nodes = graph.nodes;
  if (nodes.length === 0) {
    return {
      duration: 0,
      stateCount: 0,
      dominantState: 'burned_fire_architect',
      energyMin: 0,
      energyMax: 0,
      energyAvg: 0,
      collapseRisks: 0,
      recoveryPeriods: 0,
    };
  }

  const energies = nodes.map(n => n.energy);
  const stateFreq: Record<string, number> = {};
  nodes.forEach(n => {
    stateFreq[n.state] = (stateFreq[n.state] || 0) + 1;
  });
  const dominantState = Object.entries(stateFreq).sort((a, b) => b[1] - a[1])[0][0] as any;

  return {
    duration: nodes.length > 1 ? nodes[nodes.length - 1].time - nodes[0].time : 0,
    stateCount: Object.keys(stateFreq).length,
    dominantState,
    energyMin: Math.min(...energies),
    energyMax: Math.max(...energies),
    energyAvg: Math.round(energies.reduce((a, b) => a + b, 0) / energies.length),
    collapseRisks: nodes.filter(n => n.fatigue > 80).length,
    recoveryPeriods: nodes.filter(n => n.trend === 'improving').length,
  };
}
