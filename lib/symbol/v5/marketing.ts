// lib/symbol/v5/marketing.ts
// Autonomous Marketing Engine — 自动营销系统
// V5 核心：系统自己做营销——写广告、写SEO、写社媒、写投放素材

export type AdChannel = 'tiktok' | 'seo' | 'twitter' | 'instagram' | 'threads' | 'linkedin';

export interface AdCreative {
  channel: AdChannel;
  title?: string;
  hook: string;
  script?: string;
  content?: string;
  cta?: string;
}

export interface Campaign {
  tiktok_ads: AdCreative;
  google_seo: AdCreative;
  twitter_posts: AdCreative;
  instagram_creatives: AdCreative;
  threads_posts: AdCreative;
}

export interface ProductForAd {
  name: string;
  message: string;
  description: string;
  audienceTone: 'fear' | 'insight' | 'identity' | 'logic';
}

const CHANNEL_HOOKS: Record<AdChannel, (product: ProductForAd) => string> = {
  tiktok: (p) => `You are not broken. Your system is overloaded. ${p.message.slice(0, 60)}`,
  seo: (p) => `${p.name} — Why It Actually Works`,
  twitter: (p) => `Most people don't understand why they feel this way. ${p.message.slice(0, 100)}`,
  instagram: (p) => `Your system is speaking. ${p.message.slice(0, 60)}`,
  threads: (p) => `A thread on why ${p.message.slice(0, 80).toLowerCase()}...`,
  linkedin: (p) => `The data is clear: ${p.message.slice(0, 80)}`,
};

export class AutonomousMarketingEngine {
  generateCampaign(product: ProductForAd): Campaign {
    return {
      tiktok_ads: this.buildAd('tiktok', product),
      google_seo: this.buildAd('seo', product),
      twitter_posts: this.buildAd('twitter', product),
      instagram_creatives: this.buildAd('instagram', product),
      threads_posts: this.buildAd('threads', product),
    };
  }

  /** 为指定渠道生成广告素材 */
  buildAd(channel: AdChannel, product: ProductForAd): AdCreative {
    const base: AdCreative = {
      channel,
      hook: CHANNEL_HOOKS[channel](product),
    };

    switch (channel) {
      case 'tiktok':
        return {
          ...base,
          hook: CHANNEL_HOOKS.tiktok(product),
          script: `[Hook: ${CHANNEL_HOOKS.tiktok(product)}]\n[Body: ${product.description.slice(0, 150)}]\n[CTA: Get your system report at lingshu-app.vercel.app]`,
          cta: 'Get your system report',
        };
      case 'seo':
        return {
          ...base,
          title: product.name,
          hook: CHANNEL_HOOKS.seo(product),
          content: `${product.name}: ${product.description}\n\n${product.message}`,
          cta: 'Read more',
        };
      case 'twitter':
        return {
          ...base,
          hook: CHANNEL_HOOKS.twitter(product),
          content: product.message,
          cta: 'What pattern are you ignoring?',
        };
      case 'instagram':
        return {
          ...base,
          hook: CHANNEL_HOOKS.instagram(product),
          content: `Swipe → ${product.description.slice(0, 200)}`,
          cta: 'Link in bio',
        };
      case 'threads':
        return {
          ...base,
          hook: CHANNEL_HOOKS.threads(product),
          content: `1/ ${product.message.slice(0, 200)}\n2/ This pattern is more common than you think.`,
          cta: 'Follow for more',
        };
      case 'linkedin':
        return {
          ...base,
          hook: CHANNEL_HOOKS.linkedin(product),
          content: product.description,
          cta: 'Share your thoughts',
        };
      default:
        return base;
    }
  }

  /** 根据用户画像选择最适合的渠道 */
  pickBestChannel(profile: { intensity_score?: number; archetype?: string }): AdChannel[] {
    const score = profile.intensity_score || 50;
    const archetype = profile.archetype || '';
    if (score > 70) return ['tiktok', 'instagram', 'threads'];
    if (archetype.toLowerCase().includes('analytical')) return ['twitter', 'linkedin', 'seo'];
    return ['twitter', 'threads', 'tiktok'];
  }
}
