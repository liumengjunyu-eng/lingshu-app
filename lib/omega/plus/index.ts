// lib/omega/plus/index.ts
// Ω+ Meta Reality Layer — 多现实竞争与锁定系统

import { RealityForkEngine, type RealityVersion, type UserState } from './reality_fork';
import { AttentionEngine, type UserBehavior, type ScoredReality } from './attention_engine';
import { RealitySwitchEngine, type RealityLock, type SwitchHistoryEntry } from './switch_engine';

export function createOmegaPlusEngine() {
  return {
    fork: new RealityForkEngine(),
    attention: new AttentionEngine(),
    switcher: new RealitySwitchEngine(),
  };
}

export { RealityForkEngine, AttentionEngine, RealitySwitchEngine };
export type { RealityVersion, UserState, UserBehavior, ScoredReality, RealityLock, SwitchHistoryEntry };
