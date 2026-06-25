import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: NextRequest) {
 try {
 const body = await req.json();
 const { session_id, event_name, metadata } = body;

 if (!session_id || !event_name) {
 return NextResponse.json({ error: 'missing required fields' }, { status: 400 });
 }

 const supabase = getSupabase();
 if (!supabase) {
   return NextResponse.json({ ok: true, note: 'supabase not configured' });
 }

 const { error } = await supabase.from('events').insert({
 session_id,
 event_name,
 metadata: metadata || {},
 });

 if (error) {
   return NextResponse.json({ error: error.message }, { status: 500 });
 }

 return NextResponse.json({ ok: true });
 } catch (err) {
 return NextResponse.json({ error: 'invalid request' }, { status: 400 });
 }
}
