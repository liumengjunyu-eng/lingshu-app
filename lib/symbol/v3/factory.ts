// lib/symbol/v3/factory.ts
// Autonomous Content Factory — 无人内容工厂
// V3.3: 内容不再"生成"，而是"持续生产"——每次输出6个不同角度的变体

import type { V2Output } from '@/lib/symbol/v2/types';

export type ContentAngle = 'fear' | 'identity' | 'logic' | 'contrast' | 'reversal' | 'insight';

export interface ContentProduct {
  hook: string;
  angle: ContentAngle;
  intensity: number;
}

const HOOK_PREFIXES: Record<ContentAngle, string> = {
  fear: 'No one tells you this:',
  identity: 'This is who you are:',
  logic: 'The data is clear:',
  contrast: 'What they won\'t admit:',
  reversal: 'The opposite of what you think:',
  insight: 'The hidden pattern is:',
};

const ANGLES: ContentAngle[] = ['fear', 'identity', 'logic', 'contrast', 'reversal', 'insight'];

function mutateHook(insight: string, prefix: string): string {
  return `${prefix} ${insight}`;
}

function adjustIntensity(score: number, index: number): number {
  return Math.min(100, Math.round(score + index * 3));
}

export function contentFactory(seed: V2Output): ContentProduct[] {
  const baseInsight = seed.interpretation?.insight || seed.signals?.emotion?.toString() || 'A pattern worth noticing.';
  const intensityScore = seed.user_profile?.intensity_score || 50;

  return ANGLES.map((angle, i) => ({
    hook: mutateHook(baseInsight, HOOK_PREFIXES[angle]),
    angle,
    intensity: adjustIntensity(intensityScore, i),
  }));
}

export function pickByAngle(products: ContentProduct[], angle: ContentAngle): ContentProduct | undefined {
  return products.find((p) => p.angle === angle);
}

export function pickHighestIntensity(products: ContentProduct[]): ContentProduct {
  return [...products].sort((a, b) => b.intensity - a.intensity)[0];
}

export function getFactorySummary(products: ContentProduct[]): string {
  const best = pickHighestIntensity(products);
  return `Factory produced ${products.length} variants. Best: ${best.angle} (${best.intensity}/100) → ${best.hook}`;
}
