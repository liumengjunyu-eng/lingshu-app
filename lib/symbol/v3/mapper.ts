// lib/symbol/v3/mapper.ts
// Maps 5-diagnose answers → V2 HumanInput

import type { HumanInput } from '@/lib/symbol/types';

// Matches the ISSUE_TO_ENGINE keys in diagnose/page.tsx
const ANSWER_MAP: Record<string, { fatigue: number; stress: number; sleepQuality: number; motivation: number; digestion: number; socialLoad: number }> = {
  sleep_A: { fatigue: 75, stress: 60, sleepQuality: 25, motivation: 50, digestion: 60, socialLoad: 50 },
  sleep_B: { fatigue: 70, stress: 55, sleepQuality: 30, motivation: 40, digestion: 50, socialLoad: 45 },
  sleep_C: { fatigue: 80, stress: 65, sleepQuality: 20, motivation: 35, digestion: 45, socialLoad: 55 },
  sleep_D: { fatigue: 65, stress: 50, sleepQuality: 35, motivation: 55, digestion: 55, socialLoad: 50 },
  anxiety_A: { fatigue: 70, stress: 80, sleepQuality: 40, motivation: 45, digestion: 50, socialLoad: 50 },
  anxiety_B: { fatigue: 75, stress: 75, sleepQuality: 35, motivation: 40, digestion: 45, socialLoad: 45 },
  anxiety_C: { fatigue: 80, stress: 85, sleepQuality: 30, motivation: 30, digestion: 40, socialLoad: 40 },
  anxiety_D: { fatigue: 60, stress: 70, sleepQuality: 45, motivation: 55, digestion: 55, socialLoad: 50 },
  direction_A: { fatigue: 60, stress: 55, sleepQuality: 50, motivation: 30, digestion: 60, socialLoad: 40 },
  direction_B: { fatigue: 55, stress: 60, sleepQuality: 55, motivation: 25, digestion: 55, socialLoad: 35 },
  direction_C: { fatigue: 65, stress: 50, sleepQuality: 45, motivation: 70, digestion: 50, socialLoad: 45 },
  direction_D: { fatigue: 60, stress: 45, sleepQuality: 50, motivation: 35, digestion: 55, socialLoad: 40 },
  relationship_A: { fatigue: 70, stress: 65, sleepQuality: 50, motivation: 50, digestion: 50, socialLoad: 75 },
  relationship_B: { fatigue: 65, stress: 60, sleepQuality: 55, motivation: 45, digestion: 55, socialLoad: 60 },
  relationship_C: { fatigue: 75, stress: 70, sleepQuality: 40, motivation: 55, digestion: 45, socialLoad: 70 },
  relationship_D: { fatigue: 60, stress: 55, sleepQuality: 50, motivation: 40, digestion: 60, socialLoad: 55 },
  energy_A: { fatigue: 80, stress: 50, sleepQuality: 40, motivation: 40, digestion: 55, socialLoad: 45 },
  energy_B: { fatigue: 85, stress: 60, sleepQuality: 35, motivation: 30, digestion: 50, socialLoad: 50 },
  energy_C: { fatigue: 75, stress: 65, sleepQuality: 45, motivation: 50, digestion: 45, socialLoad: 55 },
  energy_D: { fatigue: 90, stress: 55, sleepQuality: 30, motivation: 25, digestion: 50, socialLoad: 40 },
};

export interface DiagnoseResult {
  primaryIssue: string;
  followUpChoice: string;
  emotion: string;
  persona: { persona: string; element: string };
  energy: number;
  recovery: number;
  stress: number;
  recoveryLevel: string;
  insights: string[];
}

export function mapToHumanInput(diagnose: DiagnoseResult): HumanInput {
  const key = `${diagnose.primaryIssue}_${diagnose.followUpChoice}`;
  const vals = ANSWER_MAP[key];
  if (!vals) {
    // Fallback defaults
    return {
      body: { fatigue: 60, sleepQuality: 50, digestion: 55, nervousSystem: 55, circulation: 50 },
      emotion: { stress: 60, anxiety: 50, motivation: 45, clarity: 45, emotionalStability: 50 },
      behavior: { workLoad: 55, socialLoad: 50, exercise: 35, screenTime: 60 },
      symbol: {},
    };
  }

  return {
    body: {
      fatigue: vals.fatigue,
      sleepQuality: vals.sleepQuality,
      digestion: vals.digestion,
      nervousSystem: vals.stress + 5,
      circulation: Math.round((100 - vals.fatigue + vals.motivation) / 2),
    },
    emotion: {
      stress: vals.stress,
      anxiety: Math.min(100, vals.stress - 5),
      motivation: vals.motivation,
      clarity: Math.max(10, vals.motivation - 15),
      emotionalStability: Math.max(10, 100 - vals.stress),
    },
    behavior: {
      workLoad: Math.round(vals.fatigue * 0.7 + vals.stress * 0.3),
      socialLoad: vals.socialLoad,
      exercise: Math.max(10, 100 - vals.fatigue - 30),
      screenTime: Math.round(vals.fatigue * 0.5 + 30),
    },
    symbol: {},
  };
}

export function parseDiagnoseResult(raw: string): DiagnoseResult | null {
  try {
    const parsed = JSON.parse(raw);

    // diagnose/page.tsx saves: { engineInput, diagnoseResult: { persona, element, emotion, insights, energy, recovery, stress, recoveryLevel }, primaryIssue, followUpChoice }
    // Note: API returns { data: {...} }, but diagnose page spreads data.data into diagnoseResult
    if (parsed.primaryIssue && parsed.followUpChoice && parsed.diagnoseResult) {
      const dr = parsed.diagnoseResult;
      return {
        primaryIssue: parsed.primaryIssue,
        followUpChoice: parsed.followUpChoice,
        emotion: dr.emotion || '',
        persona: { 
          persona: dr.persona || 'Balanced', 
          element: dr.element || 'Earth' 
        },
        energy: dr.energy ?? 5,
        recovery: dr.recovery ?? 5,
        stress: dr.stress ?? 5,
        recoveryLevel: dr.recoveryLevel || 'medium',
        insights: dr.insights || [],
      };
    }

    return null;
  } catch {
    return null;
  }
}

// Client-side only wrapper
export function loadDiagnoseResult(): DiagnoseResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('diagnosis_result');
    if (!raw) return null;
    return parseDiagnoseResult(raw);
  } catch {
    return null;
  }
}
