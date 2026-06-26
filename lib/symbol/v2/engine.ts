// V2.5 Unified Engine — Behavioral Mirror + Monetized Explanation System
// Layer 1: SIGNAL → Layer 2: INTERPRETATION → Layer 3: ACTION + MONETIZATION

import type { SymptomInput, V2Output } from './types';

export function runSymbolEngineV2(input: SymptomInput): V2Output {
  const { sleepQuality, energyLevel, stressLevel, moodStability, focusLevel } = input;

  // ──────────────────────────────────────────
  // Layer 1: SIGNAL EXTRACTION
  // ──────────────────────────────────────────

  // 强度分数（系统负载指数）
  const intensity_score = Math.round(
    (100 - sleepQuality + (100 - energyLevel) + stressLevel + (100 - moodStability) + (100 - focusLevel)) / 5
  );

  // 置信度
  const confidence = Math.max(0.55, Math.min(0.95,
    (sleepQuality + energyLevel + (100 - stressLevel)) / 300
  ));

  const signals = {
    body: energyLevel,
    stress: stressLevel,
    sleep: sleepQuality,
    emotion: moodStability,
    focus: focusLevel,
  };

  // ──────────────────────────────────────────
  // Layer 2: INTERPRETATION
  // ──────────────────────────────────────────

  // 冲击标签
  let label = 'Adaptive Strain Mode';
  let insight = 'Your system is not failing randomly. It is compensating consistently under load.';

  if (stressLevel > 70 && sleepQuality < 40) {
    label = 'Compensated Collapse Pattern';
    insight = 'Your system is running at full capacity — and paying for it silently.';
  } else if (energyLevel < 40) {
    label = 'Low System Resilience';
    insight = 'Your recovery bandwidth is below the threshold for sustainable output.';
  } else if (moodStability < 40 && stressLevel > 60) {
    label = 'Emotional Compression State';
    insight = 'Your emotional load is being contained, not processed.';
  }

  // 证据
  const evidence: string[] = [];
  if (sleepQuality < 40) evidence.push('Sleep fragmentation detected');
  else if (sleepQuality < 60) evidence.push('Sleep quality below optimal');
  if (stressLevel > 60) evidence.push('High compression pressure detected');
  if (energyLevel < 50) evidence.push('Low recovery bandwidth');
  if (moodStability < 40) evidence.push('Emotional volatility pattern active');
  if (focusLevel < 40) evidence.push('Cognitive dispersion detected');

  // 人格原型
  const seed = sleepQuality + energyLevel + stressLevel + moodStability + focusLevel;
  let archetype = 'Balanced System Type';
  if (seed > 350 && sleepQuality < 40) archetype = 'Overloaded System Type';
  else if (energyLevel < 40 && stressLevel > 60) archetype = 'Depleted High Performer';
  else if (moodStability < 40 && focusLevel < 50) archetype = 'Unstable Focus Type';

  // ──────────────────────────────────────────
  // Layer 3: DECISION + RECOVERY
  // ──────────────────────────────────────────

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

  // 恢复路径
  const recovery_pathway: V2Output['recovery_pathway'] = {
    phase_1: {
      label: 'Stop Doing',
      action: sleepQuality < 40
        ? 'Stop all stimulation 2 hours before bed'
        : 'Reduce decision-making load by 30%',
      product: sleepQuality < 40
        ? { id: 'sleep_kit_001', name: 'Deep Recovery Sleep Kit', priority: 1 }
        : null,
    },
    phase_2: {
      label: 'Start Doing',
      action: stressLevel > 60
        ? 'Start regulation protocol (daily 10min)'
        : 'Start energy rhythm tracking',
      product: stressLevel > 60
        ? { id: 'tcm_liver_001', name: 'Regulation Pack', priority: 2 }
        : null,
    },
    phase_3: {
      label: 'Required Tools',
      action: energyLevel < 50
        ? 'Begin restoration protocol'
        : 'Begin maintenance protocol',
      product: energyLevel < 50
        ? { id: 'qi_restore_001', name: 'Energy Restoration Set', priority: 3 }
        : null,
    },
  };

  // ──────────────────────────────────────────
  // MONETIZATION
  // ──────────────────────────────────────────

  const paywall_reason = 'Free report shows WHAT is happening. Paid report shows WHY it is happening.';
  const what_free_shows = 'Load Index, Pattern Label, Evidence';
  const what_paid_adds = 'Causal structure + breakdown prediction + recovery pathway logic';

  // ──────────────────────────────────────────
  // NARRATIVE (传播层)
  // ──────────────────────────────────────────

  const share_identity = label;
  const share_sentence = "I didn't realize I was compensating this much until I saw this.";
  const risk_label = stressLevel > 60 && sleepQuality < 40
    ? 'High risk of cascading system failure'
    : 'Moderate risk of continued energy erosion';

  // ──────────────────────────────────────────
  // FIVE ELEMENTS (六维图兼容)
  // ──────────────────────────────────────────

  const five_elements = {
    wood: (stressLevel > 65 ? 'high' : stressLevel > 40 ? 'medium' : 'low'),
    fire: (stressLevel > 60 && moodStability < 50 ? 'high' : stressLevel > 40 ? 'medium' : 'low'),
    earth: (energyLevel < 50 && focusLevel < 50 ? 'unstable' : energyLevel > 60 ? 'high' : 'medium'),
    metal: (focusLevel > 60 && stressLevel < 50 ? 'high' : focusLevel > 40 ? 'medium' : 'low'),
    water: (sleepQuality < 50 ? 'exhausted' : sleepQuality > 70 ? 'high' : 'medium'),
  };

  // ──────────────────────────────────────────
  // FORECAST (风险信号兼容)
  // ──────────────────────────────────────────

  const forecast: V2Output['forecast'] = {
    '7_days': sleepQuality < 40 ? 'Fatigue accumulation risk' : 'Stable with recovery potential',
    '30_days': stressLevel > 70 && sleepQuality < 40 ? 'Burnout probability medium-high' : 'Gradual improvement',
    '90_days': energyLevel < 40 && stressLevel > 60 ? 'Identity detachment risk' : 'System stabilization',
  };

  // ──────────────────────────────────────────
  // V4 CONTRACT VALIDATION
  // ──────────────────────────────────────────

  function validateContract(output: any) {
    const required = [
      'user_profile',
      'signals',
      'interpretation',
      'decision',
      'recovery_pathway',
    ];
    for (const key of required) {
      if (!output[key]) {
        throw new Error(`V4 CONTRACT VIOLATION: missing ${key}`);
      }
    }
    if (!output.decision?.actions) {
      throw new Error('V4 CONTRACT VIOLATION: decision.actions missing');
    }
    if (!output.recovery_pathway?.phase_1) {
      throw new Error('V4 CONTRACT VIOLATION: recovery_pathway.phase_1 missing');
    }
  }

  // ──────────────────────────────────────────
  // OUTPUT
  // ──────────────────────────────────────────

  const output = {
    user_profile: { archetype, intensity_score },
    signals,
    interpretation: { label, insight, evidence },
    decision: { actions, warnings, prohibitions, recoveryProtocol },
    recovery_pathway,
    monetization: { paywall_reason, what_free_shows, what_paid_adds },
    narrative: { risk_label, share_sentence, share_identity },
    confidence: parseFloat(confidence.toFixed(2)),
    five_elements,
    forecast,
  };

  validateContract(output);

  return output;
}
