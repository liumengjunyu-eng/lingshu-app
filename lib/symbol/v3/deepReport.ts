// lib/symbol/v3/deepReport.ts

// ============================================================
// Deep Report System — 付费核心
// 结构化人生报告生成器
// ============================================================

import type { SymbolOutput } from '@/lib/symbol/types';
import { analyzeEvolution, createSnapshot, type MemorySnapshot } from './symbolMemory';
import { runDecisionEngine, type DecisionDomain, type DecisionOption } from './decisionEngine';

export interface DeepReportSection {
  title: string;
  icon: string;
  content: string[];
  type: 'info' | 'warning' | 'action' | 'insight';
}

export interface DeepReport {
  title: string;
  subtitle: string;
  timestamp: number;
  sections: DeepReportSection[];
  evolutionInsight?: string;
  topDecisions: DecisionOption[];
  warnings: string[];
  shareCard: string;
  hook?: {
    text: string;
    type: 'insight' | 'warning' | 'invitation';
  };
}

// ---------- 符号结构描述 ----------

function describeElementStructure(sym: SymbolOutput): DeepReportSection[] {
  const f = sym.fiveElements;
  const dominant = sym.meta.dominantElement;
  const sorted = Object.entries(f).sort(([, a], [, b]) => b - a);

  const lines: string[] = [];
  lines.push(`Dominant: ${dominant.charAt(0).toUpperCase() + dominant.slice(1)} (${Math.round(f[dominant as keyof typeof f])})`);
  for (const [el, v] of sorted) {
    const bar = '█'.repeat(Math.round(v / 10)) + '░'.repeat(Math.max(0, 10 - Math.round(v / 10)));
    lines.push(`${el.padEnd(6)} ${bar} ${Math.round(v)}`);
  }

  return [{
    title: 'Your Element Structure',
    icon: '🧬',
    content: lines,
    type: 'info',
  }];
}

// ---------- 生命周期分析 ----------

function describeLifeCycle(sym: SymbolOutput): DeepReportSection[] {
  const f = sym.fiveElements;
  const fatigue = 100 - (f.water * 0.4 + f.earth * 0.2);
  const balance = sym.meta.balanceScore;

  let phase: string;
  if (fatigue > 70) phase = '🔄 System Collapse Phase — Your body is overriding your plans. Stop pushing.';
  else if (fatigue > 50 && balance < -30) phase = '⚠️ Transition Phase — High output, low recovery. This is unsustainable.';
  else if (balance > 30) phase = '🌱 Expansion Phase — Good balance, favorable for growth and new initiatives.';
  else if (fatigue < 40 && balance > 0) phase = '⚖️ Stable Phase — Maintain current rhythm, optimize edges.';
  else phase = '🌓 Mixed Signals — Some systems balanced, others depleted. Recalibrate gradually.';

  return [{
    title: 'Current Life Cycle',
    icon: '🪐',
    content: [phase, `Balance Score: ${balance} (${balance > 0 ? 'surplus' : 'deficit'})`, `Energy Level: ${100 - Math.round(fatigue)}%`],
    type: 'insight',
  }];
}

// ---------- 冲突检测 ----------

function detectConflicts(sym: SymbolOutput): DeepReportSection[] {
  const f = sym.fiveElements;
  const fatigue = 100 - (f.water * 0.4 + f.earth * 0.2);
  const sections: DeepReportSection[] = [];
  const conflicts: string[] = [];

  // Fire-Water conflict
  if (f.fire > 60 && f.water < 30) {
    conflicts.push('🔥 Fire dominates Water — You push hard but recover poorly. Burnout risk.');
  }
  // Wood-Metal conflict
  if (f.wood > 60 && f.metal > 60) {
    conflicts.push('⚔️ Wood-Metal clash — Growth ambitions vs. rigid systems. Tension in execution.');
  }
  // Earth imbalance
  if (f.earth > 70) {
    conflicts.push('🪨 Earth overload — Stability becomes stagnation. Movement is needed.');
  }
  // Water deficiency
  if (f.water < 20 && fatigue > 50) {
    conflicts.push('💧 Water depleted — Recovery systems offline. Rest is not optional.');
  }

  if (conflicts.length > 0) {
    sections.push({
      title: 'System Conflicts',
      icon: '⚡',
      content: conflicts,
      type: 'warning',
    });
  }

  return sections;
}

// ---------- 风险提示 ----------

function generateWarnings(sym: SymbolOutput): DeepReportSection[] {
  const f = sym.fiveElements;
  const warnings: string[] = [];

  if (f.fire > 70) warnings.push('High Fire: Risk of impulsive decisions. Cool down before major choices.');
  if (f.water < 25) warnings.push('Low Water: Recovery deficit. Schedule downtime or face system failure.');
  if (f.wood > 70 && f.metal < 30) warnings.push('Wood-Metal imbalance: Vision without structure leads to scattered effort.');
  if (f.earth < 25) warnings.push('Low Earth: Unstable foundation. Ground yourself before building higher.');

  if (warnings.length === 0) return [];

  return [{
    title: 'Risk Forecast',
    icon: '🔮',
    content: warnings,
    type: 'warning',
  }];
}

// ---------- 决策建议 ----------

