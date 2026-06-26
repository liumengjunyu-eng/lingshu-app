// lib/symbol/v7/index.ts
// V7 Synthetic Civilization — 合成文明统一入口
// 五大系统：Population / Culture / Rules / Memory / Reality

import { PopulationLayer, type Entity, type EntityType, type InteractionResult } from './population';
import { CultureEngine, type RawEvent, type Narrative, type CultureSnapshot } from './culture';
import { RuleEvolutionEngine, type CivilizationMetrics } from './rules';
import { MemoryLayer, type CivilizationalEvent, type CivilizationSummary } from './memory';
import { RealitySimulationEngine, type WorldState, type SimulationResult, type ProjectedState } from './reality';

export function createV7Civilization() {
  return {
    population: new PopulationLayer(),
    culture: new CultureEngine(),
    rules: new RuleEvolutionEngine(),
    memory: new MemoryLayer(),
    reality: new RealitySimulationEngine(),
  };
}

export { PopulationLayer, CultureEngine, RuleEvolutionEngine, MemoryLayer, RealitySimulationEngine };
export type {
  Entity, EntityType, InteractionResult,
  RawEvent, Narrative, CultureSnapshot,
  CivilizationMetrics,
  CivilizationalEvent, CivilizationSummary,
  WorldState, SimulationResult, ProjectedState,
};
