// lib/core/session.ts

export interface BirthInfo {
 year: number;
 month: number;
 day: number;
 hour: number;
 minute?: number;
}

export interface SessionData {
 input: string;
 answers: number[];
 texts: string[];
 score: number;
 timestamp: number;
 profile?: any;
 birthInfo?: BirthInfo;
 birthType?: string;
}

export function saveSession(data: SessionData): void {
 if (typeof window === 'undefined') return;
 localStorage.setItem('session', JSON.stringify(data));
}

export function getSession(): SessionData | null {
 if (typeof window === 'undefined') return null;
 const raw = localStorage.getItem('session');
 if (!raw) return null;
 try {
 return JSON.parse(raw);
 } catch {
 return null;
 }
}

export function clearSession(): void {
 if (typeof window === 'undefined') return;
 localStorage.removeItem('session');
}

export function hasSession(): boolean {
 return getSession() !== null;
}
