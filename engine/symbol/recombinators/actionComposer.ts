// engine/symbol/recombinators/actionComposer.ts
// 行动建议重组 — 综合各类建议，打散重排

import { SymbolicState } from '../core/types';
import { getElementProfile } from '../mappers/fiveElements';
import { getTcmProfile } from '../mappers/tcmMapper';
import { generateRecommendations } from '../interpreters/narrativeInterpreter';

export interface ActionSet {
  daily: string[];
  environment: string[];
  dietary: string[];
  emotional: string[];
  recovery: string[];
}

export function composeActions(state: SymbolicState): ActionSet {
  const recs = generateRecommendations(state);
  const element = getElementProfile(state.fiveElement);
  const tcm = getTcmProfile(state.tcmPattern);

  return {
    daily: [
      element.inBalance,
      `Your key recovery keyword: ${element.recoveryKeyword}`,
    ],
    environment: [
      `Direction: ${element.direction}`,
      `Color: ${element.color}`,
      ...tcm.lifestyleAdvice.slice(0, 2),
    ],
    dietary: tcm.dietaryAdvice.slice(0, 3),
    emotional: [
      `Elemental emotion: ${element.emotion}`,
      'Name what you feel before trying to fix it.',
    ],
    recovery: recs,
  };
}

export function composeSymbolCard(state: SymbolicState, identity: { name: string; archetype: string }): string[] {
  const element = getElementProfile(state.fiveElement);

  return [
    identity.name,
    identity.archetype,
    element.color,
    element.direction,
    element.season,
    element.emotion,
  ];
}
