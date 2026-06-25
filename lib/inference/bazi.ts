// lib/inference/bazi.ts

import { Solar } from 'lunar-javascript';
import { BirthInfo, BaziResult } from './types';
export type { BaziResult };

const GAN_WUXING: Record<string, string> = {
  '\u7532': '\u6728', '\u4e59': '\u6728',
  '\u4e19': '\u706b', '\u4e01': '\u706b',
  '\u620a': '\u571f', '\u5df1': '\u571f',
  '\u5e9a': '\u91d1', '\u8f9b': '\u91d1',
  '\u58ec': '\u6c34', '\u7678': '\u6c34',
};

const ZHI_WUXING: Record<string, string> = {
  '\u5b50': '\u6c34', '\u4e11': '\u571f', '\u5bc5': '\u6728', '\u536f': '\u6728',
  '\u8fb0': '\u571f', '\u5df3': '\u706b', '\u5348': '\u706b', '\u672a': '\u571f',
  '\u7533': '\u91d1', '\u9149': '\u91d1', '\u620c': '\u571f', '\u4ea5': '\u6c34',
};

const SHI_SHEN: Record<string, Record<string, string>> = {
  '\u7532': {'\u7532': '\u6bd4\u80a9', '\u4e59': '\u52ab\u8d22', '\u4e19': '\u98df\u795e', '\u4e01': '\u4f24\u5b98', '\u620a': '\u504f\u8d22', '\u5df1': '\u6b63\u8d22', '\u5e9a': '\u4e03\u6740', '\u8f9b': '\u6b63\u5b98', '\u58ec': '\u504f\u5370', '\u7678': '\u6b63\u5370'},
  '\u4e59': {'\u7532': '\u52ab\u8d22', '\u4e59': '\u6bd4\u80a9', '\u4e19': '\u4f24\u5b98', '\u4e01': '\u98df\u795e', '\u620a': '\u6b63\u8d22', '\u5df1': '\u504f\u8d22', '\u5e9a': '\u6b63\u5b98', '\u8f9b': '\u4e03\u6740', '\u58ec': '\u6b63\u5370', '\u7678': '\u504f\u5370'},
  '\u4e19': {'\u7532': '\u504f\u5370', '\u4e59': '\u6b63\u5370', '\u4e19': '\u6bd4\u80a9', '\u4e01': '\u52ab\u8d22', '\u620a': '\u98df\u795e', '\u5df1': '\u4f24\u5b98', '\u5e9a': '\u504f\u8d22', '\u8f9b': '\u6b63\u8d22', '\u58ec': '\u4e03\u6740', '\u7678': '\u6b63\u5b98'},
  '\u4e01': {'\u7532': '\u6b63\u5370', '\u4e59': '\u504f\u5370', '\u4e19': '\u52ab\u8d22', '\u4e01': '\u6bd4\u80a9', '\u620a': '\u4f24\u5b98', '\u5df1': '\u98df\u795e', '\u5e9a': '\u6b63\u8d22', '\u8f9b': '\u504f\u8d22', '\u58ec': '\u6b63\u5b98', '\u7678': '\u4e03\u6740'},
  '\u620a': {'\u7532': '\u4e03\u6740', '\u4e59': '\u6b63\u5b98', '\u4e19': '\u504f\u5370', '\u4e01': '\u6b63\u5370', '\u620a': '\u6bd4\u80a9', '\u5df1': '\u52ab\u8d22', '\u5e9a': '\u98df\u795e', '\u8f9b': '\u4f24\u5b98', '\u58ec': '\u504f\u8d22', '\u7678': '\u6b63\u8d22'},
  '\u5df1': {'\u7532': '\u6b63\u5b98', '\u4e59': '\u4e03\u6740', '\u4e19': '\u6b63\u5370', '\u4e01': '\u504f\u5370', '\u620a': '\u52ab\u8d22', '\u5df1': '\u6bd4\u80a9', '\u5e9a': '\u4f24\u5b98', '\u8f9b': '\u98df\u795e', '\u58ec': '\u6b63\u8d22', '\u7678': '\u504f\u8d22'},
  '\u5e9a': {'\u7532': '\u504f\u8d22', '\u4e59': '\u6b63\u8d22', '\u4e19': '\u4e03\u6740', '\u4e01': '\u6b63\u5b98', '\u620a': '\u504f\u5370', '\u5df1': '\u6b63\u5370', '\u5e9a': '\u6bd4\u80a9', '\u8f9b': '\u52ab\u8d22', '\u58ec': '\u98df\u795e', '\u7678': '\u4f24\u5b98'},
  '\u8f9b': {'\u7532': '\u6b63\u8d22', '\u4e59': '\u504f\u8d22', '\u4e19': '\u6b63\u5b98', '\u4e01': '\u4e03\u6740', '\u620a': '\u6b63\u5370', '\u5df1': '\u504f\u5370', '\u5e9a': '\u52ab\u8d22', '\u8f9b': '\u6bd4\u80a9', '\u58ec': '\u4f24\u5b98', '\u7678': '\u98df\u795e'},
  '\u58ec': {'\u7532': '\u98df\u795e', '\u4e59': '\u4f24\u5b98', '\u4e19': '\u504f\u8d22', '\u4e01': '\u6b63\u8d22', '\u620a': '\u4e03\u6740', '\u5df1': '\u6b63\u5b98', '\u5e9a': '\u504f\u5370', '\u8f9b': '\u6b63\u5370', '\u58ec': '\u6bd4\u80a9', '\u7678': '\u52ab\u8d22'},
  '\u7678': {'\u7532': '\u4f24\u5b98', '\u4e59': '\u98df\u795e', '\u4e19': '\u6b63\u8d22', '\u4e01': '\u504f\u8d22', '\u620a': '\u6b63\u5b98', '\u5df1': '\u4e03\u6740', '\u5e9a': '\u6b63\u5370', '\u8f9b': '\u504f\u5370', '\u58ec': '\u52ab\u8d22', '\u7678': '\u6bd4\u80a9'},
};

