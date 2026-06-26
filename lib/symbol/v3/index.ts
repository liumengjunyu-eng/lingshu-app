// lib/symbol/v3/index.ts
// V3 Growth Engine — 统一入口
// V3.2: + Growth Intelligence + Content Mutation + Conversion Attribution

import type { V2Output } from '@/lib/symbol/v2/types';
import { buildInsight, type InsightOutput } from './insight';
import { generateNarrative, type NarrativeOutput } from './narrative';
import {
  generateSharePayload,
  buildContentStudio,
  buildDistribution,
  type SharePayload,
  type ContentStudioPayload,
  type DistributionPayload,
} from './distribution';
import { generateContent, type ContentVariant } from './content';
import { viralScore, pickBestVariant, type BestVariantResult } from './viral';

// V3.2
import { calculateGrowthScore, type GrowthScoreResult } from './growth';
import { mutateContent, mutateHook, type MutatedVariant } from './mutation';
import { trackConversion, type AttributionEvent } from './attribution';

export interface V3Output {
  insight: InsightOutput;
  narrative: NarrativeOutput;
  share: SharePayload;
  studio: ContentStudioPayload;
  content: ContentVariant;
  bestPick: BestVariantResult;
  distribution: DistributionPayload;
  // V3.2
  mutations: MutatedVariant[];
  hookMutations: MutatedVariant[];
}

export function runV3Engine(v2: V2Output): V3Output {
  const insight = buildInsight(v2);
  const narrative = generateNarrative(v2);
  const share = generateSharePayload(v2, narrative, insight);
  const studio = buildContentStudio(v2, narrative, insight);

  // V3.1
  const content = generateContent(v2);
  const variants = [
    { id: 'hook', text: content.short_hook, platform: 'hook' as const },
    { id: 'tweet', text: content.tweet, platform: 'twitter' as const },
    { id: 'tiktok', text: content.tiktok_script, platform: 'tiktok' as const },
  ];
  const bestPick = pickBestVariant(variants);
  const distribution = buildDistribution(content, bestPick);

  // V3.2
  const mutations = mutateContent(content.short_hook);
  const hookMutations = mutateHook(content.short_hook);

  return { insight, narrative, share, studio, content, bestPick, distribution, mutations, hookMutations };
}

export {
  buildInsight,
  generateNarrative,
  generateSharePayload,
  buildContentStudio,
  generateContent,
  viralScore,
  pickBestVariant,
  buildDistribution,
  // V3.2
  calculateGrowthScore,
  mutateContent,
  mutateHook,
  trackConversion,
};
export type {
  InsightOutput,
  NarrativeOutput,
  SharePayload,
  ContentStudioPayload,
  ContentVariant,
  BestVariantResult,
  DistributionPayload,
  // V3.2
  GrowthScoreResult,
  MutatedVariant,
  AttributionEvent,
};
