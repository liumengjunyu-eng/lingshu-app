// lib/omega/plusplus/rewrite.ts
// Future Rewrite Engine — 未来重写系统
// Ω++: 用户选择一条路径后，未来轨迹被重写

import type { FuturePath } from './path_gen';
import type { PathSelection } from './selection';

export interface RewrittenState {
  newTrajectory: string;
  updatedState: Record<string, any>;
  decayWarnings: string[];
  reinforcementSteps: string[];
  rewriteCycle: number;
}

export interface RewriteHistoryEntry {
  at: number;
  pathId: string;
  pathName: string;
  cycle: number;
}

export class FutureRewriteEngine {
  private rewriteCount = 0;
  private history: RewriteHistoryEntry[] = [];

  /** 用户选择路径后，重写未来轨迹 */
  rewrite(selection: PathSelection, currentState: Record<string, any>): RewrittenState {
    this.rewriteCount++;

    const path = selection.selectedPath;
    const decayPaths = selection.alternativePaths;

    const entry: RewriteHistoryEntry = {
      at: Date.now(),
      pathId: path.id,
      pathName: path.name,
      cycle: this.rewriteCount,
    };
    this.history.push(entry);

    return {
      newTrajectory: path.outcome,
      updatedState: {
        ...currentState,
        futureBias: path.id,
        rewriteCycle: this.rewriteCount,
        lockedAt: selection.lockedAt,
        commitmentLevel: this.getCommitmentLevel(),
      },
      decayWarnings: decayPaths.map(
        (alt) => `Path ${alt.name} (${(alt.probability * 100).toFixed(0)}%) will decay if not reinforced within ${this.getDecayWindow(this.rewriteCount)} days.`
      ),
      reinforcementSteps: [
        'Review your selected path daily for the first 5 days',
        'Journal alignment between current behavior and chosen trajectory',
        'Reinforce with micro-actions that match your path',
        'Alternative paths remain available but require conscious re-selection',
      ],
      rewriteCycle: this.rewriteCount,
    };
  }

  /** 检查路径是否需要重新确认 */
  checkPathHealth(selection: PathSelection): {
    healthy: boolean;
    maintenanceNeeded: boolean;
    decayRisk: number;
  } {
    const elapsedMinutes = (Date.now() - selection.lockedAt) / 60000;
    const decayRisk = Math.min(0.95, elapsedMinutes / 60 * 0.1);
    return {
      healthy: decayRisk < 0.3,
      maintenanceNeeded: decayRisk > 0.5,
      decayRisk: Math.round(decayRisk * 100) / 100,
    };
  }

  /** 获取路径锁定后的承诺水平 */
  private getCommitmentLevel(): 'initial' | 'deepening' | 'consolidated' {
    if (this.rewriteCount <= 1) return 'initial';
    if (this.rewriteCount <= 3) return 'deepening';
    return 'consolidated';
  }

  /** 未强化路径的衰退时间窗口 */
  private getDecayWindow(rewriteCount: number): number {
    return Math.max(3, 14 - rewriteCount * 2);
  }

  /** 获取重写次数 */
  getRewriteCount(): number {
    return this.rewriteCount;
  }

  /** 获取重写历史 */
  getHistory(): RewriteHistoryEntry[] {
    return [...this.history];
  }

  /** 重置 */
  reset(): void {
    this.rewriteCount = 0;
    this.history = [];
  }
}
