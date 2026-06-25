// app/api/diagnose/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { diagnose } from '@/engine/LingshuEngine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { primaryIssue, followUpChoice } = body

    if (!primaryIssue || !followUpChoice) {
      return NextResponse.json(
        { error: '缺少必要字段: primaryIssue, followUpChoice' },
        { status: 400 }
      )
    }

    const result = diagnose({
      primaryIssue,
      followUpChoice,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('[Diagnose API Error]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}
