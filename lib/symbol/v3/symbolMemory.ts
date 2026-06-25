// lib/symbol/v3/symbolMemory.ts

// ============================================================
// Symbol Memory — "记住用户"
// 时间维度快照 + 演化分析
// ============================================================

import type { SymbolOutput } from '@/lib/symbol/types';

export interface MemorySnapshot {
  timestamp: number;
  archetype: string;
  dominantElement: string;
  balanceScore: number;
  emotionalState: string;
  stressPattern: string;
  fatigue: number;
  // Hooks for comparison
  keyElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
}

export interface SymbolMemory {
  userId: string;
  snapshots: MemorySnapshot[];
}

export type EvolutionTrend = 'improving' | 'declining' | 'unstable' | 'stable' | 'unknown';
export type EvolutionSignal = 'overheating' | 'recovering' | 'stable' | 'cycling' | 'crashing';

// ---------- 快照创建 ----------

export function createSnapshot(symbol: SymbolOutput): MemorySnapshot {
  const f = symbol.fiveElements;
  return {
    timestamp: Date.now(),
    archetype: symbol.persona.primary,
    dominantElement: symbol.meta.dominantElement,
    balanceScore: symbol.meta.balanceScore,
    emotionalState: symbol.emotionProfile.emotionalState,
    stressPattern: symbol.emotionProfile.stressPattern,
    fatigue: (100 - (f.water * 0.4 + f.earth * 0.2 + f.metal * 0.2 + f.wood * 0.1 + f.fire * 0.1)),
    keyElements: f,
  };
}

// ---------- 本地 Memory 存储 ----------

const memoryStore = new Map<string, MemorySnapshot[]>();

export function saveSnapshot(userId: string, snapshot: MemorySnapshot): void {
  if (!memoryStore.has(userId)) memoryStore.set(userId, []);
  const snaps = memoryStore.get(userId)!;
  snaps.push(snapshot);
  // Keep max 20 snapshots
  if (snaps.length > 20) snaps.splice(0, snaps.length - 20);

  // Persist to localStorage (client only)
  if (typeof window === 'undefined') return;
  try {
    const key = `ls_memory_${userId}`;
    localStorage.setItem(key, JSON.stringify(snaps));
  } catch { /* silent */ }
}

export function getMemory(userId: string): MemorySnapshot[] {
  const cached = memoryStore.get(userId);
  if (cached) return cached;

  if (typeof window === 'undefined') return [];
  try {
    const key = `ls_memory_${userId}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    memoryStore.set(userId, stored);
    return stored;
  } catch { return []; }
}

// ---------- 演化分析 ----------

export function analyzeEvolution(memory: MemorySnapshot[]): {
  trend: EvolutionTrend;
  signal: EvolutionSignal;
  direction: string;
  insight: string;
} {
  if (memory.length < 2) {
    return { trend: 'unknown', signal: 'stable', direction: 'Needs more data', insight: 'Complete another diagnosis to see your trend.' };
  }

  const last = memory[memory.length - 1];
  const prev = memory[memory.length - 2];

  const fatigueDelta = prev.fatigue - last.fatigue; // positive = less fatigue = improving
  const balanceDelta = last.balanceScore - prev.balanceScore;

  // Trend direction
  let trend: EvolutionTrend = 'stable';
  let signal: EvolutionSignal = 'stable';
  const changes = [];

  if (fatigueDelta > 10) {
    changes.push('fatigue_decreasing');
    signal = 'recovering';
  } else if (fatigueDelta < -10) {
    changes.push('fatigue_increasing');
    signal = 'overheating';
  }

  if (last.archetype !== prev.archetype) {
    changes.push('archetype_shift');
    signal = 'cycling';
    trend = 'unstable';
  }

  if (balanceDelta > 15) {
    changes.push('balance_improving');
  } else if (balanceDelta < -15) {
    changes.push('balance_declining');
    trend = balanceDelta > 0 ? 'improving' : 'declining';
  }

  if (fatigueDelta < -20 && balanceDelta < -20) {
    signal = 'crashing';
    trend = 'declining';
  }

  // Insight
  let insight: string;
  if (signal === 'crashing') {
    insight = 'Your system is showing signs of decline across multiple dimensions. Consider a recovery-focused reset.';
  } else if (signal === 'overheating') {
    insight = 'Your energy is burning faster than it recovers. Prioritize rest and reduce stimulation.';
  } else if (signal === 'recovering') {
    insight = 'Your system is rebalancing. Keep the current pattern — you are moving in the right direction.';
  } else if (signal === 'cycling') {
    insight = 'Your archetype is shifting. This is a natural transition phase. Allow space for the new pattern to settle.';
  } else {
    insight = 'Your system is relatively stable. Small micro-adjustments can create meaningful shifts over time.';
  }

  return {
    trend,
    signal,
    direction: changes.join(', ') || 'stable',
    insight,
  };
}

// ---------- 趋势分数 ----------

export function getEvolutionScore(memory: MemorySnapshot[]): number {
  if (memory.length < 2) return 50;
  const last3 = memory.slice(-3);
  const avgFatigue = last3.reduce((s, m) => s + m.fatigue, 0) / last3.length;
  const avgBalance = last3.reduce((s, m) => s + Math.abs(m.balanceScore), 0) / last3.length;
  return Math.round(100 - avgFatigue * 0.5 + (50 - avgBalance) * 0.5);
}
