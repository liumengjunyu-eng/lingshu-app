// lib/symbol/v6/distribution.ts
// V6: Multi-Platform Distribution Engine — 多平台分发引擎

export interface PlatformConfig {
  format: string;
  viral_score: number;
  style: string;
}

export interface DistributionPayload {
  tiktok: PlatformConfig;
  x: PlatformConfig;
  instagram: PlatformConfig;
  youtube: PlatformConfig;
}

export function computeDistribution(output: any): DistributionPayload {
  const intensity = output.user_profile?.intensity_score || 50;

  return {
    tiktok: {
      format: 'short_hook_video',
      viral_score: intensity > 70 ? 0.9 : 0.6,
      style: 'shock + identity reveal',
    },
    x: {
      format: 'thread',
      viral_score: intensity > 60 ? 0.8 : 0.5,
      style: 'insight + system breakdown',
    },
    instagram: {
      format: 'carousel',
      viral_score: intensity > 50 ? 0.75 : 0.4,
      style: 'identity mirror cards',
    },
    youtube: {
      format: 'long_form_explanation',
      viral_score: intensity > 70 ? 0.85 : 0.5,
      style: 'deep system breakdown',
    },
  };
}
