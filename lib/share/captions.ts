// lib/share/captions.ts
// Viral Caption 生成器 + 社交对比句封装

import type { Locale } from './types';
import { RECOVERY_TYPE_MAP, type RecoveryStateLevel } from './types';

/**
 * Viral Caption 池（按状态分）
 * 设计原则：用户在社交平台主动发出去会"被朋友看见"的那类
 */
const ZH_CAPTIONS: Record<RecoveryStateLevel, string[]> = {
  overloaded: [
    '刚做了个恢复状态测评。\n\n结果是"严重过载"。\n\n我以为我只是懒，原来是真的扛不住了。',
    '它说我不是累，是已经超载了。\n\n这句话看完愣了几秒。',
    '"你不是在休息，你只是没在工作。"\n\n被这个判断卡住了。',
  ],
  depleting: [
    '做了个恢复状态测试。\n\n"持续消耗"——消耗的速度已经超过恢复了。\n\n挺准的。',
    '测出来是"假装没事"型。\n\n哈哈怎么会这样。\n\n（真的会）',
    '它说这是我最被误解的状态。\n\n……一语中的。',
  ],
  unstable: [
    '我以为我在恢复。\n\n但其实一直在"快好了"的状态打转。\n\n这个测试太狠了。',
    '恢复状态测试。\n\n结果：永远在"快好了"，但没真到过。\n\n有没有同款。',
    '它说我不是一个人。\n\n但大部分人在这个状态比自己以为的久。\n\n被安慰到了，又被刺到了。',
  ],
  recovering: [
    '恢复状态测试。\n\n"这次是真的"型。\n\n希望这次真的是。',
    '我的恢复速度开始跟得上消耗了。\n\n做了个测试确认了一下。\n\n真的开始恢复了。',
  ],
  stable: [
    '做了个恢复状态测评，结果是"稳定"。\n\n不是因为运气，是把方法做对了。\n\n挺高兴的。',
    '它说我是少数。\n\n大部分人一辈子都没到过这个状态。\n\n（第一次觉得自己做对了什么）',
  ],
};

const EN_CAPTIONS: Record<RecoveryStateLevel, string[]> = {
  overloaded: [
    'Took a recovery assessment today.\n\nResult: "Severe Overload".\n\nI thought I was just lazy. Turns out I\'m actually at capacity.',
    'It told me I\'m not resting. I\'m just not working.\n\nThat one landed.',
    'Apparently I\'m rarer than I thought. Most people collapse before this point.',
  ],
  depleting: [
    'Got "Sustained Drain" on a recovery test.\n\nDrain is outpacing recovery.\n\nYeah, that checks out.',
    'Apparently I\'m "the faking it" type.\n\nHaha.\n\n…why is that so accurate.',
    'It said this is the most misunderstood state.\n\nOuch.',
  ],
  unstable: [
    'I thought I was recovering.\n\nTurns out I\'ve just been "almost there" on repeat.\n\nThis test is brutal.',
    'Test result: always almost there, never actually stable.\n\nAnyone else?',
    'It said I\'m not alone. But most people stay here longer than they think.\n\nBoth comforted and roasted at the same time.',
  ],
  recovering: [
    'Recovery assessment: "this time for real" type.\n\nHoping this time really is.',
    'My recovery rate is finally matching the drain.\n\nTook a test to confirm. Apparently true.',
  ],
  stable: [
    'Took a recovery assessment. Result: stable.\n\nNot because of luck. Because I did the work.',
    'It said I\'m the exception. Most people never reach this state.\n\n(First time in a while I felt like I actually did something right.)',
  ],
};

/**
 * 取一个随机 viral caption
 */
export function getViralCaption(
  state: RecoveryStateLevel,
  locale: Locale = 'zh'
): string {
  const pool = locale === 'en' ? EN_CAPTIONS : ZH_CAPTIONS;
  const list = pool[state] || pool.depleting;
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * 社交对比句（替代 rarity 统计）
 */
export function getSocialComparison(
  state: RecoveryStateLevel,
  locale: Locale = 'zh'
): string {
  const entry = RECOVERY_TYPE_MAP[state];
  if (!entry) return '';
  return locale === 'en' ? entry.socialComparisonEn : entry.socialComparisonZh;
}

/**
 * 社交可对话标签
 */
export function getSocialLabel(
  state: RecoveryStateLevel,
  locale: Locale = 'zh'
): string {
  const entry = RECOVERY_TYPE_MAP[state];
  if (!entry) return '';
  return locale === 'en' ? entry.socialLabelEn : entry.socialLabelZh;
}

/**
 * 1 秒 hook 句
 */
export function getHookLine(
  state: RecoveryStateLevel,
  locale: Locale = 'zh'
): string {
  const entry = RECOVERY_TYPE_MAP[state];
  if (!entry) return '';
  return locale === 'en' ? entry.hookEn : entry.hookZh;
}
