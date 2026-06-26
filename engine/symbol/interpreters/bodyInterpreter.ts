// engine/symbol/interpreters/bodyInterpreter.ts
// 身体层解释 — 把符号状态翻译成用户能理解的生理描述

import { SymbolicState } from '../core/types';

export function interpretBody(state: SymbolicState): string {
  const bodyDescriptions: Record<string, Record<string, string>> = {
    fire: {
      qi_deficiency: 'Your heart is working overtime but the fuel tank is empty. Physical sensation: heat without power.',
      blood_stasis: 'Heat is trapped in your chest and head. Your body wants to release but the channels are blocked.',
      yin_deficiency: 'Your body is running a fever without a fever. The core is dry, the surface is restless.',
      yang_excess: 'Full fire overload. Your nervous system is in a state of perpetual activation.',
      dampness: 'Fire trapped under fog. You feel restless but heavy at the same time.',
      balanced: 'Your fire is warm but not scorching. Body temperature and energy are well-regulated.',
    },
    water: {
      qi_deficiency: 'Your kidney energy is depleted. The deep well is running dry. You feel cold at the core.',
      blood_stasis: 'Your circulation is sluggish, especially in the lower body. Cold feet, slow recovery.',
      yin_deficiency: 'Even though you are water type, your yin is depleted. This is the most energy-critical state.',
      yang_excess: 'Water trying to suppress fire — a battle between exhaustion and restlessness.',
      dampness: 'Water has become stagnant. Fluid retention, heavy limbs, slow metabolism.',
      balanced: 'Deep, calm, flowing. Your recovery system is functioning optimally.',
    },
    wood: {
      qi_deficiency: 'Your liver energy is weak. Decision fatigue is not in your head — it is in your liver.',
      blood_stasis: 'Growth is blocked. You have the energy but it cannot move through the channels.',
      yin_deficiency: 'Flexibility without substance. You can bend but there is no spring left to return.',
      yang_excess: 'Wood on fire. Rapid growth, rapid burnout. The highest risk pattern.',
      dampness: 'Wood in damp soil. Potential is there but growth is slow and heavy.',
      balanced: 'Strong roots. Your body is aligned for sustainable growth.',
    },
    metal: {
      qi_deficiency: 'Your lung qi is weak. Shallow breathing, low voice, low boundary energy.',
      blood_stasis: 'Structure without flow. Your precision is creating internal rigidity.',
      yin_deficiency: 'The refining process has dried you out. Too much analysis, not enough moisture.',
      yang_excess: 'Metal is sharp but brittle under pressure. High performance with hidden fragility.',
      dampness: 'Metal in rust. Your precision systems are being corroded by accumulated stress.',
      balanced: 'Clear structure with gentle flow. Your body is organized but not rigid.',
    },
    earth: {
      qi_deficiency: 'Your spleen is exhausted. You are digesting everything — food, emotions, other people\'s problems.',
      blood_stasis: 'Earth is compacted. You are holding too much and nothing can pass through.',
      yin_deficiency: 'The soil is dry. Your nurturing capacity is depleted because you are not nurtured.',
      yang_excess: 'Earth mound rising too high. You have taken on too much responsibility.',
      dampness: 'Earth becomes mud. Over-nourishing yourself without direction leads to stagnation.',
      balanced: 'Rich, fertile, centered. Your body is a strong foundation.',
    },
  };

  const elementGroup = bodyDescriptions[state.fiveElement];
  if (!elementGroup) return 'Your body state is in a unique transition phase.';

  const entry = elementGroup[state.tcmPattern];
  return entry || 'Your system is expressing a mixed state. The interplay of elements is complex.';
}
