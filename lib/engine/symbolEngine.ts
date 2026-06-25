// lib/engine/symbolEngine.ts

// ============================================================
// 1. 核心类型定义
// ============================================================

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface SymbolState {
 element: Element;
 elementScores: Record<Element, number>;
 bodyType: string;
 emotionalPattern: string;
 astrology?: string;
 bloodType?: string;
 gender?: 'male' | 'female';
}

export interface TCMState {
 liver: 'overactive' | 'stagnant' | 'balanced';
 kidney: 'depleted' | 'stable' | 'overactive';
 spleen: 'weak' | 'balanced' | 'overactive';
 heart: 'overactive' | 'depleted' | 'balanced';
 lung: 'weak' | 'balanced' | 'overactive';
}

export interface LifeRecommendation {
 food: string[];
 colors: string[];
 environment: string[];
 relationship: string[];
 movement: string[];
 dailyRoutine: string[];
 spiritualPractice: string[];
}

// ============================================================
// 2. 五行计算核心
// ============================================================

export function calculateElements(
 fatigueLevel: number,
 stressLevel: number,
 sleepQuality: number,
 motivation: number,
 digestion: number,
 socialLoad: number
): Record<Element, number> {
 // 五行映射：木（动机/决策/肝）→ 火（动力/兴奋/心）→ 土（稳定/消化/脾）→ 金（边界/收敛/肺）→ 水（恢复/储备/肾）
 const wood = Math.min(95, Math.max(5, 50 + (motivation - 50) * 0.3 + (stressLevel - 50) * 0.2));
 const fire = Math.min(95, Math.max(5, 50 + (motivation - 50) * 0.4 + (sleepQuality - 50) * 0.1));
 const earth = Math.min(95, Math.max(5, 50 + (digestion - 50) * 0.3 + (stressLevel - 50) * 0.15));
 const metal = Math.min(95, Math.max(5, 50 - (socialLoad - 50) * 0.25 + (sleepQuality - 50) * 0.15));
 const water = Math.min(95, Math.max(5, 50 + (100 - fatigueLevel) * 0.3 - (stressLevel - 50) * 0.2));

 return { wood, fire, earth, metal, water };
}

export function getDominantElement(scores: Record<Element, number>): Element {
 const entries = Object.entries(scores) as [Element, number][];
 entries.sort((a, b) => b[1] - a[1]);
 return entries[0][0];
}

export function getWeakestElement(scores: Record<Element, number>): Element {
 const entries = Object.entries(scores) as [Element, number][];
 entries.sort((a, b) => a[1] - b[1]);
 return entries[0][0];
}

// ============================================================
// 3. 中医体质映射
// ============================================================

const TCM_MAP: Record<Element, {
 liver: 'overactive' | 'stagnant' | 'balanced';
 kidney: 'depleted' | 'stable' | 'overactive';
 spleen: 'weak' | 'balanced' | 'overactive';
 heart: 'overactive' | 'depleted' | 'balanced';
 lung: 'weak' | 'balanced' | 'overactive';
}> = {
 wood: {
 liver: 'overactive',
 kidney: 'depleted',
 spleen: 'weak',
 heart: 'balanced',
 lung: 'balanced',
 },
 fire: {
 liver: 'stagnant',
 kidney: 'depleted',
 spleen: 'balanced',
 heart: 'overactive',
 lung: 'weak',
 },
 earth: {
 liver: 'stagnant',
 kidney: 'stable',
 spleen: 'overactive',
 heart: 'depleted',
 lung: 'balanced',
 },
 metal: {
 liver: 'balanced',
 kidney: 'stable',
 spleen: 'balanced',
 heart: 'depleted',
 lung: 'overactive',
 },
 water: {
 liver: 'stagnant',
 kidney: 'overactive',
 spleen: 'weak',
 heart: 'depleted',
 lung: 'balanced',
 },
};

export function mapTCM(element: Element): TCMState {
 return TCM_MAP[element] || {
 liver: 'balanced',
 kidney: 'stable',
 spleen: 'balanced',
 heart: 'balanced',
 lung: 'balanced',
 };
}

// ============================================================
// 4. 情绪模式判断
// ============================================================

