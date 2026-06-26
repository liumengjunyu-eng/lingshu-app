// lib/symbol/v5/growthLoop.ts
// V5: Growth Loop Engine — 增长循环引擎

export type LoopType = 'high_strain_viral' | 'reflection_viral' | 'curiosity_viral' | 'neutral';

export interface GrowthLoopPayload {
  loopType: LoopType;
  shareProbability: number;
  triggerText: string;
  channelStrategy: {
    tiktok: string;
    youtube: string;
    x: string;
    instagram: string;
  };
}

export function computeGrowthLoop(output: any): GrowthLoopPayload {
  const intensity = output.user_profile?.intensity_score || 50;

  let loopType: LoopType = 'neutral';
  if (intensity > 70) loopType = 'high_strain_viral';
  else if (intensity > 50) loopType = 'reflection_viral';
  else loopType = 'curiosity_viral';

  const shareProbability = intensity > 70 ? 0.72 : intensity > 50 ? 0.55 : 0.38;

  const triggerText =
    loopType === 'high_strain_viral'
      ? "People like you usually don't notice this until it's too late."
      : loopType === 'reflection_viral'
      ? 'This explains more than you think.'
      : 'Try this and compare your result.';

  return {
    loopType,
    shareProbability,
    triggerText,
    channelStrategy: {
      tiktok: 'hook-first-short-form',
      youtube: 'story-based explanation',
      x: 'insight-thread format',
      instagram: 'visual identity card',
    },
  };
}
