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

  // V5: Growth Engine
  share?: {
    title: string;
    subtitle: string;
    metrics: {
      load: number;
      state: string;
      volatility: number;
    };
    warning: string;
    cta: string;
  };

  identity?: {
    identity_line: string;
    inner_state: string;
    system_truth: string;
    share_ready: boolean;
  };

  growth?: {
    loopType: 'high_strain_viral' | 'reflection_viral' | 'curiosity_viral' | 'neutral';
    shareProbability: number;
    triggerText: string;
    channelStrategy: {
      tiktok: string;
      youtube: string;
      x: string;
      instagram: string;
    };
  };

  // V6: Autonomous Growth System
  content_stream?: {
    threads: Array<{
      platform: string;
      content: string;
    }>;
    hook_variants: string[];
  };

  distribution?: {
    tiktok: { format: string; viral_score: number; style: string };
    x: { format: string; viral_score: number; style: string };
    instagram: { format: string; viral_score: number; style: string };
    youtube: { format: string; viral_score: number; style: string };
  };

  feedback_loop?: {
    signals: string[];
    adaptive_rules: Array<{
      condition: string;
      action: string;
    }>;
    learning_target: string;
  };
}
