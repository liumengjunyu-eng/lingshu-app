// lib/symbol/v3/index.ts
// V3 Growth Engine — 统一入口
// V3.3: + Growth Graph Engine + Content Factory + Predictive Distribution

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

// V3.3
import { GrowthGraph, type UserNode } from './graph';
import { contentFactory, type ContentProduct } from './factory';
import { predictBestChannel, type DistributionDecision } from './distribution_v33';

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
  // V3.3
  factoryProducts: ContentProduct[];
  distributionDecision: DistributionDecision;
  graph: GrowthGraph;
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

  // V3.3
  const factoryProducts = contentFactory(v2);
  const distributionDecision = predictBestChannel({
    intensity: Math.min(100, (v2.user_profile?.intensity_score || 50) + (v2.signals?.stress || 50) / 2),
    angle: bestPick.variant?.platform || 'insight',
    shareText: content.short_hook,
  });
  const graph = GrowthGraph.create();

  return { insight, narrative, share, studio, content, bestPick, distribution, mutations, hookMutations, factoryProducts, distributionDecision, graph };
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
  // V3.3
  GrowthGraph,
  contentFactory,
  predictBestChannel,
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
  // V3.3
  UserNode,
  ContentProduct,
  DistributionDecision,
};
