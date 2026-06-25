'use client';

import { forwardRef } from 'react';
import { getPersona, getHook } from '@/lib/persona';

interface ShareCardProps {
 score: number;
 type: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
 ({ score, type }, ref) => {
 const persona = getPersona(type);
 const hook = getHook(type);

 return (
 <div
 ref={ref}
 style={{
 width: 600,
 padding: 40,
 background: '#FBF9F6',
 borderRadius: 24,
 fontFamily: 'system-ui, sans-serif',
 }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 12, background: '#4A7C49', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <span style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>L</span>
 </div>
 <span style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A' }}>Lingshu</span>
 </div>
 <div style={{ padding: '4px 14px', borderRadius: 20, background: '#E8F0E6', color: '#4A7C49', fontSize: 13, fontWeight: 500 }}>
 {persona.name}
 </div>
 </div>

 <div style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3, marginBottom: 8 }}>
 {persona.label}
 </div>

 <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
 <span style={{ fontSize: 48, fontWeight: 700, color: '#4A7C49' }}>{score}</span>
 <span style={{ fontSize: 18, color: '#8A8A8A' }}>/ 100</span>
 </div>

 <p style={{ fontSize: 20, fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, marginBottom: 24 }}>
 &ldquo;{hook.text}&rdquo;
 </p>

 <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #EAE5DE' }}>
 <span style={{ fontSize: 13, color: '#4A7C49' }}>Find your recovery type &rarr;</span>
 <span style={{ fontSize: 12, color: '#B0B0B0' }}>lingshu.app</span>
 </div>
 </div>
 );
 }
);

ShareCard.displayName = 'ShareCard';
