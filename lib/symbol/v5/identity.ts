// lib/symbol/v5/identity.ts
// V5: Viral Identity Layer — 身份放大器

export interface IdentityPayload {
  identity_line: string;
  inner_state: string;
  system_truth: string;
  share_ready: boolean;
}

export function buildIdentity(output: any): IdentityPayload {
  const archetype = output.user_profile?.archetype || 'Unknown';
  const intensity = output.user_profile?.intensity_score || 50;
  const dominantState = output.emotion_system?.dominant_state || 'neutral';

  return {
    identity_line: `${archetype} | Load ${intensity}`,
    inner_state: `I am operating under ${dominantState}`,
    system_truth: 'This is not personality. This is system behavior under pressure.',
    share_ready: true,
  };
}
