// app/api/symbol/state/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase/client';
import { getSessionIdFromRequest } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionId = getSessionIdFromRequest(req);
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { data: state, error } = await supabase
      .from('symbol_states')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !state) {
      return NextResponse.json(
        { error: 'No state found' },
        { status: 404 }
      );
    }

    // Get associated life recommendations
    const { data: recommendations } = await supabase
      .from('life_recommendations')
      .select('*')
      .eq('symbol_state_id', state.id)
      .single();

    // Get associated hook
    const { data: hook } = await supabase
      .from('hook_generations')
      .select('*')
      .eq('symbol_state_id', state.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        state,
        recommendations,
        hook,
      },
    });
  } catch (error) {
    console.error('[Symbol State Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
