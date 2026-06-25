// app/lifegraph/page.tsx
// 用户看不到的 Life Graph 可视化页

'use client';

import { useEffect, useState } from 'react';
import { loadGraph, computeSummary, simulateLifePath, getSimulationAdvice } from '@/lib/lifegraph';
import { LifeGraph, LifeGraphSummary, SimulationResult } from '@/lib/lifegraph';
import Link from 'next/link';

export default function LifeGraphPage() {
  const [graph, setGraph] = useState<LifeGraph | null>(null);
  const [summary, setSummary] = useState<LifeGraphSummary | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const g = loadGraph();
    setGraph(g);
    if (g) {
      setSummary(computeSummary(g));
      const lastNode = g.nodes[g.nodes.length - 1];
      if (lastNode) setSimulation(simulateLifePath(lastNode));
    }
  }, []);

  if (!graph || graph.nodes.length === 0) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-sans font-bold text-ink text-3xl">No Data Yet</h1>
          <p className="text-ink/40 mt-3">Complete your first diagnosis to start tracking.</p>
          <Link href="/diagnose" className="inline-block mt-6 px-8 py-3 bg-forest text-white rounded-full text-sm font-medium hover:bg-forest/90 transition">
            Start Diagnosis
          </Link>
        </div>
      </main>
    );
  }

  const nodes = graph.nodes;
  const maxFatigue = Math.max(...nodes.map(n => n.fatigue), 80);
  const maxEnergy = Math.max(...nodes.map(n => n.energy), 80);
  const maxVal = Math.max(maxFatigue, maxEnergy);

  // SVG dimensions
  const w = Math.max(nodes.length * 120, 400);
  const h = 300;
  const pad = { top: 30, bottom: 40, left: 50, right: 30 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const xScale = (i: number) => pad.left + (i / Math.max(nodes.length - 1, 1)) * plotW;
  const yScale = (v: number) => pad.top + plotH - (v / maxVal) * plotH;

  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-forest/40 text-xs tracking-[0.2em] uppercase">Life Graph</div>
            <h1 className="font-sans font-bold text-ink text-3xl mt-1">Your Energy Trajectory</h1>
          </div>
          <Link href="/" className="text-ink/30 text-sm hover:text-ink/60 transition">Back</Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 border border-forest/5">
            <div className="text-ink/30 text-xs uppercase tracking-wider">States</div>
            <div className="text-2xl font-bold text-ink mt-1">{summary?.stateCount || 0}</div>
            <div className="text-ink/20 text-xs mt-1">phases experienced</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-forest/5">
            <div className="text-ink/30 text-xs uppercase tracking-wider">Avg Energy</div>
            <div className="text-2xl font-bold text-forest mt-1">{summary?.energyAvg || 0}</div>
            <div className="text-ink/20 text-xs mt-1">/ 100</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-forest/5">
            <div className="text-ink/30 text-xs uppercase tracking-wider">Recoveries</div>
            <div className="text-2xl font-bold text-gold mt-1">{summary?.recoveryPeriods || 0}</div>
            <div className="text-ink/20 text-xs mt-1">improvement phases</div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="bg-white rounded-2xl p-6 border border-forest/5 overflow-x-auto">
          <svg width={w} height={h} className="min-w-full">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(v => (
              <g key={v}>
                <line
                  x1={pad.left} y1={yScale(v)}
                  x2={w - pad.right} y2={yScale(v)}
                  stroke="#EAE5DE" strokeWidth="0.5"
                />
                <text x={pad.left - 8} y={yScale(v) + 3} textAnchor="end"
                  className="text-[10px]" fill="#B0B0B0">
                  {v}
                </text>
              </g>
            ))}

            {/* Fatigue line */}
            <polyline
              fill="none" stroke="#C9A96E" strokeWidth="2" strokeOpacity="0.5"
              points={nodes.map((n, i) => `${xScale(i)},${yScale(n.fatigue)}`).join(' ')}
            />

            {/* Energy line */}
            <polyline
              fill="none" stroke="#4A7C49" strokeWidth="2.5"
              points={nodes.map((n, i) => `${xScale(i)},${yScale(n.energy)}`).join(' ')}
            />

            {/* Node dots */}
            {nodes.map((n, i) => (
              <g key={n.id}>
                <circle cx={xScale(i)} cy={yScale(n.energy)} r="5" fill="#4A7C49" stroke="white" strokeWidth="2" />
                <circle cx={xScale(i)} cy={yScale(n.fatigue)} r="3" fill="#C9A96E" stroke="white" strokeWidth="1.5" />
                {/* Phase label */}
                <text x={xScale(i)} y={h - 8} textAnchor="middle"
                  className="text-[9px]" fill="#8A8A8A">
                  {n.phase === 'system_overload' ? 'OL' :
                   n.phase === 'active_recovery' ? 'AR' :
                   n.phase === 'identity_shift' ? 'IS' :
                   n.phase === 'stable_operation' ? 'SO' : 'CR'}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="flex gap-6 mt-4 justify-center text-xs">
            <span className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-forest inline-block" />
              Energy
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-gold/50 inline-block" />
              Fatigue
            </span>
            <span className="flex items-center gap-2 text-ink/30">
              OL=Overload AR=Recovery IS=Shift SO=Stable
            </span>
          </div>
        </div>

        {/* Node Timeline */}
        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-ink">Timeline</h2>
          {[...nodes].reverse().map(n => (
            <div key={n.id} className="bg-white rounded-xl p-4 border border-forest/5 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-ink">{n.state.replace(/_/g, ' ')}</div>
                <div className="text-xs text-ink/30 mt-0.5">
                  {new Date(n.time).toLocaleString()} &middot; {n.phase.replace(/_/g, ' ')}
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-forest">{n.energy} Energy</span>
                <span className="text-gold">{n.fatigue} Fatigue</span>
              </div>
            </div>
          ))}
        </div>

        {/* Life Simulation Section */}
        {simulation && (
          <div className="mt-12">
            <div className="mb-6">
              <div className="text-forest/40 text-xs tracking-[0.2em] uppercase">Life Simulation</div>
              <h2 className="font-sans font-bold text-ink text-2xl mt-1">Where You&rsquo;re Headed</h2>
              <p className="text-ink/40 text-sm mt-1">Based on your current state, the system projects these possible paths.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-forest/5 mb-6">
              <p className="text-ink/70 text-sm leading-relaxed italic">
                &ldquo;{getSimulationAdvice(simulation.current.state)}&rdquo;
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {simulation.paths.map((path, i) => (
                <div key={i} className={`rounded-2xl p-6 border ${
                  i === 1 ? 'border-forest/20 bg-forest/[0.02]' : 'border-forest/5 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-ink/30 font-mono">PATH {String.fromCharCode(65 + i)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      path.riskLevel === 'high' ? 'bg-red-50 text-red-400' :
                      path.riskLevel === 'medium' ? 'bg-amber-50 text-amber-500' :
                      'bg-green-50 text-forest'
                    }`}>
                      {path.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-ink text-base mb-1">{path.label}</h3>
                  <p className="text-ink/50 text-sm leading-relaxed">{path.outcome}</p>
                  <div className="mt-3 flex justify-between text-xs text-ink/30">
                    <span>{path.timeline}</span>
                    {path.identityShift && <span className="text-gold">Identity shift</span>}
                  </div>
                  <div className="mt-3 h-6 flex items-end gap-[2px]">
                    {path.energyProjection.slice(0, 7).map((v, j) => (
                      <div key={j}
                        className="w-full bg-forest/20 rounded-t"
                        style={{ height: `${(v / 100) * 24}px` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
