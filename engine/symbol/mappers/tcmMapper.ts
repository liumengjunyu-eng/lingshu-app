// engine/symbol/mappers/tcmMapper.ts
// 中医体质映射

import { TcmPattern } from '../core/types';

export interface TcmProfile {
  pattern: TcmPattern;
  label: string;
  description: string;
  symptoms: string[];
  dietaryAdvice: string[];
  lifestyleAdvice: string[];
  relatedOrgans: string[];
  seasonPreference: string;
}

const TCM_PROFILES: Record<TcmPattern, TcmProfile> = {
  qi_deficiency: {
    pattern: 'qi_deficiency',
    label: 'Qi Deficiency (气虚)',
    description: 'Vital energy is depleted. The engine runs but the fuel is low.',
    symptoms: ['Persistent fatigue', 'Weak voice', 'Shortness of breath on mild exertion', 'Poor appetite', 'Spontaneous sweating'],
    dietaryAdvice: ['Cooked warm foods (soups, stews)', 'Root vegetables', 'Avoid raw/cold foods', 'Ginger and dates'],
    lifestyleAdvice: ['Restorative yoga', 'Avoid over-exertion', 'Consistent sleep schedule', 'Morning sunlight exposure'],
    relatedOrgans: ['Spleen', 'Lungs'],
    seasonPreference: 'Late summer, early autumn',
  },
  blood_stasis: {
    pattern: 'blood_stasis',
    label: 'Blood Stasis (血瘀)',
    description: 'Blood flow is stagnant. Energy is trapped in certain areas and cannot circulate.',
    symptoms: ['Sharp localized pain', 'Dark circles under eyes', 'Cold extremities', 'Purple tongue', 'Menstrual irregularities'],
    dietaryAdvice: ['Saffron, turmeric', 'Dark leafy greens', 'Warm beverages', 'Avoid dairy excess'],
    lifestyleAdvice: ['Movement therapy (dance, walking)', 'Acupuncture', 'Massage', 'Deep breathing exercises'],
    relatedOrgans: ['Liver', 'Heart'],
    seasonPreference: 'Spring',
  },
  yin_deficiency: {
    pattern: 'yin_deficiency',
    label: 'Yin Deficiency (阴虚)',
    description: 'Cooling, nourishing energy is depleted. The body is dry and overheated internally.',
    symptoms: ['Night sweats', 'Dry mouth and throat', 'Insomnia', 'Malar flush', 'Scanty dark urine'],
    dietaryAdvice: ['Mung beans, tofu', 'Pear and lily bulb', 'Bone broth', 'Avoid spicy and fried foods'],
    lifestyleAdvice: ['Cool environment', 'Meditation before bed', 'Avoid excessive screen time', 'Early to bed'],
    relatedOrgans: ['Kidneys', 'Liver', 'Lungs'],
    seasonPreference: 'Autumn',
  },
  yang_excess: {
    pattern: 'yang_excess',
    label: 'Yang Excess (阳亢)',
    description: 'Active energy is in excess. The system is overheating from too much driving force.',
    symptoms: ['Red face and eyes', 'Irritability', 'Headaches', 'Constipation', 'Loud voice'],
    dietaryAdvice: ['Cooling foods (cucumber, watermelon)', 'Green tea', 'Mint', 'Reduce red meat'],
    lifestyleAdvice: ['Slow movement (Tai Chi)', 'Cooling breathing techniques', 'Reduce competitive activities'],
    relatedOrgans: ['Liver', 'Heart'],
    seasonPreference: 'Winter',
  },
  dampness: {
    pattern: 'dampness',
    label: 'Dampness (湿气)',
    description: 'Fluid metabolism is impaired. The body feels heavy, swollen, and sluggish.',
    symptoms: ['Heavy limbs', 'Brain fog', 'Edema', 'Greasy skin', 'Loose stools'],
    dietaryAdvice: ['Barley, adzuki beans', 'Pumpkin', 'Avoid dairy and fried food', 'Less sugar'],
    lifestyleAdvice: ['Dry brush', 'Sauna', 'Cardiovascular exercise', 'Dehumidified sleeping space'],
    relatedOrgans: ['Spleen', 'Lungs'],
    seasonPreference: 'Late summer',
  },
  balanced: {
    pattern: 'balanced',
    label: 'Balanced (平和)',
    description: 'Yin and Yang are in harmony. The body is functioning at optimal equilibrium.',
    symptoms: ['Good energy', 'Sound sleep', 'Stable mood', 'Normal appetite', 'Healthy complexion'],
    dietaryAdvice: ['Maintain balanced diet', 'Eat seasonally', 'Variety of colors in meals'],
    lifestyleAdvice: ['Continue current habits', 'Preventive check-ins', 'Seasonal adjustments'],
    relatedOrgans: ['All systems in balance'],
    seasonPreference: 'All seasons',
  },
};

export function getTcmProfile(pattern: TcmPattern): TcmProfile {
  return TCM_PROFILES[pattern];
}
