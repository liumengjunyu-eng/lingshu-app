// lib/symbol/v3/insight.ts
// Insight Engine — 把 V2 输出变成"可传播素材"

import type { V2Output } from '@/lib/symbol/v2/types';

export interface InsightOutput {
  core_insight: string;
  punch_line: string;
  emotional_trigger: string;
  share_ready: boolean;
}

export function buildInsight(v2: V2Output): InsightOutput {
  const core_insight = v2.interpretation.insight;

  const punch_line =
    v2.interpretation.label === 'Compensated Collapse Pattern'
      ? 'You are not tired. You are compensating.'
      : v2.interpretation.label === 'Low System Resilience'
        ? 'Your system is not broken. It is under-resourced.'
        : 'Your system is adapting under pressure.';

  const emotional_trigger =
    v2.signals.stress > 70
      ? 'This is not sustainable.'
      : v2.signals.sleep < 40
        ? 'This is quietly accumulating cost.'
        : 'This pattern is stable — until it is not.';

  return {
    core_insight,
    punch_line,
    emotional_trigger,
    share_ready: v2.confidence >= 0.6,
  };
}
