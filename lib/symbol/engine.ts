// lib/symbol/engine.ts

import { HumanInput, SymbolOutput } from './types';

export type { HumanInput };

// ============================================================
// 1. 五行计算
// ============================================================

function calculateFiveElements(input: HumanInput) {
 // 身体 → 五行映射
 const wood = 50
   + (input.emotion.motivation - 50) * 0.25
   + (input.body.nervousSystem - 50) * 0.15
   - (input.body.fatigue - 50) * 0.1;

 const fire = 50
   + (input.emotion.motivation - 50) * 0.3
   - (input.emotion.stress - 50) * 0.15
   + (input.body.circulation - 50) * 0.1;

 const earth = 50
   + (input.body.digestion - 50) * 0.2
   + (input.emotion.emotionalStability - 50) * 0.2
   - (input.behavior.socialLoad - 50) * 0.1;

 const metal = 50
   + (input.emotion.clarity - 50) * 0.2
   - (input.emotion.anxiety - 50) * 0.15
   - (input.behavior.screenTime - 50) * 0.1;

 const water = 50
   - (input.body.fatigue - 50) * 0.3
   + (input.body.sleepQuality - 50) * 0.25
   - (input.emotion.stress - 50) * 0.1;

 // 星座修正
 const zodiacModifiers: Record<string, Partial<Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', number>>> = {
   'Aries': { fire: 8, wood: 3 },
   'Taurus': { earth: 8, water: 2 },
   'Gemini': { metal: 5, fire: 5 },
   'Cancer': { water: 8, earth: 3 },
   'Leo': { fire: 10, wood: 2 },
   'Virgo': { earth: 7, metal: 5 },
   'Libra': { metal: 6, fire: 4 },
   'Scorpio': { water: 8, metal: 4 },
   'Sagittarius': { fire: 7, wood: 5 },
   'Capricorn': { earth: 8, water: 3 },
   'Aquarius': { metal: 6, fire: 4 },
   'Pisces': { water: 10, earth: 2 },
 };

 // Also support Chinese zodiac names
 const cnZodiac: Record<string, string> = {
   '白羊': 'Aries', '金牛': 'Taurus', '双子': 'Gemini', '巨蟹': 'Cancer',
   '狮子': 'Leo', '处女': 'Virgo', '天秤': 'Libra', '天蝎': 'Scorpio',
   '射手': 'Sagittarius', '摩羯': 'Capricorn', '水瓶': 'Aquarius', '双鱼': 'Pisces',
 };

 const rawZodiac = input.symbol.zodiac || '';
 const zodiacKey = cnZodiac[rawZodiac] || rawZodiac;
 const mod = zodiacModifiers[zodiacKey] || {};

 // 血型修正
 const bloodModifiers: Record<string, Partial<Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', number>>> = {
   'A': { wood: 3, earth: 2 },
   'B': { fire: 3, metal: 2 },
   'O': { fire: 4, water: 2 },
   'AB': { metal: 3, wood: 3 },
 };

 const blood = input.symbol.bloodType || '';
 const bloodMod = bloodModifiers[blood] || {};

 // 生肖修正
 const animalModifiers: Record<string, Partial<Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', number>>> = {
   'Rat': { water: 6, wood: 2 },
   'Ox': { earth: 6, water: 2 },
   'Tiger': { wood: 8, fire: 3 },
   'Rabbit': { wood: 6, water: 3 },
   'Dragon': { earth: 6, fire: 4 },
   'Snake': { fire: 8, metal: 3 },
   'Horse': { fire: 8, wood: 3 },
   'Goat': { earth: 6, water: 3 },
   'Monkey': { metal: 6, fire: 3 },
   'Rooster': { metal: 6, earth: 3 },
   'Dog': { earth: 6, fire: 3 },
   'Pig': { water: 8, earth: 2 },
 };

 // Chinese animal names
 const cnAnimal: Record<string, string> = {
   '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit',
   '龙': 'Dragon', '蛇': 'Snake', '马': 'Horse', '羊': 'Goat',
   '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig',
 };

 const rawAnimal = input.symbol.chineseZodiac || '';
 const animalKey = cnAnimal[rawAnimal] || rawAnimal;
 const animalMod = animalModifiers[animalKey] || {};

 // 应用修正
 const elements = { wood, fire, earth, metal, water };
 for (const [key, val] of Object.entries(mod)) {
   elements[key as keyof typeof elements] += val;
 }
 for (const [key, val] of Object.entries(bloodMod)) {
   elements[key as keyof typeof elements] += val;
 }
 for (const [key, val] of Object.entries(animalMod)) {
   elements[key as keyof typeof elements] += val;
 }

 // 归一化到 0-100
 for (const key of Object.keys(elements)) {
   elements[key as keyof typeof elements] = Math.max(0, Math.min(100, elements[key as keyof typeof elements]));
 }

 return elements;
}

