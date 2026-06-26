'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSession } from '@/lib/core/session';
import { ROUNDS } from '@/lib/conversation/rounds';
import { runConversation } from '@/lib/conversation/engine';
import type { Message } from '@/lib/conversation/types';

const ENTRANCE = [
  { role: 'guide', text: 'Tell me what has been weighing on you lately.', delay: 600 },
  { role: 'guide', text: 'I will listen.', delay: 1400 },
];

const COMPLETION_MSGS: Message[] = [
  { role: 'guide', text: "That's enough for me to see your pattern.", delay: 500 },
  { role: 'guide', text: "Give me one moment — I'm mapping your system.", delay: 1500 },
];

const getEmpathyForRound = (roundIdx: number): string | null => {
  const round = ROUNDS[roundIdx];
  if (!round?.empathy) return null;
  return round.empathy;
};

const getTransition = (roundIdx: number): string | null => {
  const transitions: (string | null)[] = [
    null,
    null,
    null,
    null,
    "One last question — then I'll show you what I see.",
  ];
  return transitions[roundIdx] ?? null;
};

export default function DiagnosePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialInput = searchParams.get('input') || '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [userText, setUserText] = useState('');
  const [round, setRound] = useState(-1); // -1 = entrance
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when it appears
  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  // Entrance sequence
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    ENTRANCE.forEach((msg) => {
      const t = setTimeout(() => {
        setMessages((prev) => [...prev, msg as Message]);
        if (msg === ENTRANCE[ENTRANCE.length - 1]) {
          setTimeout(() => setShowInput(true), 400);
        }
      }, msg.delay!);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Show guide question for a round
  const showGuideMessage = (guideText: string, callback?: () => void) => {
    setMessages((prev) => [...prev, { role: 'guide', text: guideText }]);
    setShowInput(false);

    // After guide speaks, show input again
    setTimeout(() => {
      setShowInput(true);
      callback?.();
    }, 600);
  };

  // Start first round
  const startFirstRound = (initialMsg?: string) => {
    setRound(0);
    setShowInput(false);

    const firstQuestion = ROUNDS[0].question;

    // If user came with input from homepage, auto-answer round 0
    if (initialMsg?.trim()) {
      const userMsg: Message = { role: 'user', text: initialMsg };
      setMessages((prev) => [...prev, userMsg]);
      setUserAnswers([initialMsg.trim()]);

      setTimeout(() => {
        showRound1(initialMsg.trim());
      }, 800);
    } else {
      showGuideMessage(firstQuestion);
    }
  };

  // After round 0 answer
  const showRound1 = (answer: string) => {
    const empathy = getEmpathyForRound(0);
    const nextQ = ROUNDS[1].question;

    if (empathy) {
      setMessages((prev) => [...prev, { role: 'guide', text: empathy }]);
      setTimeout(() => {
        showGuideMessage(nextQ);
      }, 1200);
    } else {
      showGuideMessage(nextQ);
    }
  };

  // Handle user submission for current round
  const handleSubmit = (text: string) => {
    if (!text.trim()) return;

    const trimmed = text.trim();
    const newAnswers = [...userAnswers, trimmed];

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setUserText('');
    setShowInput(false);

    const nextRound = round + 1;

    setTimeout(() => {
      if (nextRound >= ROUNDS.length) {
        // All rounds complete → completion
        setUserAnswers(newAnswers);
        handleCompletion(newAnswers);
      } else {
        setUserAnswers(newAnswers);
        processNextRound(nextRound, trimmed, newAnswers);
      }
    }, 600);
  };

  const processNextRound = (nextRound: number, currentAnswer: string, allAnswers: string[]) => {
    const empathy = getEmpathyForRound(nextRound - 1); // empathy for PREVIOUS answer
    const transition = getTransition(nextRound);
    const nextQ = ROUNDS[nextRound]?.question;

    let delay = 400;

    if (empathy) {
      const empathyMsg: Message = { role: 'guide', text: empathy };
      setMessages((prev) => [...prev, empathyMsg]);
      delay = 1200;
    }

    setTimeout(() => {
      if (transition) {
        setMessages((prev) => [...prev, { role: 'guide', text: transition }]);
        setTimeout(() => {
          showGuideMessage(nextQ);
        }, 1000);
      } else {
        showGuideMessage(nextQ);
      }
      setRound(nextRound);
    }, delay);
  };

  const handleCompletion = (answers: string[]) => {
    setCompleted(true);

    // Run conversation engine silently
    const result = runConversation(answers, ROUNDS);

    // Save to session
    saveSession({
      input: initialInput,
      answers: [],  // engine output replaces fixed scores
      texts: answers,
      conversationResult: result,
      score: Math.round(
        (result.cognitive.physicalLoad +
          result.cognitive.emotionalCompression +
          result.cognitive.cognitiveNoise +
          result.cognitive.recoveryLatency +
          result.cognitive.behavioralDrift) / 5
      ),
      timestamp: Date.now(),
    });

    // Show completion messages
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'guide', text: 'That\'s enough. I can see your pattern now.', delay: 400 }]);

      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'guide', text: 'One moment — I\'m mapping your system.', delay: 400 }]);

        setTimeout(() => {
          router.push('/result');
        }, 1600);
      }, 1000);
    }, 500);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(userText);
    }
  };

  // ============================================================
  // ENTRANCE SCREEN (before first guide message)
  // ============================================================
  if (round === -1 && messages.length === 0) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-2 h-2 mx-auto mb-4 rounded-full bg-[#C4A862]/60 animate-ping" style={{ animationDuration: '2.5s' }} />
          <p className="text-white/20 text-xs tracking-[0.3em] font-light">Loading</p>
        </div>
      </main>
    );
  }

  // ============================================================
  // CHAT INTERFACE
  // ============================================================
  return (
    <main className="min-h-screen bg-[#0B0B0B] flex flex-col">
      <div className="flex-1 max-w-lg mx-auto w-full px-5 pt-4 pb-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4 scrollbar-thin" style={{ scrollBehavior: 'smooth' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[#C4A862]/15 border border-[#C4A862]/20 text-white/90'
                  : 'bg-white/[0.04] border border-white/[0.06] text-white/80'
              }`}>
                <p className="text-sm leading-relaxed font-light whitespace-pre-line">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {!showInput && !completed && (
            <div className="flex justify-start animate-fade-up">
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {showInput && (
          <div className="border-t border-white/[0.06] pt-3 pb-2 animate-fade-up">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder={round === 0 && !initialInput ? 'I\'ve been feeling...' : 'Type freely...'}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 text-sm outline-none resize-none placeholder:text-white/15 transition-all focus:border-[#C4A862]/30 max-h-32"
              />
              <button
                onClick={() => handleSubmit(userText)}
                disabled={!userText.trim()}
                className={`px-5 py-3 rounded-xl text-sm transition-all ${
                  userText.trim()
                    ? 'bg-[#C4A862] text-[#0B0B0B] hover:opacity-90'
                    : 'bg-white/5 text-white/15 cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
            <p className="text-white/10 text-[10px] mt-1.5 text-center font-light">
              {round === 0 && !initialInput
                ? 'There are no wrong answers — just what is true for you right now'
                : 'Press Enter to send'}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.4s ease-out forwards; }
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent; }
      `}</style>
    </main>
  );
}
