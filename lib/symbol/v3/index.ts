// lib/symbol/v3/index.ts
// V3 Growth Engine — 统一入口

import type { V2Output } from '@/lib/symbol/v2/types';
import { buildInsight, type InsightOutput } from './insight';
import { generateNarrative, type NarrativeOutput } from './narrative';
import { generateSharePayload, buildContentStudio, type SharePayload, type ContentStudioPayload } from './distribution';

export interface V3Output {
  insight: InsightOutput;
  narrative: NarrativeOutput;
  share: SharePayload;
  studio: ContentStudioPayload;
}

export function runV3Engine(v2: V2Output): V3Output {
  const insight = buildInsight(v2);
  const narrative = generateNarrative(v2);
  const share = generateSharePayload(v2, narrative, insight);
  const studio = buildContentStudio(v2, narrative, insight);

  return { insight, narrative, share, studio };
}

export { buildInsight, generateNarrative, generateSharePayload, buildContentStudio };
export type { InsightOutput, NarrativeOutput, SharePayload, ContentStudioPayload };
