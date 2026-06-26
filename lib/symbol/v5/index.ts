// lib/symbol/v5/index.ts
// V5 Autonomous Business Entity — 自主商业体统一入口
// 四大核心系统：Revenue Brain / Market Simulation / Autonomous Marketing / Resource Allocation

import { RevenueBrain, type RevenueData, type PricingDecision, type PricingModel, type RevenueScenario } from './revenue';
import { MarketSimulationEngine, type ContentForSim, type SimulationResult } from './simulate';
import { AutonomousMarketingEngine, type Campaign, type ProductForAd } from './marketing';
import { ResourceAllocator, type BusinessMetrics, type AllocationResult } from './resource';

export function createV5Engine() {
  return {
    revenue: new RevenueBrain(),
    simulation: new MarketSimulationEngine(),
    marketing: new AutonomousMarketingEngine(),
    allocator: new ResourceAllocator(),
  };
}

export { RevenueBrain, MarketSimulationEngine, AutonomousMarketingEngine, ResourceAllocator };
export type {
  RevenueData, PricingDecision, PricingModel, RevenueScenario,
  ContentForSim, SimulationResult,
  Campaign, ProductForAd,
  BusinessMetrics, AllocationResult,
};
