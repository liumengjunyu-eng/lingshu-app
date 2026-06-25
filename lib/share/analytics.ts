// lib/share/analytics.ts
// 分享传播链追踪 — console.log 版本
// 仅在 sessionStorage 内记录单次会话分享链深度，跨会话归零

const CHAIN_KEY = 'ling_shu_share_chain';

interface ShareChainData {
  depth: number;
  firstState: string;
  firstTime: number;
  lastTime: number;
}

/**
 * 追踪一次分享事件
 * @param state 当前状态
 * @param from 分享触发来源
 */
export function trackShare(state: string, from: 'share_button' | 'story_page' | 'og_preview' | 'direct_link'): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = sessionStorage.getItem(CHAIN_KEY);
    const chain: ShareChainData = stored
      ? JSON.parse(stored)
      : { depth: 0, firstState: state, firstTime: Date.now(), lastTime: Date.now() };

    chain.depth += 1;
    chain.lastTime = Date.now();

    sessionStorage.setItem(CHAIN_KEY, JSON.stringify(chain));

    console.log('[灵枢 ShareChain]', {
      depth: chain.depth,
      state,
      from,
      firstVisit: new Date(chain.firstTime).toISOString(),
    });
  } catch {
    // sessionStorage 不可用时静默失败
  }
}

/**
 * 获取当前会话的分享链深度
 */
export function getShareDepth(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = sessionStorage.getItem(CHAIN_KEY);
    if (!stored) return 0;
    const chain: ShareChainData = JSON.parse(stored);
    return chain.depth;
  } catch {
    return 0;
  }
}

/**
 * 清除分享链记录（用于测试或重置）
 */
export function resetShareChain(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(CHAIN_KEY);
  } catch {
    // 静默失败
  }
}
