// app/api/lifegraph/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  // 服务端返回空，客户端从 localStorage 读取
  // API 只是预留接口，实际数据存在客户端
  return NextResponse.json({
    message: 'Life graph data is client-side. Use lib/lifegraph/store.ts directly.',
    sessionId,
  });
}
