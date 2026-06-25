import { AppState } from '@/lib/state';
import { TASKS } from '@/lib/recovery';
import { RecoveryPersona, WeightedTask } from './types';
import { determinePersona } from './persona';

/**
 * 不同人格对任务类型的权重偏好
 */
const PERSONA_TASK_WEIGHTS: Record<
  RecoveryPersona,
  Record<string, number>
> = {
  information_overload: {
    stop_input: 1.8,
    reduce_input: 1.6,
    empty_time: 1.3,
    single_task: 0.8,
    rhythm_fix: 0.6,
    maintain: 0.4,
    decision_diet: 1.0,
    physical_reset: 1.1,
    emotion_release: 0.7,
  },
  emotional_fatigue: {
    emotion_release: 1.9,
    empty_time: 1.5,
    rhythm_fix: 1.2,
    maintain: 0.9,
    stop_input: 0.7,
    single_task: 0.6,
    decision_diet: 0.8,
    physical_reset: 1.0,
    reduce_input: 0.7,
  },
  execution_decline: {
    single_task: 1.7,
    rhythm_fix: 1.5,
    maintain: 1.3,
    stop_input: 1.0,
    reduce_input: 0.8,
    empty_time: 0.6,
    decision_diet: 0.9,
    physical_reset: 1.1,
    emotion_release: 0.8,
  },
};

/**
 * 获取按权重排序的任务列表
 */
export function getWeightedTasks(
  state: AppState,
  persona?: RecoveryPersona
): WeightedTask[] {
  const p = persona || determinePersona(state);
  const weights = PERSONA_TASK_WEIGHTS[p];

  return TASKS.map((task) => ({
    ...task,
    weight: weights[task.id] || 1.0,
  })).sort((a, b) => (b.weight || 0) - (a.weight || 0));
}

/**
 * 获取当前最优任务（推荐）
 */
export function getTopTask(state: AppState): WeightedTask {
  const weighted = getWeightedTasks(state);
  return weighted[0];
}

/**
 * 获取备选任务列表（用于展示更多选项）
 */
export function getAlternativeTasks(
  state: AppState,
  count: number = 3
): WeightedTask[] {
  const weighted = getWeightedTasks(state);
  return weighted.slice(1, count + 1);
}
