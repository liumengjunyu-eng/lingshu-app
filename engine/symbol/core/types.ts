// engine/symbol/core/types.ts
// V6 Symbol Engine — 核心类型定义

// ============================================================
// 1. 输入层：用户原始信号
// ============================================================
export interface RawSignals {
  sleepQuality: number;   // 0-100
  fatigue: number;        // 0-100
  stress: number;         // 0-100
  digestion: number;      // 0-100
  anxiety: number;        // 0-100
  motivation: number;     // 0-100
  clarity: number;        // 0-100
  workLoad: number;       // 0-100
  socialLoad: number;     // 0-100
  exercise: number;       // 0-100
  zodiac?: string;
  bloodType?: string;
  chineseZodiac?: string;
  gender?: 'male' | 'female';
}

// ============================================================
// 2. 符号层：核心状态
// ============================================================
export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type TcmPattern =
  | 'qi_deficiency'
  | 'blood_stasis'
  | 'yin_deficiency'
  | 'yang_excess'
  | 'dampness'
  | 'balanced';

export type StressSystem = 'overdrive' | 'shutdown' | 'balanced';

export interface SymbolicState {
  fiveElement: FiveElement;
  tcmPattern: TcmPattern;
  stressSystem: StressSystem;
  zodiac?: string;
  bloodType?: string;
}

// ============================================================
// 3. 解释层：输出
// ============================================================
export interface SymbolInterpretation {
  identity: {
    name: string;
    archetype: string;
    shadow: string;
  };
  mirror: string;
  bodyState: string;
  rootCause: string;
  recommendations: string[];
  symbolism: string[];
}

// ============================================================
// 4. 用户画像（长期存储用）
// ============================================================
export interface UserSymbolProfile {
  sessionId: string;
  signals: RawSignals;
  state: SymbolicState;
  identity: SymbolInterpretation['identity'];
  createdAt: string;
}
