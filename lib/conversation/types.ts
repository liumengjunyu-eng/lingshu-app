// lib/conversation/types.ts

export interface ConversationRound {
  id: string;
  question: string;       // 第一句开放式问题
  empathy?: string;       // 用户回答后的共情回应（懒人模板）
  prompt?: string;        // 追加追问
  dimensions: {           // 这个round主要映射哪些维度
    dimension: keyof CognitiveInference;
    weight: number;
    keywords: string[];   // 映射到此维度的关键词
  }[];
}

export interface ConversationResult {
  answers: string[];           // 用户每轮的原始输入
  cognitive: CognitiveInference;
}

export interface CognitiveInference {
  physicalLoad: number;           // 体力消耗
  emotionalCompression: number;    // 情绪积压
  cognitiveNoise: number;          // 认知噪音
  recoveryLatency: number;         // 恢复延迟
  behavioralDrift: number;         // 行为漂移
}

export interface Message {
  role: 'guide' | 'user';
  text: string;
  delay?: number;  // animation delay ms
  isTyping?: boolean;
}
