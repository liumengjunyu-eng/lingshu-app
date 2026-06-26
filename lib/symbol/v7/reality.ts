// lib/symbol/v7/reality.ts
// Reality Simulation Engine — 现实模拟系统
// V7 终极系统：预测"世界会怎么变"——崩溃概率、涌现概率、下一状态

export interface WorldState {
  state: number;         // 0-1 system health
  instability: number;   // 0-1
  complexity: number;    // 0-1
  diversity: number;     // 0-1
  energy: number;        // 0-1 available resource
}

export interface ProjectedState {
  nextState: number;
  trajectory: 'growth' | 'decline' | 'oscillation' | 'collapse';
}

export interface SimulationResult {
  projectedState: ProjectedState;
  collapseProbability: number;
  emergenceProbability: number;
  recommendation: string;
}

export class RealitySimulationEngine {
  simulate(world: WorldState): SimulationResult {
    const projection = this.project(world);
    const collapseProb = this.collapseRisk(world);
    const emergeProb = this.emergence(world);

    return {
      projectedState: projection,
      collapseProbability: Math.round(collapseProb * 100) / 100,
      emergenceProbability: Math.round(emergeProb * 100) / 100,
      recommendation: this.generateRecommendation(projection, collapseProb, emergeProb),
    };
  }

  project(world: WorldState): ProjectedState {
    const noise = (Math.random() - 0.5) * 0.1;
    const next = world.state * (1 + noise);

    let trajectory: ProjectedState['trajectory'];
    if (next > world.state * 1.02) {
      trajectory = 'growth';
    } else if (next < world.state * 0.98) {
      if (world.instability > 0.6) trajectory = 'collapse';
      else trajectory = 'decline';
    } else {
      trajectory = 'oscillation';
    }

    return {
      nextState: Math.round(Math.max(0, Math.min(1, next)) * 100) / 100,
      trajectory,
    };
  }

  collapseRisk(world: WorldState): number {
    let risk = 0.3;
    if (world.instability > 0.7) risk += 0.4;
    if (world.complexity > 0.8 && world.energy < 0.3) risk += 0.2;
    if (world.diversity < 0.2) risk += 0.15;
    if (world.state < 0.3) risk += 0.2;
    return Math.min(risk, 0.95);
  }

  emergence(world: WorldState): number {
    let prob = 0.2;
    if (world.complexity > 0.6) prob += 0.3;
    if (world.diversity > 0.7) prob += 0.2;
    if (world.energy > 0.6) prob += 0.15;
    if (world.state > 0.7 && world.instability < 0.3) prob -= 0.1;
    return Math.max(0.05, Math.min(prob, 0.9));
  }

  generateRecommendation(projection: ProjectedState, collapseProb: number, emergeProb: number): string {
    if (collapseProb > 0.6) {
      return 'CRISIS MODE: Reduce complexity. Consolidate resources. Prepare for systemic reset.';
    }
    if (emergeProb > 0.6) {
      return 'EMERGENCE DETECTED: Increase diversity tolerance. Amplify novel patterns. New structure forming.';
    }
    if (projection.trajectory === 'growth') {
      return 'EXPANSION PHASE: Scale existing structures. Invest in complexity.';
    }
    if (projection.trajectory === 'decline') {
      return 'CONTRACTION PHASE: Reduce surface area. Focus on core stability.';
    }
    return 'OSCILLATION: Maintain current state. Prepare for directional change.';
  }

  scenarioAnalysis(world: WorldState): {
    optimistic: SimulationResult;
    pessimistic: SimulationResult;
    neutral: SimulationResult;
  } {
    const optW: WorldState = { ...world, state: Math.min(1, world.state * 1.3), instability: Math.max(0, world.instability - 0.2) };
    const pesW: WorldState = { ...world, state: Math.max(0, world.state * 0.7), instability: Math.min(1, world.instability + 0.3) };

    return {
      optimistic: this.simulate(optW),
      pessimistic: this.simulate(pesW),
      neutral: this.simulate(world),
    };
  }

  isGreatFilterEvent(world: WorldState): { active: boolean; severity: number; filter: string } {
    const severity = (world.instability * 0.4 + (1 - world.energy) * 0.3 + (1 - world.diversity) * 0.3);
    if (severity > 0.6) {
      return {
        active: true,
        severity: Math.round(severity * 100) / 100,
        filter: world.energy < 0.3 ? 'Resource Exhaustion' : world.diversity < 0.2 ? 'Cultural Collapse' : 'Complexity Trap',
      };
    }
    return { active: false, severity: 0, filter: 'none' };
  }
}
