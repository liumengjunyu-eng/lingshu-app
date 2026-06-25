// app/api/symbol/v3/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { runSymbolEngine } from '@/lib/symbol/engine';
import type { HumanInput } from '@/lib/symbol/types';
import { getSessionIdFromRequest, getSupabase } from '@/lib/supabase/client';
import { createSnapshot, saveSnapshot, getMemory, analyzeEvolution } from '@/lib/symbol/v3/symbolMemory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = getSessionIdFromRequest(req);

    // Validate
    if (!body.body || !body.emotion) {
      return NextResponse.json({ error: 'Missing required fields: body, emotion' }, { status: 400 });
    }

    // 1. Run V2 engine
    const input = body as HumanInput;
    const symbol = runSymbolEngine(input);

    // 2. Save snapshot to memory (localStorage-side; server also tries Supabase)
    const snapshot = createSnapshot(symbol);
    saveSnapshot(sessionId, snapshot);

    // 3. Get full memory & evolution
    const memory = getMemory(sessionId);
    const evolution = analyzeEvolution(memory);

    // 4. Try Supabase persist (non-blocking)
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('symbol_states').insert({
        session_id: sessionId,
        input_data: input,
        element: symbol.meta.dominantElement,
        element_scores: symbol.fiveElements,
        tcm_patterns: [symbol.bodyDiagnosis.tcmPattern],
        tcm_detail: symbol.bodyDiagnosis,
        full_snapshot: symbol,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        evolution: memory.length >= 2 ? evolution : null,
        totalSnapshots: memory.length,
        sessionId,
      },
    });
  } catch (error) {
    console.error('[V3 Analyze Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
