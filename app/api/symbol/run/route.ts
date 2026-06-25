// app/api/symbol/run/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { runSymbolEngine } from '@/lib/symbol/engine';
import type { HumanInput } from '@/lib/symbol/types';
import { getSupabase, getSessionIdFromRequest } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
 try {
 const body = await req.json();
 const sessionId = getSessionIdFromRequest(req);

 // Validate input
 if (!body.body || !body.emotion || !body.behavior) {
 return NextResponse.json(
 { error: 'Missing required fields: body, emotion, behavior' },
 { status: 400 }
 );
 }

 const input = body as HumanInput;
 const result = runSymbolEngine(input);

 // Store to Supabase (non-blocking)
 const supabase = getSupabase();
 if (supabase) {
 await supabase.from('symbol_states').insert({
 session_id: sessionId,
 input_data: input,
 element: result.meta.dominantElement,
 element_scores: result.fiveElements,
 tcm_patterns: [result.bodyDiagnosis.tcmPattern],
 tcm_detail: result.bodyDiagnosis,
 full_snapshot: result,
 });
 }

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
