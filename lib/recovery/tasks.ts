import { RecoveryTask, RecoveryStateLevel } from './types';

export const TASKS: RecoveryTask[] = [
  {
    id: 'stop_input',
    title: '停止输入',
    instruction: '关闭所有非必要信息源 2 小时。不看手机、不刷视频、不读新闻。',
    insight: '你以为你需要休息，其实你需要停止输入。',
    applicableStates: ['overloaded'],
  },
  {
    id: 'reduce_input',
    title: '减少输入负荷',
    instruction: '今天减少 30% 信息输入（社交媒体/短视频/新闻）。只做必要沟通。',
    insight: '你不是累，是输入已经压垮了恢复系统。',
    applicableStates: ['overloaded', 'depleting'],
  },
  {
    id: 'single_task',
    title: '单任务模式',
    instruction: '今天只专注一个任务。切换任务前停顿 5 秒。',
    insight: '你的问题不是忙，是节奏破碎。',
    applicableStates: ['unstable'],
  },
  {
    id: 'empty_time',
    title: '空白时间',
    instruction: '留出 20 分钟完全无输入时间——不看、不读、不听。',
    insight: '恢复不是休息，是停止输入。',
    applicableStates: ['depleting', 'unstable'],
  },
  {
    id: 'rhythm_fix',
    title: '固定节奏',
    instruction: '今天固定起床和睡觉时间，保持节奏一致。',
    insight: '恢复正在发生，但节奏还不稳定。',
    applicableStates: ['unstable', 'recovering'],
  },
  {
    id: 'maintain',
    title: '维持恢复节奏',
    instruction: '保持当前的输入限制和作息节奏。今天不增加新任务。',
    insight: '你已经回到可恢复状态，继续保持。',
    applicableStates: ['recovering', 'stable'],
  },
  {
    id: 'decision_diet',
    title: '降低决策负荷',
    instruction: '今天减少非必要决策。吃什么、穿什么都提前简化。',
    insight: '每一个小决策都在消耗恢复资源。',
    applicableStates: ['depleting', 'unstable'],
  },
  {
    id: 'physical_reset',
    title: '身体优先',
    instruction: '今天完成一次 20 分钟的低强度身体活动——散步、拉伸、轻度运动。',
    insight: '恢复是从身体开始的，不是从脑子开始的。',
    applicableStates: ['overloaded', 'depleting'],
  },
  {
    id: 'emotion_release',
    title: '情绪表达',
    instruction: '写下最近最烦的一件事，不解决，只表达。写完后不再回顾。',
    insight: '情绪的持续消耗，比体力消耗更隐蔽。',
    applicableStates: ['unstable'],
  },
];

export function getTasksForState(state: RecoveryStateLevel): RecoveryTask[] {
  return TASKS.filter((t) => t.applicableStates.includes(state));
}

export function getCurrentTask(state: RecoveryStateLevel): RecoveryTask {
  const tasks = getTasksForState(state);
  if (tasks.length === 0) return TASKS[0];
  // 随机选择，避免每次都一样
  return tasks[Math.floor(Math.random() * tasks.length)];
}
