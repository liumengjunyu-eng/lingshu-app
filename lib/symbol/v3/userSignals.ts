// lib/symbol/v3/userSignals.ts

// ============================================================
// User Signal System — "认识用户"
// 轻量级行为事件工厂，不依赖 Supabase
// ============================================================

export type SignalEvent =
  | 'visit'
  | 'diagnosis_start'
  | 'diagnosis_complete'
  | 'result_view'
  | 'report_generate'
  | 'share_click'
  | 'share_success'
  | 'waitlist_join'
  | 'deep_report_view';

export interface SignalEntry {
  event: SignalEvent;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface UserSignals {
  sessionId: string;
  events: SignalEntry[];
}

// ---------- 信号采集 ----------

const signalStore = new Map<string, SignalEntry[]>();

export function captureSignal(
  sessionId: string,
  event: SignalEvent,
  metadata?: Record<string, any>
): void {
  const entry: SignalEntry = { event, sessionId, timestamp: Date.now(), metadata };
  if (!signalStore.has(sessionId)) signalStore.set(sessionId, []);
  signalStore.get(sessionId)!.push(entry);

  if (typeof window !== 'undefined') {
    // Also persist to localStorage for cross-session continuity
    try {
      const key = `ls_signals_${sessionId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(entry);
      // Keep last 100 entries
      if (existing.length > 100) existing.splice(0, existing.length - 100);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch { /* silent */ }
  }
}

export function getSignals(sessionId: string): SignalEntry[] {
  const memory = signalStore.get(sessionId);
  if (memory) return memory;
  // Try localStorage (client only)
  if (typeof window === 'undefined') return [];
  try {
    const key = `ls_signals_${sessionId}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    signalStore.set(sessionId, stored);
    return stored;
  } catch { return []; }
}

// ---------- 行为分析 ----------

export function analyzeUserPattern(sessionId: string) {
  const signals = getSignals(sessionId);

  if (signals.length === 0) {
    return { engagement: 0, shareRate: 0, viralityScore: 0, isNewUser: true, dropOffPoint: null };
  }

  const started = signals.filter(s => s.event === 'diagnosis_start').length;
  const completed = signals.filter(s => s.event === 'diagnosis_complete').length;
  const views = signals.filter(s => s.event === 'result_view').length;
  const shares = signals.filter(s => s.event === 'share_success').length;

  const engagement = completed / Math.max(started, 1);
  const shareRate = shares / Math.max(views, 1);

  // Find drop-off point
  let dropOffPoint: string | null = null;
  if (started > 0 && completed === 0) dropOffPoint = 'diagnosis';
  else if (completed > 0 && views === 0) dropOffPoint = 'result_load';

  return {
    engagement: Math.round(engagement * 100),
    shareRate: Math.round(shareRate * 100),
    viralityScore: Math.round(shareRate * engagement * 100),
    isNewUser: signals.length < 3,
    dropOffPoint,
    totalSignals: signals.length,
  };
}

// ---------- 简化版后端存存储桥 ----------

export interface SignalPayload {
  event: SignalEvent;
  metadata?: Record<string, any>;
}

export function buildSignalPayload(event: SignalEvent, metadata?: Record<string, any>): SignalPayload {
  return { event, metadata };
}
