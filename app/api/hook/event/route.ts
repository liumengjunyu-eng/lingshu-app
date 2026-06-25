// app/api/hook/event/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase/client';
import { getSessionIdFromRequest } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hookId, eventType } = body;
    const sessionId = getSessionIdFromRequest(req);

    if (!hookId || !eventType) {
      return NextResponse.json(
        { error: 'Missing hookId or eventType' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('hook_events').insert({
        hook_id: hookId,
        session_id: sessionId,
        event_type: eventType,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Hook Event Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
