// lib/symbol/v3/content.ts
// Content Generation Engine — 把"报告"变成"内容资产池"
// V3.1: 自动生成 4 变体: short_hook / long_form / tweet / tiktok_script

import type { V2Output } from '@/lib/symbol/v2/types';

export interface ContentVariant {
  short_hook: string;
  long_form: string;
  tweet: string;
  tiktok_script: string;
}

function generateHook(v2: V2Output): string {
  const score = v2.user_profile.intensity_score;
  if (score > 75) {
    return 'Your system is running on emergency power.';
  }
  if (score > 60) {
    return "I didn't realize I was running on a broken system.";
  }
  if (score > 45) {
    return 'This explained my burnout better than anything else.';
  }
  return 'Most people never see their own pattern.';
}

function generateLongForm(v2: V2Output): string {
  const label = v2.interpretation.label;
  const insight = v2.interpretation.insight;
  return [
    `Most people don't realize they are running in ${label}.`,
    '',
    insight,
    '',
    `Your system is compensating. The question is: for how long?`,
    '',
    `Load Index: ${v2.user_profile.intensity_score}`,
  ].join('\n');
}

function generateTweet(v2: V2Output): string {
  const score = v2.user_profile.intensity_score;
  const label = v2.interpretation.label;
  return [
    `Your system has a label: ${label}.`,
    '',
    score > 60
      ? 'Most people ignore it until it breaks.'
      : 'The quiet cost adds up before you notice it.',
    '',
    'Check your pattern →',
  ].join('\n');
}

function generateTikTokScript(v2: V2Output): string {
  const label = v2.interpretation.label;
  const score = v2.user_profile.intensity_score;
  const insight = v2.interpretation.insight;

  return [
    'HOOK (0-3s):',
    'You are not tired. You are overloaded.',
    '',
    'BODY (3-12s):',
    `Your system is running in "${label}" mode.`,
    'It is compensating for missing recovery.',
    '',
    'PATTERN (12-20s):',
    insight.substring(0, 200),
    '',
    'END (20-30s):',
    `Most people ignore this pattern until it breaks.`,
    `Load Index: ${score}`,
    '',
    '#systempattern #burnoutrecovery #mentalhealth',
  ].join('\n');
}

export function generateContent(v2: V2Output): ContentVariant {
  return {
    short_hook: generateHook(v2),
    long_form: generateLongForm(v2),
    tweet: generateTweet(v2),
    tiktok_script: generateTikTokScript(v2),
  };
}
