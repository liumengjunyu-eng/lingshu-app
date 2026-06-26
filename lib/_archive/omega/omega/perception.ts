// lib/symbol/omega/perception.ts
// Perception Override Engine — 感知覆盖系统
// Ω: 不是"展示信息"，而是"改变理解方式"

export interface RawInput {
  stress?: number;       // 0-1
  confusion?: number;    // 0-1
  energy?: number;       // 0-1
  awareness?: number;    // 0-1
  anxiety?: number;      // 0-1
  fatigue?: number;      // 0-1
  [key: string]: any;
}

export interface PerceivedMeaning {
  originalLabel: string;
  reinterpretedLabel: string;
  shift: number;         // magnitude of reinterpretation
  category: 'cognitive_upgrade' | 'system_reconfiguration' | 'structural_shift' | 'stable';
}

export interface EmotionShift {
  from: string;
  to: string;
  magnitude: number;
}

export interface TransformedOutput {
  original: RawInput;
  perceivedMeaning: PerceivedMeaning;
  emotionalShift: EmotionShift;
  reinterpretationDepth: number; // 0-1 how much the original was rewritten
}

const MEANING_MAP: Array<{ condition: (i: RawInput) => boolean; original: string; reinterpreted: string; category: PerceivedMeaning['category'] }> = [
  { condition: (i) => (i.stress || 0) > 0.7, original: 'high stress', reinterpreted: 'system reconfiguration in progress', category: 'system_reconfiguration' },
  { condition: (i) => (i.confusion || 0) > 0.6, original: 'confusion', reinterpreted: 'structural upgrade in progress — new patterns forming', category: 'cognitive_upgrade' },
  { condition: (i) => (i.fatigue || 0) > 0.7, original: 'exhaustion', reinterpreted: 'deep integration phase — system consolidating gains', category: 'structural_shift' },
  { condition: (i) => (i.anxiety || 0) > 0.6, original: 'anxiety', reinterpreted: 'heightened alertness — system preparing for expansion', category: 'system_reconfiguration' },
  { condition: (i) => (i.energy || 0) > 0.7 && (i.awareness || 0) > 0.6, original: 'high energy + awareness', reinterpreted: 'optimal state — system operating at peak coherence', category: 'stable' },
  { condition: (i) => (i.energy || 0) < 0.3, original: 'low energy', reinterpreted: 'conservation phase — system reallocating resources', category: 'structural_shift' },
];

const EMOTION_MAP: Array<{ condition: (i: RawInput) => boolean; from: string; to: string }> = [
  { condition: (i) => (i.stress || 0) > 0.7, from: 'overwhelm', to: 'calm reinterpretation' },
  { condition: (i) => (i.confusion || 0) > 0.5, from: 'uncertainty', to: 'curiosity' },
  { condition: (i) => (i.fatigue || 0) > 0.6, from: 'depletion', to: 'integration' },
  { condition: (i) => (i.anxiety || 0) > 0.5, from: 'fear', to: 'alert readiness' },
];

export class PerceptionOverrideEngine {
  /** 重写输入的含义——改变理解方式 */
  transform(input: RawInput): TransformedOutput {
    const shift = this.shiftEmotion(input);
    const meaning = this.rewriteMeaning(input);

    // Calculate reinterpretation depth: how many signals were rewritten
    const activeSignals = Object.values(input).filter((v) => typeof v === 'number' && v > 0.3).length || 1;
    const rewritten = (meaning.category !== 'stable' ? 1 : 0) + (shift.magnitude > 0.3 ? 1 : 0);
    const depth = Math.round(Math.min(1, rewritten / Math.max(1, activeSignals)) * 100) / 100;

    return {
      original: { ...input },
      perceivedMeaning: meaning,
      emotionalShift: shift,
      reinterpretationDepth: depth,
    };
  }

  /** 重写含义标签 */
  rewriteMeaning(input: RawInput): PerceivedMeaning {
    for (const rule of MEANING_MAP) {
      if (rule.condition(input)) {
        return {
          originalLabel: rule.original,
          reinterpretedLabel: rule.reinterpreted,
          shift: Math.round(Math.abs((input.stress || 0.5) - 0.3) * 100) / 100,
          category: rule.category,
        };
      }
    }
    return {
      originalLabel: 'stable',
      reinterpretedLabel: 'stable perception state — no reinterpretation required',
      shift: 0,
      category: 'stable',
    };
  }

  /** 情感转换 */
  shiftEmotion(input: RawInput): EmotionShift {
    for (const rule of EMOTION_MAP) {
      if (rule.condition(input)) {
        return {
          from: rule.from,
          to: rule.to,
          magnitude: Math.round(Math.min(1, (input.stress || 0.5) * 0.8) * 100) / 100,
        };
      }
    }
    return { from: 'neutral', to: 'neutral', magnitude: 0.05 };
  }

  /** 感知覆盖的强度评级 */
  getOverrideIntensity(result: TransformedOutput): 'light' | 'moderate' | 'deep' {
    if (result.reinterpretationDepth > 0.6) return 'deep';
    if (result.reinterpretationDepth > 0.3) return 'moderate';
    return 'light';
  }
}
