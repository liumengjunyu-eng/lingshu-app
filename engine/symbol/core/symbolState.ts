// engine/symbol/core/symbolState.ts
// 状态聚合器 — 从 RawSignals → SymbolicState

import { RawSignals, SymbolicState, FiveElement, TcmPattern, StressSystem } from './types';

export function aggregateSymbolState(signals: RawSignals): SymbolicState {
  const element = mapFiveElement(signals);
  const tcm = mapTCM(signals);
  const stressSystem = mapStressSystem(signals);

  return {
    fiveElement: element,
    tcmPattern: tcm,
    stressSystem,
    zodiac: signals.zodiac,
    bloodType: signals.bloodType,
  };
}

function mapFiveElement(s: RawSignals): FiveElement {
  // 睡眠差 + 高疲劳 + 高焦虑 → 水弱
  if (s.sleepQuality < 35 && s.fatigue > 65 && s.anxiety > 60) return 'water';

  // 高动机 + 高焦虑 + 高压力 → 火过旺
  if (s.motivation > 65 && s.anxiety > 55 && s.stress > 60) return 'fire';

  // 高疲劳 + 消化差 → 土虚
  if (s.fatigue > 55 && s.digestion < 40) return 'earth';

  // 高压力 + 高清晰度 → 金
  if (s.stress > 50 && s.clarity > 60) return 'metal';

  // 睡眠好 + 运动多 + 压力低 → 木
  if (s.sleepQuality > 60 && s.exercise > 50 && s.stress < 40) return 'wood';

  // fallback: 取睡眠和压力的比值
  const ratio = s.sleepQuality / Math.max(s.stress, 1);
  if (ratio > 1.5) return 'wood';
  if (ratio > 1.0) return 'fire';
  if (ratio > 0.7) return 'earth';
  if (ratio > 0.4) return 'metal';
  return 'water';
}

function mapTCM(s: RawSignals): TcmPattern {
  if (s.sleepQuality < 30 && s.fatigue > 70) return 'yin_deficiency';
  if (s.stress > 70 && s.sleepQuality < 40) return 'yang_excess';
  if (s.fatigue > 60 && s.digestion < 40) return 'qi_deficiency';
  if (s.stress > 60 && s.digestion > 60) return 'dampness';
  if (s.stress > 50 && s.anxiety > 50) return 'blood_stasis';
  return 'balanced';
}

function mapStressSystem(s: RawSignals): StressSystem {
  if (s.stress > 70 && s.sleepQuality < 40) return 'overdrive';
  if (s.stress > 65 && s.sleepQuality < 20 && s.fatigue > 75) return 'shutdown';
  return 'balanced';
}
