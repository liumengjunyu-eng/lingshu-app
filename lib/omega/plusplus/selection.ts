// lib/omega/plusplus/selection.ts
// User Selection Engine — 用户选择引擎
// Ω++: 用户从多条未来路径中选择一条锁定

import type { FuturePath } from './path_gen';

export interface PathSelection {
  selectedPath: FuturePath;
  locked: boolean;
  lockedAt: number;
  message: string;
  alternativePaths: FuturePath[];
}

export interface SelectionHistoryEntry {
  selectedId: string;
  previousId: string | null;
  at: number;
  confidence: number;
}

export class UserSelectionEngine {
  private history: SelectionHistoryEntry[] = [];
  private currentSelection: PathSelection | null = null;
  private readonly MAX_REWRITES = 10;

  /** 用户选择一条路径锁定 */
  select(paths: FuturePath[], userChoice: string): PathSelection {
    const selected = paths.find((p) => p.id === userChoice) || paths[0];
    const alternatives = paths.filter((p) => p.id !== userChoice);

    // Record history
    this.history.push({
      selectedId: selected.id,
      previousId: this.currentSelection?.selectedPath.id || null,
      at: Date.now(),
      confidence: selected.probability,
    });

    this.currentSelection = {
      selectedPath: selected,
      locked: true,
      lockedAt: Date.now(),
      message: `Reality path locked based on user selection. Alternative paths will decay if not reinforced.`,
      alternativePaths: alternatives,
    };

    return this.currentSelection;
  }

  /** 重新选择（改变路径） */
  reselect(paths: FuturePath[], newChoice: string): PathSelection {
    const rewrites = this.history.length;
    if (rewrites >= this.MAX_REWRITES) {
      return {
        selectedPath: this.currentSelection!.selectedPath,
        locked: true,
        lockedAt: this.currentSelection!.lockedAt,
        message: 'Maximum reality rewrites reached. Current path is permanently locked.',
        alternativePaths: [],
      };
    }

    return this.select(paths, newChoice);
  }

  /** 获取当前选择 */
  getCurrentSelection(): PathSelection | null {
    return this.currentSelection;
  }

  /** 路径锁定强度 — 用户切换次数越少越强 */
  getLockStrength(): { strength: number; label: string } {
    const rewrites = this.history.length;
    if (rewrites === 0) return { strength: 0, label: 'No path selected' };
    if (rewrites <= 1) return { strength: 0.3, label: 'Initial commitment—fragile' };
    if (rewrites <= 3) return { strength: 0.6, label: 'Exploring alternatives—moderate commitment' };
    return { strength: 0.9, label: 'Deep commitment—path is structurally reinforced' };
  }

  /** 获取选择历史 */
  getHistory(): SelectionHistoryEntry[] {
    return [...this.history];
  }

  /** 重置选择 */
  reset(): void {
    this.history = [];
    this.currentSelection = null;
  }
}
