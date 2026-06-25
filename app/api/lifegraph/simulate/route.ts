// app/api/lifegraph/simulate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { simulateLifePath } from '@/lib/lifegraph/simulation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { node } = body;

    if (!node || !node.state || typeof node.energy !== 'number') {
      return NextResponse.json({ error: 'Valid node required with state, energy, fatigue' }, { status: 400 });
    }

    const result = simulateLifePath(node);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
