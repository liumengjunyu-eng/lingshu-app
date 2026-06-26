/**
 * V5.1 Types
 * 对话式诊断类型定义
 */

export interface ChatMessage {
  role: 'user' | 'guide';
  text: string;
  timestamp?: number;
}

export interface ConversationRound {
  id: number;
  question: string;
  empathyResponse: string; // 对用户上一轮的共情回应
  followUpHint?: string;   // 追问提示
}

export interface ConversationState {
  messages: ChatMessage[];
  currentRound: number;
  isComplete: boolean;
  extractedState?: {
    physicalLoad: number;
    emotionalCompression: number;
    cognitiveNoise: number;
    recoveryLatency: number;
    behavioralDrift: number;
  };
}

// 4轮对话配置
export const V5_ROUNDS: ConversationRound[] = [
  {
    id: 0,
    question: "What has been weighing on you lately?",
    empathyResponse: "I hear you.",
    followUpHint: "Take your time. There's no wrong answer.",
  },
  {
    id: 1,
    question: "When you think about the past month, what pattern keeps showing up?",
    empathyResponse: "That sounds familiar to many people. But your version is unique.",
    followUpHint: "Think about moments that repeat.",
  },
  {
    id: 2,
    question: "If nothing changed in the next six months, what worries you most?",
    empathyResponse: "The future can feel heavy when the present is already full.",
    followUpHint: "Be honest about the fear.",
  },
  {
    id: 3,
    question: "What do you wish someone understood about what you're carrying?",
    empathyResponse: "You don't have to carry it alone. I can see the pattern now.",
    followUpHint: "This is the last one.",
  },
];
