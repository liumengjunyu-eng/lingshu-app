// lib/inference/types.ts

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  city?: string;
  gender?: 'male' | 'female';
}

export interface Wuxing {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BaziResult {
  fourPillars: string[];
  dayMaster: string;
  dayMasterWuxing: string;
  wuxing: Wuxing;
  wuxingPercentages: Record<string, number>;
  isWeak: boolean;
  recommendation: string[];
  shiShen: string[];
}

export interface ZodiacResult {
  name: string;
  element: string;
  quality: string;
  traits: string[];
  compatibility: string[];
  ruler: string;
}

export interface BloodResult {
  type: string;
  traits: string[];
  strength: string;
  weakness: string;
  wuxingAffinity: string;
  communication: string;
  workStyle: string;
  loveStyle: string;
}

export interface TCMResult {
  constitution: string;
  description: string;
  organs: string[];
  emotion: string;
  recommendation: string[];
  foodAdvice: string[];
}

export interface YijingResult {
  hexagramName: string;
  hexagramSymbol: string;
  interpretation: string;
  advice: string;
}

export interface CombinedResult {
  coreInsight: string;
  recoveryFocus: string[];
  dailyTask: {
    title: string;
    instruction: string;
    reasoning: string;
  };
}

export interface InferenceResult {
  bazi: BaziResult;
  zodiac: ZodiacResult;
  blood: BloodResult | null;
  tcm: TCMResult;
  yijing: YijingResult;
  combined: CombinedResult;
}
