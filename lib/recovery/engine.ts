import { UserScore, RecoveryStateLevel } from './types';

export function calculateState(score: UserScore): RecoveryStateLevel {
  if (score.fatigue > 75) return 'overloaded';
  if (score.fatigue > 50) return 'depleting';
  if (score.stability < 40) return 'unstable';
  if (score.recoveryRate > 55 && score.fatigue < 45) return 'recovering';
  return 'stable';
}

export function getStateLabel(state: RecoveryStateLevel): string {
  const map: Record<RecoveryStateLevel, string> = {
    overloaded: '过载',
    depleting: '消耗中',
    unstable: '波动',
    recovering: '恢复中',
    stable: '稳定',
  };
  return map[state];
}

export function getStateInsight(state: RecoveryStateLevel): string {
  const map: Record<RecoveryStateLevel, string> = {
    overloaded: '你不是累，是输入已经压垮了恢复系统。',
    depleting: '你在持续消耗，但没有给恢复留出空间。',
    unstable: '你的问题不是忙，是节奏被打破了。',
    recovering: '恢复正在发生，但还不足以建立稳定节奏。',
    stable: '你已经回到可恢复状态。',
  };
  return map[state];
}

export function getStateEmoji(state: RecoveryStateLevel): string {
  const map: Record<RecoveryStateLevel, string> = {
    overloaded: '🔴',
    depleting: '🟠',
    unstable: '🟡',
    recovering: '🟢',
    stable: '✅',
  };
  return map[state];
}

export function calculateNextScore(
  current: UserScore,
  feedback: 'done' | 'partial' | 'skip'
): UserScore {
  const next = { ...current };

  switch (feedback) {
    case 'done':
      next.fatigue = Math.max(0, next.fatigue - 15);
      next.recoveryRate = Math.min(100, next.recoveryRate + 12);
      next.stability = Math.min(100, next.stability + 10);
      next.inputLoad = Math.max(0, next.inputLoad - 10);
      next.streak += 1;
      break;
    case 'partial':
      next.fatigue = Math.max(0, next.fatigue - 5);
      next.recoveryRate = Math.min(100, next.recoveryRate + 4);
      next.stability = Math.min(100, next.stability + 3);
      next.inputLoad = Math.max(0, next.inputLoad - 3);
      next.streak = 0;
      break;
    case 'skip':
      next.fatigue = Math.min(100, next.fatigue + 10);
      next.recoveryRate = Math.max(0, next.recoveryRate - 5);
      next.stability = Math.max(0, next.stability - 5);
      next.inputLoad = Math.min(100, next.inputLoad + 8);
      next.streak = 0;
      break;
  }

  return next;
}

export function getSymptoms(state: RecoveryStateLevel): string[] {
  const map: Record<RecoveryStateLevel, string[]> = {
    overloaded: [
      '明明休息了，还是累',
      '情绪容易被放大',
      '精力恢复明显变慢',
      '注意力难以集中',
    ],
    depleting: [
      '工作后恢复变慢',
      '情绪波动比以前频繁',
      '睡眠质量不稳定',
    ],
    unstable: [
      '节奏容易被打乱',
      '做事效率时高时低',
      '容易分心',
    ],
    recovering: [
      '偶尔感觉恢复不够快',
      '压力后需要更长时间调整',
      '体力恢复比想象中慢',
    ],
    stable: [
      '恢复速度正常',
      '情绪稳定',
      '精力储备充足',
    ],
  };
  return map[state] || map.stable;
}
