// lib/conversation/engine.ts
// 关键字 → 认知维度映射引擎
// 用户以为在聊天。实际上是结构化数据采集。

import { ConversationRound, CognitiveInference, ConversationResult } from './types';

/**
 * 将用户文本映射到认知维度分数
 * 对每个维度，匹配关键词 → 累加权重 → 归一化到 0-100
 */
function textToDimensions(text: string, round: ConversationRound): Partial<CognitiveInference> {
  const lc = text.toLowerCase();
  const result: Partial<CognitiveInference> = {};

  // 按维度分组关键词
  for (const d of round.dimensions) {
    let score = 0;
    let hits = 0;

    for (const kw of d.keywords) {
      const kwLc = kw.toLowerCase();
      const regex = new RegExp(kwLc, 'gi');
      const matches = lc.match(regex);
      if (matches) {
        hits += matches.length;
      }
    }

    // 基础分：命中数映射到 0-80
    if (hits > 0) {
      score = Math.min(80, 20 + hits * 15);
    } else {
      // 没命中不代表没有这个维度的问题 — 给一个中等基准
      score = 35;
    }

    // 加权调整
    score = Math.round(score * d.weight);

    result[d.dimension] = Math.min(100, Math.max(0, score));
  }

  return result;
}

/**
 * 合并多轮结果到最终认知推断
 */
export function mergeResults(allResults: Partial<CognitiveInference>[]): CognitiveInference {
  const dimensions: (keyof CognitiveInference)[] = [
    'physicalLoad',
    'emotionalCompression',
    'cognitiveNoise',
    'recoveryLatency',
    'behavioralDrift',
  ];

  const merged: CognitiveInference = {
    physicalLoad: 0,
    emotionalCompression: 0,
    cognitiveNoise: 0,
    recoveryLatency: 0,
    behavioralDrift: 0,
  };

  for (const dim of dimensions) {
    let total = 0;
    let count = 0;
    for (const r of allResults) {
      if (r[dim] !== undefined) {
        total += r[dim];
        count++;
      }
    }
    merged[dim] = count > 0 ? Math.round(total / count) : 35;
  }

  return merged;
}

/**
 * 执行全对话映射
 */
export function runConversation(
  userAnswers: string[],
  rounds: ConversationRound[]
): ConversationResult {
  const roundResults: Partial<CognitiveInference>[] = [];

  for (let i = 0; i < userAnswers.length && i < rounds.length; i++) {
    if (!userAnswers[i]?.trim()) continue;
    const result = textToDimensions(userAnswers[i], rounds[i]);
    roundResults.push(result);
  }

  const cognitive = mergeResults(roundResults);

  return {
    answers: userAnswers,
    cognitive,
  };
}
