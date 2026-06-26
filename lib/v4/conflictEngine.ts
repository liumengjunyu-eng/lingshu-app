// lib/v4/conflictEngine.ts

import { CognitiveState } from './types';

export interface ConflictSignal {
 intensity: number; // 0-100
 type: 'internal' | 'systemic' | 'behavioral' | 'unknown';
 description: string;
 uncertainty: number; // 0-100, 越高越不确定
}

/**
 * 冲突检测引擎
 * 让系统"不是总是确定的"
 * 关键：系统对自身解释保留不确定性 → 增强信任
 */
export function detectConflict(state: CognitiveState): ConflictSignal {
 const { physicalLoad, emotionalCompression, cognitiveNoise, recoveryLatency, behavioralDrift } = state;

 // 内部冲突：高认知噪声 + 高恢复延迟
 if (cognitiveNoise > 70 && recoveryLatency > 60) {
 return {
 intensity: 85,
 type: 'internal',
 uncertainty: 40,
 description: 'Cognitive overload conflicting with recovery system',
 };
 }

 // 情绪冲突
 if (emotionalCompression > 70 && behavioralDrift > 60) {
 return {
 intensity: 80,
 type: 'systemic',
 uncertainty: 35,
 description: 'Emotional compression causing behavioral instability',
 };
 }

 // 身体冲突
 if (physicalLoad > 75 && recoveryLatency < 40) {
 return {
 intensity: 78,
 type: 'behavioral',
 uncertainty: 30,
 description: 'Physical exhaustion without recovery alignment',
 };
 }

 // 模糊状态（关键）
 const avg =
 (physicalLoad + emotionalCompression + cognitiveNoise + recoveryLatency + behavioralDrift) / 5;

 if (avg < 40) {
 return {
 intensity: 20,
 type: 'unknown',
 uncertainty: 70,
 description: 'Low signal environment — system ambiguity high',
 };
 }

 return {
 intensity: 50,
 type: 'unknown',
 uncertainty: 50,
 description: 'Mixed system signals — no dominant pattern',
 };
}

/**
 * 获取不确定性提示文案
 */
export function getConflictNarrative(conflict: ConflictSignal): string {
 if (conflict.uncertainty > 50) {
 return 'This pattern is suggestive, not diagnostic. Your system may not fit a single framework.';
 }
 if (conflict.intensity > 80) {
 return 'The conflict pattern is strong — but the root may shift over time.';
 }
 return 'Multiple system signals detected. The primary pattern is visible, but secondary signals suggest complexity.';
}
