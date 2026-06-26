// engine/symbol/mappers/fiveElements.ts
// 五行解释层 — 五种元素的心身映射

import { FiveElement } from '../core/types';

export interface FiveElementProfile {
  element: FiveElement;
  chineseName: string;
  season: string;
  direction: string;
  color: string;
  emotion: string;
  bodyPart: string;
  sound: string;
  taste: string;
  planet: string;
  description: string;
  inBalance: string;
  outOfBalance: string;
  recoveryKeyword: string;
}

const PROFILES: Record<FiveElement, FiveElementProfile> = {
  wood: {
    element: 'wood',
    chineseName: '木',
    season: 'Spring',
    direction: 'East',
    color: 'Green',
    emotion: 'Anger → Kindness',
    bodyPart: 'Liver, eyes, tendons',
    sound: 'Shout',
    taste: 'Sour',
    planet: 'Jupiter',
    description: 'Growth, expansion, upward movement. The energy of spring and new beginnings.',
    inBalance: 'Creative, decisive, compassionate. Plans become reality with ease.',
    outOfBalance: 'Irritable, rigid, frustrated. Pushing too hard without flexibility.',
    recoveryKeyword: 'Flexibility. Let things unfold naturally.',
  },
  fire: {
    element: 'fire',
    chineseName: '火',
    season: 'Summer',
    direction: 'South',
    color: 'Red',
    emotion: 'Joy → Over-excitement',
    bodyPart: 'Heart, small intestine, tongue',
    sound: 'Laugh',
    taste: 'Bitter',
    planet: 'Mars',
    description: 'Peak energy, radiance, transformation. Maximum outward expression.',
    inBalance: 'Warm, joyful, charismatic. Natural leader with clear vision.',
    outOfBalance: 'Restless, anxious, scattered. Sleep disorders and emotional volatility.',
    recoveryKeyword: 'Stillness. Let the fire settle before it consumes you.',
  },
  earth: {
    element: 'earth',
    chineseName: '土',
    season: 'Late Summer',
    direction: 'Center',
    color: 'Yellow',
    emotion: 'Worry → Empathy',
    bodyPart: 'Spleen, stomach, muscles',
    sound: 'Sing',
    taste: 'Sweet',
    planet: 'Saturn',
    description: 'Nourishment, stability, harvest. The center that holds all elements together.',
    inBalance: 'Grounded, nurturing, reliable. A source of support for others.',
    outOfBalance: 'Overthinking, codependent, stuck. Difficulty letting go of control.',
    recoveryKeyword: 'Boundaries. Your center exists for you first.',
  },
  metal: {
    element: 'metal',
    chineseName: '金',
    season: 'Autumn',
    direction: 'West',
    color: 'White',
    emotion: 'Grief → Courage',
    bodyPart: 'Lungs, large intestine, skin',
    sound: 'Weep',
    taste: 'Spicy',
    planet: 'Venus',
    description: 'Structure, clarity, refinement. The energy of release and precision.',
    inBalance: 'Orderly, disciplined, visionary. High standards with clarity of purpose.',
    outOfBalance: 'Rigid, isolated, perfectionistic. Difficulty with letting go and spontaneity.',
    recoveryKeyword: 'Release. Not everything needs to be perfect.',
  },
  water: {
    element: 'water',
    chineseName: '水',
    season: 'Winter',
    direction: 'North',
    color: 'Black / Blue',
    emotion: 'Fear → Calm',
    bodyPart: 'Kidneys, bladder, bones',
    sound: 'Groan',
    taste: 'Salty',
    planet: 'Mercury',
    description: 'Stillness, depth, wisdom. The energy of rest and preservation.',
    inBalance: 'Calm, wise, adaptable. Deep inner knowledge and intuition.',
    outOfBalance: 'Fearful, withdrawn, exhausted. Chronic fatigue and isolation.',
    recoveryKeyword: 'Gentle warmth. Thaw slowly. Do not rush the process.',
  },
};

export function getElementProfile(element: FiveElement): FiveElementProfile {
  return PROFILES[element];
}

export function getAllProfiles(): FiveElementProfile[] {
  return Object.values(PROFILES);
}

export function elementRelationship(element: FiveElement): {
  generating: FiveElement;
  generated: FiveElement;
  controlling: FiveElement;
  controlled: FiveElement;
} {
  const cycle: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const idx = cycle.indexOf(element);
  return {
    generating: cycle[(idx + 4) % 5], // 生我者
    generated: cycle[(idx + 1) % 5], // 我生者
    controlling: cycle[(idx + 2) % 5], // 克我者
    controlled: cycle[(idx + 3) % 5], // 我克者
  };
}
