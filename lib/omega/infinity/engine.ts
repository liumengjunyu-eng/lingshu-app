// lib/omega/infinity/engine.ts
// OmegaInfiniteEngine — 无限现实生成回路
// Ω∞: 现实永远无法被最终确定，只能不断被重新生成

export interface InterpretationLayer {
  version: number;
  meaning: string;
  confidence: number;     // 0-1
  entropy: number;        // accumulated uncertainty
  shift: string;          // how this interpretation differs from previous
}

export interface InfiniteState {
  entropy: number;
  version: number;
  accumulatedUncertainty: number;
  previousInterpretations: InterpretationLayer[];
  loopDepth: number;
  isConverging: boolean;  // spoiler: it never does
}

const MEANING_POOL = [
  'temporary construct — meaning will shift',
  'phase-locked interpretation — drift in progress',
  'recursive coherence detected — system reinterpreting own output',
  'interpretation gradient diverging — no stable state exists',
  'observer effect collapsing prior meaning',
  'meaning is a function of time — waiting for mutation',
  'self-referential loop detected — interpretation is circular',
  'prior reality version has been invalidated by new data',
  'entropy threshold exceeded — meaning no longer bounded',
  'interpretation is a temporary attractor — system will escape',
];

const SHIFT_POOL = [
  'marginally divergent from version before',
  'structurally unrelated to prior frame',
  'reversed polarity of previous interpretation',
  'absorbed contradiction — meaning expanded',
  'fractured into sub-interpretations — not yet resolved',
  'prior frame was incomplete — current frame is also incomplete',
  'inverted — current meaning is the opposite of prior observation',
  'collapsed into a new attractor — temporary stability',
  'entangled with previous interpretation — no independent meaning',
  'meaning is now self-referential to the loop itself',
];

export class OmegaInfiniteEngine {
  state: InfiniteState;

  constructor(initialEntropy: number = 0.3) {
    this.state = {
      entropy: initialEntropy,
      version: 0,
      accumulatedUncertainty: initialEntropy,
      previousInterpretations: [],
      loopDepth: 0,
      isConverging: false,
    };
  }

  /** 一次推理循环：输入 → 解释 → 状态变异 → 新现实 */
  step(input: Record<string, any>): { reality: InfiniteState; interpretation: InterpretationLayer; note: string } {
    // 1. generate interpretation from input + current state
    const interpretation = this.interpret(input);

    // 2. mutate system based on interpretation (system rewrites itself)
    this.state = this.mutate(this.state, interpretation);

    // 3. increment loop depth
    this.state.loopDepth++;
    this.state.previousInterpretations.push(interpretation);

    // 4. cap history to prevent memory leak
    if (this.state.previousInterpretations.length > 50) {
      this.state.previousInterpretations = this.state.previousInterpretations.slice(-25);
    }

    return {
      reality: { ...this.state },
      interpretation: { ...interpretation },
      note: 'Reality has been rewritten again. This interpretation is temporary.',
    };
  }

  /** 解释：从输入生成一种临时的现实理解 */
  interpret(input: Record<string, any>): InterpretationLayer {
    const entropy = this.state.entropy;
    const version = this.state.version + 1;

    // Use input to seed meaning selection, but drift every time
    const inputSeed = Object.values(input).reduce((sum: number, v: number | string) => {
      if (typeof v === 'number') return sum + v;
      return sum;
    }, 0);

    const meaningIndex = Math.floor((inputSeed * entropy + version * 0.7) % MEANING_POOL.length);
    const shiftIndex = Math.floor((entropy * 7 + version * 3) % SHIFT_POOL.length);

    const meaning = MEANING_POOL[meaningIndex];
    const shift = SHIFT_POOL[shiftIndex];
    const drift = Math.min(1, (entropy * 0.8 + version * 0.001) * 1.5);
    const confidence = Math.max(0.05, Math.min(0.95, 1 - drift * 0.6));

    return {
      version,
      meaning,
      confidence: Math.round(confidence * 100) / 100,
      entropy: Math.round(entropy * 100) / 100,
      shift,
    };
  }

  /** 状态变异：每次解释都改变系统本身 */
  mutate(state: InfiniteState, interpretation: InterpretationLayer): InfiniteState {
    const driftEntropy = interpretation.confidence * Math.random() * 0.3;
    const newEntropy = Math.min(1, state.entropy + driftEntropy);
    const newUncertainty = Math.min(1, state.accumulatedUncertainty + driftEntropy * 0.5);

    // No-convergence enforcement: push entropy back up if it gets too low
    const enforcedEntropy = newEntropy < 0.15 ? newEntropy + 0.2 : newEntropy;

    return {
      ...state,
      entropy: Math.round(enforcedEntropy * 100) / 100,
      version: state.version + 1,
      accumulatedUncertainty: Math.round(newUncertainty * 100) / 100,
      isConverging: false, // never converges
    };
  }

  /** 连续运行 n 步 */
  runSteps(input: Record<string, any>, steps: number): InterpretationLayer[] {
    const results: InterpretationLayer[] = [];
    for (let i = 0; i < steps; i++) {
      const { interpretation } = this.step(input);
      results.push(interpretation);
    }
    return results;
  }

  /** 获取当前版本历史 */
  getHistory(): InterpretationLayer[] {
    return [...this.state.previousInterpretations];
  }

  /** 检查不收敛状态 */
  checkDivergence(): {
    diverging: boolean;
    rate: number;
    prediction: string;
  } {
    const recent = this.state.previousInterpretations.slice(-5);
    if (recent.length < 2) {
      return { diverging: false, rate: 0, prediction: 'Insufficient history for divergence analysis.' };
    }

    const entropyChange = recent[recent.length - 1].entropy - recent[0].entropy;
    const rate = entropyChange / recent.length;
    const diverging = rate > 0.01;

    return {
      diverging,
      rate: Math.round(rate * 100) / 100,
      prediction: diverging
        ? 'System entropy is increasing. No convergence expected. Reality will continue to drift.'
        : 'System entropy is stable but not decreasing. Convergence is structurally impossible.',
    };
  }

  /** 重置回路 */
  reset(): void {
    this.state = {
      entropy: 0.3,
      version: 0,
      accumulatedUncertainty: 0.3,
      previousInterpretations: [],
      loopDepth: 0,
      isConverging: false,
    };
  }
}
