// lib/symbol/v2/sentenceEngine.ts
// V2.4 Growth Engine — 认知句爆发系统

export const collapseStates = [
  "You are functioning, but at a cost your system is hiding.",
  "Nothing is wrong. Everything is compensation.",
  "You are not tired. You are overloaded.",
  "Your stability is maintained by silent trade-offs.",
  "What looks like control is actually suppression.",
  "You are still standing. But your foundation is cracking.",
  "The price of your performance is paid in recovery debt.",
  "You haven't crashed. You're just holding it together.",
];

export const riskSignals = [
  "Your system is borrowing energy from your future self.",
  "This pattern typically precedes emotional exhaustion.",
  "Your recovery window is shorter than your stress cycle.",
  "You are stable only in appearance, not in structure.",
  "Every skipped recovery today becomes a system cost tomorrow.",
];

export const identityLines = [
  "Compensated stability type",
  "High-functioning overload pattern",
  "Emotional suppression dominant system",
  "Silent burnout trajectory",
  "Deferred recovery profile",
  "Cognitive debt accumulator",
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
