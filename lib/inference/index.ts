// lib/inference/index.ts
import { BirthInfo, InferenceResult } from './types';
import { getBaziInfo } from './bazi';
import { getZodiacInfo } from './zodiac';
import { BLOOD_DATA } from './blood';
import { getTCMInfo } from './tcm';
import { getYijingInfo } from './yijing';

export function infer(info: BirthInfo, bloodType?: string): InferenceResult {
  const bazi = getBaziInfo(info);
  const zodiac = getZodiacInfo(info.month, info.day);
  const blood = bloodType && BLOOD_DATA[bloodType.toUpperCase()]
    ? { ...BLOOD_DATA[bloodType.toUpperCase()] }
    : null;
  const tcm = getTCMInfo(bazi.wuxing, bazi.isWeak, bazi.dayMasterWuxing);
  const yijing = getYijingInfo(info.year, info.month, info.day);

  // 综合恢复重点
  const recoveryFocus: string[] = [];

  // 八字→恢复重点
  if (bazi.isWeak) {
    const weakMap: Record<string, string[]> = {
      '\u6728': ['\u6062\u590d\u809d\u6c14', '\u758f\u89e3\u538b\u529b', '\u4fdd\u8bc1\u7761\u7720'],
      '\u706b': ['\u4fdd\u62a4\u5fc3\u810f', '\u8c03\u8282\u60c5\u7eea', '\u9002\u5ea6\u8fd0\u52a8'],
      '\u571f': ['\u8c03\u517b\u813e\u80c3', '\u89c4\u5f8b\u996e\u98df', '\u51cf\u8f7b\u601d\u8651'],
      '\u91d1': ['\u8c03\u7406\u547c\u5438', '\u6da6\u80ba', '\u589e\u5f3a\u514d\u75ab'],
      '\u6c34': ['\u517b\u80be', '\u4fdd\u8bc1\u4f11\u606f', '\u51cf\u5c11\u6d88\u8017'],
    };
    recoveryFocus.push(...(weakMap[bazi.dayMasterWuxing] || ['\u5e73\u8861\u9634\u9633', '\u6062\u590d\u7cbe\u529b']));
  } else {
    recoveryFocus.push('\u7ef4\u6301\u5f53\u524d\u5e73\u8861', '\u6ce8\u610f\u4e0d\u8fc7\u5ea6\u6d88\u8017');
  }

  // 星座→恢复重点
  const zodiacMap: Record<string, string[]> = {
    '\u706b': ['\u6ce8\u610f\u60c5\u7eea\u8fc7\u70ed', '\u9700\u8981\u51b7\u5374\u65f6\u95f4'],
    '\u571f': ['\u907f\u514d\u8fc7\u5ea6\u56fa\u6267', '\u4fdd\u6301\u7075\u6d3b\u6027'],
    '\u98ce': ['\u51cf\u5c11\u8fc7\u5ea6\u601d\u8651', '\u589e\u52a0\u8eab\u4f53\u6d3b\u52a8'],
    '\u6c34': ['\u6ce8\u610f\u60c5\u7eea\u8fb9\u754c', '\u907f\u514d\u8fc7\u5ea6\u5171\u60c5'],
  };
  if (zodiac.element in zodiacMap) {
    recoveryFocus.push(...(zodiacMap[zodiac.element as keyof typeof zodiacMap]));
  }

  // 血型→恢复重点
  if (blood) {
    const bloodMap: Record<string, string> = {
      '\u6728': '\u6ce8\u610f\u60c5\u7eea\u758f\u89e3',
      '\u706b': '\u907f\u514d\u51b2\u52a8\u6d88\u8017',
      '\u91d1': '\u6ce8\u610f\u547c\u5438\u8c03\u8282',
      '\u6c34+\u91d1': '\u5e73\u8861\u7406\u6027\u4e0e\u611f\u6027',
    };
    if (blood.wuxingAffinity in bloodMap) {
      recoveryFocus.push(bloodMap[blood.wuxingAffinity as keyof typeof bloodMap]);
    }
  }

  // 中医体质→恢复重点
  recoveryFocus.push(...tcm.recommendation.slice(0, 2));

  // 去重
  const uniqueFocus = [...new Set(recoveryFocus)];

  // 综合核心洞察
  const bloodPart = blood
    ? `\uff0c\u4f60\u7684${bloodType}\u578b\u8840\u6027\u683c\u7279\u8d28\uff08${blood.traits.slice(0, 2).join('\u3001')}\uff09`
    : '';
  const coreInsight =
    `\u4f60\u5c5e\u4e8e${bazi.dayMasterWuxing}\u547d\u5c40\uff08${bazi.dayMaster}\u65e5\u4e3b\uff09\uff0c${
      bazi.isWeak ? '\u8eab\u5f31\uff0c\u9700\u8981\u8865\u5145\u81ea\u8eab\u80fd\u91cf' : '\u8eab\u5f3a\uff0c\u4fdd\u6301\u5e73\u8861'
    }\u3002${zodiac.name}\uff08${zodiac.element}\u8c61\uff09${bloodPart}\u4f7f\u4f60\u7684\u6062\u590d\u9700\u6c42\u504f\u5411\uff1a${uniqueFocus.slice(0, 3).join('\u3001')}\u3002`;

  return {
    bazi,
    zodiac,
    blood,
    tcm,
    yijing,
    combined: {
      coreInsight,
      recoveryFocus: uniqueFocus,
      dailyTask: {
        title: '\u6062\u590d\u57fa\u7840',
        instruction: '\u4ece\u6700\u5c0f\u53ef\u6267\u884c\u7684\u52a8\u4f5c\u5f00\u59cb\uff0c\u5173\u6ce8\u8eab\u4f53\u4fe1\u53f7',
        reasoning: coreInsight,
      },
    },
  };
}
