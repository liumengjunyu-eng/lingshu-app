// lib/omega/plus/switch_engine.ts
// Reality Switching Engine — 现实切换系统
// Ω+: 用户行为反向选择现实模型 → 动态切换当前解释层

import type { ScoredReality } from './attention_engine';

export interface RealityLock {
  id: string;
  name: string;
  label: string;
  interpretation: string;
  emotionalTone: string;
  lockedAt: number;
  lockReason: string;
  confidence: number;
  switchCount: number;
}

export interface SwitchHistoryEntry {
  from: string;
  to: string;
  at: number;
  trigger: string;
}

export class RealitySwitchEngine {
  private currentReality: ScoredReality | null = null;
  private history: SwitchHistoryEntry[] = [];
  private switchCount = 0;
  private lastSwitchAt = 0;
  private readonly MIN_SWITCH_INTERVAL_MS = 30000; // 30s min between switches

  /** 切换当前锁定现实 */
  switch(selected: ScoredReality, reason: string): RealityLock {
    const previous = this.currentReality;

    // Rate limiting
    const now = Date.now();
    if (previous && now - this.lastSwitchAt < this.MIN_SWITCH_INTERVAL_MS) {
      // Return current lock instead of switching too fast
      return this.getCurrentLock(previous);
    }

    // Record switch
    if (previous && previous.id !== selected.id) {
      this.history.push({
        from: previous.id,
        to: selected.id,
        at: now,
        trigger: reason,
      });
      this.switchCount++;
    }

    this.currentReality = selected;
    this.lastSwitchAt = now;

    return this.getCurrentLock(selected);
  }

  /** 获取当前锁定现实 */
  getCurrent(): ScoredReality | null {
    return this.currentReality;
  }

  /** 获取当前锁的完整状态 */
  getCurrentLock(reality?: ScoredReality): RealityLock {
    const r = reality || this.currentReality;
    if (!r) {
      return {
        id: 'none',
        name: 'No Reality Selected',
        label: 'System idle — no dominant interpretation',
        interpretation: 'Waiting for sufficient signal to construct a reality frame.',
        emotionalTone: 'neutral',
        lockedAt: Date.now(),
        lockReason: 'insufficient data',
        confidence: 0,
        switchCount: this.switchCount,
      };
    }
    return {
      id: r.id,
      name: r.name,
      label: r.label,
      interpretation: r.interpretation,
      emotionalTone: r.emotionalTone,
      lockedAt: Date.now(),
      lockReason: `Selected by attention competition: score ${(r.attentionScore * 100).toFixed(0)}%`,
      confidence: r.attentionScore,
      switchCount: this.switchCount,
    };
  }

  /** 检查是否需要切换到更优的现实 */
  evaluateSwitch(candidates: ScoredReality[]): { shouldSwitch: boolean; reason: string; winner?: ScoredReality } {
    const top = [...candidates].sort((a, b) => b.attentionScore - a.attentionScore)[0];
    const current = this.currentReality;

    if (!current) {
      return { shouldSwitch: true, reason: 'No active reality — locking to highest score.', winner: top };
    }

    if (top.id === current.id) {
      return { shouldSwitch: false, reason: 'Current reality remains dominant.' };
    }

    const gap = top.attentionScore - current.attentionScore;
    if (gap > 0.15) {
      return { shouldSwitch: true, reason: `${top.id} exceeded current reality by ${(gap * 100).toFixed(0)}% attention score.`, winner: top };
    }

    if (gap > 0.05 && this.switchCount < 3 && this.history.length > 2) {
      return { shouldSwitch: true, reason: `Marginal advantage (${(gap * 100).toFixed(0)}%) but system is in early exploration phase.`, winner: top };
    }

    return { shouldSwitch: false, reason: `${top.id} leads by ${(gap * 100).toFixed(0)}% — below switch threshold.` };
  }

  /** 获取切换历史 */
  getHistory(): SwitchHistoryEntry[] {
    return [...this.history];
  }

  /** 现实切换稳定性 — 频繁切换 = 不稳定 */
  getStability(): { stable: boolean; stabilityScore: number } {
    const totalSwitches = this.switchCount;
    const timeSpan = this.history.length > 1 ? this.history[this.history.length - 1].at - this.history[0].at : 1;
    const frequency = totalSwitches / Math.max(1, timeSpan / 60000); // switches per minute
    const stabilityScore = Math.round(Math.max(0, Math.min(1, 1 - frequency * 0.1)) * 100) / 100;
    return {
      stable: stabilityScore > 0.7,
      stabilityScore,
    };
  }

  /** 重置 */
  reset(): void {
    this.currentReality = null;
    this.history = [];
    this.switchCount = 0;
    this.lastSwitchAt = 0;
  }
}
