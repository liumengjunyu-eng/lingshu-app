// lib/symbol/v3/viral.ts
// Viral Testing Engine — 爆款测试系统
// V3.1 核心：不是生成内容，是"测试内容"
// 系统自动选：哪个 hook 最容易传播、哪个适合 TikTok、哪个适合 Twitter

export interface ViralScoreResult {
  score: number;
  breakdown: {
    notTired: number;
    brokenSystem: number;
    mostPeople: number;
    didntRealize: number;
    emergencyPower: number;
    quietCost: number;
  };
}

const TRIGGER_PATTERNS: { word: string; weight: number }[] = [
  { word: 'not tired', weight: 30 },
  { word: 'broken system', weight: 25 },
  { word: 'most people', weight: 20 },
  { word: "didn't realize", weight: 15 },
  { word: 'emergency power', weight: 25 },
  { word: 'quiet cost', weight: 15 },
  { word: 'compensating', weight: 20 },
  { word: 'overloaded', weight: 15 },
  { word: 'until it breaks', weight: 20 },
  { word: 'never see', weight: 10 },
  { word: 'burnout', weight: 15 },
  { word: 'system is running', weight: 15 },
  { word: 'Load Index', weight: 5 },
];

export function viralScore(content: string): ViralScoreResult {
  const lower = content.toLowerCase();
  const breakdown = {
    notTired: lower.includes('not tired') ? 30 : 0,
    brokenSystem: lower.includes('broken system') ? 25 : 0,
    mostPeople: lower.includes('most people') ? 20 : 0,
    didntRealize: lower.includes("didn't realize") ? 15 : 0,
    emergencyPower: lower.includes('emergency power') ? 25 : 0,
    quietCost: lower.includes('quiet cost') ? 15 : 0,
  };

  // Additional keyword scoring
  let bonus = 0;
  for (const p of TRIGGER_PATTERNS) {
    if (lower.includes(p.word)) bonus += p.weight * 0.1; // small boost per match
  }

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0) + Math.round(bonus);

  return {
    score: Math.min(total, 100),
    breakdown,
  };
}

export interface VariantCandidate {
  id: string;
  text: string;
  platform: 'twitter' | 'tiktok' | 'threads' | 'linkedin' | 'hook';
}

export interface BestVariantResult {
  variant: VariantCandidate;
  score: number;
  explanation: string;
}

export function pickBestVariant(variants: VariantCandidate[]): BestVariantResult {
  const scored = variants.map((v) => ({
    variant: v,
    score: viralScore(v.text).score,
  }));

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];

  let explanation = '';
  if (best.score >= 60) {
    explanation = `🔥 High virality potential (${best.score}/100). Recommended for ${best.variant.platform}.`;
  } else if (best.score >= 40) {
    explanation = `📈 Moderate virality (${best.score}/100). Good for ${best.variant.platform}.`;
  } else {
    explanation = `📊 Low virality signal (${best.score}/100). Consider editing for more emotional trigger words.`;
  }

  return {
    variant: best.variant,
    score: best.score,
    explanation,
  };
}