// ============================================================
// 2. 身体诊断
// ============================================================

function diagnoseBody(input: HumanInput, elements: any): {
  tcmPattern: string;
  imbalances: string[];
  organState: {
    liver: 'excess' | 'deficient' | 'balanced';
    heart: 'excess' | 'deficient' | 'balanced';
    spleen: 'excess' | 'deficient' | 'balanced';
    lung: 'excess' | 'deficient' | 'balanced';
    kidney: 'excess' | 'deficient' | 'balanced';
  };
} {
 const imbalances: string[] = [];

 if (input.body.fatigue > 70) imbalances.push('fatigue_excess');
 if (input.body.sleepQuality < 40) imbalances.push('sleep_deficit');
 if (input.body.digestion < 40) imbalances.push('digestion_weak');
 if (input.body.nervousSystem > 70) imbalances.push('nervous_overload');
 if (elements.water < 30) imbalances.push('kidney_deficiency');
 if (elements.fire > 70) imbalances.push('heart_excess');

 let tcmPattern = 'balanced';
 if (elements.water < 30 && elements.fire > 60) tcmPattern = 'kidney_deficiency_with_heart_excess';
 else if (elements.wood > 70 && elements.earth < 30) tcmPattern = 'liver_excess_with_spleen_deficiency';
 else if (elements.earth > 70 && elements.metal < 30) tcmPattern = 'spleen_dampness';
 else if (elements.metal > 70 && elements.fire < 30) tcmPattern = 'lung_deficiency';
 else if (elements.water > 70 && elements.fire < 30) tcmPattern = 'kidney_deficiency_with_cold';

 return {
   tcmPattern,
   imbalances,
   organState: {
     liver: elements.wood > 60 ? 'excess' : elements.wood < 40 ? 'deficient' : 'balanced',
     heart: elements.fire > 60 ? 'excess' : elements.fire < 40 ? 'deficient' : 'balanced',
     spleen: elements.earth > 60 ? 'excess' : elements.earth < 40 ? 'deficient' : 'balanced',
     lung: elements.metal > 60 ? 'excess' : elements.metal < 40 ? 'deficient' : 'balanced',
     kidney: elements.water > 60 ? 'excess' : elements.water < 40 ? 'deficient' : 'balanced',
   },
 };
}

// ============================================================
// 3. 情绪画像
// ============================================================

function profileEmotion(input: HumanInput): {
  dominantEmotion: string;
  emotionalState: 'stable' | 'volatile' | 'depleted' | 'recovering';
  stressPattern: 'acute' | 'chronic' | 'suppressed';
} {
 const stressPattern: 'chronic' | 'acute' | 'suppressed' = input.emotion.stress > 70 ? 'chronic' : input.emotion.stress > 40 ? 'acute' : 'suppressed';

 const scores = {
   stress: input.emotion.stress,
   anxiety: input.emotion.anxiety,
   motivation: input.emotion.motivation,
   clarity: input.emotion.clarity,
   stability: input.emotion.emotionalStability,
 };

 const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5;

 let emotionalState: 'stable' | 'volatile' | 'depleted' | 'recovering' = 'stable';
 if (avg < 35) emotionalState = 'depleted';
 else if (scores.stress > 65 && scores.stability < 40) emotionalState = 'volatile';
 else if (scores.motivation > 50 && scores.clarity < 35) emotionalState = 'volatile';
 else if (avg > 65) emotionalState = 'recovering';

 return { dominantEmotion: 'neutral', emotionalState, stressPattern };
}