export function getEmotionalPattern(
 element: Element,
 fatigueLevel: number,
 stressLevel: number
): string {
 const patterns: Record<Element, Record<string, string>> = {
 wood: {
 high: 'Easily irritated, decision fatigue, can\'t relax',
 low: 'Lacking drive, avoiding decisions, self-doubt',
 },
 fire: {
 high: 'Over-excited, anxious, trouble falling asleep',
 low: 'Loss of passion, depleted motivation, feeling flat',
 },
 earth: {
 high: 'Overthinking, controlling, can\'t let go',
 low: 'Insecure, dependent, directionless',
 },
 metal: {
 high: 'Perfectionist, self-critical, defensive',
 low: 'Blurry boundaries, easily influenced, self-denial',
 },
 water: {
 high: 'Emotionally sensitive, over-empathic, easily affected',
 low: 'Emotionally numb, suppressed, disconnected',
 },
 };

 const isHigh = stressLevel > 65 || fatigueLevel > 70;
 const key = isHigh ? 'high' : 'low';
 return patterns[element]?.[key] || 'Need deeper assessment';
}

// ============================================================
// 5. 生活建议生成器
// ============================================================

export function generateLifeRecommendations(
 state: SymbolState,
 tcm: TCMState
): LifeRecommendation {
 const element = state.element;

 // 饮食建议
 const foodMap: Record<Element, string[]> = {
 wood: ['Leafy greens', 'Lemon', 'Celery', 'Spinach', 'Peppermint tea'],
 fire: ['Bitter melon', 'Mung beans', 'Lotus seed', 'Lily bulb', 'Chrysanthemum tea'],
 earth: ['Millet', 'Pumpkin', 'Chinese yam', 'Jujube', 'Ginger tea'],
 metal: ['White radish', 'Pear', 'White fungus', 'Lily bulb', 'Honey water'],
 water: ['Black beans', 'Black sesame', 'Seaweed', 'Wood ear mushroom', 'Warm water'],
 };

 // 颜色建议
 const colorMap: Record<Element, string[]> = {
 wood: ['Green', 'Teal', 'Deep blue'],
 fire: ['Red', 'Purple', 'Pink'],
 earth: ['Yellow', 'Brown', 'Beige'],
 metal: ['White', 'Gold', 'Gray'],
 water: ['Black', 'Deep blue', 'Navy'],
 };

 // 环境建议
 const envMap: Record<Element, string[]> = {
 wood: ['Add plants', 'Green decor in the east', 'Wood furniture', 'Keep ventilated'],
 fire: ['Reduce red decor', 'Keep space cool', 'Avoid harsh lighting', 'Use soft lights'],
 earth: ['Keep tidy', 'Use earth tones', 'Add stability', 'Reduce clutter'],
 metal: ['Add metal elements', 'Keep air flowing', 'Minimalist design', 'Reduce accumulation'],
 water: ['Add water elements', 'Use dark tones', 'Keep quiet', 'Add privacy'],
 };

 // 关系建议
 const relationshipMap: Record<Element, string[]> = {
 wood: ['Avoid controlling dynamics', 'Find people who understand your pace', 'Reduce draining social events'],
 fire: ['Watch for emotional overload', 'Find stable supporters', 'Reduce over-socializing'],
 earth: ['Learn to say no', 'Build healthy boundaries', 'Seek equal relationships'],
 metal: ['Loosen standards', 'Accept imperfection', 'Find people who accept the real you'],
 water: ['Maintain emotional connection', 'Avoid over-empathizing', 'Find people who can hold your emotions'],
 };

 // 运动建议
 const movementMap: Record<Element, string[]> = {
 wood: ['Morning walk', 'Tai Chi', 'Ba Duan Jin', 'Stretching'],
 fire: ['Brisk walking', 'Swimming', 'Dancing', 'Light cardio'],
 earth: ['Yoga', 'Strength training', 'Pilates', 'Hiking'],
 metal: ['Breathwork', 'Jogging', 'Stretching', 'Qigong'],
 water: ['Gentle swimming', 'Slow walking', 'Tai Chi', 'Sitting meditation'],
 };

 // 日常作息
 const routineMap: Record<Element, string[]> = {
 wood: ['Sleep by 11pm', 'Wake 6-7am', 'Morning meditation'],
 fire: ['Sleep by 10:30pm', 'Wake 6am', 'Short midday nap'],
 earth: ['Sleep by 10:30pm', 'Wake 6:30am', 'Regular meal times'],
 metal: ['Sleep by 10pm', 'Wake 6am', 'Breathwork practice'],
 water: ['Sleep by 10pm', 'Wake 7am', 'Evening meditation'],
 };

 // 灵性实践
 const spiritualMap: Record<Element, string[]> = {
 wood: ['Journaling', 'Expressive writing', 'Creative activities'],
 fire: ['Gratitude practice', 'Sharing', 'Passionate expression'],
 earth: ['Meditation', 'Mindfulness', 'Space organization'],
 metal: ['Breath meditation', 'Decluttering', 'Self-reflection'],
 water: ['Sitting in stillness', 'Dream journaling', 'Inner exploration'],
 };

 return {
 food: foodMap[element] || foodMap.earth,
 colors: colorMap[element] || colorMap.earth,
 environment: envMap[element] || envMap.earth,
 relationship: relationshipMap[element] || relationshipMap.earth,
 movement: movementMap[element] || movementMap.earth,
 dailyRoutine: routineMap[element] || routineMap.earth,
 spiritualPractice: spiritualMap[element] || spiritualMap.earth,
 };
}

