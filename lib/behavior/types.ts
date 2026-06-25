import { RecoveryTask } from '@/lib/recovery';

export type RecoveryPersona =
  | 'information_overload' // 信息过载型
  | 'emotional_fatigue' // 情绪疲劳型
  | 'execution_decline'; // 执行力下降型

export interface WeightedTask extends RecoveryTask {
  weight: number;
}
