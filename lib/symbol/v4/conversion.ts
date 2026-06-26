// lib/symbol/v4/conversion.ts
// Conversion Brain — 自动转化系统
// V4 核心：系统自己优化"赚钱路径"——哪个 paywall 文案更赚钱、哪种情绪更容易转化

export interface ConversionEvent {
  event: string;
  value: number;
  context: Record<string, any>;
  timestamp: number;
}

export class ConversionBrain {
  private conversionLog: ConversionEvent[] = [];

  track(event: string, context: Record<string, any>): ConversionEvent {
    const entry: ConversionEvent = {
      event,
      value: this.getValue(event),
      context,
      timestamp: Date.now(),
    };
    this.conversionLog.push(entry);
    this._persist();
    return entry;
  }

  getValue(event: string): number {
    switch (event) {
      case 'share': return 3;
      case 'signup': return 8;
      case 'pay': return 15;
      case 'return': return 5;
      case 'click': return 1;
      default: return 1;
    }
  }

  // --- Paywall optimization ---

  /** Score a paywall variant by its emotional triggers */
  private simulateConversion(text: string): number {
    let score = 0;
    const triggers: [RegExp, number][] = [
      [/what happens/i, 30],
      [/what this means/i, 25],
      [/your system/i, 20],
      [/your pattern/i, 18],
      [/do nothing/i, 25],
      [/something changes/i, 22],
      [/the truth/i, 20],
      [/why you/i, 15],
      [/reveal/i, 18],
      [/hidden/i, 15],
    ];
    for (const [pattern, points] of triggers) {
      if (pattern.test(text)) score += points;
    }
    return Math.min(score, 100);
  }

  optimizePaywall(variants: { id: string; text: string }[]): { id: string; score: number; text: string } {
    const scored = variants.map((v) => ({
      id: v.id,
      score: this.simulateConversion(v.text),
      text: v.text,
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }

  getConversionStats(): { totalValue: number; events: ConversionEvent[]; topEvents: { event: string; count: number; value: number }[] } {
    const map = new Map<string, { count: number; value: number }>();
    for (const e of this.conversionLog) {
      const entry = map.get(e.event) || { count: 0, value: 0 };
      entry.count++;
      entry.value += e.value;
      map.set(e.event, entry);
    }
    return {
      totalValue: this.conversionLog.reduce((s, e) => s + e.value, 0),
      events: [...this.conversionLog],
      topEvents: Array.from(map.entries()).map(([event, data]) => ({ event, ...data })).sort((a, b) => b.value - a.value),
    };
  }

  // --- Persistence ---

  private STORAGE_KEY = 'v4_conversion_brain';

  private _persist(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.conversionLog));
    } catch { /* ignore */ }
  }

  load(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      this.conversionLog = JSON.parse(raw);
    } catch { /* ignore */ }
  }

  static create(): ConversionBrain {
    const brain = new ConversionBrain();
    brain.load();
    return brain;
  }
}
