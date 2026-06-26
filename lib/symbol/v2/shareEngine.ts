// lib/symbol/v2/shareEngine.ts
// V2.4 Growth Engine — 多平台内容生成

import { pickRandom, collapseStates, identityLines } from './sentenceEngine';

export interface ShareInput {
  score: number;
  archetype: string;
  risk: string;
}

export interface ShareOutput {
  tiktok: {
    hook: string;
    body: string;
    closing: string;
  };
  twitter: {
    text: string;
  };
  instagram: {
    caption: string;
  };
  card: {
    title: string;
    subtitle: string;
    score: number;
  };
}

export function generateShareContent(input: ShareInput): ShareOutput {
  const sentence = pickRandom(collapseStates);
  const identity = pickRandom(identityLines);

  return {
    tiktok: {
      hook: "I didn't expect an AI to describe me like this.",
      body: sentence,
      closing: `My system type: ${identity}`,
    },
    twitter: {
      text: `${sentence}\n\nSystem type: ${identity}\n\nScore: ${input.score}/100`,
    },
    instagram: {
      caption: `System Report:\n\n${sentence}\n\n${identity}\n\nScore: ${input.score}/100\n\n#selfsystem #aianalysis #systemhealth #recoverymode`,
    },
    card: {
      title: identity,
      subtitle: sentence,
      score: input.score,
    },
  };
}
