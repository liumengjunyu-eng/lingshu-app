/** @v4 - System Contract: Runtime Schema Lock */
export interface SystemContract {
  input: {
    sleepQuality: number;
    energyLevel: number;
    stressLevel: number;
    moodStability: number;
    focusLevel: number;
  };

  output: {
    user_profile: any;
    body_system: any;
    emotion_system: any;
    behavior_system: any;

    decision: {
      actions: string[];
      warnings: string[];
      prohibitions: string[];
      recoveryProtocol: string;
    };

    recovery_pathway: {
      phase_1: any;
      phase_2: any;
      phase_3: any;
    };
  };
}
