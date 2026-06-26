// lib/symbol/v6/index.ts
// V6 Synthetic Economy — 合成经济体统一入口
// 三大系统：Company Swarm / Market Physics / Capital Flow

import { CompanySwarm, CompanyNodeFactory, type CompanyNode } from './swarm';
import { MarketPhysicsEngine, type MarketState, type SimulationStepResult } from './physics';
import { CapitalFlowEngine, type CapitalAllocation, type PortfolioItem } from './capital';

export function createV6Economy(initialCompanies: number = 10, initialCapital: number = 100000) {
  const swarm = new CompanySwarm();
  swarm.spawn(initialCompanies);
  const physics = new MarketPhysicsEngine();
  const capital = new CapitalFlowEngine(initialCapital);

  return { swarm, physics, capital };
}

export { CompanySwarm, CompanyNodeFactory, MarketPhysicsEngine, CapitalFlowEngine };
export type { CompanyNode, MarketState, SimulationStepResult, CapitalAllocation, PortfolioItem };
