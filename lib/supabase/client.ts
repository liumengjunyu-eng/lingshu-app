import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
 if (_supabase) return _supabase;
 const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
 const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if (!supabaseUrl || !supabaseKey) return null;
 _supabase = createClient(supabaseUrl, supabaseKey);
 return _supabase;
}

export function getSessionId(): string {
 if (typeof window === 'undefined') return '';
 let id = localStorage.getItem('session_id');
 if (!id) {
 id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
 localStorage.setItem('session_id', id);
 }
 return id;
}

export async function insertEvent(payload: { session_id: string; event_name: string; metadata: Record<string, any> }): Promise<void> {
 const supabase = getSupabase();
 if (!supabase) {
 console.warn('[Supabase] Not configured, skipping event insert');
 return;
 }
 try {
 const { error } = await supabase.from('events').insert(payload);
 if (error) console.error('[Supabase] Insert error:', error);
 } catch (err) {
 console.error('[Supabase] Insert exception:', err);
 }
}
