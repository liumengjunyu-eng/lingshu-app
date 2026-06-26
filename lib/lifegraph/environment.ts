// lib/lifegraph/environment.ts
// Relationship & Environment Engine — V4 模块三

import { LifeGraphNode } from './types';

// ─── 类型定义 ────────────────────────────────────────

export type RelationshipType = 'partner' | 'family' | 'coworkers' | 'friends' | 'mentor';

export interface RelationshipScore {
  type: RelationshipType;
  label: string;
  /** -50 (draining) → +50 (nourishing) */
  impact: number;
  description: string;
}

export type CityCategory = 'tier1_high_stress' | 'tier1_balanced' | 'tier2_growing' | 'small_stable' | 'nature_retreat';

export interface CityProfile {
  name: string;
  category: CityCategory;
  energy: number;       // 0-100 city energy
  stress: number;       // 0-100 stress index
  recoveryScore: number; // 0-100 how recovery-friendly
  description: string;
}

export interface EnvironmentAssessment {
  relationships: RelationshipScore[];
  relationshipSummary: {
    totalImpact: number;  // -100 to +100
    nourishingCount: number;
    drainingCount: number;
    dominantType: 'nourishing' | 'draining' | 'balanced';
  };
  currentCity: CityProfile | null;
  recommendedCities: CityProfile[];
  workspaceEnergy: number;     // 0-100
  homeEnergy: number;          // 0-100
  overallEnvironmentScore: number; // 0-100
}

// ─── 城市数据 ────────────────────────────────────────

const CITY_DATABASE: CityProfile[] = [
  { name: 'Shanghai', category: 'tier1_high_stress', energy: 75, stress: 82, recoveryScore: 35, description: 'High energy, high pressure. Constant stimulation accelerates burnout.' },
  { name: 'Beijing', category: 'tier1_high_stress', energy: 72, stress: 85, recoveryScore: 30, description: 'Intense career environment. Environmental stress from scale and pace.' },
  { name: 'Shenzhen', category: 'tier1_high_stress', energy: 78, stress: 80, recoveryScore: 32, description: 'Young city, relentless pace. Innovation at the cost of recovery.' },
  { name: 'Hangzhou', category: 'tier1_balanced', energy: 65, stress: 55, recoveryScore: 62, description: 'Tech hub with natural balance. West Lake provides a recovery anchor.' },
  { name: 'Chengdu', category: 'tier1_balanced', energy: 55, stress: 45, recoveryScore: 70, description: 'Laid-back culture. Strong social recovery environment.' },
  { name: 'Kunming', category: 'small_stable', energy: 45, stress: 30, recoveryScore: 82, description: 'Spring climate year-round. Natural recovery environment.' },
  { name: 'Dali', category: 'nature_retreat', energy: 30, stress: 20, recoveryScore: 92, description: 'Low stimulation, high nature. Maximum recovery potential.' },
  { name: 'Singapore', category: 'tier1_balanced', energy: 68, stress: 50, recoveryScore: 65, description: 'Structured, clean, efficient. Moderate recovery support.' },
  { name: 'Tokyo', category: 'tier1_high_stress', energy: 70, stress: 78, recoveryScore: 38, description: 'High density, long hours. Recovery requires deliberate effort.' },
  { name: 'Berlin', category: 'tier1_balanced', energy: 60, stress: 45, recoveryScore: 68, description: 'Creative capital with strong work-life boundaries.' },
  { name: 'Chiang Mai', category: 'nature_retreat', energy: 28, stress: 18, recoveryScore: 90, description: 'Digital nomad hub. Low cost, low stress, high recovery.' },
  { name: 'Melbourne', category: 'tier1_balanced', energy: 58, stress: 42, recoveryScore: 72, description: 'Strong café culture. Arts + nature in balance.' },
];

// ─── 诊断推荐 ────────────────────────────────────────

/**
 * 根据当前能量状态推荐适合的城市
 */
export function recommendCitiesByState(node: LifeGraphNode): CityProfile[] {
  const fatigue = node.fatigue;

  if (fatigue > 70) {
    // 高疲劳 → 自然疗愈型城市
    return CITY_DATABASE.filter(c => c.category === 'nature_retreat' || c.category === 'small_stable')
      .sort((a, b) => b.recoveryScore - a.recoveryScore);
  }

  if (fatigue > 45) {
    // 中高疲劳 → 平衡型城市
    return CITY_DATABASE.filter(c => c.category === 'tier1_balanced' || c.category === 'small_stable')
      .sort((a, b) => b.recoveryScore - a.recoveryScore);
  }

  // 低疲劳 → 可接受任何城市
  return CITY_DATABASE.filter(c => c.recoveryScore > 40)
    .sort((a, b) => b.recoveryScore - a.recoveryScore);
}