function generateDecisionSummary(sym: SymbolOutput): DeepReportSection[] {
  const f = sym.fiveElements;
  const dominant = sym.meta.dominantElement;
  const recs: string[] = [];

  const tips: Record<string, string[]> = {
    wood: ['Start new projects', 'Network and expand', 'Plant seeds for future'],
    fire: ['Lead and inspire', 'Close deals quickly', 'Show your work publicly'],
    earth: ['Consolidate gains', 'Strengthen systems', 'Nurture relationships'],
    metal: ['Refine and optimize', 'Cut what does not serve', 'Establish clear boundaries'],
    water: ['Rest and recover', 'Reflect and plan', 'Let go of control'],
  };

  const avoid: Record<string, string[]> = {
    wood: ['Avoid premature commitment', 'Do not overextend'],
    fire: ['Avoid burnout', 'Do not force outcomes'],
    earth: ['Avoid stagnation', 'Do not resist change'],
    metal: ['Avoid rigidity', 'Do not isolate'],
    water: ['Avoid withdrawal', 'Do not procrastinate'],
  };

  recs.push(...(tips[dominant] || tips.earth));
  recs.push(...(avoid[dominant] || avoid.earth).map(s => `⚠️ ${s}`));

  return [{
    title: 'Decision Guidance',
    icon: '🧭',
    content: recs,
    type: 'action',
  }];
}

// ---------- 演化洞察 ----------

function generateEvolutionInsight(memory: MemorySnapshot[]): { section: DeepReportSection; insight: string } | null {
  if (memory.length < 2) return null;
  const latest = memory[memory.length - 1];
  const previous = memory[memory.length - 2];
  const trend = latest.balanceScore - previous.balanceScore;

  let evo: { section: DeepReportSection; insight: string };
  if (trend > 15) {
    evo = {
      insight: 'Your system is strengthening. The interventions are working.',
      section: {
        title: 'Your Evolution',
        icon: '📈',
        content: ['Positive trajectory detected', `Signal: +${trend} balance improvement`, 'Trend: Recovery accelerating'],
        type: 'insight',
      },
    };
  } else if (trend < -15) {
    evo = {
      insight: 'Warning: Declining trajectory. Review your recovery protocols.',
      section: {
        title: 'Your Evolution',
        icon: '📉',
        content: ['Negative trajectory detected', `Signal: ${trend} balance decline`, 'Trend: Depletion accelerating'],
        type: 'warning',
      },
    };
  } else {
    evo = {
      insight: 'Stable pattern. Small adjustments will compound over time.',
      section: {
        title: 'Your Evolution',
        icon: '➡️',
        content: ['Stable trajectory', `Signal: ${trend > 0 ? '+' : ''}${trend} balance shift`, 'Trend: Gradual optimization needed'],
        type: 'insight',
      },
    };
  }
  return evo;
}

// ============================================================
// 主入口
// ============================================================

export function generateDeepReport(
  symbol: SymbolOutput,
  memorySnapshot?: MemorySnapshot,
  memory?: MemorySnapshot[]
): DeepReport {
  const sections: DeepReportSection[] = [];

  // 1. 符号结构
  sections.push(...describeElementStructure(symbol));

  // 2. 生命周期
  sections.push(...describeLifeCycle(symbol));

  // 3. 冲突检测
  sections.push(...detectConflicts(symbol));

  // 4. 风险提示
  sections.push(...generateWarnings(symbol));

  // 5. 决策建议
  sections.push(...generateDecisionSummary(symbol));

  // 6. 演化洞察（如有历史）
  let evolutionInsight: string | undefined;
  if (memory) {
    const evo = generateEvolutionInsight(memory);
    if (evo) {
      sections.push(evo.section);
      evolutionInsight = evo.insight;
    }
  }

  // 收集所有警告
  const allWarnings = sections.filter(s => s.type === 'warning').flatMap(s => s.content);

  // 收集前3条决策
  const domains: DecisionDomain[] = ['career', 'health', 'timing'];
  const topDecisions: DecisionOption[] = [];
  for (const domain of domains) {
    const result = runDecisionEngine({ domain, userId: '', currentSymbol: symbol });
    if (result.topPick) topDecisions.push(result.topPick);
  }

  // Share card line
  const dominant = symbol.meta.dominantElement;
  const archetype = symbol.persona.primary;
  const shareCard = `🧬 ${archetype} · ${dominant} dominant · ${symbol.meta.balanceScore > 0 ? 'balanced' : 'deficit'} · Built by LingShu`;

  // Generate hook based on dominant element and balance
  const hooks: Record<string, string[]> = {
    wood: ['Growth requires both sunlight and shadow.', 'Your roots are deeper than you realize.', 'New beginnings start with patience.'],
    fire: ['Intensity burns bright, but needs fuel.', 'Your passion is a compass, not a destination.', 'Light that burns too hot consumes itself.'],
    earth: ['Stability is strength, but rigidity breaks.', 'The ground that holds everything needs rest too.', 'Nourishment comes in cycles.'],
    metal: ['Precision cuts, but also isolates.', 'Your clarity is a gift—use it to connect, not divide.', 'Even the sharpest blade needs a sheath.'],
    water: ['Flow finds a way, but needs a channel.', 'Your depth holds wisdom—and weight.', 'Still waters run deep; turbulence reveals stones.'],
  };
  const elementHooks = hooks[dominant] || hooks.earth;
  const hookText = elementHooks[Math.floor(Math.random() * elementHooks.length)];
  const hookType = symbol.meta.balanceScore < -20 ? 'warning' : symbol.meta.balanceScore > 20 ? 'insight' : 'invitation';

  return {
    title: `${symbol.persona.primary} — Deep Report`,
    subtitle: `A complete structural analysis of your current symbolic system`,
    timestamp: Date.now(),
    sections,
    evolutionInsight,
    topDecisions: topDecisions.slice(0, 3),
    warnings: allWarnings,
    shareCard,
    hook: {
      text: hookText,
      type: hookType,
    },
  };
}
