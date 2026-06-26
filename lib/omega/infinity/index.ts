// lib/omega/infinity/index.ts
// Ω∞ Infinite Reality Loop — 无限现实生成回路

import { OmegaInfiniteEngine, type InfiniteState, type InterpretationLayer } from './engine';
import { FeedbackMutationEngine, type MutationEvent } from './mutation';

export function createOmegaInfinityEngine() {
  return {
    loop: new OmegaInfiniteEngine(),
    mutation: new FeedbackMutationEngine(),
  };
}

export { OmegaInfiniteEngine, FeedbackMutationEngine };
export type { InfiniteState, InterpretationLayer, MutationEvent };
