import { NextRequest, NextResponse } from 'next/server';

// 5 × 4 = 20 种路径的人格分配
const PERSONA_MAP: Record<string, { persona: string; element: string }> = {
 'sleep_A': { persona: '执行者', element: '金' },
 'sleep_B': { persona: '完美者', element: '土' },
 'sleep_C': { persona: '敏感者', element: '水' },
 'sleep_D': { persona: '思考者', element: '金' },
 'anxiety_A': { persona: '思考者', element: '金' },
 'anxiety_B': { persona: '完美者', element: '土' },
 'anxiety_C': { persona: '敏感者', element: '水' },
 'anxiety_D': { persona: '探索者', element: '火' },
 'direction_A': { persona: '思考者', element: '金' },
 'direction_B': { persona: '完美者', element: '土' },
 'direction_C': { persona: '探索者', element: '火' },
 'direction_D': { persona: '执行者', element: '金' },
 'relationship_A': { persona: '探索者', element: '火' },
 'relationship_B': { persona: '敏感者', element: '水' },
 'relationship_C': { persona: '执行者', element: '金' },
 'relationship_D': { persona: '观察者', element: '木' },
 'energy_A': { persona: '执行者', element: '金' },
 'energy_B': { persona: '敏感者', element: '水' },
 'energy_C': { persona: '探索者', element: '火' },
 'energy_D': { persona: '观察者', element: '木' },
};

// 恢复等级阈值
const RECOVERY_THRESHOLDS = [
 { max: 3, level: 'heavy' as const },
 { max: 6, level: 'medium' as const },
 { max: 8, level: 'light' as const },
 { max: 10, level: 'good' as const },
];

function calculateRecovery(primaryIssue: string, followUpChoice: string): {
 energy: number;
 recovery: number;
 stress: number;
 recoveryLevel: string;
} {
 // 伪随机但确定性的评分
 const hash = primaryIssue.charCodeAt(0) + followUpChoice.charCodeAt(0);
 const seed = hash % 10;

 const energy = Math.min(10, Math.max(1, seed + 2));
 const stress = Math.min(10, Math.max(1, 10 - seed + 1));
 const recovery = Math.min(10, Math.max(1, energy - stress + 5));

 const recoveryLevel = RECOVERY_THRESHOLDS.find(t => recovery <= t.max)?.level || 'good';

 return { energy, recovery, stress, recoveryLevel };
}

export async function POST(request: NextRequest) {
 try {
 const body = await request.json();
 const { primaryIssue, followUpChoice } = body;

 if (!primaryIssue || !followUpChoice) {
 return NextResponse.json(
 { error: '缺少参数' },
 { status: 400 }
 );
 }

 const key = `${primaryIssue}_${followUpChoice}`;
 const persona = PERSONA_MAP[key];

 if (!persona) {
 return NextResponse.json(
 { error: '未找到匹配的人格类型' },
 { status: 404 }
 );
 }

 const scores = calculateRecovery(primaryIssue, followUpChoice);

 return NextResponse.json({
 data: {
 persona: persona.persona,
 element: persona.element,
 ...scores,
 },
 });
 } catch (error) {
 console.error('[诊断API错误]', error);
 return NextResponse.json(
 { error: '诊断服务异常' },
 { status: 500 }
 );
 }
}
