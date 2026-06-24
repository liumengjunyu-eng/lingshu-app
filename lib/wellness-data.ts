// 六维调理方案数据
// 基于五行偏弱，提供针对性的调理建议

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
    element: '木',
    color: 'Green, Teal, Forest Green',
    direction: 'East',
    food: 'Sour foods, leafy greens, sprouts, lemon',
    exercise: 'Stretching, Tai Chi, morning walk in nature',
    acupoint: 'Liver 3 (Taichong), Gallbladder 20 (Fengchi)',
    sleep: 'Sleep before 11pm, wake up with sunrise',
    classic: '《黄帝内经》云：「春三月，此谓发陈。天地俱生，万物以荣。」木行偏弱者，宜顺应春气，舒展身心。',
    emotion: 'Wood represents growth and expansion. When balanced, you feel motivated and decisive.'
  },
  '火': {
    element: '火',
    color: 'Red, Pink, Coral, Warm Orange',
    direction: 'South',
    food: 'Bitter foods, red beans, goji berries, small amount of spice',
    exercise: 'Heart-opening yoga, dancing, social sports',
    acupoint: 'Heart 7 (Shenmen), Pericardium 6 (Neiguan)',
    sleep: 'Sleep before 12am, avoid over-excitement at night',
    classic: '《黄帝内经》云：「夏三月，此谓蕃秀。天地气交，万物华实。」火行偏弱者，宜温养心阳，保持喜悦。',
    emotion: 'Fire represents joy and connection. When balanced, you radiate warmth and charisma.'
  },
  '土': {
    element: '土',
    color: 'Yellow, Orange, Earth tones',
    direction: 'Center',
    food: 'Sweet foods (natural), millet, pumpkin, sweet potato',
    exercise: 'Grounding exercises, walking barefoot on grass, qigong',
    acupoint: 'Stomach 36 (Zusanli), Spleen 6 (Sanyinjiao)',
    sleep: 'Regular sleep schedule, avoid late-night eating',
    classic: '《黄帝内经》云：「中央黄色，入通于脾。」土行偏弱者，宜健脾和胃，保持中心稳固。',
    emotion: 'Earth represents stability and nourishment. When balanced, you feel centered and supportive.'
  },
  '金': {
    element: '金',
    color: 'White, Silver, Metallic, Pale gold',
    direction: 'West',
    food: 'Pungent foods, white foods (radish, pear, lily bulb)',
    exercise: 'Cardio, breathing exercises, autumn hikes',
    acupoint: 'Lung 7 (Lieque), Large Intestine 4 (Hegu)',
    sleep: 'Sleep with window slightly open, wake up early',
    classic: '《黄帝内经》云：「秋三月，此谓容平。天气以急，地气以明。」金行偏弱者，宜润肺益气，保持清爽。',
    emotion: 'Metal represents clarity and discernment. When balanced, you think clearly and set healthy boundaries.'
  },
  '水': {
    element: '水',
    color: 'Black, Dark Blue, Navy, Deep Purple',
    direction: 'North',
    food: 'Salty foods (moderate), black sesame, walnuts, seafood',
    exercise: 'Swimming, yoga, meditation, restorative practices',
    acupoint: 'Kidney 3 (Taixi), Kidney 1 (Yongquan)',
    sleep: 'Sleep before 11pm, keep lower back warm',
    classic: '《黄帝内经》云：「冬三月，此谓闭藏。水冰地坼，无扰乎阳。」水行偏弱者，宜补肾藏精，保持内在宁静。',
    emotion: 'Water represents wisdom and flow. When balanced, you trust life and adapt gracefully.'
  }
};

// 根据五行获取调理方案
export function getWellnessPlan(weakestElement: string): WellnessPlan | null {
  return WELLNESS_MAP[weakestElement] || null;
}
