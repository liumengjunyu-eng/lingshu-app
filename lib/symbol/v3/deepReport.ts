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
  shareCard: string; // one-line share text
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

  // Fire overdrive + Water depletion
  if (f.fire > 65 && f.water < 40) {
    conflicts.push('🔥 You are burning faster than you recover. High Fire + low Water = chronic deficit cycle. Same output, diminishing returns.');
  }

  // Wood overdrive + Earth weak
  if (f.wood > 65 && f.earth < 40) {
    conflicts.push('🌳 You push growth without grounding. High Wood + low Earth = ambition without stability.');
  }

  // Metal overdrive + Fire weak (overthinking)
  if (f.metal > 65 && f.fire < 40) {
    conflicts.push('⚔️ You think more than you act. High Metal + low Fire = analysis paralysis.');
  }

  // Emotion vs Body
  if (sym.emotionProfile.emotionalState === 'volatile' && fatigue > 50) {
    conflicts.push('💭 Your emotions and body are sending opposite signals. Your mind wants to move, but your body needs rest.');
  }

  if (conflicts.length === 0) {
    conflicts.push('No significant internal conflicts detected. Your systems are relatively aligned.');
  }

  sections.push({
    title: 'Cross-System Conflicts',
    icon: '⚡',
    content: conflicts.slice(0, 3),
    type: conflicts.length > 1 ? 'warning' : 'info',
  });

  return sections;
}

// ---------- 风险提示 ----------

function generateWarnings(sym: SymbolOutput): DeepReportSection[] {
  const f = sym.fiveElements;
  const warnings: string[] = [];

  if (f.water < 35) warnings.push('Recovery system depleted — continued output without restoration leads to burnout');
  if (f.fire > 70 && f.water < 35) warnings.push('Chronic burnout risk — high activity + no recovery base');
  if (sym.emotionProfile.emotionalState === 'depleted') warnings.push('Emotional reserves critically low — avoid major life decisions');
  if (sym.emotionProfile.stressPattern === 'chronic') warnings.push('Chronic stress pattern detected — nervous system needs extended recovery');
  if (f.metal > 70 && f.fire < 35) warnings.push('Overthinking trap — clarity without action becomes paralysis');

  if (warnings.length === 0) {
    warnings.push('No critical warnings — maintain current trajectory with micro-adjustments');
  }

  return [{
    title: 'Risk Assessment',
    icon: '🚨',
    content: warnings.slice(0, 4),
    type: 'warning',
  }];
}

// ---------- 决策建议汇总 ----------

function generateDecisionSummary(sym: SymbolOutput): DeepReportSection[] {
  const domains: DecisionDomain[] = ['career', 'health', 'timing'];
  const picks: string[] = [];

  for (const domain of domains) {
    const result = runDecisionEngine({ domain, userId: '', currentSymbol: sym });
    if (result.topPick) {
      picks.push(`[${domain.charAt(0).toUpperCase() + domain.slice(1)}] ${result.topPick.label} — ${result.topPick.reason}`);
    }
  }

  return [{
    title: 'Decision Guide',
    icon: '🧭',
    content: picks.length > 0 ? picks : ['Complete a full assessment to unlock personalized decision guidance.'],
    type: 'action',
  }];
}

// ---------- 演化洞察 ----------

function generateEvolutionInsight(memory: MemorySnapshot[]): { section: DeepReportSection; insight: string } | null {
  if (memory.length < 2) return null;
  const evo = analyzeEvolution(memory);
  return {
    section: {
      title: 'Your Evolution',
      icon: '📈',
      content: [evo.insight, `Signal: ${evo.signal}`, `Trend: ${evo.trend}`],
      type: 'insight',
    },
    insight: evo.insight,
  };
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

  return {
    title: `${symbol.persona.primary} — Deep Report`,
    subtitle: `A complete structural analysis of your current symbolic system`,
    timestamp: Date.now(),
    sections,
    evolutionInsight,
    topDecisions: topDecisions.slice(0, 3),
    warnings: allWarnings,
    shareCard,
  };
}
