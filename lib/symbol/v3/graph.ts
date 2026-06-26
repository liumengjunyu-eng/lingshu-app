// lib/symbol/v3/graph.ts
// Growth Graph Engine — 用户传播网络
// V3.3: 用户不再是"个体"，而是"增长网络的节点"

export interface UserNode {
  id: string;
  referrer?: string;
  score: number;
  conversions: number;
  shares: number;
  firstSeen: number;
  lastActive: number;
}

export class GrowthGraph {
  nodes: Map<string, UserNode> = new Map();

  addUser(node: UserNode): void {
    const existing = this.nodes.get(node.id);
    if (existing) {
      existing.score = Math.max(existing.score, node.score);
      existing.conversions = existing.conversions + node.conversions;
      existing.shares = existing.shares + node.shares;
      existing.lastActive = Date.now();
    } else {
      this.nodes.set(node.id, { ...node, firstSeen: Date.now(), lastActive: Date.now() });
    }
    this._persist();
  }

  getInfluenceScore(id: string): number {
    const node = this.nodes.get(id);
    if (!node) return 0;
    return node.shares * 3 + node.conversions * 10 + node.score * 0.5;
  }

  getTopNodes(limit = 10): UserNode[] {
    return [...this.nodes.values()]
      .sort((a, b) => this.getInfluenceScore(b.id) - this.getInfluenceScore(a.id))
      .slice(0, limit);
  }

  /** 以当前节点为根，追溯传播链深度 */
  getReferralDepth(id: string, visited = new Set<string>()): number {
    if (visited.has(id)) return 0;
    const node = this.nodes.get(id);
    if (!node || !node.referrer) return 1;
    visited.add(id);
    return 1 + this.getReferralDepth(node.referrer, visited);
  }

  /** 超级传播者阈值：influenceScore > 50 */
  isSuperSpreader(id: string): boolean {
    return this.getInfluenceScore(id) > 50;
  }

  /** 总网络健康度 */
  getNetworkHealth(): { totalNodes: number; totalConversions: number; totalShares: number; avgInfluence: number } {
    const all = [...this.nodes.values()];
    const totalNodes = all.length;
    const totalConversions = all.reduce((s, n) => s + n.conversions, 0);
    const totalShares = all.reduce((s, n) => s + n.shares, 0);
    const avgInfluence = totalNodes > 0 ? all.reduce((s, n) => s + this.getInfluenceScore(n.id), 0) / totalNodes : 0;
    return { totalNodes, totalConversions, totalShares, avgInfluence };
  }

  // --- persistence ---

  private STORAGE_KEY = 'growth_graph';

  private _persist(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = [...this.nodes.entries()].map(([id, node]) => ({ id, ...node }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch { /* quota exceeded or unavailable */ }
  }

  load(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const data: (UserNode & { id: string })[] = JSON.parse(raw);
      for (const { id, ...rest } of data) {
        this.nodes.set(id, { id, ...rest });
      }
    } catch { /* corrupt or unavailable */ }
  }

  static create(): GrowthGraph {
    const g = new GrowthGraph();
    g.load();
    return g;
  }
}
