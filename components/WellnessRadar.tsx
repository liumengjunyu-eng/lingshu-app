'use client';

import { useState } from 'react';
import { WELLNESS_MAP, type WellnessPlan } from '@/lib/wellness-data';

// Map element values (0-100) based on V2Output five_elements levels
function elementToScore(level: string): number {
  switch (level) {
    case 'high': return 80;
    case 'medium': return 55;
    case 'low': return 30;
    case 'unstable': return 40;
    case 'exhausted': return 15;
    default: return 50;
  }
}

// Map English element names to Chinese keys used in WELLNESS_MAP
const ELEMENT_KEY: Record<string, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

const ELEMENT_LABELS: Record<string, string> = {
  wood: 'Wood',
  fire: 'Fire',
  earth: 'Earth',
  metal: 'Metal',
  water: 'Water',
};

const ELEMENT_COLORS: Record<string, string> = {
  wood: '#4a9e6f',
  fire: '#c45a48',
  earth: '#c49a48',
  metal: '#8a8a9a',
  water: '#4a7a9e',
};

interface Props {
  wood: string;
  fire: string;
  earth: string;
  metal: string;
  water: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function WellnessRadar({ wood, fire, earth, metal, water }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const elements = [
    { key: 'wood', score: elementToScore(wood) },
    { key: 'fire', score: elementToScore(fire) },
    { key: 'earth', score: elementToScore(earth) },
    { key: 'metal', score: elementToScore(metal) },
    { key: 'water', score: elementToScore(water) },
  ];

  // Find weakest element
  const weakest = elements.reduce((a, b) => (a.score < b.score ? a : b));
  const wellnessPlan: WellnessPlan | null = WELLNESS_MAP[ELEMENT_KEY[weakest.key]] || null;

  // Skip selected element for detailed view
  const detailKey = selected || weakest.key;
  const detailPlan: WellnessPlan | null = WELLNESS_MAP[ELEMENT_KEY[detailKey]] || null;

  const cx = 120;
  const cy = 120;
  const maxR = 100;
  const angles = [0, 72, 144, 216, 288]; // 5 points for pentagon

  // Build polygon points for the data
  const dataPoints = elements.map((el, i) => {
    const r = (el.score / 100) * maxR;
    return polarToCartesian(cx, cy, r, angles[i]);
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  // Grid lines (3 levels: 25%, 50%, 75%)
  const grids = [25, 50, 75].map((pct) => {
    const r = (pct / 100) * maxR;
    const pts = angles.map((a) => polarToCartesian(cx, cy, r, a));
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  });

  // Axis lines with labels
  const axisLabels = elements.map((el, i) => {
    const tip = polarToCartesian(cx, cy, maxR + 18, angles[i]);
    return { x: tip.x, y: tip.y, label: ELEMENT_LABELS[el.key], score: el.score };
  });

  return (
    <div className="space-y-6">
      {/* Radar SVG */}
      <div className="flex justify-center">
        <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible">
          {/* Grid */}
          {grids.map((g, i) => (
            <path key={i} d={g} fill="none" stroke="white" strokeOpacity={0.06} strokeWidth="1" />
          ))}

          {/* Axis lines */}
          {angles.map((a, i) => {
            const tip = polarToCartesian(cx, cy, maxR, a);
            return (
              <line
                key={i}
                x1={cx} y1={cy}
                x2={tip.x} y2={tip.y}
                stroke="white" strokeOpacity={0.08} strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <path d={dataPath} fill="#C4A862" fillOpacity={0.15} stroke="#C4A862" strokeWidth="1.5" />

          {/* Data dots */}
          {dataPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y} r="3"
              fill={ELEMENT_COLORS[elements[i].key]}
              className="cursor-pointer hover:r-5 transition-all"
              onClick={() => setSelected(elements[i].key)}
            />
          ))}

          {/* Labels */}
          {axisLabels.map((l, i) => (
            <text
              key={i}
              x={l.x} y={l.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white" fillOpacity={0.4}
              fontSize="9"
              className="cursor-pointer"
              onClick={() => setSelected(elements[i].key)}
            >
              {l.label}
              <tspan x={l.x} dy="12" fill="#C4A862" fillOpacity={0.5} fontSize="7">
                {l.score}
              </tspan>
            </text>
          ))}

          {/* Center score */}
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#C4A862" fontSize="12" fontWeight="300">
            {weakest.score}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="white" fillOpacity={0.2} fontSize="6">
            weakest
          </text>
        </svg>
      </div>

      {/* Wellness detail card */}
      {detailPlan && (
        <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ELEMENT_COLORS[detailKey] }} />
            <p className="text-sm text-white/70 capitalize">{detailPlan.element} — {ELEMENT_KEY[detailKey]}</p>
            {detailKey !== weakest.key && (
              <button
                onClick={() => setSelected(null)}
                className="ml-auto text-[10px] text-white/20 hover:text-white/40"
              >
                ← back to weakest
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-white/30">Direction</p>
              <p className="text-white/60">{detailPlan.direction}</p>
            </div>
            <div>
              <p className="text-white/30">Color</p>
              <p className="text-white/60">{detailPlan.color}</p>
            </div>
            <div>
              <p className="text-white/30">Food</p>
              <p className="text-white/60">{detailPlan.food}</p>
            </div>
            <div>
              <p className="text-white/30">Exercise</p>
              <p className="text-white/60">{detailPlan.exercise}</p>
            </div>
            <div>
              <p className="text-white/30">Acupoint</p>
              <p className="text-white/60">{detailPlan.acupoint}</p>
            </div>
            <div>
              <p className="text-white/30">Sleep</p>
              <p className="text-white/60">{detailPlan.sleep}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-xs text-white/30">Emotion</p>
            <p className="text-xs text-white/50 mt-0.5">{detailPlan.emotion}</p>
          </div>
          {detailPlan.classic && (
            <div className="mt-2 text-[10px] text-white/20 italic leading-relaxed">
              {detailPlan.classic}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
