// lib/symbol/v3/index.ts
// V3 Growth Engine — 统一入口
// V3.1: + Content Generation Engine + Viral Testing Engine + Distribution Automation

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

export interface V3Output {
  insight: InsightOutput;
  narrative: NarrativeOutput;
  share: SharePayload;
  studio: ContentStudioPayload;
  content: ContentVariant;
  bestPick: BestVariantResult;
  distribution: DistributionPayload;
}

export function runV3Engine(v2: V2Output): V3Output {
  const insight = buildInsight(v2);
  const narrative = generateNarrative(v2);
  const share = generateSharePayload(v2, narrative, insight);
  const studio = buildContentStudio(v2, narrative, insight);

  // V3.1 additions
  const content = generateContent(v2);
  const variants = [
    { id: 'hook', text: content.short_hook, platform: 'hook' as const },
    { id: 'tweet', text: content.tweet, platform: 'twitter' as const },
    { id: 'tiktok', text: content.tiktok_script, platform: 'tiktok' as const },
    { id: 'threads', text: content.long_form, platform: 'threads' as const },
    { id: 'linkedin', text: content.long_form, platform: 'linkedin' as const },
  ];
  const bestPick = pickBestVariant(variants);
  const distribution = buildDistribution(content, bestPick);

  return { insight, narrative, share, studio, content, bestPick, distribution };
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
};
export type {
  InsightOutput,
  NarrativeOutput,
  SharePayload,
  ContentStudioPayload,
  ContentVariant,
  BestVariantResult,
  DistributionPayload,
};
