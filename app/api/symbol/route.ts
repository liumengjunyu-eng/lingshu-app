// app/api/symbol/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { runSymbolEngine, SymbolEngineInput } from '@/lib/engine/symbolEngine';

export async function POST(req: NextRequest) {
 try {
 const body = await req.json();
 const input = body as SymbolEngineInput;

 // 验证必要字段
 if (
 input.fatigueLevel === undefined ||
 input.stressLevel === undefined ||
 input.sleepQuality === undefined
 ) {
 return NextResponse.json(
 { error: 'Missing required fields: fatigueLevel, stressLevel, sleepQuality' },
 { status: 400 }
 );
 }

 const result = runSymbolEngine(input);

 return NextResponse.json({
 success: true,
 data: result,
 });
 } catch (error) {
 console.error('[Symbol Engine Error]', error);
 return NextResponse.json(
 { error: 'Internal server error' },
 { status: 500 }
 );
 }
}
