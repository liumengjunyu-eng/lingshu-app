// app/api/symbol/v2/route.ts
// V6 Symbol Engine API

import { NextRequest, NextResponse } from 'next/server';
import { runSymbolEngine } from '@/engine/symbol';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const signals = await request.json();

    // 验证必填字段
    const requiredFields = ['sleepQuality', 'fatigue', 'stress', 'digestion', 'anxiety', 'motivation', 'clarity', 'workLoad', 'socialLoad', 'exercise'];
    for (const field of requiredFields) {
      if (typeof signals[field] !== 'number') {
        return NextResponse.json({ error: `Missing or invalid field: ${field}` }, { status: 400 });
      }
    }

    const result = runSymbolEngine(signals);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('[Symbol V2 Engine Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
