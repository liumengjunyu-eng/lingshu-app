// lib/symbol/v4/content_brain.ts
// Content Brain — 内容自动生成系统
// V4: 内容不是"生成"，而是"实时适配"——同一份 insight 适配所有平台格式

export interface AdaptiveContentOutput {
  viral_video: VideoScript;
  seo_article: SEOArticle;
  social_post: SocialPost;
  thread: ThreadPost;
}

export interface VideoScript {
  hook: string;
  body: string;
  pacing: string;
  duration: string;
}

export interface SEOArticle {
  title: string;
  slug: string;
  structure: string[];
  content: string;
  metaDescription: string;
}

export interface SocialPost {
  text: string;
  tone: string;
  cta: string;
}

export interface ThreadPost {
  tweets: string[];
  theme: string;
}

const HOOKS = [
  'You are not tired. You are misaligned.',
  'The pattern you ignore is the one destroying you.',
  'Your system is trying to tell you something.',
  'Burnout is not the problem. It is the signal.',
  'You are running a recovery deficit you never noticed.',
];

const SEO_TITLES = [
  'Why You Feel Burned Out Without Reason',
  'The Hidden Recovery Deficit Most People Ignore',
  'Your Body Is in a State You Don\'t Understand',
  'The Behavioral Pattern That Keeps You Exhausted',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateAdaptiveContent(insight: string): AdaptiveContentOutput {
  const hook = pick(HOOKS);
  const seoTitle = pick(SEO_TITLES);

  const viral_video: VideoScript = {
    hook,
    body: insight.slice(0, 200),
    pacing: 'fast cut / emotional escalation with subtle ambient tension',
    duration: '45-60 seconds',
  };

  const seo_article: SEOArticle = {
    title: seoTitle,
    slug: seoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    structure: ['problem hook', 'the hidden pattern', 'why it happens', 'what to do about it'],
    content: insight,
    metaDescription: `Most people don't realize ${insight.slice(0, 80).toLowerCase()}...`,
  };

  const social_post: SocialPost = {
    text: `This explains a pattern most people never notice:\n\n${insight}`,
    tone: 'insight + identity shift',
    cta: 'What pattern are you ignoring?',
  };

  // Twitter thread: split insight into 3-5 tweets
  const sentences = insight.split(/[.!?]+/).filter(Boolean);
  const tweets = sentences.slice(0, 5).map((s, i) =>
    i === 0
      ? `1/ ${s.trim()}.`
      : i === sentences.slice(0, 5).length - 1
        ? `${i + 1}/ ${s.trim()}. Your patterns are telling you something.`
        : `${i + 1}/ ${s.trim()}.`
  );

  const thread: ThreadPost = {
    tweets: tweets.length >= 2 ? tweets : ['1/ ' + insight, '2/ Your system is speaking. Are you listening?'],
    theme: 'behavioral pattern awareness',
  };

  return { viral_video, seo_article, social_post, thread };
}
