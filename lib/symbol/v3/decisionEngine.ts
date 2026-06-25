// lib/symbol/v3/decisionEngine.ts

// ============================================================
// Decision Engine — "帮助用户"
// 基于 SymbolDNA + 现实上下文 → 加权决策建议
// ============================================================

import type { SymbolOutput } from '@/lib/symbol/types';

export type DecisionDomain = 'career' | 'relationship' | 'location' | 'health' | 'timing';

export interface DecisionContext {
  domain: DecisionDomain;
  userId: string;
  currentSymbol: SymbolOutput;
  memory?: any[]; // past snapshots
  userSignals?: any;
}

export interface DecisionOption {
  label: string;
  score: number;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface DecisionResult {
  domain: DecisionDomain;
  options: DecisionOption[];
  topPick: DecisionOption | null;
  warning?: string;
}

// ---------- 辅助：元素到可读 ----------

function elName(el: string): string {
  const map: Record<string, string> = {
    wood: 'Wood 🌳', fire: 'Fire 🔥', earth: 'Earth ⛰️', metal: 'Metal ⚔️', water: 'Water 💧'
  };
  return map[el] || el;
}

// ============================================================
// Domain-specific decision logics
// ============================================================

function decideCareer(sym: SymbolOutput): DecisionOption[] {
  const f = sym.fiveElements;
  const dominant = sym.meta.dominantElement;
  const fatigue = 100 - (f.water * 0.4 + f.earth * 0.2);

  const options: DecisionOption[] = [];

  // Fire dominant → suited for creative / leadership
  if (f.fire > 60) {
    options.push({
      label: 'Lean into creative or leadership roles',
      score: Math.round(f.fire * 0.7 + f.wood * 0.3),
      reason: `Your Fire (${Math.round(f.fire)}) signals natural leadership and creative energy.`,
      confidence: f.fire > 70 ? 'high' : 'medium',
    });
  }

  // Wood dominant → suited for growth / strategy
  if (f.wood > 60) {
    options.push({
      label: 'Pursue growth-oriented or strategic work',
      score: Math.round(f.wood * 0.6 + f.fire * 0.2 + f.metal * 0.2),
      reason: `Your Wood (${Math.round(f.wood)}) favors expansion, decision-making, and new frontiers.`,
      confidence: f.wood > 70 ? 'high' : 'medium',
    });
  }

  // Metal dominant → suited for structure / systems
  if (f.metal > 60) {
    options.push({
      label: 'Optimize for structured, systems-based work',
      score: Math.round(f.metal * 0.6 + f.earth * 0.2 + f.fire * 0.1),
      reason: `Your Metal (${Math.round(f.metal)}) favors precision, boundaries, and clear systems.`,
      confidence: f.metal > 70 ? 'high' : 'medium',
    });
  }

  // Water dominant → suited for independent / deep work
  if (f.water > 55) {
    options.push({
      label: 'Prioritize independent, deep-focus work',
      score: Math.round(f.water * 0.5 + f.metal * 0.3 + f.wood * 0.1),
      reason: `Your Water (${Math.round(f.water)}) favors depth, restoration, and autonomous rhythm.`,
      confidence: f.water > 65 ? 'high' : 'medium',
    });
  }

  // Fatigue warning
  if (fatigue > 60) {
    options.push({
      label: 'Reduce workload and prioritize recovery',
      score: Math.round((100 - fatigue) * 0.5),
      reason: `Your fatigue level (${Math.round(fatigue)}%) suggests pushing harder may backfire.`,
      confidence: 'high',
    });
  }

  return options.sort((a, b) => b.score - a.score);
}

function decideRelationship(sym: SymbolOutput): DecisionOption[] {
  const f = sym.fiveElements;
  const options: DecisionOption[] = [];

  if (f.fire > 65) {
    options.push({
      label: 'Seek partners who provide stabilizing energy',
      score: Math.round(f.earth * 0.5 + f.water * 0.3 + (100 - f.fire) * 0.2),
      reason: `High Fire (${Math.round(f.fire)}) needs Earth or Water partners for balance.`,
      confidence: 'medium',
    });
  }

  if (f.water > 60) {
    options.push({
      label: 'Prioritize emotional safety and depth over breadth',
      score: Math.round(f.water * 0.5 + f.earth * 0.2 + f.metal * 0.2),
      reason: `Deep Water (${Math.round(f.water)}) needs a container that feels safe and consistent.`,
      confidence: 'medium',
    });
  }

  if (f.earth > 60) {
    options.push({
      label: 'Watch for over-giving in relationships',
      score: Math.round(Math.min(100, (100 - f.earth) * 0.8 + f.fire * 0.2)),
      reason: `High Earth (${Math.round(f.earth)}) means you carry others easily — make sure you are also carried.`,
      confidence: 'high',
    });
  }

  return options.sort((a, b) => b.score - a.score);
}

function decideHealth(sym: SymbolOutput): DecisionOption[] {
  const f = sym.fiveElements;
  const options: DecisionOption[] = [];
  const fatigue = 100 - (f.water * 0.4 + f.earth * 0.2);

  if (fatigue > 55) {
    options.push({
      label: 'Restorative reset: reduce all output 72h',
      score: Math.round(Math.min(100, fatigue * 0.8 + (100 - f.water) * 0.3)),
      reason: `Fatigue is ${Math.round(fatigue)}% — your system is signaling, not failing.`,
      confidence: 'high',
    });
  }

  if (f.fire > 65) {
    options.push({
      label: 'Reduce stimulants (caffeine, high-intensity, social overload)',
      score: Math.round(f.fire * 0.5 + (100 - f.water) * 0.4),
      reason: `High Fire (${Math.round(f.fire)}) with low Water recovery creates a chronic deficit.`,
      confidence: 'medium',
    });
  }

  if (f.water < 40) {
    options.push({
      label: 'Prioritize sleep and silence — restore your recovery base',
      score: Math.round((100 - f.water) * 0.7 + (100 - f.fire) * 0.3),
      reason: `Water (${Math.round(f.water)}) is your recovery engine. It needs fuel, not more work.`,
      confidence: 'high',
    });
  }

  return options.sort((a, b) => b.score - a.score);
}

function decideTiming(sym: SymbolOutput): DecisionOption[] {
  const f = sym.fiveElements;
  const options: DecisionOption[] = [];
  const fatigue = 100 - (f.water * 0.4 + f.earth * 0.2);

  if (fatigue > 60) {
    options.push({
      label: 'Delay major decisions for 3-7 days',
      score: Math.round(fatigue * 0.6 + (100 - f.metal) * 0.3),
      reason: `Fatigue (${Math.round(fatigue)}%) impairs decision quality. Wait for recovery.`,
      confidence: 'high',
    });
  } else {
    options.push({
      label: 'Favorable for strategic decisions now',
      score: Math.round(f.metal * 0.4 + f.wood * 0.3 + f.fire * 0.2),
      reason: `Your clarity (Metal ${Math.round(f.metal)}) and drive (Wood ${Math.round(f.wood)}) are aligned.`,
      confidence: 'medium',
    });
  }

  if (f.fire > f.water + 20) {
    options.push({
      label: 'Channel expansion energy into planning, not execution',
      score: Math.round(f.fire * 0.5 + f.wood * 0.3),
      reason: 'Your expansion energy outpaces your recovery. Plan now, execute after restoration.',
      confidence: 'medium',
    });
  }

  return options.sort((a, b) => b.score - a.score);
}

function decideLocation(sym: SymbolOutput): DecisionOption[] {
  const f = sym.fiveElements;
  const options: DecisionOption[] = [];

  if (f.fire > 65) {
    options.push({
      label: 'Consider cooler climates or coastal environments',
      score: Math.round(f.fire * 0.5 + f.water * 0.3 + (100 - f.earth) * 0.1),
      reason: `High Fire (${Math.round(f.fire)}) benefits from environments that naturally cool and ground.`,
      confidence: 'medium',
    });
  }

  if (f.water > 65) {
    options.push({
      label: 'Prioritize environments with access to nature and quiet',
      score: Math.round(f.water * 0.5 + f.earth * 0.3 + f.metal * 0.1),
      reason: `Water-dominant (${Math.round(f.water)}) types thrive with natural rhythms and low stimulation.`,
      confidence: 'medium',
    });
  }

  if (f.wood > 60) {
    options.push({
      label: 'Look for environments with growth potential and natural light',
      score: Math.round(f.wood * 0.5 + f.fire * 0.2 + f.earth * 0.2),
      reason: `Wood (${Math.round(f.wood)}) needs room to grow — both physically and metaphorically.`,
      confidence: 'medium',
    });
  }

  return options.sort((a, b) => b.score - a.score);
}

// ============================================================
// 主入口
// ============================================================

export function runDecisionEngine(ctx: DecisionContext): DecisionResult {
  const { domain, currentSymbol } = ctx;

  let options: DecisionOption[];

  switch (domain) {
    case 'career':
      options = decideCareer(currentSymbol);
      break;
    case 'relationship':
      options = decideRelationship(currentSymbol);
      break;
    case 'health':
      options = decideHealth(currentSymbol);
      break;
    case 'location':
      options = decideLocation(currentSymbol);
      break;
    case 'timing':
      options = decideTiming(currentSymbol);
      break;
    default:
      options = [];
  }

  // General warning: chronic fatigue
  const fatigue = 100 - (currentSymbol.fiveElements.water * 0.4 + currentSymbol.fiveElements.earth * 0.2);
  let warning: string | undefined;
  if (fatigue > 70 && domain !== 'health') {
    warning = `Your system is at ${Math.round(fatigue)}% fatigue. Any decision made in this state should be revisited after recovery.`;
  }

  return {
    domain,
    options,
    topPick: options[0] || null,
    warning,
  };
}
