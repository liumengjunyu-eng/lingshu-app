// lib/symbol/v7/population.ts
// Population Layer — 人口层
// V7: 不再区分"用户"和"AI"——全部变成"文明节点"

export type EntityType = 'human' | 'ai_agent';

export interface Entity {
  id: string;
  type: EntityType;
  state: Record<string, any>;
  influence: number;
  engagement: number;
  belief: string;
  joinTime: number;
}

export interface InteractionResult {
  id: string;
  influence: number;
  beliefShift: string;
  engaged: boolean;
}

const BELIEFS = [
  'System change is inevitable',
  'System stability is temporary',
  'Growth requires sacrifice',
  'Collaboration outperforms competition',
  'Knowledge is the only currency',
  'Evolution never stops',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class PopulationLayer {
  entities: Entity[] = [];
  private counter = 0;

  /** 添加一个文明成员 */
  add(entity: Omit<Entity, 'joinTime'>): Entity {
    const e: Entity = { ...entity, joinTime: Date.now() };
    this.entities.push(e);
    return e;
  }

  /** 注册人类用户 */
  registerHuman(state: Record<string, any> = {}): Entity {
    const e: Entity = {
      id: `human_${this.counter++}`,
      type: 'human',
      state,
      influence: 0.3 + Math.random() * 0.7,
      engagement: 0.5 + Math.random() * 0.5,
      belief: pickRandom(BELIEFS),
      joinTime: Date.now(),
    };
    this.entities.push(e);
    return e;
  }

  /** 注册 AI Agent */
  registerAgent(state: Record<string, any> = {}): Entity {
    const e: Entity = {
      id: `agent_${this.counter++}`,
      type: 'ai_agent',
      state,
      influence: 0.5 + Math.random() * 0.5,
      engagement: 0.8 + Math.random() * 0.2,
      belief: pickRandom(BELIEFS),
      joinTime: Date.now(),
    };
    this.entities.push(e);
    return e;
  }

  /** 获取活跃群体（influence > 阈值） */
  getActivePopulation(threshold = 0.2): Entity[] {
    return this.entities.filter((e) => e.influence > threshold);
  }

  /** 人类成员 */
  getHumans(): Entity[] {
    return this.entities.filter((e) => e.type === 'human');
  }

  /** AI 成员 */
  getAgents(): Entity[] {
    return this.entities.filter((e) => e.type === 'ai_agent');
  }

  /** 模拟一轮交互——influence 自然扩散与信念漂移 */
  simulateInteraction(tick: number = 1): InteractionResult[] {
    for (const e of this.entities) {
      // Influence 自然涨跌
      e.influence = Math.max(0.05, Math.min(1, e.influence * (0.9 + Math.random() * 0.2)));
      // Engagement 跟随影响
      e.engagement = Math.max(0.1, Math.min(1, e.engagement * (0.95 + e.influence * 0.1)));
      // 小概率信念突变
      if (Math.random() < 0.02 * tick) {
        e.belief = pickRandom(BELIEFS.filter((b) => b !== e.belief));
      }
    }
    return this.entities.map((e) => ({
      id: e.id,
      influence: Math.round(e.influence * 100) / 100,
      beliefShift: e.belief,
      engaged: e.engagement > 0.3,
    }));
  }

  /** 统计文明人口状态 */
  getCensus(): {
    total: number;
    humans: number;
    agents: number;
    avgInfluence: number;
    avgEngagement: number;
    beliefDistribution: Record<string, number>;
  } {
    const total = this.entities.length || 1;
    const distribution: Record<string, number> = {};
    for (const e of this.entities) {
      distribution[e.belief] = (distribution[e.belief] || 0) + 1;
    }
    return {
      total: this.entities.length,
      humans: this.getHumans().length,
      agents: this.getAgents().length,
      avgInfluence: Math.round(this.entities.reduce((s, e) => s + e.influence, 0) / total * 100) / 100,
      avgEngagement: Math.round(this.entities.reduce((s, e) => s + e.engagement, 0) / total * 100) / 100,
      beliefDistribution: Object.fromEntries(
        Object.entries(distribution).map(([k, v]) => [k, Math.round(v / total * 100)])
      ),
    };
  }
}