// ============================================================
// 6. 统一 Symbol Engine 入口
// ============================================================

export interface SymbolEngineInput {
 fatigueLevel: number;
 stressLevel: number;
 sleepQuality: number;
 motivation: number;
 digestion: number;
 socialLoad: number;
 astrology?: string;
 bloodType?: string;
 gender?: 'male' | 'female';
}

export interface SymbolEngineOutput {
 element: Element;
 elementScores: Record<Element, number>;
 tcm: TCMState;
 emotionalPattern: string;
 recommendations: LifeRecommendation;
 dominantDescription: string;
 weakDescription: string;
}

export function runSymbolEngine(input: SymbolEngineInput): SymbolEngineOutput {
 // 1. 计算五行
 const elementScores = calculateElements(
 input.fatigueLevel,
 input.stressLevel,
 input.sleepQuality,
 input.motivation,
 input.digestion,
 input.socialLoad
 );

 const dominant = getDominantElement(elementScores);
 const weakest = getWeakestElement(elementScores);

 // 2. 中医映射
 const tcm = mapTCM(dominant);

 // 3. 情绪模式
 const emotionalPattern = getEmotionalPattern(
 dominant,
 input.fatigueLevel,
 input.stressLevel
 );

 // 4. 生成建议
 const recommendations = generateLifeRecommendations(
 { element: dominant, elementScores, bodyType: '', emotionalPattern, astrology: input.astrology, bloodType: input.bloodType, gender: input.gender },
 tcm
 );

 // 5. 描述
 const dominantDesc: Record<Element, string> = {
 wood: 'Wood dominates — you have strong growth energy, great at decision-making and execution. Watch for over-consumption of liver energy.',
 fire: 'Fire dominates — you radiate warmth and passion. Be mindful of heart-fire overactivity, learn to cool down and recover.',
 earth: 'Earth dominates — you are the core of stability and support. Avoid over-burdening yourself, learn to set boundaries.',
 metal: 'Metal dominates — you have clear boundaries and structure. Loosen your standards, accept imperfection.',
 water: 'Water dominates — you have deep perception and recovery ability. Avoid over-immersion, stay connected with the outside.',
 };

 const weakDesc: Record<Element, string> = {
 wood: 'Wood is low — decision fatigue, hesitation. Add green foods and morning movement.',
 fire: 'Fire is low — lacking drive, passion fading. Add warm colors and environments.',
 earth: 'Earth is low — unstable, anxious, directionless. Add routine and structured living.',
 metal: 'Metal is low — blurry boundaries, easily influenced. Add white foods and breathwork.',
 water: 'Water is low — recovery depleted, easy fatigue. Add dark foods and prioritize sleep.',
 };

 return {
 element: dominant,
 elementScores,
 tcm,
 emotionalPattern,
 recommendations,
 dominantDescription: dominantDesc[dominant],
 weakDescription: weakDesc[weakest],
 };
}
