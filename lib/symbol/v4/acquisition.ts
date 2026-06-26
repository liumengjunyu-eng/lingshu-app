// lib/symbol/v4/acquisition.ts
// Acquisition Brain — 自动获客系统
// V4: 系统开始"自己找用户"，决定去哪个渠道拉人

export type AcquisitionChannel = 'tiktok' | 'twitter' | 'google' | 'threads' | 'reddit' | 'instagram';

export interface AcquisitionStrategy {
  channel: AcquisitionChannel;
  strategy: string;
  confidence: number;
}

const CHANNEL_STRATEGIES: Record<AcquisitionChannel, string> = {
  tiktok: 'short-form emotional hook videos (pattern recognition, identity shock)',
  twitter: 'insight-driven text posts with thread structure',
  google: 'SEO-optimized articles targeting burnout/self-discovery queries',
  threads: 'conversational pattern explanations with community hooks',
  reddit: 'problem narrative + deep explanation posts in relevant subreddits',
  instagram: 'visual identity cards + carousel breakdowns of behavioral patterns',
};

export interface UserProfileForAcquisition {
  intensity_score?: number;
  archetype?: string;
  focusLevel?: number;
  stressLevel?: number;
  sleepQuality?: number;
  emotion?: number;
}

export class AcquisitionBrain {
  channels: AcquisitionChannel[] = ['tiktok', 'twitter', 'google', 'threads', 'reddit', 'instagram'];

  predictChannelFit(profile: UserProfileForAcquisition): AcquisitionChannel {
    const score = profile.intensity_score || 50;
    const archetype = profile.archetype || '';
    const focus = profile.focusLevel || 50;
    const emotion = profile.emotion || 50;

    // High intensity emotional patterns → TikTok
    if (score > 70 && emotion > 60) return 'tiktok';
    // Analytical / high focus → Reddit
    if (archetype.toLowerCase().includes('analytical') || focus > 70) return 'reddit';
    // Low focus, high stress → Instagram (visual, low cognitive load)
    if (focus < 40 && (profile.stressLevel || 50) > 65) return 'instagram';
    // Moderate insight-driven → Twitter
    if (score > 40 && score <= 70) return 'twitter';
    // Conversational → Threads
    if (archetype.toLowerCase().includes('social') || archetype.toLowerCase().includes('connector')) return 'threads';
    // Fallback
    return 'google';
  }

  generateAcquisitionStrategy(profile: UserProfileForAcquisition): AcquisitionStrategy {
    const channel = this.predictChannelFit(profile);
    const strategy = CHANNEL_STRATEGIES[channel];

    // Confidence based on how well the profile fits the channel's typical user
    let confidence = 0.6;
    if (channel === 'tiktok' && (profile.intensity_score || 50) > 70) confidence = 0.9;
    if (channel === 'reddit' && (profile.archetype || '').toLowerCase().includes('analytical')) confidence = 0.85;
    if (channel === 'instagram' && (profile.intensity_score || 50) > 60) confidence = 0.8;

    return { channel, strategy, confidence };
  }

  /** Get channel recommendations for all channels, sorted by fit */
  rankAllChannels(profile: UserProfileForAcquisition): { channel: AcquisitionChannel; strategy: string; score: number }[] {
    const best = this.predictChannelFit(profile);
    return this.channels.map((ch) => ({
      channel: ch,
      strategy: CHANNEL_STRATEGIES[ch],
      score: ch === best ? 100 : ch === 'google' ? 40 : Math.floor(Math.random() * 30) + 10,
    })).sort((a, b) => b.score - a.score);
  }
}
