// lib/share/types.ts
// 传播系统：在 5 档 RecoveryStateLevel 上叠加可分享身份标签

import type { RecoveryStateLevel } from '../recovery/types';

export type { RecoveryStateLevel };

export type Locale = 'zh' | 'zh-TW' | 'en' | 'ja' | 'ko';

export interface ShareLabel {
  /** 中文标签（简体；繁体复用） */
  label: string;
  /** 英文标签 */
  labelEn: string;
  /** 1 秒抓眼球的冲突句（"你之所以累不是因为 X"） */
  hookZh: string;
  hookEn: string;
  /** 社交可对话标签（朋友间能直接说出口的） */
  socialLabelZh: string;
  socialLabelEn: string;
  /** 社交对比句（替代 rarity 统计） */
  socialComparisonZh: string;
  socialComparisonEn: string;
  /** 视觉锚点 */
  emoji: string;
  color: string;
  /** 一句话描述 */
  descriptionZh: string;
  descriptionEn: string;
}

export const RECOVERY_TYPE_MAP: Record<RecoveryStateLevel, ShareLabel> = {
  overloaded: {
    label: '严重过载',
    labelEn: 'Severe Overload',
    hookZh: '你不是在休息。你只是没在工作。',
    hookEn: 'You\'re not resting. You\'re just not working.',
    socialLabelZh: '"没事型"（但其实早就扛不住了）',
    socialLabelEn: 'The "I\'m fine" type (but not really)',
    socialComparisonZh: '这状态的人比你想的更少。大部分人扛到这个程度早就崩溃了。',
    socialComparisonEn: 'You\'re rarer than you think. Most people collapse before this point.',
    emoji: '🔴',
    color: '#D46A5A',
    descriptionZh: '你看起来还行。但你的系统已经超载。',
    descriptionEn: 'You look fine. But your system is not.',
  },
  depleting: {
    label: '持续消耗',
    labelEn: 'Sustained Drain',
    hookZh: '你说没事，但身体不这么认为。',
    hookEn: 'You say you\'re fine. But your body is not listening.',
    socialLabelZh: '"假装没事"型',
    socialLabelEn: 'The "faking it" type',
    socialComparisonZh: '这是最被误解的状态。周围人看不见，你自己也快看不见了。',
    socialComparisonEn: 'This is the most misunderstood state. People around you don\'t see it.',
    emoji: '🟠',
    color: '#E8A87C',
    descriptionZh: '你还在撑。但消耗速度已经超过恢复速度。',
    descriptionEn: 'You\'re still going. But drain is outpacing recovery.',
  },
  unstable: {
    label: '波动不稳',
    labelEn: 'Unstable',
    hookZh: '你一直在"快好了"。但从没真的稳定。',
    hookEn: 'You keep being "almost there". But never stable.',
    socialLabelZh: '"快好了"型',
    socialLabelEn: 'The "almost there" type',
    socialComparisonZh: '你不是一个人。但大部分人在这个状态停留的时间比自己以为的久。',
    socialComparisonEn: 'You\'re not alone. But most people stay in this state longer than they think.',
    emoji: '🟡',
    color: '#D9B86C',
    descriptionZh: '你在恢复。但总是被反复打断。',
    descriptionEn: 'You\'re recovering. But you keep getting interrupted.',
  },
  recovering: {
    label: '正在恢复',
    labelEn: 'Recovering',
    hookZh: '你开始找到节奏了。',
    hookEn: 'You\'re starting to find your rhythm.',
    socialLabelZh: '"这次是真的"型',
    socialLabelEn: 'The "this time for real" type',
    socialComparisonZh: '大部分人尝试很多次都到不了这一步。你已经到了。',
    socialComparisonEn: 'Most people don\'t reach this. You have.',
    emoji: '🟢',
    color: '#7BA47B',
    descriptionZh: '你的恢复速度开始跟得上消耗了。',
    descriptionEn: 'Your recovery rate is finally matching the drain.',
  },
  stable: {
    label: '稳定状态',
    labelEn: 'Stable',
    hookZh: '你不是天生精力好。你是把方法做对了。',
    hookEn: 'You\'re not lucky. You did the work.',
    socialLabelZh: '"把事做对"型',
    socialLabelEn: 'The "did the work" type',
    socialComparisonZh: '你是少数。绝大部分人一辈子都没到过这个状态。',
    socialComparisonEn: 'You\'re the exception. Most people never reach this state.',
    emoji: '🌿',
    color: '#4A7C49',
    descriptionZh: '你找到了自己的节奏。别停。',
    descriptionEn: 'You\'ve found your rhythm. Keep going.',
  },
};
