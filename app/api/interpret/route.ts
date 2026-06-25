// 灵枢 AI 解读 API — 调用 DeepSeek 生成个性化八字解读
import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API = "https://api.deepseek.com/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { name, bazi, naYin, shishen, lunarDate, zodiac, wuxing, intent, bloodType } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "DEEPSEEK_API_KEY not configured" }, { status: 500 });
    }

    // 构建五行数据摘要
    const wxSummary = Object.entries(wuxing.percentages as Record<string, number>)
      .map(([el, pct]) => `${el}(${WUXING_EN[el] || el}): ${pct}%`)
      .join(", ");

    const intentZh: Record<string, string> = {
      health: "健康养生",
      career: "事业发展",
      relationship: "情感关系",
    };

    const prompt = `你是灵枢(LingShu)，一位融合东方命理智慧与现代健康理念的 AI 导师。你的语言风格：冷静克制、有洞察力、不命定论。说话直接用短句，不用列表，不用首先其次最后。

用户信息：
- 姓名：${name}
- 生肖：${zodiac}
- 农历出生日期：${lunarDate}
- 八字四柱：年柱 ${bazi.year}（纳音 ${naYin.split(" ")[0]}，十神 ${shishen.year}），月柱 ${bazi.month}（纳音 ${naYin.split(" ")[1]}，十神 ${shishen.month}），日柱 ${bazi.day}（日主），时柱 ${bazi.hour}（纳音 ${naYin.split(" ")[3]}，十神 ${shishen.hour}）
- 五行分布：${wxSummary}
- 最强五行：${wuxing.strongest}（${WUXING_EN[wuxing.strongest] || wuxing.strongest}）
- 最弱五行：${wuxing.weakest}（${WUXING_EN[wuxing.weakest] || wuxing.weakest}）
- 关注领域：${intentZh[intent as string] || "综合"}
${bloodType ? `- 血型：${bloodType}` : ""}

请根据以上信息，用英文输出三段解读（每段 2-4 句话），格式为三行纯文本，用 ||| 分隔：

第一段：根据最强五行分析用户的性格天赋和本能模式。结合具体的生活场景（比如工作方式、社交风格、决策习惯）来说，不要只描述五行属性本身。

第二段：根据最弱五行指出用户需要补充的能量维度，以及当前关注领域（${intentZh[intent as string] || "综合"}）中可能遇到的挑战。给出有方向性的建议，不笼统。

第三段：结合生肖和关注领域，给一段鼓励性和实用性兼具的话。让用户感到被看见，而不是被定义。

只输出三段内容，用 ||| 分隔，不要加标题、不要加总结、不要加额外的说明文字。`;

    const response = await fetch(DEEPSEEK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一个洞察力敏锐的东方命理顾问。不说废话，不堆砌术语。用短句直接说真话。" },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("DeepSeek API error:", response.status, errBody);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // 按 ||| 分隔，如果格式不对则整段返回
    const sections = content
      .split("|||")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    return NextResponse.json({
      sections: sections.length >= 3 ? sections.slice(0, 3) : [content],
      usage: data.usage,
    });
  } catch (err: any) {
    console.error("Interpret API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

const WUXING_EN: Record<string, string> = {
  "木": "Wood", "火": "Fire", "土": "Earth", "金": "Metal", "水": "Water",
};
