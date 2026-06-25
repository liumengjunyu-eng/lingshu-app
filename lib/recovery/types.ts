export type RecoveryStateLevel =
  | 'overloaded'
  | 'depleting'
  | 'unstable'
  | 'recovering'
  | 'stable';

export interface UserScore {
  fatigue: number; // 0-100
  inputLoad: number; // 0-100
  recoveryRate: number; // 0-100
  stability: number; // 0-100
  streak: number; // 连续完成天数
  isPremium: boolean;
}

export interface FeedbackResult {
  state: RecoveryStateLevel;
  insight: string;
  nextTask: string;
}

export interface RecoveryTask {
  id: string;
  title: string;
  instruction: string;
  insight: string;
  applicableStates: RecoveryStateLevel[];
}
