// components/Proverb.tsx
'use client';

import { useState } from 'react';

const PROVERBS = [
  { source: '圣经', text: '你们要休息，要知道我是神。', ref: '诗篇 46:10' },
  { source: '黄帝内经', text: '恬淡虚无，真气从之。', ref: '《素问·上古天真论》' },
  { source: '道德经', text: '致虚极，守静笃。', ref: '《道德经》第十六章' },
  { source: '圣经', text: '凡劳苦担重担的人，可以到我这里来，我就使你们得安息。', ref: '马太福音 11:28' },
  { source: '黄帝内经', text: '上工治未病。', ref: '《素问·四气调神大论》' },
  { source: '道德经', text: '为学日益，为道日损。', ref: '《道德经》第四十八章' },
];

export function Proverb() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * PROVERBS.length));
  const proverb = PROVERBS[index];

  const next = () => {
    setIndex((prev) => (prev + 1) % PROVERBS.length);
  };

  return (
    <div className="card text-center">
      <p className="body-caption mb-3">今日箴言</p>
      <p className="heading-card text-[#1A1A1A] leading-relaxed">
        &ldquo;{proverb.text}&rdquo;
      </p>
      <p className="body-small mt-2">
        —— {proverb.source} · {proverb.ref}
      </p>
      <button onClick={next} className="btn-ghost mx-auto mt-3">
        换一句 →
      </button>
    </div>
  );
}
