// app/api/symbol/v3/memory/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSessionIdFromRequest } from '@/lib/supabase/client';
import { getMemory, analyzeEvolution, getEvolutionScore } from '@/lib/symbol/v3/symbolMemory';

export async function GET(req: NextRequest) {
  try {
    const sessionId = getSessionIdFromRequest(req);
    const memory = getMemory(sessionId);

    if (memory.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          memory: [],
          evolution: null,
          evolutionScore: 50,
          totalSnapshots: 0,
        },
      });
    }

    const evolution = memory.length >= 2 ? analyzeEvolution(memory) : null;
    const score = getEvolutionScore(memory);

    return NextResponse.json({
      success: true,
      data: {
        memory: memory.slice(-5).reverse(), // last 5, newest first
        evolution,
        evolutionScore: score,
        totalSnapshots: memory.length,
      },
    });
  } catch (error) {
    console.error('[V3 Memory Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
