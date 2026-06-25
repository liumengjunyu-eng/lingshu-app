// 6-Dimension Wellness Plan Data
// Based on weak elements, provides targeted wellness advice

export interface WellnessPlan {
  element: string;
  color: string;
  direction: string;
  food: string;
  exercise: string;
  acupoint: string;
  sleep: string;
  classic: string;
  emotion: string;
}

export const WELLNESS_MAP: Record<string, WellnessPlan> = {
  '木': {
    element: 'Wood',
    color: 'Green, Teal, Forest Green',
    direction: 'East',
    food: 'Sour foods, leafy greens, sprouts, lemon',
    exercise: 'Stretching, Tai Chi, morning walk in nature',
    acupoint: 'Liver 3 (Taichong), Gallbladder 20 (Fengchi)',
    sleep: 'Sleep before 11pm, wake up with sunrise',
    classic: '"In spring, all things begin to grow. The heavens and earth give birth, and all things flourish." — Huangdi Neijing. When Wood is weak, follow the energy of spring: stretch, grow, and expand.',
    emotion: 'Wood represents growth and expansion. When balanced, you feel motivated and decisive.'
  },
  '火': {
    element: 'Fire',
    color: 'Red, Pink, Coral, Warm Orange',
    direction: 'South',
    food: 'Bitter foods, red beans, goji berries, small amount of spice',
    exercise: 'Heart-opening yoga, dancing, social sports',
    acupoint: 'Heart 7 (Shenmen), Pericardium 6 (Neiguan)',
    sleep: 'Sleep before 12am, avoid over-excitement at night',
    classic: '"In summer, everything flourishes and bears fruit. The energy of heaven and earth meets, and all things ripen." — Huangdi Neijing. When Fire is weak, warm your heart energy and embrace joy.',
    emotion: 'Fire represents joy and connection. When balanced, you radiate warmth and charisma.'
  },
  '土': {
    element: 'Earth',
    color: 'Yellow, Orange, Earth tones',
    direction: 'Center',
    food: 'Sweet foods (natural), millet, pumpkin, sweet potato',
    exercise: 'Grounding exercises, walking barefoot on grass, qigong',
    acupoint: 'Stomach 36 (Zusanli), Spleen 6 (Sanyinjiao)',
    sleep: 'Regular sleep schedule, avoid late-night eating',
    classic: '"The center governs the spleen. Yellow is its color, and it opens into the mouth." — Huangdi Neijing. When Earth is weak, nourish the spleen and stomach, and stay grounded.',
    emotion: 'Earth represents stability and nourishment. When balanced, you feel centered and supportive.'
  },
  '金': {
    element: 'Metal',
    color: 'White, Silver, Metallic, Pale gold',
    direction: 'West',
    food: 'Pungent foods, white foods (radish, pear, lily bulb)',
    exercise: 'Cardio, breathing exercises, autumn hikes',
    acupoint: 'Lung 7 (Lieque), Large Intestine 4 (Hegu)',
    sleep: 'Sleep with window slightly open, wake up early',
    classic: '"In autumn, the energy of heaven is urgent and the energy of earth is clear. Harvest what has been sown." — Huangdi Neijing. When Metal is weak, moisten the lungs, breathe deeply, and let go.',
    emotion: 'Metal represents clarity and discernment. When balanced, you think clearly and set healthy boundaries.'
  },
  '水': {
    element: 'Water',
    color: 'Black, Dark Blue, Navy, Deep Purple',
    direction: 'North',
    food: 'Salty foods (moderate), black sesame, walnuts, seafood',
    exercise: 'Swimming, yoga, meditation, restorative practices',
    acupoint: 'Kidney 3 (Taixi), Kidney 1 (Yongquan)',
    sleep: 'Sleep before 11pm, keep lower back warm',
    classic: '"In winter, all things close and store. Water freezes, earth cracks — do not disturb the yang energy." — Huangdi Neijing. When Water is weak, nourish the kidneys, conserve energy, and rest deeply.',
    emotion: 'Water represents wisdom and flow. When balanced, you trust life and adapt gracefully.'
  }
};

// Get wellness plan based on weakest element
export function getWellnessPlan(weakestElement: string): WellnessPlan | null {
  return WELLNESS_MAP[weakestElement] || null;
}
