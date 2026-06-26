// engine/symbol/index.ts
// V6 Symbol Engine — 统一入口

import { RawSignals, SymbolInterpretation } from './core/types';
import { aggregateSymbolState } from './core/symbolState';
import { generateIdentity, generateMirror } from './core/identityGenerator';
import { interpretBody } from './interpreters/bodyInterpreter';
import { interpretRootCause } from './interpreters/narrativeInterpreter';
import { composeActions, composeSymbolCard } from './recombinators/actionComposer';

/**
 * 完整运行符号引擎
 * 输入: RawSignals → 输出: SymbolInterpretation
 */
export function runSymbolEngine(signals: RawSignals): SymbolInterpretation {
  const state = aggregateSymbolState(signals);
  const identity = generateIdentity(state);
  const mirror = generateMirror(state, identity);
  const bodyState = interpretBody(state);
  const rootCause = interpretRootCause(state);
  const actionSet = composeActions(state);
  const cardData = composeSymbolCard(state, identity);

  const recommendations = [
    ...actionSet.daily,
    ...actionSet.environment.slice(0, 2),
    ...actionSet.recovery.slice(0, 3),
  ];

  const symbolism = [
    `五行: ${state.fiveElement}`,
    `中医: ${state.tcmPattern}`,
    `压力系统: ${state.stressSystem}`,
    `色彩: ${cardData[2]}`,
    `方向: ${cardData[3]}`,
    `季节: ${cardData[4]}`,
    `情绪: ${cardData[5]}`,
    state.zodiac ? `星座: ${state.zodiac}` : null,
    state.bloodType ? `血型: ${state.bloodType}` : null,
  ].filter(Boolean) as string[];

  return {
    identity,
    mirror,
    bodyState,
    rootCause,
    recommendations,
    symbolism,
  };
}

// 子模块导出（供高级使用）
export { aggregateSymbolState } from './core/symbolState';
export { generateIdentity, generateMirror } from './core/identityGenerator';
export { interpretBody } from './interpreters/bodyInterpreter';
export { interpretRootCause } from './interpreters/narrativeInterpreter';
export { composeActions, composeSymbolCard } from './recombinators/actionComposer';
export { getElementProfile, elementRelationship } from './mappers/fiveElements';
export { getTcmProfile } from './mappers/tcmMapper';
export * from './core/types';
