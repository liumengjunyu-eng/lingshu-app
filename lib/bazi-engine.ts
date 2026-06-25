// BaZi Analysis Engine — powered by lunar-javascript
import { Lunar } from 'lunar-javascript';

// Element colors
export const WUXING_COLORS: Record<string, string> = {
  '木': '#4CAF50',
  '火': '#FF5722',
  '土': '#FFC107',
  '金': '#E0E0E0',
  '水': '#2196F3'
};

// Element names (English)
export const WUXING_NAMES: Record<string, string> = {
  '木': 'Wood',
  '火': 'Fire',
  '土': 'Earth',
  '金': 'Metal',
  '水': 'Water'
};

// Heavenly stem → element mapping
const WUXING_OF_STEM: Record<string, string> = {
  '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土',
  '己':'土','庚':'金','辛':'金','壬':'水','癸':'水'
};

// Earthly branch → element mapping
const WUXING_OF_BRANCH: Record<string, string> = {
  '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火',
  '午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'
};

// Hidden stems in each branch
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

// Heavenly stem yin/yang
const YINYANG: Record<string, string> = {
  '甲':'Yang','乙':'Yin','丙':'Yang','丁':'Yin','戊':'Yang',
  '己':'Yin','庚':'Yang','辛':'Yin','壬':'Yang','癸':'Yin'
};

const WUXING_CYCLE = ['木','火','土','金','水'];

// Element state by branch
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

// Analyze five elements
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

// Generate insights
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

// Core BaZi calculation
export function calculateBaZi(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  gender: string
) {
  // lunar-javascript uses solar calendar dates
  const lunar = Lunar.fromYmdHms(birthYear, birthMonth, birthDay, birthHour, 0, 0);

  // BaZi pillars
  const baziArr = lunar.getBaZi().map((p: any) => p.toString());
  const baziMap: Record<string, string> = {
    year: baziArr[0],
    month: baziArr[1],
    day: baziArr[2],
    hour: baziArr[3]
  };

  // Na Yin (element of each pillar)
  const l = lunar as any;
  const naYin = l.getYearNaYin() + ' ' + l.getMonthNaYin() + ' ' + l.getDayNaYin() + ' ' + l.getTimeNaYin();

  // Ten Gods (Shi Shen)
  const ec = (lunar.getEightChar() as any) || {};
  const shishen = {
    year: ec.getYearShiShenGan?.() || 'Indirect Wealth',
    month: ec.getMonthShiShenGan?.() || 'Direct Officer',
    day: 'Self',
    hour: ec.getTimeShiShenGan?.() || 'Eating God'
  };

  const zodiac = (lunar as any).getShengxiao() as string;
  const lunarDate = lunar.toString() as string;

  // Analyze five elements
  const wuxing = analyzeWuxing(baziArr);

  // Generate insights
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
// Blood Type Personality Analysis
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
    name: 'Type A',
    traits: ['Responsible', 'Sensitive', 'Cautious', 'Patient'],
    strength: 'Detail-oriented, dependable, great planner',
    weakness: 'Prone to anxiety, overthinking, high self-pressure',
    fiveElement: '木',
    healthTendency: 'Liver energy may stagnate — release emotions regularly',
    communication: 'Tactful and reserved, indirect with emotions',
    workStyle: 'Methodical, perfectionist, thrives in structured work',
    loveStyle: 'Slow to warm but deeply loyal, values commitment',
  },
  'B': {
    name: 'Type B',
    traits: ['Optimistic', 'Free-spirited', 'Creative', 'Infectious energy'],
    strength: 'Adaptable, innovative, natural social connector',
    weakness: 'Impatient, unstructured, loses interest quickly',
    fiveElement: '火',
    healthTendency: 'Heart fire may flare — watch emotional volatility',
    communication: 'Direct and passionate, expressive communicator',
    workStyle: 'Flexible, thrives in creative environments',
    loveStyle: 'Warm and proactive, seeks novelty and excitement',
  },
  'O': {
    name: 'Type O',
    traits: ['Confident', 'Goal-driven', 'Decisive', 'Natural leader'],
    strength: 'Strong decision-maker, resilient, excellent executor',
    weakness: 'Stubborn, may overlook others\' feelings, self-focused',
    fiveElement: '金',
    healthTendency: 'Lungs and large intestine sensitive — watch respiratory health',
    communication: 'Straightforward, no-nonsense communicator',
    workStyle: 'Clear goals, effective manager, suited for leadership',
    loveStyle: 'Initiates actively, values mutual growth in relationships',
  },
  'AB': {
    name: 'Type AB',
    traits: ['Rational', 'Unique thinker', 'Insightful', 'Adaptable'],
    strength: 'Flexible mind, analytical, broad perspective',
    weakness: 'Sometimes indecisive, emotionally distant, hesitant',
    fiveElement: '水+金',
    healthTendency: 'Nervous system sensitive — prioritize sleep quality',
    communication: 'Analytical communicator, emotional expression is subtle',
    workStyle: 'Strategic thinker, excels in coordination roles',
    loveStyle: 'Rational and emotional intertwined, needs understanding and space',
  },
};

/**
 * Get blood type analysis
 * @param bloodType Blood type (A/B/O/AB)
 * @param wuXingCount Element distribution for combined analysis
 * @returns Complete blood type analysis
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
      bloodType: 'Unknown',
      traits: ['Insufficient data', 'Cannot analyze'],
      strength: 'Add your blood type for a complete analysis',
      weakness: 'Add your blood type for a complete analysis',
      fiveElement: '—',
      healthTendency: '—',
      communication: '—',
      workStyle: '—',
      loveStyle: '—',
      combinedAdvice: 'Consider adding your blood type in your profile for a more complete reading.',
    };
  }

  // Blood type element vs user's dominant element analysis
  const bloodWx = data.fiveElement;
  const userWx = Object.entries(wuXingCount).sort((a, b) => b[1] - a[1])[0][0];

  let combinedAdvice = '';
  if (bloodWx === userWx) {
    combinedAdvice = `Your blood type (${data.name}) aligns with your dominant element (${WUXING_NAMES[userWx] || userWx}). This means smooth energy flow — but watch for over-amplification of this element's traits. Consider balancing practices for ${WUXING_NAMES[userWx] || userWx}.`;
  } else if (bloodWx.includes('+')) {
    combinedAdvice = `Your blood type (${data.name}) has a composite element (${bloodWx}). Combined with your dominant element (${WUXING_NAMES[userWx] || userWx}), you have versatile energy. Lean into your multi-dimensional nature.`;
  } else {
    combinedAdvice = `Your blood type (${data.name}) corresponds to the element "${WUXING_NAMES[bloodWx] || bloodWx}", complementing your dominant element "${WUXING_NAMES[userWx] || userWx}". This gives you both ${WUXING_NAMES[userWx] || userWx}'s drive and the nuanced perception of ${WUXING_NAMES[bloodWx] || bloodWx}. Use both in your decision-making.`;
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

// Generate report data
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

  // Blood type analysis
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
