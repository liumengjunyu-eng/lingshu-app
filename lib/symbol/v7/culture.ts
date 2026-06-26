// lib/symbol/v7/culture.ts
// Culture Engine — 文化生成系统
// V7 核心：系统开始"产生文化"——信念、叙事、集体情绪

export type EmotionalTone = 'expansion' | 'collapse' | 'transformation' | 'stasis';

export interface RawEvent {
  summary: string;
  impact: number;  // 0-1
  sentiment: number; // -1 to 1
  type: 'economic' | 'cultural' | 'technological' | 'social' | 'crisis';
}

export interface Narrative {
  myth: string;
  belief: string;
  emotionalTone: EmotionalTone;
  contagion: number; // 0-1, how fast this narrative spreads
}

export interface CultureSnapshot {
  dominantNarratives: Narrative[];
  dominantTone: EmotionalTone;
  beliefDiversity: number;
  culturalTension: number;
}

export class CultureEngine {
  private narratives: Narrative[] = [];
  private readonly MAX_NARRATIVES = 50;

  /** 从事件生成文化叙事 */
  generateNarratives(events: RawEvent[]): Narrative[] {
    const generated: Narrative[] = events.map((e) => this.transform(e));
    this.narratives.push(...generated);
    // Trim
    if (this.narratives.length > this.MAX_NARRATIVES) {
      this.narratives = this.narratives.slice(-this.MAX_NARRATIVES);
    }
    return generated;
  }

  /** 单事件 → 叙事 */
  transform(event: RawEvent): Narrative {
    return {
      myth: `This is what the system believes happened: ${event.summary}`,
      belief: this.generateBelief(event),
      emotionalTone: this.detectTone(event),
      contagion: Math.round((event.impact + Math.random() * 0.3) * 100) / 100,
    };
  }

  /** 从事件提炼信念 */
  generateBelief(event: RawEvent): string {
    if (event.impact > 0.7) {
      return 'System change is inevitable';
    }
    if (event.impact > 0.4) {
      return 'System stability is temporary';
    }
    if (event.sentiment > 0.3) {
      return 'Growth creates new possibilities';
    }
    if (event.sentiment < -0.3) {
      return 'Collapse is a necessary reset';
    }
    return 'Adaptation is the only constant';
  }

  /** 检测集体情绪基调 */
  detectTone(event: RawEvent): EmotionalTone {
    const { sentiment, impact, type } = event;
    if (type === 'crisis') return 'collapse';
    if (sentiment > 0.3 && impact > 0.5) return 'expansion';
    if (sentiment < -0.3 && impact > 0.5) return 'collapse';
    if (impact > 0.6) return 'transformation';
    return 'stasis';
  }

  /** 获取当前文明文化快照 */
  getSnapshot(events: RawEvent[] = []): CultureSnapshot {
    // Update with recent events if any
    if (events.length > 0) {
      this.generateNarratives(events);
    }

    const dominant = this.getDominantNarratives(3);
    const tones = dominant.map((n) => n.emotionalTone);
    const toneCount: Record<string, number> = {};
    for (const t of tones) {
      toneCount[t] = (toneCount[t] || 0) + 1;
    }
    const dominantTone = (Object.entries(toneCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'stasis') as EmotionalTone;

    const beliefs = new Set(this.narratives.map((n) => n.belief));

    return {
      dominantNarratives: dominant,
      dominantTone,
      beliefDiversity: Math.round(beliefs.size / Math.max(1, this.narratives.length) * 100),
      culturalTension: Math.round(this.narratives.filter((n) => n.emotionalTone === 'collapse' || n.emotionalTone === 'transformation').length / Math.max(1, this.narratives.length) * 100),
    };
  }

  /** 获取传播力最强的叙事 */
  getDominantNarratives(count: number = 3): Narrative[] {
    return [...this.narratives].sort((a, b) => b.contagion - a.contagion).slice(0, count);
  }

  /** 文明文化熵——衡量文化多样性 */
  getCulturalEntropy(): number {
    const total = this.narratives.length || 1;
    const beliefMap: Record<string, number> = {};
    for (const n of this.narratives) {
      beliefMap[n.belief] = (beliefMap[n.belief] || 0) + 1;
    }
    // Shannon entropy
    let entropy = 0;
    for (const count of Object.values(beliefMap)) {
      const p = count / total;
      entropy -= p * Math.log2(p);
    }
    return Math.round(entropy * 100) / 100;
  }
}
