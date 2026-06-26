// lib/symbol/v3/narrative.ts
// Narrative Engine — 把"报告"变成"内容资产"

import type { V2Output } from '@/lib/symbol/v2/types';

const HOOKS = [
  "I didn't realize this was happening until I saw the pattern.",
  'This explained me better than anything else ever has.',
  "I thought I was just tired. I wasn't.",
  'This is what burnout actually looks like.',
  'No one tells you this is a system problem.',
  'Most people never see their own pattern.',
  'I finally understood why I feel this way.',
];

const TITLES = [
  'Your Hidden System Pattern',
  'Why You Feel Drained All the Time',
  'The Cost You Do Not See Yet',
  'Your Behavioral Load Report',
  'The Silent Overload Pattern',
  'What Your System Is Really Telling You',
];

export interface NarrativeOutput {
  title: string;
  hook: string;
  body: string;
  metric: string;
  label: string;
}

export function generateNarrative(v2: V2Output): NarrativeOutput {
  const hook = HOOKS[Math.floor(Math.random() * HOOKS.length)];
  const title = TITLES[Math.floor(Math.random() * TITLES.length)];

  return {
    title,
    hook,
    body: v2.interpretation.insight,
    metric: `Load Index: ${v2.user_profile.intensity_score}`,
    label: v2.interpretation.label,
  };
}

export function generateRefId(): string {
  return Math.random().toString(36).substring(2, 8);
}
