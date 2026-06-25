'use client';

import { useState } from 'react';

const PROVERBS = [
  { source: '圣经', text: '你们要休息，要知道我是神。', ref: '诗篇 46:10' },
  { source: '黄帝内经', text: '恬淡虚无，真气从之。', ref: '《素问·上古天真论》' },
  { source: '道德经', text: '致虚极，守静笃。', ref: '《道德经》第十六章' },
  { source: '圣经', text: '凡劳苦担重担的人，可以到我这里来，我就使你们得安息。', ref: '马太福音 11:28' },
  { source: '黄帝内经', text: '上工治未病。', ref: '《素问·四气调神大论》' },
  { source: '道德经', text: '为学日益，为道日损。', ref: '《道德经》第四十八章' },
  { source: '圣经', text: '你们哪一个能用思虑使寿数多加一刻呢？', ref: '马太福音 6:27' },
  { source: '黄帝内经', text: '精神内守，病安从来？', ref: '《素问·上古天真论》' },
];

export function Proverb() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * PROVERBS.length));
  const p = PROVERBS[index];

  return (
    <div className="card" style={{ padding: '20px', textAlign: 'center', marginBottom: '16px', borderLeft: '3px solid #D4A85360' }}>
      <p style={{ fontSize: '12px', color: '#8A8A8A', marginBottom: '10px', letterSpacing: '1px' }}>📜 今日箴言</p>
      <p style={{ fontSize: '18px', color: '#2D2D2D', fontWeight: 500, lineHeight: 1.6, fontStyle: 'italic' }}>
        &ldquo;{p.text}&rdquo;
      </p>
      <p style={{ fontSize: '13px', color: '#8A8A8A', marginTop: '8px' }}>
        —— {p.source} · {p.ref}
      </p>
      <button
        onClick={() => setIndex(i => (i + 1) % PROVERBS.length)}
        style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#8A8A8A',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        换一句 →
      </button>
    </div>
  );
}
