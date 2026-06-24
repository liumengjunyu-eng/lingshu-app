// 简化版八字分析引擎（基于 intl-engine.js 逻辑）
// 用于 Next.js 项目

// 天干
export const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

// 地支
export const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 天干五行
export const WUXING_OF_STEM: Record<string, string> = {
  '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土',
  '己':'土','庚':'金','辛':'金','壬':'水','癸':'水'
};

// 地支五行
export const WUXING_OF_BRANCH: Record<string, string> = {
  '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火',
  '午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'
};

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

// 简化版八字计算（实际应该用 lunar-javascript 库）
// 这里先用随机生成做演示
export function calculateBaZi(birthYear: number, birthMonth: number, birthDay: number, birthHour: number): {
  year: string;
  month: string;
  day: string;
  hour: string;
} {
  // 简化：随机生成天干地支（实际应该根据农历计算）
  const randomStem = () => HEAVENLY_STEMS[Math.floor(Math.random() * 10)];
  const randomBranch = () => EARTHLY_BRANCHES[Math.floor(Math.random() * 12)];
  
  return {
    year: randomStem() + randomBranch(),
    month: randomStem() + randomBranch(),
    day: randomStem() + randomBranch(),
    hour: randomStem() + randomBranch()
  };
}

// 分析五行能量
export function analyzeWuxing(bazi: {
  year: string;
  month: string;
  day: string;
  hour: string;
}): {
  counts: Record<string, number>;
  percentages: Record<string, number>;
  strongest: string;
  weakest: string;
} {
  const counts: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  
  // 统计天干地支的五行
  Object.values(bazi).forEach(gz => {
    const stem = gz[0];
    const branch = gz[1];
    counts[WUXING_OF_STEM[stem]]++;
    counts[WUXING_OF_BRANCH[branch]]++;
  });
  
  // 计算百分比
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  Object.entries(counts).forEach(([wx, count]) => {
    percentages[wx] = Math.round(count / total * 100);
  });
  
  // 找最强和最弱
  let strongest = '木';
  let weakest = '木';
  let maxCount = 0;
  let minCount = Infinity;
  
  Object.entries(counts).forEach(([wx, count]) => {
    if (count > maxCount) {
      maxCount = count;
      strongest = wx;
    }
    if (count < minCount) {
      minCount = count;
      weakest = wx;
    }
  });
  
  return { counts, percentages, strongest, weakest };
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
  const bazi = calculateBaZi(formData.birthYear, formData.birthMonth, formData.birthDay, formData.birthHour);
  const wuxing = analyzeWuxing(bazi);
  
  return {
    name: formData.name,
    bazi,
    wuxing,
    // 简化：实际应该添加更多分析（十神、纳音、大运等）
  };
}
