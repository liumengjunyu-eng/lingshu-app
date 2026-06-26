// lib/symbol/omega/index.ts
// Ω Omega Layer — 现实替代层

import { PerceptionOverrideEngine, type RawInput, type TransformedOutput } from './perception';
import { IdentityReconstructionEngine, type UserSnapshot, type ReconstructedIdentity } from './identity';
import { RealityProbabilityEngine, type IndividualState, type RealityAnalysis, type RealityProbabilities } from './reality';

export function createOmegaEngine() {
  return {
    perception: new PerceptionOverrideEngine(),
    identity: new IdentityReconstructionEngine(),
    reality: new RealityProbabilityEngine(),
  };
}

export { PerceptionOverrideEngine, IdentityReconstructionEngine, RealityProbabilityEngine };
export type {
  RawInput, TransformedOutput,
  UserSnapshot, ReconstructedIdentity,
  IndividualState, RealityAnalysis, RealityProbabilities,
};
