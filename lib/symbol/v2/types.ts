// lib/symbol/v2/types.ts
// V2.2 类型定义

export interface SymptomInput {
  sleepQuality: number;   // 0-100
  energyLevel: number;    // 0-100
  stressLevel: number;    // 0-100
  moodStability: number;  // 0-100
  focusLevel: number;     // 0-100
}

export interface V2Output {
  user_profile: {
    archetype: string;
    intensity_score: number;
  };
  body_system: {
    energy_level: 'high' | 'medium' | 'low';
    fatigue_type: string;
    sleep_quality: 'good' | 'fragmented' | 'poor';
  };
  emotion_system: {
    dominant_state: string;
    volatility: 'high' | 'medium' | 'low';
    recovery_speed: 'fast' | 'medium' | 'slow';
  };
  behavior_system: {
    patterns: string[];
  };
  five_elements: {
    wood: 'high' | 'medium' | 'low' | 'unstable' | 'exhausted';
    fire: 'high' | 'medium' | 'low' | 'unstable' | 'exhausted';
    earth: 'high' | 'medium' | 'low' | 'unstable' | 'exhausted';
    metal: 'high' | 'medium' | 'low' | 'unstable' | 'exhausted';
    water: 'high' | 'medium' | 'low' | 'unstable' | 'exhausted';
  };
  conflict_engine: {
    core_conflict: string;
    secondary_conflicts: string[];
  };
  forecast: {
    '7_days': string;
    '30_days': string;
    '90_days': string;
  };
  recovery_plan: {
    phase_1: string;
    phase_2: string;
    phase_3: string;
  };
  // ⭐ V2.2 核心：recovery_pathway 替换 product_mapping
  recovery_pathway: {
    phase_1: {
      label: string;
      action: string;
      product: { id: string; name: string; priority: number } | null;
    };
    phase_2: {
      label: string;
      action: string;
      product: { id: string; name: string; priority: number } | null;
    };
    phase_3: {
      label: string;
      action: string;
      product: { id: string; name: string; priority: number } | null;
    };
  };
  // V2.1 决策引擎
  decision: {
    actions: string[];
    warnings: string[];
    prohibitions: string[];
    recoveryProtocol: string;
  };
  // V2.4 增长引擎
  share: {
    tiktok: { hook: string; body: string; closing: string };
    twitter: { text: string };
    instagram: { caption: string };
    card: { title: string; subtitle: string; score: number };
  };
  // V2.5 增长字段：传播与表达层
  narrative_seed: string;
  share_angle: string;
}
