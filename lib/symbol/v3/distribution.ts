// lib/symbol/v3/distribution.ts
// Distribution Engine — 裂变核心：用户不只是分享，是带用户回来

import type { V2Output } from '@/lib/symbol/v2/types';
import type { NarrativeOutput } from './narrative';
import type { InsightOutput } from './insight';

export interface SharePayload {
  text: string;
  link: string;
  image_template: string;
  platform_variants: {
    twitter: string;
    tiktok_caption: string;
    threads: string;
    linkedin: string;
  };
}

export interface ContentStudioPayload {
  identity: string;
  hook: string;
  body: string;
  metric: string;
  share_link: string;
}

function generateRefId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export function buildContentStudio(v2: V2Output, narrative: NarrativeOutput, insight: InsightOutput): ContentStudioPayload {
  return {
    identity: v2.narrative.share_identity,
    hook: narrative.hook,
    body: insight.core_insight,
    metric: narrative.metric,
    share_link: `https://lingshu-app-gules.vercel.app/?ref=${generateRefId()}`,
  };
}

export function generateSharePayload(v2: V2Output, narrative: NarrativeOutput, insight: InsightOutput): SharePayload {
  const ref = generateRefId();
  const link = `https://lingshu-app-gules.vercel.app/?ref=${ref}`;

  const base = [
    narrative.hook,
    '',
    `${v2.narrative.share_identity}`,
    `${narrative.metric}`,
    '',
    insight.core_insight,
  ].join('\n');

  return {
    text: `${base}\n\n${link}`,
    link,
    image_template: 'system_report_card_v3',
    platform_variants: {
      twitter: `${narrative.hook}\n\n${v2.narrative.share_identity}\n${narrative.metric}\n\n${insight.punch_line}\n\n${link}`,
      tiktok_caption: `${narrative.hook} #systempattern #burnoutrecovery #mentalhealth ${v2.narrative.share_identity.replace(/\s+/g, '').toLowerCase()}`,
      threads: `${narrative.hook}\n\nYour system has a pattern. Most people never see theirs.`,
      linkedin: `I took a system assessment and learned something about how I operate.\n\n${narrative.title}: ${v2.narrative.share_identity}\n\n${insight.core_insight}\n\n${link}`,
    },
  };
}
