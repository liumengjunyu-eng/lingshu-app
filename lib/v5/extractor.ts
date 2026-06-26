import { CognitiveState } from "@/lib/v4/types";

/**
 * V5.1 Extractor
 * 从用户对话文本中提取认知状态五维向量
 * 关键词匹配 → 加权累加 → 归一化到 0-100
 */

interface KeywordPattern {
  pattern: RegExp;
  dimension: keyof CognitiveState;
  weight: number;
}

const PATTERNS: KeywordPattern[] = [
  // Physical Load 体力消耗
  { pattern: /累|疲惫|没力气|burnout|exhausted|tired|fatigue|drained|no energy/i, dimension: 'physicalLoad', weight: 20 },
  { pattern: /身体|physical|body|muscle|pain|ache|sore/i, dimension: 'physicalLoad', weight: 15 },
  { pattern: /加班|工作|work|overwork|long hours/i, dimension: 'physicalLoad', weight: 10 },
  
  // Emotional Compression 情绪积压
  { pattern: /焦虑|害怕|担心|panic|anxious|worry|fear|scared|nervous/i, dimension: 'emotionalCompression', weight: 20 },
  { pattern: /压力|stress|pressure|overwhelmed|burden/i, dimension: 'emotionalCompression', weight: 18 },
  { pattern: /情绪|emotion|mood|feeling|sad|depressed|upset/i, dimension: 'emotionalCompression', weight: 15 },
  { pattern: /压抑|bottled up|holding back|can't express/i, dimension: 'emotionalCompression', weight: 25 },
  
  // Cognitive Noise 认知噪音
  { pattern: /纠结|想太多|停不下来|overthinking|racing thoughts|can't stop thinking/i, dimension: 'cognitiveNoise', weight: 20 },
  { pattern: /混乱|confused|scattered|distracted|can't focus|brain fog/i, dimension: 'cognitiveNoise', weight: 18 },
  { pattern: /决定|decision|choice|uncertain|don't know what to do/i, dimension: 'cognitiveNoise', weight: 15 },
  { pattern: /思绪|thoughts|mind|mental|thinking/i, dimension: 'cognitiveNoise', weight: 12 },
  
  // Recovery Latency 恢复延迟
  { pattern: /失眠|睡不着|多梦|insomnia|can't sleep|sleep|rest|recover/i, dimension: 'recoveryLatency', weight: 25 },
  { pattern: /休息|relax|unwind|recharge|weekend|vacation/i, dimension: 'recoveryLatency', weight: 15 },
  { pattern: /恢复|bounce back|get over|take time/i, dimension: 'recoveryLatency', weight: 18 },
  { pattern: /慢|slow|long time|never fully/i, dimension: 'recoveryLatency', weight: 12 },
  
  // Behavioral Drift 行为漂移
  { pattern: /拖延|不知道怎么办|没方向|procrastinate|putting off|avoiding/i, dimension: 'behavioralDrift', weight: 20 },
  { pattern: /迷失|lost|direction|purpose|meaning|stuck/i, dimension: 'behavioralDrift', weight: 18 },
  { pattern: /习惯|habit|routine|pattern|behavior|keep doing/i, dimension: 'behavioralDrift', weight: 12 },
  { pattern: /改变|change|want to|wish I could|if only/i, dimension: 'behavioralDrift', weight: 15 },
];

const BASELINE = 40; // 基线值

export function extractState(messages: string[]): CognitiveState {
  const text = messages.join(" ").toLowerCase();
  
  const state: CognitiveState = {
    physicalLoad: BASELINE,
    emotionalCompression: BASELINE,
    cognitiveNoise: BASELINE,
    recoveryLatency: BASELINE,
    behavioralDrift: BASELINE,
  };
  
  // 关键词匹配加权
  for (const { pattern, dimension, weight } of PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      // 多次出现累加，但递减
      const multiplier = Math.min(matches.length, 3);
      state[dimension] += weight * (1 + (multiplier - 1) * 0.5);
    }
  }
  
  // 归一化到 0-100
  return {
    physicalLoad: Math.min(100, Math.round(state.physicalLoad)),
    emotionalCompression: Math.min(100, Math.round(state.emotionalCompression)),
    cognitiveNoise: Math.min(100, Math.round(state.cognitiveNoise)),
    recoveryLatency: Math.min(100, Math.round(state.recoveryLatency)),
    behavioralDrift: Math.min(100, Math.round(state.behavioralDrift)),
  };
}

/**
 * 计算综合负载指数
 */
export function calculateSystemLoad(state: CognitiveState): number {
  const sum = state.physicalLoad + 
              state.emotionalCompression + 
              state.cognitiveNoise + 
              state.recoveryLatency + 
              state.behavioralDrift;
  return Math.round(sum / 5);
}

/**
 * 获取主导维度
 */
export function getDominantDimension(state: CognitiveState): keyof CognitiveState {
  const entries = Object.entries(state) as [keyof CognitiveState, number][];
  return entries.reduce((max, curr) => curr[1] > max[1] ? curr : max)[0];
}
