// lib/v4/profileEngine.ts

import { CognitiveState, UserProfile } from './types';

/**
 * 创建新用户画像
 */
export function createProfile(id: string, state: CognitiveState): UserProfile {
 return {
 id,
 baselineState: state,
 history: [state],
 evolutionTrend: 'stable',
 lastUpdated: Date.now(),
 sessionCount: 1,
 };
}

/**
 * 更新用户画像
 */
export function updateProfile(profile: UserProfile, newState: CognitiveState): UserProfile {
 const history = [...profile.history, newState];
 const trend = computeTrend(history);
 return {
 ...profile,
 history,
 evolutionTrend: trend,
 lastUpdated: Date.now(),
 sessionCount: profile.sessionCount + 1,
 };
}

/**
 * 计算进化趋势
 */
function computeTrend(history: CognitiveState[]): UserProfile['evolutionTrend'] {
 if (history.length < 2) return 'stable';

 const recent = history[history.length - 1];
 const previous = history[history.length - 2];

 const noiseDelta = recent.cognitiveNoise - previous.cognitiveNoise;
 const recoveryDelta = recent.recoveryLatency - previous.recoveryLatency;
 const emotionDelta = recent.emotionalCompression - previous.emotionalCompression;

 // 综合判断
 const improving = noiseDelta < -5 && recoveryDelta < -5 && emotionDelta < -5;
 const declining = noiseDelta > 5 && recoveryDelta > 5 && emotionDelta > 5;

 if (improving) return 'improving';
 if (declining) return 'declining';

 // 如果有改善趋势但不够明显
 if (noiseDelta < -3 || recoveryDelta < -3 || emotionDelta < -3) return 'improving';
 if (noiseDelta > 3 || recoveryDelta > 3 || emotionDelta > 3) return 'declining';

 return 'stable';
}

/**
 * 获取趋势描述
 */
export function describeTrend(trend: UserProfile['evolutionTrend']): string {
 const map = {
 improving: 'Your system is moving toward recovery. Keep going.',
 declining: 'Your system is showing signs of increased load. Attention needed.',
 volatile: 'Your system is fluctuating. Consistency is key.',
 stable: 'Your system is in a stable state. Maintain current patterns.',
 };
 return map[trend] || map.stable;
}

/**
 * 获取用户画像摘要
 */
export function getProfileSummary(profile: UserProfile): string {
 const trendDesc = describeTrend(profile.evolutionTrend);
 return `Session ${profile.sessionCount} · ${trendDesc}`;
}
