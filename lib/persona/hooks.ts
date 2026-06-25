export interface HookEntry {
 id: string;
 type: 'debt' | 'depleted' | 'drifting' | 'restored';
 text: string;
}

export const HOOKS: HookEntry[] = [
 // Debt
 { id: 'debt_01', type: 'debt', text: 'You are not tired. You are in recovery debt.' },
 { id: 'debt_02', type: 'debt', text: 'You keep going. Even when your system is asking you to stop.' },
 { id: 'debt_03', type: 'debt', text: 'People admire your discipline. Your body experiences it as exhaustion.' },
 { id: 'debt_04', type: 'debt', text: 'You forgot what recovered feels like.' },
 // Depleted
 { id: 'depleted_01', type: 'depleted', text: 'You look fine. Your system is not.' },
 { id: 'depleted_02', type: 'depleted', text: 'You keep pushing. Your recovery stopped weeks ago.' },
 { id: 'depleted_03', type: 'depleted', text: "You're functioning. Not recovering." },
 { id: 'depleted_04', type: 'depleted', text: 'People think you are fine. Your body knows you are not.' },
 // Drifting
 { id: 'drifting_01', type: 'drifting', text: 'You rest. But you never recharge.' },
 { id: 'drifting_02', type: 'drifting', text: 'You are not broken. You are paused.' },
 { id: 'drifting_03', type: 'drifting', text: 'You are almost there. But something keeps pulling you back.' },
 // Restored
 { id: 'restored_01', type: 'restored', text: 'You are the exception. Most people never reach this state.' },
 { id: 'restored_02', type: 'restored', text: 'You have found your recovery rhythm. Keep going.' },
 { id: 'restored_03', type: 'restored', text: 'You are one of the few who actually recover properly.' },
];
