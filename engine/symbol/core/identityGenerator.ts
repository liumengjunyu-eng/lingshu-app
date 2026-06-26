// engine/symbol/core/identityGenerator.ts
// 身份生成器 — 传播核心

import { SymbolicState, FiveElement } from './types';

interface IdentityTemplate {
  name: string;
  archetype: string;
  shadow: string;
}

const ELEMENT_BASE: Record<FiveElement, {
  archetype: string;
  shadow: string;
  modifier: Record<string, string>;
}> = {
  fire: {
    archetype: 'The Driven Burner',
    shadow: 'After the fire, ash remains.',
    modifier: {
      overdrive: ' — Running on fumes',
      shutdown: ' — Embers buried deep',
      balanced: ' — A steady flame',
    },
  },
  wood: {
    archetype: 'The Growing Force',
    shadow: 'Growth without rest becomes exhaustion.',
    modifier: {
      overdrive: ' — Pushing through walls',
      shutdown: ' — Roots in hard soil',
      balanced: ' — Spring renewal',
    },
  },
  earth: {
    archetype: 'The Silent Stabilizer',
    shadow: 'The earth that holds everything — but crumbles alone.',
    modifier: {
      overdrive: ' — Holding too much',
      shutdown: ' — Depleted soil',
      balanced: ' — Fertile ground',
    },
  },
  metal: {
    archetype: 'The Precision Recycler',
    shadow: 'Perfection is the slowest form of destruction.',
    modifier: {
      overdrive: ' — Forging in fire',
      shutdown: ' — Rusted structure',
      balanced: ' — Sharp and settled',
    },
  },
  water: {
    archetype: 'The Deep Restorer',
    shadow: 'Still water runs deep — but isolation freezes.',
    modifier: {
      overdrive: ' — Flooding fast',
      shutdown: ' — Frozen lake',
      balanced: ' — Flowing wisely',
    },
  },
};

const BLOOD_MODIFIERS: Record<string, string> = {
  A: ', quiet perfectionist',
  B: ', freedom-oriented',
  O: ', natural leader',
  AB: ', intuitive observer',
};

export function generateIdentity(state: SymbolicState): { name: string; archetype: string; shadow: string } {
  const element = state.fiveElement;
  const base = ELEMENT_BASE[element];

  // 根据压力系统获取修饰
  const modifier = base.modifier[state.stressSystem] || '';

  // 血型微调
  const bloodNote = state.bloodType ? BLOOD_MODIFIERS[state.bloodType] || '' : '';
  const archetype = `${base.archetype}${bloodNote}`;

  // 构造传播名
  const elementNames: Record<FiveElement, string> = {
    fire: 'Fire',
    wood: 'Wood',
    earth: 'Earth',
    metal: 'Metal',
    water: 'Water',
  };

  const stressLabels: Record<string, string> = {
    overdrive: 'Overdriver',
    shutdown: 'Deep Restorer',
    balanced: 'Harmonizer',
  };

  const tcmLabels: Record<string, string> = {
    qi_deficiency: 'Qi-Saver',
    blood_stasis: 'Flow-Blue',
    yin_deficiency: 'Night-Seeker',
    yang_excess: 'Day-Drinker',
    dampness: 'Dew-Walker',
    balanced: 'Center-Keeper',
  };

  const archetypeName = `${elementNames[element]}${stressLabels[state.stressSystem] || 'Watcher'}`;

  return {
    name: `${archetypeName}${modifier}`,
    archetype,
    shadow: base.shadow,
  };
}

export function generateMirror(state: SymbolicState, identity: { name: string; archetype: string }): string {
  const mirrors: Record<string, string> = {
    fire: 'You look productive from the outside. From the inside, it feels different.',
    wood: 'You\'ve been growing — but growth without rest has a cost.',
    earth: 'Everyone leans on you. The question is: who holds you?',
    metal: 'Your precision is your strength and your trap.',
    water: 'You feel more than you show. That\'s not weakness — it\'s capacity.',
  };

  return mirrors[state.fiveElement] || 'You are not what your tiredness tells you.';
}
