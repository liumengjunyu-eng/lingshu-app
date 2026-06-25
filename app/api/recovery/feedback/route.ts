import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { state, feedback, newState, score } = body;

    // 记录反馈数据（后续接入数据库）
    console.log('[恢复反馈]', {
      timestamp: new Date().toISOString(),
      state,
      feedback,
      newState,
      score,
    });

    return NextResponse.json({
      success: true,
      message: '反馈已记录',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '反馈记录失败' },
      { status: 500 }
    );
  }
}
