import { HOOKS, HookEntry } from './hooks';

export interface Persona {
 id: string;
 type: 'debt' | 'depleted' | 'drifting' | 'restored';
 name: string;
 label: string;
 description: string;
}

export const PERSONAS: Record<string, Persona> = {
 debt: {
 id: 'debt',
 type: 'debt',
 name: 'Recovery Debt',
 label: 'The one who forgot what recovered feels like',
 description: 'You have been running for too long without a reset.',
 },
 depleted: {
 id: 'depleted',
 type: 'depleted',
 name: 'Silent Exhaustion',
 label: 'The one who looks fine but isn\'t',
 description: 'You are functioning, but your recovery system is paused.',
 },
 drifting: {
 id: 'drifting',
 type: 'drifting',
 name: 'The Drifter',
 label: 'The one who is almost there',
 description: 'You are close to recovery, but something keeps pulling you back.',
 },
 restored: {
 id: 'restored',
 type: 'restored',
 name: 'Restored',
 label: 'The one who found their rhythm',
 description: 'You have found your recovery rhythm. Keep going.',
 },
};

export function getPersona(type: string): Persona {
 return PERSONAS[type] || PERSONAS.depleted;
}

export function getHook(type: string): HookEntry {
 const hooks = HOOKS.filter(h => h.type === type);
 return hooks.length > 0 ? hooks[Math.floor(Math.random() * hooks.length)] : HOOKS[0];
}
