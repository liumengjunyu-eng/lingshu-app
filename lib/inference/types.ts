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

export type EmotionType =
  | 'exhausted'
  | 'uncomfortable'
  | 'no_motivation'
  | 'no_interest'
  | 'never_rested';

export const EMOTION_LABELS: Record<EmotionType, string> = {
  exhausted: '持续的疲惫感',
  uncomfortable: '说不清但就是不舒服',
  no_motivation: '对未来没动力',
  no_interest: '对任何事情都提不起兴趣',
  never_rested: '总想休息但一直没休息够',
};

export const EMOTION_MIRROR: Record<EmotionType, { insight: string; description: string; recoveryFocus: string }> = {
  exhausted: {
    insight: '你一直在用消耗的方式维持运行。',
    description: '这不是因为你不够好，而是因为你已经连续透支太久。身体在说：我不能再这样下去了。',
    recoveryFocus: '停止消耗，不是增加恢复。',
  },
  uncomfortable: {
    insight: '你说不清哪里不对，但你知道不对。',
    description: '这不是矫情，是你的系统在发送信号。信号模糊，但真实。',
    recoveryFocus: '允许自己不舒服，不需要理由。',
  },
  no_motivation: {
    insight: '你不是没有动力，你是动力已经用完了。',
    description: '你一直在用“应该”驱动自己，而不是“想要”。现在系统需要重新校准动机源。',
    recoveryFocus: '停止用“应该”驱动自己。',
  },
  no_interest: {
    insight: '你不是对什么都没兴趣，你是在保护剩余的能量。',
    description: '兴趣需要能量支持。当你能量不足时，系统会自动关闭所有非必要功能。这不是你的错。',
    recoveryFocus: '先恢复能量，兴趣会自己回来。',
  },
  never_rested: {
    insight: '你一直想休息，但一直没有真正休息过。',
    description: '你习惯了用“撑”代替休息。但撑得越久，恢复需要的时间越长。',
    recoveryFocus: '真正的休息，从停止“撑”开始。',
  },
};

export interface InferenceResult {
  bazi: BaziResult;
  zodiac: ZodiacResult;
  blood: BloodResult | null;
  tcm: TCMResult;
  yijing: YijingResult;
  combined: CombinedResult;
}