// ============================================================
// 4. 人格原型（中西融合）
// ============================================================

function generatePersona(elements: any, _input: HumanInput) {
 type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
 const dominant = (Object.entries(elements).sort((a: any, b: any) => (b[1] as number) - (a[1] as number))[0][0]) as ElementKey;

 const personas: Record<ElementKey, { primary: string; secondary: string[]; shadow: string; description: string }> = {
   wood: {
     primary: 'The Pioneer',
     secondary: ['Growth-Seeker', 'Decision-Maker'],
     shadow: 'Overwhelmed by responsibility',
     description: 'You are driven by growth and expansion. Your challenge is to balance ambition with recovery.',
   },
   fire: {
     primary: 'The Flame',
     secondary: ['Creator', 'Connector'],
     shadow: 'Burned out by your own intensity',
     description: 'You are passionate and magnetic. Your challenge is to sustain your fire without consuming yourself.',
   },
   earth: {
     primary: 'The Anchor',
     secondary: ['Stabilizer', 'Nurturer'],
     shadow: 'Overburdened by others\' needs',
     description: 'You are reliable and grounding. Your challenge is to protect your own energy while supporting others.',
   },
   metal: {
     primary: 'The Architect',
     secondary: ['Strategist', 'Perfectionist'],
     shadow: 'Frozen by your own standards',
     description: 'You are precise and structured. Your challenge is to create without being trapped by perfection.',
   },
   water: {
     primary: 'The Deep One',
     secondary: ['Intuitive', 'Restorer'],
     shadow: 'Drowned by your own depth',
     description: 'You are perceptive and restorative. Your challenge is to stay connected without being overwhelmed.',
   },
 };

 const base = personas[dominant] || personas.earth;
 return {
   primary: base.primary,
   secondary: base.secondary,
   shadow: base.shadow,
   description: base.description,
 };
}

// ============================================================
// 5. 行动建议
// ============================================================

function generateRecommendations(elements: any, diagnosis: any, _emotion: any) {
 const immediate: string[] = [];
 const weekly: string[] = [];
 const lifestyle: string[] = [];
 const environment: string[] = [];

 // 基于身体
 if (diagnosis.imbalances.includes('fatigue_excess')) {
   immediate.push('Go to bed 1 hour early tonight — no work, no screens.');
   weekly.push('Schedule 2 "zero-output" blocks this week (60 min each).');
   lifestyle.push('Reframe rest as an active practice, not a luxury.');
 }

 if (diagnosis.imbalances.includes('sleep_deficit')) {
   immediate.push('Turn off all screens 1 hour before bed tonight.');
   weekly.push('Be in bed by 11pm this week. Log your sleep quality each day.');
 }

 if (diagnosis.imbalances.includes('digestion_weak')) {
   immediate.push('Skip fried and raw foods today. Stick to warm, simple meals.');
   weekly.push('Eat at regular times. Stop at 70% full.');
 }

 // 基于五行
 if (elements.wood > 70) {
   environment.push('Add plants and natural light to your space.');
   weekly.push('Spend 15+ minutes outdoors every day.');
 }

 if (elements.fire > 70) {
   immediate.push('Reduce caffeine and stimulants today.');
   environment.push('Use soft, warm lighting. Reduce red decor.');
   weekly.push('Schedule 30 minutes of "no social interaction" daily.');
 }

 if (elements.metal > 70) {
   weekly.push('Practice "done" instead of "perfect" — ship one imperfect thing.');
   environment.push('Keep your space tidy. Reduce visual clutter.');
 }

 if (elements.water < 30) {
   immediate.push('Soak your feet or take a hot bath tonight.');
   weekly.push('Be asleep by 11pm every night this week.');
   lifestyle.push('Add 10 minutes of stillness or meditation daily.');
 }

 // 基于情绪
 if (diagnosis.imbalances.includes('nervous_overload')) {
   immediate.push('Stop all information intake for 30 minutes. Now.');
   weekly.push('Schedule one completely blank afternoon.');
 }

 return {
   immediate: immediate.slice(0, 3),
   weekly: weekly.slice(0, 3),
   lifestyle: lifestyle.slice(0, 3),
   environment: environment.slice(0, 3),
 };
}

