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

// 地支藏干映射
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

// 五行相生相克
const WUXING_CYCLE = ['木','火','土','金','水'];

// 计算八字主轴五行
function getMainElement(gz: string): string {
  const stem = gz[0];
  const branch = gz[1];
  // 天干优先决定日主属性
  return WUXING_OF_STEM[stem] || WUXING_OF_BRANCH[branch] || '土';
}

// 计算日主（出生日期的天干）
export function getDayMaster(bazi: string[]): { stem: string; element: string; isYang: boolean } {
  const dayGan = bazi[2][0];
  return {
    stem: dayGan,
    element: WUXING_OF_STEM[dayGan] || '土',
    isYang: YINYANG[dayGan] === '阳'
  };
}

// 分析十神
function analyzeShishen(dayMaster: string, otherStem: string): string {
  const dmElement = WUXING_OF_STEM[dayMaster];
  const osElement = WUXING_OF_STEM[otherStem];
  const isYang = YINYANG[dayMaster] === '阳';
  const osIsYang = YINYANG[otherStem] === '阳';

  const dmIdx = WUXING_CYCLE.indexOf(dmElement);
  const osIdx = WUXING_CYCLE.indexOf(osElement);

  // 计算距离
  let diff = (osIdx - dmIdx + 5) % 5;

  // 同我者：比劫
  if (diff === 0) return osIsYang ? '劫财' : '比肩';

  // 我生者：食伤
  if (diff === 1) return osIsYang ? '食神' : '伤官';

  // 我克者：才财
  if (diff === 2) return osIsYang ? '偏财' : '正财';

  // 克我者：官杀
  if (diff === 3) return osIsYang ? '七杀' : '正官';

  // 生我者：印枭
  return osIsYang ? '偏印' : '正印';
}

// 分析五行能量
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
    // 天干权重 1
    counts[WUXING_OF_STEM[stem]]++;
    // 地支权重 1（藏干另算）
    counts[WUXING_OF_BRANCH[branch]]++;
    // 地支藏干权重 0.5
    (HIDDEN_STEMS[branch] || []).forEach(hs => {
      counts[WUXING_OF_STEM[hs]] += 0.5;
    });
  });

  // 计算加权总分
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  const score: Record<string, number> = {};
  Object.entries(counts).forEach(([wx, count]) => {
    percentages[wx] = Math.round(count / total * 100);
    score[wx] = Math.round(count / total * 100);
  });

  let strongest = '木';
  let weakest = '木';
  let maxScore = 0;
  let minScore = Infinity;
  Object.entries(score).forEach(([wx, s]) => {
    if (s > maxScore) { maxScore = s; strongest = wx; }
    if (s < minScore) { minScore = s; weakest = wx; }
  });

  return { counts, percentages, strongest, weakest, score };
}

// 月令分析（出生月份的能量强弱）
function getMonthStrength(monthBranch: string): string {
  const strengths: Record<string, string> = {
    '寅': '旺（春）', '卯': '旺（春）',
    '巳': '旺（夏）', '午': '旺（夏）',
    '申': '旺（秋）', '酉': '旺（秋）',
    '亥': '旺（冬）', '子': '旺（冬）',
    '辰': '墓（春末）', '戌': '墓（秋末）', '丑': '墓（冬末）', '未': '墓（夏末）'
  };
  return strengths[monthBranch] || '平';
}

// 生成八字解读
function generateInsights(bazi: string[], wuxing: ReturnType<typeof analyzeWuxing>, gender: string): string[] {
  const dayMaster = getDayMaster(bazi);
  const monthBranch = bazi[1][1];
  const monthStrength = getMonthStrength(monthBranch);
  const insights: string[] = [];

  const strengthText = monthStrength.includes('旺') ? 'strong' : monthStrength.includes('墓') ? 'weak' : 'balanced';
  insights.push(`Your ${dayMaster.element} Day Master is ${strengthText} in the ${monthBranch} month, giving you a natural tendency toward ${strengthText === 'strong' ? 'confidence and assertiveness' : strengthText === 'weak' ? 'caution and resourcefulness' : 'adaptability'}.`);

  const dominant = wuxing.strongest;
  const lacking = wuxing.weakest;
  insights.push(`Your dominant ${dominant} energy makes you naturally ${dominant === '木' ? 'growth-oriented and visionary' : dominant === '火' ? 'passionate and charismatic' : dominant === '土' ? 'stable and nurturing' : dominant === '金' ? 'discerning and principled' : 'adaptive and wise'}.`);
  insights.push(`Pay attention to your ${lacking} element — it is your weakest area and represents the greatest opportunity for growth.`);

  return insights;
}

// 用 lunar-javascript 排八字
export function calculateBaZi(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  gender: string
): {
  bazi: string[];
  naYin: string[];
  shishen: Record<string, string>;
  lunarDate: string;
  zodiac: string;
  dayMaster: string;
  insights: string[];
  wuxing: ReturnType<typeof analyzeWuxing>;
} {
  // lunar-javascript 排盘
  // 出生时辰对应：0=子时, 1=丑时, ..., 23=亥时
  const hourIndex = Math.floor(birthHour / 2); // 每两小时为一个时辰
  const hourMap = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const lunarHour = hourMap[hourIndex % 12];

  // 使用 solarToLunar（阳历转农历）排盘
  // lunar-javascript 期望公历日期
  const lunar = Lunar.fromYmdHms(birthYear, birthMonth, birthDay, birthHour, 0, 0);

  const baziArr = lunar.getBaZi();
  const naYinArr = lunar.getNaYin();
  const lunarDateStr = lunar.toString();
  const zodiac = lunar.getShengXiao();

  const bazi = baziArr as string[];
  const naYin = naYinArr as string[];

  // 计算十神
  const dayMasterStem = bazi[2][0];
  const shishen: Record<string, string> = {};
  bazi.forEach((gz, i) => {
    const stem = gz[0];
    shishen[i === 0 ? 'year' : i === 1 ? 'month' : i === 2 ? 'day' : 'hour'] = analyzeShishen(dayMasterStem, stem);
  });

  // 分析五行
  const wuxing = analyzeWuxing(bazi);

  // 生成解读
  const insights = generateInsights(bazi, wuxing, gender);

  return {
    bazi,
    naYin,
    shishen,
    lunarDate: lunarDateStr,
    zodiac,
    dayMaster: dayMasterStem,
    insights,
    wuxing
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

  // 格式化八字柱显示
  const baziMap: Record<string, string> = {};
  const labels = ['year', 'month', 'day', 'hour'];
  result.bazi.forEach((gz, i) => {
    baziMap[labels[i]] = gz;
  });

  return {
    name: formData.name,
    bazi: baziMap,
    naYin: {
      year: result.naYin[0],
      month: result.naYin[1],
      day: result.naYin[2],
      hour: result.naYin[3]
    },
    shishen: result.shishen,
    lunarDate: result.lunarDate,
    zodiac: result.zodiac,
    wuxing: result.wuxing,
    insights: result.insights
  };
}
