import { NextRequest, NextResponse } from 'next/server';
import { infer } from '@/lib/inference';
import { BirthInfo } from '@/lib/inference/types';

// 5 × 4 = 20 种路径的人格分配（FREEZE模式）
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

const RECOVERY_THRESHOLDS = [
 { max: 3, level: 'heavy' as const },
 { max: 6, level: 'medium' as const },
 { max: 8, level: 'light' as const },
 { max: 10, level: 'good' as const },
];

function calculateRecovery(primaryIssue: string, followUpChoice: string): {
  energy: number; recovery: number; stress: number; recoveryLevel: string;
} {
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
    const { primaryIssue, followUpChoice, name, year, month, day, hour, minute, city, gender, bloodType } = body;

    // 模式A: 推理引擎模式（有出生信息）
    if (year && month && day !== undefined && hour !== undefined) {
      const birthInfo: BirthInfo = {
        year, month, day, hour,
        minute: minute || 0,
        city: city || '',
        gender: gender || 'male',
      };
      const result = infer(birthInfo, bloodType);
      return NextResponse.json({
        success: true,
        name: name || '\u7528\u6237',
        ...result,
      });
    }

    // 模式B: FREEZE诊断模式（原逻辑）
    if (!primaryIssue || !followUpChoice) {
      return NextResponse.json(
        { error: '\u7f3a\u5c11\u53c2\u6570' },
        { status: 400 }
      );
    }

    const key = `${primaryIssue}_${followUpChoice}`;
    const persona = PERSONA_MAP[key];

    if (!persona) {
      return NextResponse.json(
        { error: '\u672a\u627e\u5230\u5339\u914d\u7684\u4eba\u683c\u7c7b\u578b' },
        { status: 404 }
      );
    }

    const scores = calculateRecovery(primaryIssue, followUpChoice);

    return NextResponse.json({
      data: { persona: persona.persona, element: persona.element, ...scores },
    });
  } catch (error) {
    console.error('[\u8bca\u65adAPI\u9519\u8bef]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '\u8bca\u65ad\u670d\u52a1\u5f02\u5e38' },
      { status: 500 }
    );
  }
}
