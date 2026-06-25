import { getSessionId, insertEvent } from '@/lib/supabase/client';

export type TrackEvent =
 | 'visit'
 | 'test_start'
 | 'test_complete'
 | 'result_view'
 | 'share_click'
 | 'share_success';

export async function track(event: TrackEvent, metadata?: Record<string, any>) {
 const sessionId = getSessionId();

 if (typeof window !== 'undefined') {
 console.log('[Track]', event, { sessionId, metadata });
 }

 await insertEvent({
 session_id: sessionId,
 event_name: event,
 metadata: metadata || {},
 });
}
