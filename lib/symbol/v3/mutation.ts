// lib/symbol/v3/mutation.ts
// Content Mutation Engine — 内容进化系统
// V3.2 核心：内容不是生成，是"进化"
// 同一个报告 → 自动生成 4 个传播版本（不同情绪基调）

export type MutationTone = 'fear' | 'neutral' | 'insight' | 'identity';

export interface MutatedVariant {
  tone: MutationTone;
  text: string;
}

function mutateTone(text: string, tone: MutationTone): string {
  switch (tone) {
    case 'fear':
      return `This pattern will not stop unless something changes: ${text}`;
    case 'identity':
      return `This is who you are becoming: ${text}`;
    case 'insight':
      return `What this really means: ${text}`;
    case 'neutral':
    default:
      return text;
  }
}

export function mutateContent(base: string): MutatedVariant[] {
  const tones: MutationTone[] = ['fear', 'neutral', 'insight', 'identity'];
  return tones.map((tone) => ({
    tone,
    text: mutateTone(base, tone),
  }));
}

// Hook-level mutation (for short/share text)
export function mutateHook(base: string): MutatedVariant[] {
  const hooks: Record<MutationTone, string> = {
    fear: `This is not sustainable. ${base}`,
    neutral: base,
    insight: `What no one tells you: ${base.toLowerCase()}`,
    identity: `This is your pattern. ${base}`,
  };

  return (Object.entries(hooks) as [MutationTone, string][]).map(([tone, text]) => ({
    tone,
    text,
  }));
}
