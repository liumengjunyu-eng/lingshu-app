// 八字分析引擎 — 接入 lunar-javascript 实现真实排盘
import { Lunar } from 'lunar-javascript';

// 五行颜色
export const WUXING_COLORS: Record<string, string> = {
  '木': '#4CAF50',
  '火': '#FF5722',
  '土': '#FFC107',
  '金': '#E0E0E0',
  '水': '#2196F3'
};

// 五行名称（英文）
export const WUXING_NAMES: Record<string, string> = {
  '木': 'Wood',
  '火': 'Fire',
  '土': 'Earth',
  '金': 'Metal',
  '水': 'Water'
};

// 天干五行
const WUXING_OF_STEM: Record<string, string> = {
  '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土',
  '己':'土','庚':'金','辛':'金','壬':'水','癸':'水'
};

// 地支五行
const WUXING_OF_BRANCH: Record<string, string> = {
  '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火',
  '午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'
};

// 地支藏干
const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己','癸','辛'],
  '寅': ['甲','丙','戊'],
  '卯': ['乙'],
  '辰': ['戊','乙','癸'],
  '巳': ['丙','庚','戊'],
  '午': ['丁','己'],
  '未': ['己','丁','乙'],
  '申': ['庚','壬','戊'],
  '酉': ['辛'],
  '戌': ['戊','辛','丁'],
  '亥': ['壬','甲']
};

// 天干阴阳
const YINYANG: Record<string, string> = {
  '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳',
  '己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴'
};

const WUXING_CYCLE = ['木','火','土','金','水'];

// 五行旺相
function getElementState(branch: string): string {
  const states: Record<string, string> = {
    '寅':'旺','卯':'旺',
    '巳':'旺','午':'旺',
    '申':'旺','酉':'旺',
    '亥':'旺','子':'旺',
    '辰':'墓','戌':'墓','丑':'墓','未':'墓'
  };
  return states[branch] || '平';
}

// 分析五行
function analyzeWuxing(bazi: string[]): {
  counts: Record<string, number>;
  percentages: Record<string, number>;
  strongest: string;
  weakest: string;
  score: Record<string, number>;
} {
  const counts: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  bazi.forEach(gz => {
    const stem = gz[0];
    const branch = gz[1];
    counts[WUXING_OF_STEM[stem]]++;
    counts[WUXING_OF_BRANCH[branch]]++;
    (HIDDEN_STEMS[branch] || []).forEach(hs => {
      counts[WUXING_OF_STEM[hs]] += 0.5;
    });
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  const score: Record<string, number> = {};
  Object.entries(counts).forEach(([wx, count]) => {
    percentages[wx] = Math.round(count / total * 100);
    score[wx] = Math.round(count / total * 100);
  });

  let strongest = '木', weakest = '木';
  let maxScore = 0, minScore = Infinity;
  Object.entries(score).forEach(([wx, s]) => {
    if (s > maxScore) { maxScore = s; strongest = wx; }
    if (s < minScore) { minScore = s; weakest = wx; }
  });

  return { counts, percentages, strongest, weakest, score };
}

// 生成解读
function generateInsights(wuxing: ReturnType<typeof analyzeWuxing>, zodiac: string): string[] {
  const { strongest, weakest } = wuxing;
  const insights: string[] = [];

  const traitMap: Record<string, string> = {
    '木': 'growth-oriented and visionary',
    '火': 'passionate and charismatic',
    '土': 'stable and nurturing',
    '金': 'discerning and principled',
    '水': 'adaptive and wise'
  };
  const growthMap: Record<string, string> = {
    '木': 'flexibility and resilience',
    '火': 'emotional warmth and inner peace',
    '土': 'stability and self-care',
    '金': 'clarity and healthy boundaries',
    '水': 'wisdom and focused direction'
  };

  insights.push(`Your ${WUXING_NAMES[strongest]} nature is dominant — you are naturally ${traitMap[strongest]}. This shapes how you approach challenges and relationships.`);
  insights.push(`Your ${WUXING_NAMES[weakest]} energy needs the most attention. When balanced, it gives you ${growthMap[weakest]}. The 6-Dimensional Wellness Plan below is designed specifically to strengthen this element.`);
  insights.push(`As a ${zodiac}, your zodiac animal complements your BaZi energy pattern. Use the daily practice section to align your ${WUXING_NAMES[weakest]} element with the natural rhythms.`);

  return insights;
}

// 核心排盘函数
export function calculateBaZi(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  gender: string
) {
  // lunar-javascript 使用阳历日期
  const lunar = Lunar.fromYmdHms(birthYear, birthMonth, birthDay, birthHour, 0, 0);

  // 八字
  const baziArr = lunar.getBaZi() as string[];
  const baziMap: Record<string, string> = {
    year: baziArr[0],
    month: baziArr[1],
    day: baziArr[2],
    hour: baziArr[3]
  };

  // 纳音五行
  const ec = lunar.getEightChar();
  const naYinArr: string[] = ec.getBaZiNaYin();
  const naYin = naYinArr[0] + ' ' + naYinArr[1] + ' ' + naYinArr[2] + ' ' + naYinArr[3];

  // 八字十神（通过EightChar）
  const shishen = {
    year: ec.getYearShiShenGan(),
    month: ec.getMonthShiShenGan(),
    day: '日主',
    hour: ec.getTimeShiShenGan()
  };

  const zodiac = lunar.getShengXiao() as string;
  const lunarDate = lunar.toString() as string;

  // 分析五行
  const wuxing = analyzeWuxing(baziArr);

  // 生成解读
  const insights = generateInsights(wuxing, zodiac);

  return {
    bazi: baziMap,
    naYin,
    shishen,
    zodiac,
    lunarDate,
    wuxing,
    insights
  };
}

// 生成报告数据
export function generateReport(formData: {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: string;
}) {
  const result = calculateBaZi(
    formData.birthYear,
    formData.birthMonth,
    formData.birthDay,
    formData.birthHour,
    formData.gender
  );

  return {
    name: formData.name,
    gender: formData.gender,
    ...result
  };
}
