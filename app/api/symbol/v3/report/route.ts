// app/api/symbol/v3/report/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { runSymbolEngine } from '@/lib/symbol/engine';
import type { HumanInput } from '@/lib/symbol/types';
import { getSessionIdFromRequest } from '@/lib/supabase/client';
import { createSnapshot, getMemory } from '@/lib/symbol/v3/symbolMemory';
import { generateDeepReport } from '@/lib/symbol/v3/deepReport';
import { runDecisionEngine, type DecisionDomain } from '@/lib/symbol/v3/decisionEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = getSessionIdFromRequest(req);

    if (!body.body || !body.emotion) {
      return NextResponse.json({ error: 'Missing required fields: body, emotion' }, { status: 400 });
    }

    // 1. Run engine
    const input = body as HumanInput;
    const symbol = runSymbolEngine(input);

    // 2. Get memory
    const memory = getMemory(sessionId);
    const snapshot = createSnapshot(symbol);

    // 3. Generate deep report
    const report = generateDeepReport(symbol, snapshot, memory);

    // 4. Run all 5 decision domains
    const domains: DecisionDomain[] = ['career', 'relationship', 'health', 'location', 'timing'];
    const decisions = domains.map(domain => {
      const r = runDecisionEngine({ domain, userId: sessionId, currentSymbol: symbol });
      return { domain, topPick: r.topPick, options: r.options.slice(0, 3), warning: r.warning };
    });

    return NextResponse.json({
      success: true,
      data: {
        report,
        decisions,
        symbol: {
          fiveElements: symbol.fiveElements,
          persona: symbol.persona,
          meta: symbol.meta,
          emotionProfile: symbol.emotionProfile,
        },
        evolution: memory.length >= 2 ? true : false,
        totalSnapshots: memory.length,
      },
    });
  } catch (error) {
    console.error('[V3 Report Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
