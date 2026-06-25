// app/api/symbol/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase/client';
import { getSessionIdFromRequest } from '@/lib/supabase/client';
import { runSymbolEngine } from '@/lib/engine/symbolEngine';
import { generateHook } from '@/lib/engine/hookGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = getSessionIdFromRequest(req);

    // 1. Run Symbol Engine
    const result = runSymbolEngine({
      fatigueLevel: body.fatigueLevel ?? 50,
      stressLevel: body.stressLevel ?? 50,
      sleepQuality: body.sleepQuality ?? 50,
      motivation: body.motivation ?? 50,
      digestion: body.digestion ?? 50,
      socialLoad: body.socialLoad ?? 50,
      astrology: body.astrology,
      bloodType: body.bloodType,
      gender: body.gender,
    });

    // 2. Generate Hook
    const hook = generateHook(result.element, result.elementScores);

    // 3. Store in Supabase (non-blocking)
    const supabase = getSupabase();
    if (supabase) {
      const { data: stateData, error: stateError } = await supabase
        .from('symbol_states')
        .insert({
          session_id: sessionId,
          input_data: body,
          energy_level: Math.round(result.elementScores.fire),
          fatigue_level: body.fatigueLevel,
          sleep_quality: body.sleepQuality,
          stress_pattern: body.stressLevel > 70 ? 'chronic' : body.stressLevel > 40 ? 'acute' : 'suppressed',
          activity_level: body.motivation > 70 ? 'high' : body.motivation > 40 ? 'medium' : 'low',
          element: result.element,
          element_balance: Math.round((result.elementScores[result.element] ?? 50) - 50),
          element_scores: result.elementScores,
          tcm_patterns: [],
          tcm_detail: result.tcm,
          astrology: body.astrology ?? null,
          blood_type: body.bloodType ?? null,
          personality_tag: result.element,
          environment_stress: body.socialLoad ?? 50,
          full_snapshot: result,
        })
        .select()
        .single();

      if (!stateError && stateData) {
        await supabase.from('life_recommendations').insert({
          symbol_state_id: stateData.id,
          diet: result.recommendations.food,
          movement: result.recommendations.movement,
          environment: result.recommendations.environment,
          emotional: result.recommendations.relationship,
          daily_routine: result.recommendations.dailyRoutine,
          spiritual: result.recommendations.spiritualPractice,
          full_recommendation: result.recommendations,
        });

        await supabase.from('hook_generations').insert({
          symbol_state_id: stateData.id,
          hook_text: hook.text,
          hook_type: hook.type,
          hook_category: hook.category,
          weight: hook.weight,
        });
      } else if (stateError) {
        console.error('[Supabase] Insert error:', stateError);
      }
    }

    // 4. Return result
    return NextResponse.json({
      success: true,
      data: {
        symbol: {
          element: result.element,
          elementScores: result.elementScores,
          balance: Math.round((result.elementScores[result.element] ?? 50) - 50),
        },
        tcm: result.tcm,
        emotionalPattern: result.emotionalPattern,
        recommendations: result.recommendations,
        hook,
        dominantDescription: result.dominantDescription,
        weakDescription: result.weakDescription,
      },
    });
  } catch (error) {
    console.error('[Symbol Analyze Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
