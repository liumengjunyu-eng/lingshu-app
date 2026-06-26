// lib/symbol/v6/contentEngine.ts
// V6: Self-Generating Content Engine — 自生成内容引擎

export interface Thread {
  platform: string;
  content: string;
}

export interface ContentStream {
  threads: Thread[];
  hook_variants: string[];
}

export function generateContentStream(output: any): ContentStream {
  const archetype = output.user_profile?.archetype || 'Unknown';
  const score = output.user_profile?.intensity_score || 50;
  const dominantState = output.emotion_system?.dominant_state || 'neutral';

  return {
    threads: [
      {
        platform: 'x',
        content: `I was labeled "${archetype}" by a system that doesn't care about feelings. It only reads load patterns. Mine was ${score}.`,
      },
      {
        platform: 'tiktok',
        content: `POV: You discover your "burnout" is actually a system overload pattern.`,
      },
      {
        platform: 'instagram',
        content: `They called it stress. The system called it collapse delay.`,
      },
    ],
    hook_variants: [
      'You are not tired. You are overloaded.',
      'This is what your mind looks like under pressure.',
      'Most people never see this layer.',
    ],
  };
}
