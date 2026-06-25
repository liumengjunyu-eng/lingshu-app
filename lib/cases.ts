// lib/cases.ts

export interface Case {
  id: string;
  title: string;
  category: 'health' | 'career' | 'relationship';
  emoji: string;
  user: string;
  problem: string;
  diagnosis: string;
  solution: string;
  result: string;
  data: string;
  duration: string;
}

export const CASES: Case[] = [
  // ========== 身体类案例（2个） ==========
  {
    id: 'case_001',
    title: '失眠3年，调理2个月改善',
    category: 'health',
    emoji: '😴',
    user: '匿名 · 35岁 · 女性',
    problem: '入睡困难，多梦，白天疲劳，依赖咖啡维持精力',
    diagnosis: '木弱火旺，肝胆失调，肝血不足',
    solution: '23:00前睡 + 太冲穴按摩 + 绿色饮食 + 减少咖啡',
    result: '入睡时间从2小时缩短到30分钟，深度睡眠增加',
    data: '入睡时间 ↓75% · 深度睡眠 ↑40%',
    duration: '2个月',
  },
  {
    id: 'case_002',
    title: '长期疲劳，1个月恢复精力',
    category: 'health',
    emoji: '⚡',
    user: '匿名 · 42岁 · 男性',
    problem: '白天嗜睡，注意力不集中，运动后恢复慢',
    diagnosis: '土弱水泛，脾肾两虚，湿气困阻',
    solution: '健脾祛湿饮食 + 八段锦「调理脾胃须单举」+ 足三里艾灸',
    result: '精力值从3分提升到8分，工作效率明显提高',
    data: '精力值 ↑167% · 注意力 ↑50%',
    duration: '1个月',
  },

  // ========== 人生类案例（2个） ==========
  {
    id: 'case_003',
    title: '创业迷茫，3个月找到方向',
    category: 'career',
    emoji: '🧭',
    user: '匿名 · 38岁 · 男性',
    problem: '创业3年遇到瓶颈，方向不清晰，团队士气低迷',
    diagnosis: '火旺金弱，决策冲动，缺乏长期战略',
    solution: '调整团队配置 + 确定核心产品 + 分阶段目标制定',
    result: '3个月内营收增长40%，团队从6人扩到12人',
    data: '营收 ↑40% · 团队效率 ↑35%',
    duration: '3个月',
  },
  {
    id: 'case_004',
    title: '换城市换工作，找到人生节奏',
    category: 'career',
    emoji: '🌆',
    user: '匿名 · 29岁 · 女性',
    problem: '一线城市压力大，职业倦怠，不知道要不要离开',
    diagnosis: '金水相生，适合南方城市，需要环境能量转换',
    solution: '从北京搬到杭州 + 从互联网转到内容行业',
    result: '收入持平但生活品质大幅提升，幸福感明显增加',
    data: '幸福感 ↑60% · 焦虑指数 ↓45%',
    duration: '4个月',
  },

  // ========== 情感类案例（2个） ==========
  {
    id: 'case_005',
    title: '夫妻沟通改善，关系回温',
    category: 'relationship',
    emoji: '💞',
    user: '匿名 · 41岁 · 女性',
    problem: '结婚8年，沟通减少，经常冷战，孩子教育理念不合',
    diagnosis: '木火相生但火过旺，双方五行需要调和',
    solution: '每周一次深度交流 + 共同做一件事 + 家庭空间调整',
    result: '从每月冷战3次到几乎不再冷战，孩子成绩也提升了',
    data: '冲突频率 ↓70% · 满意度 ↑55%',
    duration: '2个月',
  },
  {
    id: 'case_006',
    title: '走出情绪低谷，重建自信',
    category: 'relationship',
    emoji: '🌱',
    user: '匿名 · 27岁 · 男性',
    problem: '失恋后陷入自我否定，社交回避，工作状态低迷',
    diagnosis: '水旺木漂，情绪敏感，缺乏稳定支持系统',
    solution: '每天10分钟冥想 + 找到运动社群 + 制定个人成长计划',
    result: '3个月后主动社交，工作上获得晋升机会',
    data: '社交频率 ↑200% · 自我评价 ↑80%',
    duration: '3个月',
  },
];

/**
 * 按分类获取案例
 */
export function getCasesByCategory(category: Case['category']): Case[] {
  return CASES.filter(c => c.category === category);
}

/**
 * 获取所有案例（随机排序，用于首页展示）
 */
export function getRandomCases(count: number = 6): Case[] {
  const shuffled = [...CASES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 根据分类获取案例数量统计
 */
export function getCaseStats() {
  return {
    total: CASES.length,
    health: CASES.filter(c => c.category === 'health').length,
    career: CASES.filter(c => c.category === 'career').length,
    relationship: CASES.filter(c => c.category === 'relationship').length,
  };
}
