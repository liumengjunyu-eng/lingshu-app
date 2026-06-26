// lib/conversation/rounds.ts
// V5 对话轮次 — 共情引导的结构性提问
// 每轮：开放式问题 → 用户回答 → 共情回应 → 追问（可选）

import { ConversationRound } from './types';

export const ROUNDS: ConversationRound[] = [
  {
    id: 'state',
    question: "How have you been feeling recently?\nTake your time — just describe what comes to mind.",
    dimensions: [
      { dimension: 'physicalLoad', weight: 0.4, keywords: ['tired', 'exhausted', 'fatigue', '疲惫', '累', '乏', '没力气', 'sore', 'heavy', 'sluggish', '慢', '重', '酸'] },
      { dimension: 'emotionalCompression', weight: 0.4, keywords: ['anxious', 'stressed', 'overwhelmed', '焦虑', '压力', '绷', '紧张', '烦', '压抑', 'upset', '沉重', 'sad', 'blue'] },
      { dimension: 'cognitiveNoise', weight: 0.2, keywords: ['scattered', 'distracted', '乱', '分心', '散', 'busy', '忙', '杂'] },
    ],
  },
  {
    id: 'mind',
    question: "What has been occupying your mind most lately?",
    empathy: "That makes sense. A lot of people find that even when they're not actively thinking about it, it still takes up space.",
    dimensions: [
      { dimension: 'cognitiveNoise', weight: 0.5, keywords: ['work', 'money', '创业', 'project', 'deadline', '忙', '项目', '生意', '客户', 'team', '团队', 'decision', '决定', 'choice', '选择', '不确定', 'uncertain'] },
      { dimension: 'emotionalCompression', weight: 0.3, keywords: ['relation', 'family', '父母', '家人', 'partner', '对象', 'friend', '朋友', 'love', '爱', 'hurt', '伤', 'miss', '想', '担心', 'worry'] },
      { dimension: 'behavioralDrift', weight: 0.2, keywords: ['procrastinate', '拖延', 'avoid', '逃避', '不想动', '放', '搁', 'later', '明天'] },
    ],
  },
  {
    id: 'future',
    question: "If nothing changed in the next six months — what worries you most about that?",
    empathy: "That's a real concern. Most people don't look six months ahead — they just survive the day. The fact that you can see it means something.",
    dimensions: [
      { dimension: 'cognitiveNoise', weight: 0.35, keywords: ['stuck', '卡', '原地', 'same', '重复', '没变化', 'no progress', 'waste', '浪费时间', '方向', 'direction', 'path', '路'] },
      { dimension: 'emotionalCompression', weight: 0.35, keywords: ['lonely', '孤独', 'alone', 'isolated', '孤立', 'miss', 'fear', '怕', 'afraid', 'regret', '后悔', '遗憾'] },
      { dimension: 'recoveryLatency', weight: 0.3, keywords: ['worse', '恶化', '更', 'down', '下坡', '崩', 'burnout', '垮', '病', 'sick', 'health', '健康'] },
    ],
  },
  {
    id: 'seen',
    question: "What do you wish people understood about you?",
    empathy: "Thank you for sharing that. Most people never say this out loud.",
    dimensions: [
      { dimension: 'emotionalCompression', weight: 0.4, keywords: ['misunderstood', '误解', 'not seen', '不被', '忽略', 'ignored', 'invisible', '透明', 'alone', 'nobody', 'judge', 'judged', '评价'] },
      { dimension: 'behavioralDrift', weight: 0.35, keywords: ['trying', '在努力', '尽力', 'hard', '累', 'tired', 'enough', '不够', '不足', 'expectation', '期望', '标准'] },
      { dimension: 'physicalLoad', weight: 0.25, keywords: ['pain', '疼', 'hurt', 'suffer', '受', 'body', '身体', 'sick', 'health', 'health'] },
    ],
  },
  {
    id: 'pattern',
    question: "One last thing — if you could change one pattern in your life right now, what would it be?",
    empathy: "I hear you. That pattern — it's not random. It's your system telling you something.",
    dimensions: [
      { dimension: 'behavioralDrift', weight: 0.35, keywords: ['sleep', '睡', 'insomnia', '失眠', 'late', '熬夜', 'phone', '手机', 'screen', '屏幕', 'bed', '床'] },
      { dimension: 'recoveryLatency', weight: 0.35, keywords: ['rest', '休息', 'stop', '停', 'pause', '慢', 'breathe', '呼吸', 'meditate', '冥想', 'weekend', '周末', 'leave', '放'] },
      { dimension: 'physicalLoad', weight: 0.3, keywords: ['exercise', '运动', 'diet', '吃', 'eat', 'food', '饮食', 'drink', '喝', 'alcohol', '酒', 'smoke', '烟'] },
    ],
  },
];