const WX_KEYS: (keyof import('./types').Wuxing)[] = ['wood', 'fire', 'earth', 'metal', 'water'];

export function getBaziInfo(info: BirthInfo): BaziResult {
  const solar = Solar.fromYmdHms(info.year, info.month, info.day, info.hour, info.minute || 0, 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getBaZi();

  const ganInOrder = bazi.map((p: any) => p.getGan());
  const zhiInOrder = bazi.map((p: any) => p.getZhi());

  // 统计五行
  const wuxing = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const g of ganInOrder) {
    const wx = GAN_WUXING[g];
    if (wx) wuxing[wx as keyof typeof wuxing] += 2;
  }
  for (const z of zhiInOrder) {
    // 地支藏干不深究，用本气
    const wx = ZHI_WUXING[z];
    if (wx) wuxing[wx as keyof typeof wuxing] += 1;
  }

  const dayMaster = ganInOrder[2];
  const dayMasterWuxing = GAN_WUXING[dayMaster] || '\u672a\u77e5';
  const total = Object.values(wuxing).reduce((a, b) => a + b, 0) || 1;

  // 五行百分比
  const wuxingPercentages: Record<string, number> = {};
  for (const key of WX_KEYS) {
    wuxingPercentages[key] = Math.round((wuxing[key] / total) * 100);
  }

  // 身弱/身强判断：日主五行得分 vs 其他四行平均分
  const dayScore = wuxing[dayMasterWuxing as keyof typeof wuxing] || 0;
  const othersAvg = (total - dayScore) / 4;
  const isWeak = dayScore < othersAvg * 0.8;

  // 十神
  const shiShen = ganInOrder.map((g: string) => {
    const map = SHI_SHEN[dayMaster];
    return map ? (map[g] || '') : '';
  });

  // 调候建议
  const recommendations: string[] = [];
  if (isWeak) {
    const weakWx = dayMasterWuxing;
    const map: Record<string, string[]> = {
      '\u6728': ['\u8865\u6c34\uff08\u5370\u661f\u751f\u8eab\uff09', '\u8865\u6728\uff08\u6bd4\u52ab\u5e2e\u8eab\uff09', '\u52a0\u5f3a\u6668\u95f4\u6d3b\u52a8'],
      '\u706b': ['\u8865\u6728\uff08\u5370\u661f\u751f\u8eab\uff09', '\u8865\u706b\uff08\u6bd4\u52ab\u5e2e\u8eab\uff09', '\u589e\u52a0\u8fd0\u52a8'],
      '\u571f': ['\u8865\u706b\uff08\u5370\u661f\u751f\u8eab\uff09', '\u8865\u571f\uff08\u6bd4\u52ab\u5e2e\u8eab\uff09', '\u89c4\u5f8b\u996e\u98df'],
      '\u91d1': ['\u8865\u571f\uff08\u5370\u661f\u751f\u8eab\uff09', '\u8865\u91d1\uff08\u6bd4\u52ab\u5e2e\u8eab\uff09', '\u5f3a\u5316\u547c\u5438\u8bad\u7ec3'],
      '\u6c34': ['\u8865\u91d1\uff08\u5370\u661f\u751f\u8eab\uff09', '\u8865\u6c34\uff08\u6bd4\u52ab\u5e2e\u8eab\uff09', '\u4fdd\u8bc1\u7761\u7720'],
    };
    recommendations.push(...(map[weakWx] || ['\u5e73\u8861\u9634\u9633', '\u987a\u5e94\u81ea\u7136']));
  } else {
    recommendations.push('\u4fdd\u6301\u5f53\u524d\u8282\u594f', '\u6ce8\u610f\u4e0d\u8fc7\u5ea6\u6d88\u8017');
  }

  return {
    fourPillars: bazi.map((p: any) => p.toString()),
    dayMaster,
    dayMasterWuxing,
    wuxing,
    wuxingPercentages,
    isWeak,
    recommendation: recommendations,
    shiShen,
  };
}
