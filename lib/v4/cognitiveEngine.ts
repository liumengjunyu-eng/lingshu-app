// lib/v4/cognitiveEngine.ts

import { CognitiveState } from './types';

/**
 * 从 5 个答案构建认知状态向量
 * answers: [body, energy, stress, recovery, focus]
 */
export function buildCognitiveState(answers: number[]): CognitiveState {
 // 确保有 5 个值，不足则补默认值
 const safe = [...answers, 50, 50, 50, 50, 50].slice(0, 5);

 return {
 physicalLoad: Math.min(100, Math.max(0, safe[0])),
 emotionalCompression: Math.min(100, Math.max(0, safe[2])),
 cognitiveNoise: Math.min(100, Math.max(0, safe[4])),
 recoveryLatency: Math.min(100, Math.max(0, safe[3])),
 behavioralDrift: Math.min(100, Math.max(0, (safe[1] + safe[4]) / 2)),
 };
}

/**
 * 计算系统负载指数（综合分数）
 */
export function calculateLoadIndex(state: CognitiveState): number {
 const weights = {
 physicalLoad: 0.25,
 emotionalCompression: 0.2,
 cognitiveNoise: 0.25,
 recoveryLatency: 0.15,
 behavioralDrift: 0.15,
 };

 const total =
 state.physicalLoad * weights.physicalLoad +
 state.emotionalCompression * weights.emotionalCompression +
 state.cognitiveNoise * weights.cognitiveNoise +
 state.recoveryLatency * weights.recoveryLatency +
 state.behavioralDrift * weights.behavioralDrift;

 return Math.round(Math.min(100, Math.max(0, total)));
}

/**
 * 获取认知状态描述
 */
export function describeCognitiveState(state: CognitiveState): string {
 const max = Math.max(
 state.physicalLoad,
 state.emotionalCompression,
 state.cognitiveNoise,
 state.recoveryLatency,
 state.behavioralDrift
 );

 if (state.cognitiveNoise > 70 && state.recoveryLatency < 40) {
 return 'Cognitive Overload with Recovery Deficit';
 }
 if (state.emotionalCompression > 70 && state.cognitiveNoise > 50) {
 return 'Emotional Compression driving Cognitive Noise';
 }
 if (state.physicalLoad > 70 && state.recoveryLatency < 40) {
 return 'Physical Depletion with Delayed Recovery';
 }
 if (state.behavioralDrift > 70) {
 return 'Behavioral Drift Pattern';
 }
 if (max < 35) {
 return 'Stable System State';
 }
 return 'Compensated System State';
}
