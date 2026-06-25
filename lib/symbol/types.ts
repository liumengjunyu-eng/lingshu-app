// lib/symbol/types.ts

// ============================================================
// 1. 输入层
// ============================================================

export interface HumanInput {
 // 身体状态（0-100）
 body: {
 fatigue: number; // 疲劳程度
 sleepQuality: number; // 睡眠质量
 digestion: number; // 消化状态
 nervousSystem: number; // 神经系统紧张度
 circulation: number; // 循环状态
 };

 // 情绪状态（0-100）
 emotion: {
 stress: number; // 压力
 anxiety: number; // 焦虑
 motivation: number; // 动力
 clarity: number; // 思维清晰度
 emotionalStability: number; // 情绪稳定性
 };

 // 行为数据（0-100）
 behavior: {
 workLoad: number; // 工作负荷
 socialLoad: number; // 社交负荷
 exercise: number; // 运动量
 screenTime: number; // 屏幕时间
 };

 // 符号系统
 symbol: {
 zodiac?: string; // 星座
 bloodType?: string; // 血型
 chineseZodiac?: string; // 生肖
 gender?: 'male' | 'female';
 age?: number;
 };
}

// ============================================================
// 2. 输出层
// ============================================================

export interface SymbolOutput {
 // 五行结构
 fiveElements: {
 wood: number; // 肝/决策/生长
 fire: number; // 心/动力/热情
 earth: number; // 脾/稳定/承载
 metal: number; // 肺/边界/收敛
 water: number; // 肾/恢复/储备
 };

 // 身体诊断
 bodyDiagnosis: {
 tcmPattern: string; // 中医体质
 imbalances: string[]; // 失衡点
 organState: {
 liver: 'excess' | 'deficient' | 'balanced';
 heart: 'excess' | 'deficient' | 'balanced';
 spleen: 'excess' | 'deficient' | 'balanced';
 lung: 'excess' | 'deficient' | 'balanced';
 kidney: 'excess' | 'deficient' | 'balanced';
 };
 };

 // 情绪画像
 emotionProfile: {
 dominantEmotion: string;
 emotionalState: 'stable' | 'volatile' | 'depleted' | 'recovering';
 stressPattern: 'acute' | 'chronic' | 'suppressed';
 };

 // 人格原型（中西融合）
 persona: {
 primary: string; // 主原型
 secondary: string[]; // 副原型
 shadow: string; // 阴影面
 description: string;
 };

 // 行动建议
 recommendations: {
 immediate: string[]; // 立即行动
 weekly: string[]; // 本周调整
 lifestyle: string[]; // 长期习惯
 environment: string[]; // 环境调整
 };

 // 传播Hook
 hook: {
 text: string;
 type: 'recognition' | 'revelation' | 'identity';
 };

 // 元数据
 meta: {
 dominantElement: string;
 balanceScore: number; // -100 ~ +100
 timestamp: number;
 };
}
