import { AppState } from '@/lib/state';
import { RecoveryPersona } from './types';

/**
 * 根据用户状态判断恢复人格分型
 */
export function determinePersona(state: AppState): RecoveryPersona {
  const { fatigueLevel, recoveryScore, streak } = state.recovery;

  // 信息过载型：疲劳高 + 恢复低 + 连续完成低
  if (fatigueLevel > 7 && recoveryScore < 4 && streak < 2) {
    return 'information_overload';
  }

  // 情绪疲劳型：疲劳中 + 恢复中 + 连续完成中
  if (fatigueLevel > 5 && recoveryScore < 6 && streak < 4) {
    return 'emotional_fatigue';
  }

  // 执行力下降型（默认）：恢复低 + 连续完成低
  if (recoveryScore < 4 && streak < 3) {
    return 'execution_decline';
  }

  // 默认：执行力下降型
  return 'execution_decline';
}

/**
 * 获取人格对应的显示名称和描述
 */
export function getPersonaInfo(persona: RecoveryPersona): {
  label: string;
  description: string;
  insight: string;
} {
  const map: Record<
    RecoveryPersona,
    { label: string; description: string; insight: string }
  > = {
    information_overload: {
      label: '信息过载型',
      description: '你的疲惫主要来自持续的信息输入过载',
      insight: '你不是累，是输入已经超过了你的处理能力。',
    },
    emotional_fatigue: {
      label: '情绪疲劳型',
      description: '你的疲惫主要来自情绪消耗和内在压力',
      insight: '你不是状态差，是情绪在持续消耗你的恢复能力。',
    },
    execution_decline: {
      label: '执行力下降型',
      description: '你的疲惫表现为行动力下降和节奏紊乱',
      insight: '你不是不想做，是恢复速度跟不上消耗速度。',
    },
  };

  return map[persona];
}
