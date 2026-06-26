// lib/v4/reportGenerator.ts

import { CognitiveState, SystemFusion, LayeredReport } from './types';
import { calculateLoadIndex, describeCognitiveState } from './cognitiveEngine';
import { fuseSystems } from './systemFusion';

/**
 * 生成分层报告
 */
export function generateLayeredReport(state: CognitiveState): LayeredReport {
 const score = calculateLoadIndex(state);
 const fusion = fuseSystems(state);

 // Primary Layer
 let primaryLabel = '';
 let primaryDescription = '';
 let primaryColor = '';

 switch (fusion.dominantSystem) {
 case 'cognitive':
 primaryLabel = 'Cognitive Overload';
 primaryDescription = 'Your mind is processing at max capacity. Decision fatigue is active.';
 primaryColor = '#C4A862';
 break;
 case 'emotional':
 primaryLabel = 'Emotional Compression';
 primaryDescription = 'Emotions are being held in a compressed state. Release is needed.';
 primaryColor = '#D4A86A';
 break;
 case 'physical':
 primaryLabel = 'Physical Depletion';
 primaryDescription = 'Your body is running on reduced energy reserves. Rest is not optional.';
 primaryColor = '#C49A6A';
 break;
 case 'behavioral':
 primaryLabel = 'Behavioral Drift';
 primaryDescription = 'Your patterns are shifting toward avoidance and delay.';
 primaryColor = '#A8A8A8';
 break;
 default:
 primaryLabel = 'Balanced System';
 primaryDescription = 'Your systems are in alignment. Maintain with consistent recovery.';
 primaryColor = '#5A8A6A';
 }

 // Secondary Layer
 const secondary = fusion.imbalanceVector.slice(0, 3).map((item) => ({
 label: item.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
 value: item,
 }));

 if (secondary.length === 0) {
 secondary.push({
 label: 'Balanced',
 value: 'All systems within normal range',
 });
 }

 // Tertiary Layer
 const tertiary = [
 {
 label: 'Root Cause',
 value: fusion.rootCauseLayer || 'System is stable',
 },
 {
 label: 'Element Pattern',
 value: fusion.elementDescription || 'Balanced',
 },
 ];

 // Conflict
 const conflict = fusion.conflictDescription;

 return {
 score,
 primary: {
 label: primaryLabel,
 description: primaryDescription,
 color: primaryColor,
 },
 secondary,
 tertiary,
 conflict,
 trustAnchor: 'This is not a personality test. It is a system pattern recognition model.',
 };
}

/**
 * 生成分享报告（用于 Share 页）
 */
export function generateShareReport(state: CognitiveState): {
 label: string;
 score: number;
 sentence: string;
 fullReport: string;
} {
 const fusion = fuseSystems(state);
 const score = calculateLoadIndex(state);

 const label =
 fusion.dominantSystem === 'cognitive'
 ? 'Cognitive Overload System'
 : fusion.dominantSystem === 'emotional'
 ? 'Emotional Compression System'
 : fusion.dominantSystem === 'physical'
 ? 'Physical Depletion System'
 : 'Balanced System';

 const sentences = [
 "I didn't realize I was compensating until I saw the system map.",
 'My system is running on borrowed recovery.',
 'The diagnosis: high output, low restoration.',
 'I thought I was fine. My system disagrees.',
 'Recovery debt is real. I just checked mine.',
 'You are not broken. You are just operating beyond your recovery capacity.',
 ];

 const sentence = sentences[Math.floor(Math.random() * sentences.length)];

 const fullReport = `
SYSTEM REPORT
Type: ${label}
Load Index: ${score}

"${sentence}"

Dominant Layer: ${fusion.dominantSystem}
Imbalance: ${fusion.imbalanceVector.join(' · ') || 'None detected'}

→ Test yours: linglife.vercel.app
`;

 return { label, score, sentence, fullReport };
}
