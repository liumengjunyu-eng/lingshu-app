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
  const l = lunar as any;
  const naYin = l.getYearNaYin() + ' ' + l.getMonthNaYin() + ' ' + l.getDayNaYin() + ' ' + l.getTimeNaYin();

  // 八字十神（通过EightChar）
  const ec = (lunar.getEightChar() as any) || {};
  const shishen = {
    year: ec.getYearShiShenGan?.() || '偏财',
    month: ec.getMonthShiShenGan?.() || '正官',
    day: '日主',
    hour: ec.getTimeShiShenGan?.() || '食神'
  };

  const zodiac = (lunar as any).getShengxiao() as string;
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

// ============================================================
// 血型性格分析模块
// ============================================================

export const BLOOD_TYPE_MAP: Record<string, {
  name: string;
  traits: string[];
  strength: string;
  weakness: string;
  fiveElement: string;
  healthTendency: string;
  communication: string;
  workStyle: string;
  loveStyle: string;
}> = {
  'A': {
    name: 'A型',
    traits: ['认真负责', '敏感细腻', '谨慎稳重', '有耐心'],
    strength: '做事细致、有责任心、善于规划',
    weakness: '容易焦虑、过度思虑、自我压力大',
    fiveElement: '木',
    healthTendency: '肝气易郁结，注意情绪疏解',
    communication: '委婉含蓄，不直接表达情绪',
    workStyle: '按部就班，追求完美，适合精细工作',
    loveStyle: '慢热但专一，重视承诺和安全感',
  },
  'B': {
    name: 'B型',
    traits: ['开朗乐观', '自由奔放', '创造性强', '感染力强'],
    strength: '适应力强、富有创意、善于社交',
    weakness: '过于随性、缺乏计划性、容易三分钟热度',
    fiveElement: '火',
    healthTendency: '心火易旺，注意情绪波动',
    communication: '直接热情，表达欲强',
    workStyle: '灵活多变，适合创意型工作',
    loveStyle: '热情主动，喜欢新鲜感',
  },
  'O': {
    name: 'O型',
    traits: ['自信果断', '目标导向', '执行力强', '领导力'],
    strength: '决策力强、抗压能力好、行动力卓越',
    weakness: '容易固执、忽视他人感受、过于自我',
    fiveElement: '金',
    healthTendency: '肺与大肠易敏感，注意呼吸系统',
    communication: '直接了当，不拐弯抹角',
    workStyle: '目标明确，善于管理，适合领导岗位',
    loveStyle: '主动追求，重视彼此成长',
  },
  'AB': {
    name: 'AB型',
    traits: ['理性冷静', '思维独特', '洞察力强', '适应力强'],
    strength: '思维灵活、善于分析、兼容并包',
    weakness: '有时优柔寡断、情感疏离、犹豫不决',
    fiveElement: '水+金',
    healthTendency: '神经系统易敏感，注意睡眠',
    communication: '理性分析，但情感表达含蓄',
    workStyle: '善于统筹，适合战略型工作',
    loveStyle: '理性与感性交织，需要理解的空间',
  },
};

/**
 * 获取血型分析结果
 * @param bloodType 血型 (A/B/O/AB)
 * @param wuXingCount 五行分布（用于联动分析）
 * @returns 完整的血型分析报告
 */
export function getBloodTypeAnalysis(
  bloodType: string,
  wuXingCount: Record<string, number>
): {
  bloodType: string;
  traits: string[];
  strength: string;
  weakness: string;
  fiveElement: string;
  healthTendency: string;
  communication: string;
  workStyle: string;
  loveStyle: string;
  combinedAdvice: string;
} {
  const type = bloodType.toUpperCase();
  const data = BLOOD_TYPE_MAP[type];

  if (!data) {
    return {
      bloodType: '未知',
      traits: ['信息不足', '无法分析'],
      strength: '请完善血型信息以获得精准分析',
      weakness: '请完善血型信息以获得精准分析',
      fiveElement: '—',
      healthTendency: '—',
      communication: '—',
      workStyle: '—',
      loveStyle: '—',
      combinedAdvice: '建议在个人资料中补充血型信息，以获得更完整的分析。',
    };
  }

  // 血型对应五行与用户实际五行的联动分析
  const bloodWx = data.fiveElement;
  const userWx = Object.entries(wuXingCount).sort((a, b) => b[1] - a[1])[0][0];

  let combinedAdvice = '';
  if (bloodWx === userWx) {
    combinedAdvice = `你的血型（${data.name}）与你的五行主导（${userWx}）同频。这让你在行动时更加顺畅，但也容易强化该五行的过旺倾向。建议适当关注${userWx}元素的平衡调节。`;
  } else if (bloodWx.includes('+')) {
    combinedAdvice = `你的血型（${data.name}）属于复合五行（${bloodWx}），结合你的五行主导（${userWx}），建议在生活和工作中灵活切换角色，发挥多元化优势。`;
  } else {
    combinedAdvice = `你的血型（${data.name}）对应五行「${bloodWx}」，与你当前的五行主导「${userWx}」形成互补。这种组合让你既有${userWx}的行动力，又有${bloodWx}的细腻感知。建议在决策时充分运用两者的优势。`;
  }

  return {
    bloodType: data.name,
    traits: data.traits,
    strength: data.strength,
    weakness: data.weakness,
    fiveElement: data.fiveElement,
    healthTendency: data.healthTendency,
    communication: data.communication,
    workStyle: data.workStyle,
    loveStyle: data.loveStyle,
    combinedAdvice,
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
  bloodType?: string;
}) {
  const result = calculateBaZi(
    formData.birthYear,
    formData.birthMonth,
    formData.birthDay,
    formData.birthHour,
    formData.gender
  );

  // 血型分析
  const bloodTypeData = formData.bloodType
    ? getBloodTypeAnalysis(formData.bloodType, result.wuxing.counts)
    : null;

  return {
    name: formData.name,
    gender: formData.gender,
    bloodType: formData.bloodType || null,
    bloodTypeData,
    ...result
  };
}
