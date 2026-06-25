// app/[locale]/opengraph-image.tsx
// 按 locale 渲染不同文案的 OG 分享图

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '灵枢 · 恢复状态测评';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TITLES: Record<string, string> = {
  zh: '你不是累。\n你是恢复方式不对。',
  'zh-TW': '你不是累。\n你是恢復方式不對。',
  en: 'You are not burned out.\nYou are recovering incorrectly.',
  ja: 'あなたは疲れているのではない。\n回復の仕方を間違えているのだ。',
  ko: '당신은 지친 게 아닙니다.\n회복 방식을 잘못하고 있는 겁니다.',
};

const SUBTITLES: Record<string, string> = {
  zh: '一个让你重新认识自己的测评',
  'zh-TW': '一個讓你重新認識自己的測評',
  en: 'The test most people don\'t expect to relate to.',
  ja: 'ほとんどの人が予想しない診断。',
  ko: '대부분의 사람이 예상하지 못할 테스트.',
};

export default async function Image({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'zh';
  const title = TITLES[locale] || TITLES.zh;
  const subtitle = SUBTITLES[locale] || SUBTITLES.zh;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F0E8',
          padding: '60px 80px',
        }}
      >
        {/* 冲突句 */}
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#1A1A1A',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.2,
            margin: 0,
            fontFamily: '"Georgia", "Noto Serif SC", serif',
            whiteSpace: 'pre-wrap',
          }}
        >
          {title}
        </h1>

        {/* 副线 */}
        <p
          style={{
            fontSize: 24,
            color: '#4A4A4A',
            marginTop: 24,
            textAlign: 'center',
            fontWeight: 400,
            fontFamily: '"Helvetica", "PingFang SC", sans-serif',
            letterSpacing: '0.3px',
          }}
        >
          {subtitle}
        </p>

        {/* 品牌标识 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 18,
            color: '#8A8A8A',
            fontWeight: 400,
            fontFamily: '"Helvetica", sans-serif',
          }}
        >
          🌀 lingshu.app
        </div>
      </div>
    ),
    { ...size },
  );
}