// ============================================================
// 6. Hook 生成
// ============================================================

function generateHook(_elements: any, dominant: string) {
 const hooks: Record<string, string[]> = {
   wood: [
     'You keep moving. But you never arrive.',
     'You are not stuck. You are paused.',
     'Your drive is real. Your recovery is not.',
   ],
   fire: [
     'You are not burnt out. You are spread too thin.',
     'You have high output and low recovery.',
     'You light up rooms. But you run out of fuel.',
   ],
   earth: [
     'You carry others. But who carries you?',
     'You are stable but static.',
     'Your strength is your anchor. But also your cage.',
   ],
   metal: [
     'You are perfect. But perfect is exhausting.',
     'Your precision is your power. And your prison.',
     'You are not broken. You are too rigid.',
   ],
   water: [
     'You feel everything. That is your strength and your burden.',
     'You are not over-sensitive. You are deeply connected.',
     'Your depth is real. But it needs rest.',
   ],
 };

 const pool = hooks[dominant] || hooks.earth;
 const text = pool[Math.floor(Math.random() * pool.length)];

 return { text, type: 'recognition' as const };
}

// ============================================================
// 7. V5 增长系统注入
// ============================================================

import { generateSharePayload } from './v5/shareEngine';
import { buildIdentity } from './v5/identity';
import { computeGrowthLoop } from './v5/growthLoop';

// ============================================================
// 8. V6 自动增长系统注入
// ============================================================

import { generateContentStream } from './v6/contentEngine';
import { computeDistribution } from './v6/distribution';
import { computeFeedbackLoop } from './v6/feedbackLoop';

// ============================================================
// 9. 主入口
// ============================================================

export function runSymbolEngine(input: HumanInput): SymbolOutput {
 const fiveElements = calculateFiveElements(input);
 const dominant = Object.entries(fiveElements).sort((a: any, b: any) => (b[1] as number) - (a[1] as number))[0][0];
 const bodyDiagnosis = diagnoseBody(input, fiveElements);
 const emotionProfile = profileEmotion(input);
 const persona = generatePersona(fiveElements, input);
 const recommendations = generateRecommendations(fiveElements, bodyDiagnosis, emotionProfile);
 const hook = generateHook(fiveElements, dominant);

 const balanceScore = Math.round(
   (fiveElements as any).wood + (fiveElements as any).fire + (fiveElements as any).earth + (fiveElements as any).metal + (fiveElements as any).water - 250
 );

 // V4 基础输出
 const baseOutput = {
   fiveElements,
   bodyDiagnosis,
   emotionProfile,
   persona,
   recommendations,
   hook,
   meta: {
     dominantElement: dominant,
     balanceScore,
     timestamp: Date.now(),
   },
 };

 // V5 增长系统注入
 const share = generateSharePayload(baseOutput);
 const identity = buildIdentity(baseOutput);
 const growth = computeGrowthLoop(baseOutput);

 // V6 自动增长系统注入
 const content_stream = generateContentStream(baseOutput);
 const distribution = computeDistribution(baseOutput);
 const feedback_loop = computeFeedbackLoop();

 return {
   ...baseOutput,
   share,
   identity,
   growth,
   content_stream,
   distribution,
   feedback_loop,
 };
}
