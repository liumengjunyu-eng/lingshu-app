// lib/engine/hookGenerator.ts

import { Element } from './symbolEngine';

export interface Hook {
 id: string;
 text: string;
 type: 'recognition' | 'revelation' | 'identity';
 category: string;
 weight: number;
}

// Hook 模板库（按五行 + 状态组合）
const HOOK_TEMPLATES: Record<Element, Record<string, string[]>> = {
 wood: {
 high: [
 'You keep moving. But you never arrive.',
 'You are not stuck. You are paused.',
 'Your drive is real. Your recovery is not.',
 ],
 low: [
 'You are not lost. You are recovering.',
 'You are not lazy. You are depleted.',
 'Your energy is not gone. It is deeply resting.',
 ],
 },
 fire: {
 high: [
 'You are not burnt out. You are spread too thin.',
 'You have high output and low recovery.',
 'Your fire is strong. But it needs fuel to last.',
 ],
 low: [
 'You are not empty. You are resetting.',
 'Your passion is not gone. It is gathering.',
 'You are between cycles. That is not failure.',
 ],
 },
 earth: {
 high: [
 'You carry others. But who carries you?',
 'You are stable but static.',
 'Your strength is your anchor. But also your cage.',
 ],
 low: [
 'You are not unstable. You are recalibrating.',
 'Your ground is shifting. That is growth.',
 'You are not weak. You are restructuring.',
 ],
 },
 metal: {
 high: [
 'You are perfect. But perfect is exhausting.',
 'Your precision is your power. And your prison.',
 'You are not broken. You are too rigid.',
 ],
 low: [
 'You are not lost. You are letting go.',
 'Your boundaries are not gone. They are reforming.',
 'You are not weak. You are becoming flexible.',
 ],
 },
 water: {
 high: [
 'You feel everything. That is your strength and your burden.',
 'You are not over-sensitive. You are deeply connected.',
 'Your depth is real. But it needs rest.',
 ],
 low: [
 'You are not numb. You are protecting yourself.',
 'Your emotions are not gone. They are regrouping.',
 'You are not empty. You are preserving.',
 ],
 },
};

// Balanced fallbacks for mid-range scores
const FALLBACKS: Record<Element, string[]> = {
 wood: ['You are pushing and pausing. Both are valid.'],
 fire: ['Your warmth fluctuates. That is human.'],
 earth: ['You are holding ground. That is enough.'],
 metal: ['Some days sharp, some days soft. Both are you.'],
 water: ['You ebb and flow. That is not weakness.'],
};

export function getTemplatesForElement(element: Element, scores: Record<Element, number>): string[] {
 const score = scores[element] || 50;
 if (score > 60 && HOOK_TEMPLATES[element]?.high) return HOOK_TEMPLATES[element].high;
 if (score < 40 && HOOK_TEMPLATES[element]?.low) return HOOK_TEMPLATES[element].low;
 return FALLBACKS[element] || ['Your state is recalibrating.'];
}

export function generateHook(
 element: Element,
 scores: Record<Element, number>
): Hook {
 const pool = getTemplatesForElement(element, scores);
 const text = pool[Math.floor(Math.random() * pool.length)];

 return {
 id: `hook_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
 text,
 type: 'recognition',
 category: element,
 weight: 1.0,
 };
}
