// lib/symbol/v2/engine.ts
// V2.2 Symbol Engine → V2.4 with share engine

import type { SymptomInput, V2Output } from './types';
import { generateShareContent } from './shareEngine';

export { SymptomInput, V2Output };

export function runSymbolEngineV2(input: SymptomInput): V2Output {
  const { sleepQuality, energyLevel, stressLevel, moodStability, focusLevel } = input;

  // ---- 强度分数 ----
  const intensity_score = Math.round(
    (100 - sleepQuality + (100 - energyLevel) + stressLevel + (100 - moodStability) + (100 - focusLevel)) / 5
  );

  // ---- 身体系统 ----
  const energy_level = energyLevel > 70 ? 'high' as const : energyLevel > 40 ? 'medium' as const : 'low' as const;
  const sleep_quality = sleepQuality > 70 ? 'good' as const : sleepQuality > 40 ? 'fragmented' as const : 'poor' as const;

  let fatigue_type = 'normal';
  if (sleepQuality < 40 && stressLevel > 70) fatigue_type = 'liver_heat_+_kidney_deficiency';
  else if (energyLevel < 40 && sleepQuality < 50) fatigue_type = 'spleen_weak_+_qi_deficiency';
  else if (stressLevel > 70) fatigue_type = 'liver_qi_stagnation';

  // ---- 情绪系统 ----
  let dominant_state = 'balanced';
  if (stressLevel > 70 && moodStability < 40) dominant_state = 'anxiety_+_suppression';
  else if (moodStability < 40) dominant_state = 'emotional_instability';
  else if (stressLevel > 60) dominant_state = 'chronic_stress';

  const volatility = moodStability < 40 ? 'high' as const : moodStability < 65 ? 'medium' as const : 'low' as const;
  const recovery_speed = sleepQuality > 70 && energyLevel > 60 ? 'fast' as const : sleepQuality > 40 ? 'medium' as const : 'slow' as const;

  // ---- 行为系统 ----
  const patterns: string[] = [];
  if (stressLevel > 60 && focusLevel < 50) patterns.push('overthinking');
  if (energyLevel < 50 && focusLevel < 50) patterns.push('delayed_decision');
  if (stressLevel > 60 && sleepQuality < 50) patterns.push('self_pressure_loop');

  // ---- 五行系统 ----
  const five_elements = {
    wood: (stressLevel > 65 ? 'high' : stressLevel > 40 ? 'medium' : 'low'),
    fire: (stressLevel > 60 && moodStability < 50 ? 'high' : stressLevel > 40 ? 'medium' : 'low'),
    earth: (energyLevel < 50 && focusLevel < 50 ? 'unstable' : energyLevel > 60 ? 'high' : 'medium'),
    metal: (focusLevel > 60 && stressLevel < 50 ? 'high' : focusLevel > 40 ? 'medium' : 'low'),
    water: (sleepQuality < 50 ? 'exhausted' : sleepQuality > 70 ? 'high' : 'medium'),
  } as V2Output['five_elements'];

  // ---- 冲突引擎 ----
  const core_conflict =
    energyLevel < 50 && stressLevel > 60
      ? 'High cognitive output vs low emotional recovery capacity'
      : sleepQuality < 40 && stressLevel > 60
        ? 'Sleep deficit vs high performance expectation'
        : 'Desire for stability vs environment overload';

  const secondary_conflicts: string[] = [];
  if (sleepQuality < 50 && stressLevel > 50) secondary_conflicts.push('sleep_vs_stimulation_imbalance');
  if (energyLevel < 50 && focusLevel < 50) secondary_conflicts.push('desire_vs_execution_gap');

  // ---- 预测 ----
  const forecast = {
    '7_days': sleepQuality < 40 ? 'Fatigue accumulation risk' : 'Stable with recovery potential',
    '30_days': stressLevel > 70 && sleepQuality < 40 ? 'Burnout probability medium-high' : 'Gradual improvement',
    '90_days': energyLevel < 40 && stressLevel > 60 ? 'Identity detachment risk' : 'System stabilization',
  };

  // ---- 恢复计划 ----
  const recovery_plan = {
    phase_1: sleepQuality < 40 ? 'Sleep reset (3 days)' : 'Energy assessment (3 days)',
    phase_2: stressLevel > 60 ? 'Liver energy regulation (7 days)' : 'Rhythm rebuilding (7 days)',
    phase_3: energyLevel < 50 ? 'Decision simplification protocol (14 days)' : 'Maintenance protocol (14 days)',
  };

  // ---- V2.2 核心：recovery_pathway（可 null 的产品映射） ----
  const recovery_pathway: V2Output['recovery_pathway'] = {
    phase_1: {
      label: 'Stop Doing',
      action:
        sleepQuality < 40
          ? 'Stop all stimulation 2 hours before bed'
          : 'Reduce decision-making load by 30%',
      product: sleepQuality < 40
        ? { id: 'sleep_kit_001', name: 'Deep Recovery Sleep Kit', priority: 1 }
        : null,
    },
    phase_2: {
      label: 'Start Doing',
      action:
        stressLevel > 60
          ? 'Start liver regulation protocol (daily 10min)'
          : 'Start energy rhythm tracking',
      product: stressLevel > 60
        ? { id: 'tcm_liver_001', name: 'TCM Liver Detox Pack', priority: 2 }
        : null,
    },
    phase_3: {
      label: 'Required Tools',
      action:
        energyLevel < 50
          ? 'Begin Qi restoration protocol'
          : 'Begin maintenance protocol',
      product: energyLevel < 50
        ? { id: 'qi_restore_001', name: 'Qi Restoration Herbal Set', priority: 3 }
        : null,
    },
  };

  // ---- V2.1 决策引擎 ----
  const actions: string[] = [];
  const warnings: string[] = [];
  const prohibitions: string[] = [];
  let recoveryProtocol = 'Standard recovery protocol';

  if (sleepQuality < 40 && stressLevel > 60) {
    warnings.push('High nervous system overload detected');
    prohibitions.push('Do not make major decisions in the next 48 hours');
    actions.push('48-hour recovery protocol required');
  }
  if (energyLevel < 50) {
    actions.push('Reduce cognitive load by 30%');
  }
  if (moodStability < 40) {
    warnings.push('Emotional volatility may affect judgment');
    actions.push('Delay important conversations');
  }
  if (focusLevel < 40) {
    actions.push('Avoid complex tasks before 11 AM');
  }
  if (sleepQuality < 40 && energyLevel < 40) {
    recoveryProtocol = '72-hour system reset: no stimulation, no decisions, only rest';
  } else if (sleepQuality < 50) {
    recoveryProtocol = 'Sleep recovery: 3 days of sleep hygiene protocol';
  } else if (energyLevel < 50) {
    recoveryProtocol = 'Energy restoration: reduce cognitive output for 5 days';
  }

  // ---- 人格原型 ----
  const seed = sleepQuality + energyLevel + stressLevel + moodStability + focusLevel;
  let archetype = 'Balanced System Type';
  if (seed > 350 && sleepQuality < 40) archetype = 'Overloaded System Type';
  else if (energyLevel < 40 && stressLevel > 60) archetype = 'Depleted High Performer';
  else if (moodStability < 40 && focusLevel < 50) archetype = 'Unstable Focus Type';

  const narrative_seed_pool = [
    "I thought I was just tired. Turns out I've been running a broken system.",
    "I didn't know burnout could be this silent.",
    "This explained me better than anything I've ever taken.",
    "I wasn't lazy. I was overloaded.",
    "I finally understood what my body was trying to say."
  ];

  const share_angle_pool = [
    "High Functioning Collapse",
    "Silent Burnout Pattern",
    "Cognitive Overload Type",
    "Emotional Compression State"
  ];

  return {
    user_profile: { archetype, intensity_score },
    body_system: { energy_level, fatigue_type, sleep_quality },
    emotion_system: { dominant_state, volatility, recovery_speed },
    behavior_system: { patterns },
    five_elements,
    conflict_engine: { core_conflict, secondary_conflicts: secondary_conflicts ?? [] },
    forecast,
    recovery_plan,
    recovery_pathway,
    decision: {
      actions: actions ?? [],
      warnings: warnings ?? [],
      prohibitions: prohibitions ?? [],
      recoveryProtocol: recoveryProtocol ?? '',
    },
    share: generateShareContent({
      score: intensity_score,
      archetype,
      risk: forecast['7_days'],
    }),
    // V2.5 增长字段
    narrative_seed: narrative_seed_pool[Math.floor(Math.random() * narrative_seed_pool.length)],
    share_angle: share_angle_pool[Math.floor(Math.random() * share_angle_pool.length)],
  };
}
