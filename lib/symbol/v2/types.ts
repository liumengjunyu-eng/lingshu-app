// V2.5 Unified Output — Behavioral Mirror + Monetized Explanation System

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

  signals: {
    body: number;
    stress: number;
    sleep: number;
    emotion: number;
    focus: number;
  };

  interpretation: {
    label: string;
    insight: string;
    evidence: string[];
  };

  decision: {
    actions: string[];
    warnings: string[];
    prohibitions: string[];
    recoveryProtocol: string;
  };

  recovery_pathway: {
    phase_1: { label: string; action: string; product: { id: string; name: string; priority: number } | null };
    phase_2: { label: string; action: string; product: { id: string; name: string; priority: number } | null };
    phase_3: { label: string; action: string; product: { id: string; name: string; priority: number } | null };
  };

  monetization: {
    paywall_reason: string;
    what_free_shows: string;
    what_paid_adds: string;
  };

  narrative: {
    risk_label: string;
    share_sentence: string;
    share_identity: string;
  };

  confidence: number;

  // V2.4 compatibility — five_elements for wellness radar
  five_elements: {
    wood: string;
    fire: string;
    earth: string;
    metal: string;
    water: string;
  };

  // V2.4 compatibility — forecast for risk signal
  forecast: {
    '7_days': string;
    '30_days': string;
    '90_days': string;
  };
}
