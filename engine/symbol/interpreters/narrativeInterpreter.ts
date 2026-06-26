// engine/symbol/interpreters/rootCauseInterpreter.ts
// 根源解释层 — 把状态翻译成因果叙事

import { SymbolicState } from '../core/types';

export function interpretRootCause(state: SymbolicState): string {
  const elementRoot: Record<string, Record<string, string>> = {
    fire: {
      qi_deficiency: 'You have been running on motivation without structural support. Your drive exceeds your capacity.',
      yang_excess: 'Chronic overstimulation. Your nervous system has lost the ability to down-regulate.',
      yin_deficiency: 'Years of night-time screen use and late work have depleted your restorative energy.',
      blood_stasis: 'Emotional expression has been suppressed. What you feel is trapped in your body.',
      dampness: 'Information overload mixed with inactivity. Your mind is consuming more than your body is processing.',
      balanced: 'Your current state is sustainable. Maintain awareness of the seasonal shifts.',
    },
    water: {
      qi_deficiency: 'Deep exhaustion that rest alone cannot fix. Your recovery system itself needs recovery.',
      yang_excess: 'You are fighting your natural rhythm. Your body wants stillness but you keep pushing.',
      yin_deficiency: 'The most depleted state. Your reserves have been drawn down over months or years.',
      blood_stasis: 'Isolation has created internal stagnation. Connection is your medicine.',
      dampness: 'Too much inward focus without movement. Water needs flow, not accumulation.',
      balanced: 'Your deep rest capacity is intact. You recover efficiently.',
    },
    wood: {
      qi_deficiency: 'Decision fatigue from constant growth pressure. You are expanding in too many directions.',
      yang_excess: 'Ambition without patience. You are pushing growth faster than your foundation can support.',
      yin_deficiency: 'Growth without nourishment. You are giving more than you are receiving.',
      blood_stasis: 'Creative energy is blocked. You have ideas but no channel to express them.',
      dampness: 'Growth in heavy conditions. External environment is slowing your natural expansion.',
      balanced: 'Steady growth with proper support. Your trajectory is healthy.',
    },
    metal: {
      qi_deficiency: 'Perfectionism has exhausted your discernment. You are refining things that do not need refinement.',
      yang_excess: 'Analysis paralysis. You are over-optimizing at the cost of execution.',
      yin_deficiency: 'The structure is too rigid. Your need for order is creating internal friction.',
      blood_stasis: 'Grief or unresolved loss is being stored in your lungs and skin.',
      dampness: 'Accumulated details and unfinished tasks are weighing down your system.',
      balanced: 'Clear structure with adaptive capacity. Your systems serve you, not constrain you.',
    },
    earth: {
      qi_deficiency: 'You have been holding space for everyone except yourself. Caretaker burnout is real.',
      yang_excess: 'You have taken on too much responsibility. Your worry center is overdriven.',
      yin_deficiency: 'Your nurturing well is dry. You need to receive before you can give again.',
      blood_stasis: 'Outdated beliefs about your role are stuck in your body. You can let some of them go.',
      dampness: 'Overthinking has created mental mud. Too much rumination, not enough action.',
      balanced: 'Centered and grounded. Your support systems are reciprocal.',
    },
  };

  const entry = elementRoot[state.fiveElement]?.[state.tcmPattern];
  return entry || 'Your state is a unique combination of elements. The root cause lies in the misalignment between your natural rhythm and your current environment.';
}

export function generateRecommendations(state: SymbolicState): string[] {
  const recommendations: Record<string, string[]> = {
    fire: [
      'Reduce stimulation 1 hour before bed. Blue light is amplifying your fire.',
      'Practice cooling breathing (inhale through nose 4s, hold 4s, exhale through mouth 6s).',
      'Eat less spicy food. Bitter greens (endive, radicchio) will balance your fire.',
      'Move your workspace away from direct sunlight. Too much heat energy in your environment.',
      'Wear cooler colors (blue, white) to calm your system.',
    ],
    wood: [
      'Morning stretching before any screen. Your liver energy needs physical movement to flow.',
      'Sour foods in moderation (lemon water, sauerkraut) to support liver function.',
      'Reduce caffeine — it over-amplifies wood energy and creates rigidity.',
      'Green environment exposure. 20 minutes in a park resets your growth energy.',
      'Say "no" to one commitment per week. Wood overgrows when it has too many directions.',
    ],
    earth: [
      'Eat warm, cooked meals. Your spleen needs the digestive support.',
      'Establish a consistent meal schedule. Irregular eating weakens earth energy.',
      'Practice receiving. Ask for help once per day, even for small things.',
      'Yellow and orange in your environment (a cloth, a mug) supports earth energy.',
      'Reduce multitasking. Single-task for 25-minute blocks.',
    ],
    metal: [
      'Morning deep breathing (5 min) to open lung energy. Let things go.',
      'Reduce perfectionism targets. Complete at 80% for one week as an experiment.',
      'White or silver in your environment supports metal energy.',
      'Let yourself cry if needed. Grief is metal\'s natural release valve.',
      'Spicy foods in moderation (ginger tea, pepper) to move metal energy.',
    ],
    water: [
      'Sleep before 11pm. Water energy restoration happens in the first half of the night.',
      'Warm salt baths. Salty taste and warm water both nourish kidney energy.',
      'Reduce fearful media consumption. Your water system is absorbing too much anxiety.',
      'Black and dark blue clothing supports your element.',
      'Gentle movement (walking, swimming). Slow flow is better than no flow.',
    ],
  };

  return recommendations[state.fiveElement] || [
    'Listen to your body. It knows what it needs.',
    'Rest before you think you need it.',
    'Check in with yourself three times per day.',
  ];
}