/**
 * 寻找特定城市信息
 */
export function findCity(name: string): CityProfile | null {
  return CITY_DATABASE.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
}

// ─── 关系评估生成 ────────────────────────────────────

/**
 * 基于系统状态生成关系评估
 * （实际产品中应让用户填写关系数据，此版本基于状态推断倾向）
 */
export function assessRelationships(node: LifeGraphNode): RelationshipScore[] {
  const fatigue = node.fatigue;
  const state = node.state;

  // 基于状态生成基础关系倾向
  const isOverloaded = fatigue > 60;
  const isRecovering = node.phase === 'active_recovery' || node.phase === 'identity_shift';

  const relationships: RelationshipScore[] = [
    {
      type: 'partner',
      label: 'Partner / Spouse',
      impact: isOverloaded ? -15 : isRecovering ? -8 : 20,
      description: isOverloaded
        ? 'Your energy deficit makes emotional availability difficult. Not their fault — but the drain is real.'
        : isRecovering
        ? 'You need space right now. Communicate it clearly, don\'t let guilt create more fatigue.'
        : 'Strong emotional anchor. This relationship is a net energy gain.',
    },
    {
      type: 'family',
      label: 'Family',
      impact: isOverloaded ? -20 : 5,
      description: isOverloaded
        ? 'Family expectations are adding to your load. Boundaries are not rejection — they\'re survival.'
        : 'Moderate support. Manage expectations to keep it from becoming a drain.',
    },
    {
      type: 'coworkers',
      label: 'Coworkers',
      impact: state === 'burned_fire_architect' ? -25 : -10,
      description: state === 'burned_fire_architect'
        ? 'Your work environment is the primary drain source. Constant demand, insufficient recovery.'
        : 'Standard workplace friction. Manageable with proper boundaries.',
    },
    {
      type: 'friends',
      label: 'Friends',
      impact: isOverloaded ? -10 : 15,
      description: isOverloaded
        ? 'You\'ve been withdrawing. True friends will understand — give them context, not silence.'
        : 'Social connections are supporting your recovery. Maintain them.',
    },
    {
      type: 'mentor',
      label: 'Mentor / Guide',
      impact: isRecovering ? 25 : 10,
      description: isRecovering
        ? 'Now is the right time to seek guidance. A mentor can shorten your recovery curve significantly.'
        : 'A trusted outside perspective would add stability.',
    },
  ];

  return relationships;
}

// ─── 综合评估 ────────────────────────────────────────

export function assessEnvironment(
  node: LifeGraphNode,
  cityName?: string
): EnvironmentAssessment {
  const relationships = assessRelationships(node);
  const totalImpact = relationships.reduce((sum, r) => sum + r.impact, 0);
  const nourishingCount = relationships.filter(r => r.impact > 0).length;
  const drainingCount = relationships.filter(r => r.impact < 0).length;

  const dominantType = totalImpact > 10 ? 'nourishing'
    : totalImpact < -10 ? 'draining'
    : 'balanced';

  const currentCity = cityName ? findCity(cityName) : null;
  const recommendedCities = recommendCitiesByState(node);

  // 工作环境能量：基于状态推断
  const workspaceEnergy = node.state === 'burned_fire_architect' ? 25
    : node.fatigue > 70 ? 18
    : node.fatigue > 45 ? 45
    : 65;

  // 家庭环境能量：基于状态
  const homeEnergy = node.fatigue > 70 ? 30
    : node.fatigue > 45 ? 55
    : 70;

  const environmentScore = Math.round(
    (Math.max(0, 100 + totalImpact) * 0.3) +
    ((currentCity?.recoveryScore || 50) * 0.25) +
    (workspaceEnergy * 0.25) +
    (homeEnergy * 0.2)
  );

  return {
    relationships,
    relationshipSummary: {
      totalImpact,
      nourishingCount,
      drainingCount,
      dominantType,
    },
    currentCity,
    recommendedCities,
    workspaceEnergy,
    homeEnergy,
    overallEnvironmentScore: Math.min(100, Math.max(0, environmentScore)),
  };
}
