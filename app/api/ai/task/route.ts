import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        task: {
          id: 'fallback',
          title: '减少信息输入',
          instruction: '今天减少30%信息输入，不刷短内容超过30分钟',
          reasoning: 'fallback（DEEPSEEK_API_KEY 未配置）',
        },
      });
    }

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是行为设计系统，只输出JSON，不要解释。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[DeepSeek API Error]', res.status, errorText);
      return NextResponse.json({
        task: {
          id: 'fallback',
          title: '减少信息输入',
          instruction: '今天减少30%信息输入，不刷短内容超过30分钟',
          reasoning: 'fallback（API 调用失败）',
        },
      });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    let task;
    try {
      task = JSON.parse(content);
    } catch {
      task = {
        id: 'fallback',
        title: '减少信息输入',
        instruction: '今天减少30%信息输入，不刷短内容超过30分钟',
        reasoning: 'fallback（JSON 解析失败）',
      };
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('[AI Task Error]', error);
    return NextResponse.json(
      {
        task: {
          id: 'fallback',
          title: '减少信息输入',
          instruction: '今天减少30%信息输入，不刷短内容超过30分钟',
          reasoning: 'fallback（服务器错误）',
        },
      },
      { status: 200 }
    );
  }
}
