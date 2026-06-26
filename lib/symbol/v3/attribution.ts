// lib/symbol/v3/attribution.ts
// Conversion Attribution Engine — 归因系统
// V3.2 最关键升级：系统知道 TikTok vs Twitter vs Threads 哪个更赚钱

export interface AttributionEvent {
  ref: string;
  channel: 'twitter' | 'tiktok' | 'threads' | 'linkedin' | 'direct' | 'unknown';
  event: 'share' | 'click' | 'signup' | 'pay';
  timestamp: number;
  metadata?: Record<string, string>;
}

export interface ChannelValue {
  channel: string;
  totalValue: number;
  events: number;
  averageValue: number;
}

const EVENT_WEIGHTS: Record<AttributionEvent['event'], number> = {
  share: 3,
  click: 1,
  signup: 5,
  pay: 10,
};

export function trackConversion(ref: string, channel: AttributionEvent['channel'], event: AttributionEvent['event']): AttributionEvent {
  const log: AttributionEvent = {
    ref,
    channel,
    event,
    timestamp: Date.now(),
  };

  // Log to console in dev; in production this writes to a store/API
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('attribution_log') || '[]');
      existing.push(log);
      localStorage.setItem('attribution_log', JSON.stringify(existing));
    } catch {
      // localStorage may be full or unavailable
    }
  }

  return log;
}

function getValue(event: AttributionEvent['event']): number {
  return EVENT_WEIGHTS[event] || 0;
}

export function computeChannelValue(events: AttributionEvent[]): ChannelValue[] {
  const map = new Map<string, { totalValue: number; events: number }>();

  for (const e of events) {
    const entry = map.get(e.channel) || { totalValue: 0, events: 0 };
    entry.totalValue += getValue(e.event);
    entry.events += 1;
    map.set(e.channel, entry);
  }

  return Array.from(map.entries()).map(([channel, data]) => ({
    channel,
    totalValue: data.totalValue,
    events: data.events,
    averageValue: data.events > 0 ? Math.round(data.totalValue / data.events * 100) / 100 : 0,
  }));
}

export function getAttributionLog(): AttributionEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('attribution_log') || '[]');
  } catch {
    return [];
  }
}

export function clearAttributionLog(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('attribution_log');
}
