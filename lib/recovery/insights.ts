import { UserScore, RecoveryStateLevel } from './types';

export function generateInsight(
  state: RecoveryStateLevel,
  result: 'done' | 'partial' | 'skip'
): string {
  const map: Record<RecoveryStateLevel, Record<string, string>> = {
    overloaded: {
      done: '你今天停止了输入。这是恢复系统重新启动的第一步。',
      partial: '输入还在，但你已经意识到了。这本身就是恢复的开始。',
      skip: '输入还在持续。恢复没有启动，但明天可以重新选择。',
    },
    depleting: {
      done: '你正在恢复。但恢复是持续的，不是一次性的。继续保持。',
      partial: '恢复没有失败，只是被中断了。中断不可怕，放弃才可怕。',
      skip: '消耗还在继续。你需要的不是完美计划，是今天的一小步。',
    },
    unstable: {
      done: '节奏正在建立。你今天锁定了恢复的基础。',
      partial: '节奏还没有稳定，但你已经开始觉察到了。',
      skip: '节奏破碎。你需要的不是一个完美计划，是今天的一小步。',
    },
    recovering: {
      done: '恢复稳定了。继续维持，不要回到旧节奏。',
      partial: '恢复还在进行，但还没有变成新的习惯。',
      skip: '恢复被打断了。明天继续，不要中断两天。',
    },
    stable: {
      done: '你已经回到可恢复状态。继续保持这个节奏。',
      partial: '稳定但没有进步。恢复系统需要持续投入。',
      skip: '稳定被打破了。回到节奏需要重新开始。',
    },
  };

  return map[state]?.[result] || '你的状态正在被重新调整。明天继续。';
}

export function generateStreakInsight(streak: number): string {
  if (streak === 0) return '';
  if (streak < 3) return `你已经连续 ${streak} 天完成恢复任务。`;
  if (streak < 7) return `你已经连续 ${streak} 天完成恢复任务。节奏正在建立。`;
  return `你已经连续 ${streak} 天完成恢复任务。恢复系统已经启动。`;
}
