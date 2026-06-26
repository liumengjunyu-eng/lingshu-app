// lib/v4/systemFusion.ts

import { CognitiveState, SystemFusion, DominantSystem, FiveElementsState } from './types';

/**
 * 从认知状态映射到五行
 */
export function mapToFiveElements(state: CognitiveState): FiveElementsState {
 // 木（决策/生长）← 认知噪声反向 + 行为漂移
 const wood = Math.min(100, Math.max(0, 50 + (100 - state.cognitiveNoise) * 0.3 + (100 - state.behavioralDrift) * 0.2));

 // 火（情绪/动力）← 情绪压缩
 const fire = Math.min(100, Math.max(0, 50 + state.emotionalCompression * 0.4 + state.cognitiveNoise * 0.2));

 // 土（稳定/承载）← 恢复延迟反向 + 物理负载反向
 const earth = Math.min(100, Math.max(0, 50 + (100 - state.recoveryLatency) * 0.3 + (100 - state.physicalLoad) * 0.2));

 // 金（边界/收敛）← 行为漂移反向 + 认知噪声反向
 const metal = Math.min(100, Math.max(0, 50 + (100 - state.behavioralDrift) * 0.3 + (100 - state.cognitiveNoise) * 0.2));

 // 水（恢复/储备）← 恢复延迟反向
 const water = Math.min(100, Math.max(0, 50 + (100 - state.recoveryLatency) * 0.5));

 return { wood, fire, earth, metal, water };
}

/**
 * 获取五行主导描述
 */
export function describeElements(elements: FiveElementsState): string {
 const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
 const dominant = sorted[0][0];
 const weak = sorted[sorted.length - 1][0];

 const map: Record<string, { name: string; desc: string; weakDesc: string }> = {
 wood: { name: 'Wood', desc: '决策力与生发之气', weakDesc: '决策疲劳，难以启动新事物' },
 fire: { name: 'Fire', desc: '情绪表达与热情', weakDesc: '情绪压抑，失去热情' },
 earth: { name: 'Earth', desc: '稳定感与承载能力', weakDesc: '缺乏稳定感，容易焦虑' },
 metal: { name: 'Metal', desc: '边界感与自我控制', weakDesc: '边界模糊，容易受影响' },
 water: { name: 'Water', desc: '恢复力与深层能量', weakDesc: '恢复能力下降，持续疲劳' },
 };

 const d = map[dominant];
 const w = map[weak];
 return `${d?.name || 'Balanced'} dominant (${d?.desc || '平衡'}), ${w?.name || '—'} weak (${w?.weakDesc || '—'})`;
}

/**
 * 五系统融合引擎（核心）
 */
export function fuseSystems(state: CognitiveState): SystemFusion {
 const { physicalLoad, emotionalCompression, cognitiveNoise, recoveryLatency, behavioralDrift } = state;

 // 1. 找出主导系统
 const systems: Record<DominantSystem, number> = {
 physical: physicalLoad,
 emotional: emotionalCompression,
 cognitive: cognitiveNoise,
 behavioral: behavioralDrift,
 balanced: 50,
 };

 const sorted = Object.entries(systems).sort((a, b) => b[1] - a[1]);
 const dominant = sorted[0][0] as DominantSystem;

 // 2. 失衡向量
 const imbalance: string[] = [];
 if (cognitiveNoise > 65) imbalance.push('high cognitive noise');
 if (recoveryLatency > 65) imbalance.push('low recovery latency');
 if (emotionalCompression > 65) imbalance.push('emotional compression');
 if (physicalLoad > 65) imbalance.push('physical overload');
 if (behavioralDrift > 65) imbalance.push('behavioral drift');
 if (cognitiveNoise < 35 && recoveryLatency < 35 && emotionalCompression < 35) {
 imbalance.push('balanced systems');
 }

 // 3. 根因层
 let rootCause = '';
 if (cognitiveNoise > 65 && recoveryLatency < 40) {
 rootCause = 'decision fatigue + emotional suppression loop';
 } else if (physicalLoad > 65 && recoveryLatency < 40) {
 rootCause = 'physical depletion with delayed recovery';
 } else if (emotionalCompression > 65 && cognitiveNoise > 50) {
 rootCause = 'emotional compression driving cognitive noise';
 } else if (behavioralDrift > 65 && cognitiveNoise < 40) {
 rootCause = 'behavioral drift with preserved cognition';
 } else if (recoveryLatency > 65) {
 rootCause = 'recovery system is the primary bottleneck';
 } else {
 rootCause = 'system is in a balanced but fragile state';
 }

 // 4. 五行映射
 const fiveElements = mapToFiveElements(state);

 // 5. 冲突描述
 const conflictCount = imbalance.filter(i => i !== 'balanced systems').length;
 const conflictDescription =
 conflictCount === 0
 ? 'Your systems are currently in balance. Maintain this state with consistent recovery.'
 : conflictCount === 1
 ? `You have ${conflictCount} system under stress. Your system is still functional but needs attention.`
 : `You are running ${conflictCount} systems in conflict. You are not broken — you are misaligned.`;

 // 6. 元素描述
 const elementDescription = describeElements(fiveElements);

 return {
 dominantSystem: dominant,
 imbalanceVector: imbalance,
 rootCauseLayer: rootCause,
 conflictDescription,
 fiveElements,
 elementDescription,
 };
}
