// lib/omega/plusplus/index.ts
// Ω++ Reality Editor Layer — 现实编辑器统一入口

import { PathGenerationEngine, type FuturePath, type CurrentStateInput } from './path_gen';
import { UserSelectionEngine, type PathSelection, type SelectionHistoryEntry } from './selection';
import { FutureRewriteEngine, type RewrittenState, type RewriteHistoryEntry } from './rewrite';

export function createOmegaPlusPlusEngine() {
  return {
    pathGen: new PathGenerationEngine(),
    selection: new UserSelectionEngine(),
    rewrite: new FutureRewriteEngine(),
  };
}

export { PathGenerationEngine, UserSelectionEngine, FutureRewriteEngine };
export type {
  FuturePath, CurrentStateInput,
  PathSelection, SelectionHistoryEntry,
  RewrittenState, RewriteHistoryEntry,
};
