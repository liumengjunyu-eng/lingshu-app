// lib/symbol/v7/memory.ts
// Memory Layer — 文明记忆系统
// V7 核心：系统拥有"历史"——事件归档、模式检索、文明叙事

export interface CivilizationalEvent {
  id: string;
  summary: string;
  impact: number;
  type: 'birth' | 'death' | 'merger' | 'crisis' | 'innovation' | 'cultural_shift' | 'rule_change' | 'collapse' | 'expansion';
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface CivilizationSummary {
  totalEvents: number;
  dominantTheme: 'expansion' | 'instability' | 'stasis' | 'transformation';
  era: string;
  age: number; // ms since first event
  keyEvents: CivilizationalEvent[];
}

export class MemoryLayer {
  private archive: CivilizationalEvent[] = [];
  private eventCounter = 0;

  /** 记录一个文明事件 */
  record(summary: string, impact: number, type: CivilizationalEvent['type'], entityId?: string, metadata?: Record<string, any>): CivilizationalEvent {
    const event: CivilizationalEvent = {
      id: `evt_${this.eventCounter++}`,
      summary,
      impact,
      type,
      entityId,
      metadata,
      timestamp: Date.now(),
    };
    this.archive.push(event);
    return event;
  }

  /** 按模式检索历史 */
  retrieve(pattern: string): CivilizationalEvent[] {
    const lower = pattern.toLowerCase();
    return this.archive.filter(
      (a) =>
        a.summary.toLowerCase().includes(lower) ||
        a.type.toLowerCase().includes(lower) ||
        a.id.includes(pattern)
    );
  }

  /** 按时间段检索 */
  retrieveByTime(from: number, to: number = Date.now()): CivilizationalEvent[] {
    return this.archive.filter((e) => e.timestamp >= from && e.timestamp <= to);
  }

  /** 按影响度检索 */
  retrieveByImpact(minImpact: number): CivilizationalEvent[] {
    return this.archive.filter((e) => e.impact >= minImpact).sort((a, b) => b.impact - a.impact);
  }

  /** 文明小结 */
  summarizeCivilization(): CivilizationSummary {
    const total = this.archive.length;
    const collapseCount = this.archive.filter((a) => a.type === 'collapse').length;
    const expansionCount = this.archive.filter((a) => a.type === 'expansion').length;
    const innovationCount = this.archive.filter((a) => a.type === 'innovation').length;
    const instabilityRatio = collapseCount / Math.max(1, total);

    let dominantTheme: CivilizationSummary['dominantTheme'];
    if (instabilityRatio > 0.4) {
      dominantTheme = 'instability';
    } else if (expansionCount > innovationCount && expansionCount > collapseCount) {
      dominantTheme = 'expansion';
    } else if (innovationCount > expansionCount) {
      dominantTheme = 'transformation';
    } else {
      dominantTheme = 'stasis';
    }

    const age = this.archive.length > 0 ? Date.now() - this.archive[0].timestamp : 0;
    const days = Math.floor(age / 86400000);
    const hours = Math.floor((age % 86400000) / 3600000);

    return {
      totalEvents: total,
      dominantTheme,
      era: days > 0 ? `Era ${Math.floor(days / 7) + 1}` : 'Genesis',
      age,
      keyEvents: this.getKeyEvents(5),
    };
  }

  /** 获取影响最大的事件 */
  getKeyEvents(count: number = 5): CivilizationalEvent[] {
    return [...this.archive].sort((a, b) => b.impact - a.impact).slice(0, count);
  }

  /** 获取最近的事件 */
  getRecentEvents(count: number = 10): CivilizationalEvent[] {
    return [...this.archive].sort((a, b) => b.timestamp - a.timestamp).slice(0, count);
  }

  /** 按类型统计事件 */
  getEventBreakdown(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    for (const e of this.archive) {
      breakdown[e.type] = (breakdown[e.type] || 0) + 1;
    }
    return breakdown;
  }

  /** 完整存档 */
  getFullArchive(): CivilizationalEvent[] {
    return [...this.archive];
  }

  /** 存档大小 */
  get size(): number {
    return this.archive.length;
  }
}
