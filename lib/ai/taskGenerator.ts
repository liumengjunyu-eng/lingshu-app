import { AppState } from '@/lib/state';

export type GeneratedTask = {
  id: string;
  title: string;
  instruction: string;
  reasoning: string;
};

function buildPrompt(state: AppState): string {
  return `你是一个行为恢复系统。用户当前状态：
- 疲劳程度：${state.recovery.fatigueLevel}/10
- 恢复指数：${state.recovery.recoveryScore}/10
- 当前阶段：${state.recovery.stage}
- 连续完成：${state.recovery.streak}
- 是否付费用户：${state.premium.isPremium}

目标：生成一个"低负担、可执行、能降低疲劳或提升恢复"的单一任务。
要求：
- 今天可以完成
- 低认知负担
- 必须改变行为，不是提供建议
- 不能重复"休息""放松"这类空泛指令
- 必须具体到动作级别

输出 JSON：
{
 "title": "",
 "instruction": "",
 "reasoning": ""
}`;
}

export async function generateTask(state: AppState): Promise<GeneratedTask> {
  const prompt = buildPrompt(state);

  const res = await fetch(
    `${typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ai/task`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    }
  );

  const data = await res.json();

  try {
    return data.task as GeneratedTask;
  } catch {
    return {
      id: 'fallback',
      title: '减少信息输入',
      instruction: '今天减少30%信息输入，不刷短内容超过30分钟',
      reasoning: 'fallback',
    };
  }
}
