// lib/v4/types.ts

// ============================================================
// 1. 认知状态
// ============================================================

export interface CognitiveState {
 physicalLoad: number; // 0-100
 emotionalCompression: number; // 0-100
 cognitiveNoise: number; // 0-100
 recoveryLatency: number; // 0-100
 behavioralDrift: number; // 0-100
}

// ============================================================
// 2. 五行状态（扩展）
// ============================================================

export interface FiveElementsState {
 wood: number; // 肝/决策
 fire: number; // 心/情绪
 earth: number; // 脾/稳定
 metal: number; // 肺/边界
 water: number; // 肾/恢复
}

// ============================================================
// 3. 系统融合输出
// ============================================================

export type DominantSystem = 'physical' | 'emotional' | 'cognitive' | 'behavioral' | 'balanced';

export interface SystemFusion {
 dominantSystem: DominantSystem;
 imbalanceVector: string[];
 rootCauseLayer: string;
 conflictDescription: string;
 fiveElements: FiveElementsState;
 elementDescription: string;
}

// ============================================================
// 4. 分层报告
// ============================================================

export interface LayeredReport {
 score: number;
 primary: {
 label: string;
 description: string;
 color: string;
 };
 secondary: {
 label: string;
 value: string;
 }[];
 tertiary: {
 label: string;
 value: string;
 }[];
 conflict: string;
 trustAnchor: string;
}

// ============================================================
// 5. 用户画像
// ============================================================

export interface UserProfile {
 id: string;
 baselineState: CognitiveState;
 history: CognitiveState[];
 evolutionTrend: 'improving' | 'declining' | 'volatile' | 'stable';
 lastUpdated: number;
 sessionCount: number;
}

// ============================================================
// 6. 诊断输入
// ============================================================

export interface DiagnosisInput {
 answers: number[];
 texts: string[];
 input: string;
}
