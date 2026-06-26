'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSession } from '@/lib/core/session';
import { V5_ROUNDS, ChatMessage } from '@/lib/v5/types';
import { extractState, calculateSystemLoad } from '@/lib/v5/extractor';

export default function DiagnosePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialInput = searchParams.get('input') || '';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [userText, setUserText] = useState('');
  const [round, setRound] = useState(-1); // -1 = entrance, 0-3 = rounds, 4 = complete
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showInput]);

  // Focus input
  useEffect(() => {
    if (showInput && !isProcessing) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showInput, isProcessing]);

  // Entrance sequence
  useEffect(() => {
    const entranceMsgs: ChatMessage[] = [
      { role: 'guide', text: "Tell me what has been weighing on you lately.", timestamp: Date.now() },
      { role: 'guide', text: "I will listen.", timestamp: Date.now() + 600 },
    ];
    
    setTimeout(() => {
      setMessages([entranceMsgs[0]]);
      setTimeout(() => {
        setMessages(prev => [...prev, entranceMsgs[1]]);
        setTimeout(() => {
          setShowInput(true);
          if (initialInput) {
            // Auto-submit initial input from homepage
            handleUserMessage(initialInput);
          }
        }, 400);
      }, 600);
    }, 400);
  }, [initialInput]);

  const handleUserMessage = (text: string) => {
    if (!text.trim() || isProcessing) return;
    
    const trimmed = text.trim();
    setIsProcessing(true);
    setShowInput(false);
    
    // Add user message
    const userMsg: ChatMessage = { role: 'user', text: trimmed, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setUserText('');
    
    // Determine next step
    const nextRound = round + 1;
    
    setTimeout(() => {
      if (nextRound >= V5_ROUNDS.length) {
        // Complete - show final empathy then extract
        handleCompletion([...messages.filter(m => m.role === 'user').map(m => m.text), trimmed]);
      } else {
        // Continue to next round
        continueConversation(nextRound, trimmed);
      }
    }, 600);
  };

  const continueConversation = (roundIdx: number, lastAnswer: string) => {
    const roundConfig = V5_ROUNDS[roundIdx];
    
    // Show empathy for previous answer
    const empathyMsg: ChatMessage = { 
      role: 'guide', 
      text: roundConfig.empathyResponse,
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, empathyMsg]);
    
    setTimeout(() => {
      // Show next question
      const questionMsg: ChatMessage = { 
        role: 'guide', 
        text: roundConfig.question,
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, questionMsg]);
      setRound(roundIdx);
      setShowInput(true);
      setIsProcessing(false);
    }, 1000);
  };

  const handleCompletion = (allAnswers: string[]) => {
    // Final empathy
    const finalEmpathy: ChatMessage = { 
      role: 'guide', 
      text: "That's enough. I can see your pattern now.",
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, finalEmpathy]);
    
    setTimeout(() => {
      // Extract state from all answers
      const cognitiveState = extractState(allAnswers);
      const systemLoad = calculateSystemLoad(cognitiveState);
      
      // Save to session
      saveSession({
        input: initialInput || allAnswers[0],
        answers: [
          cognitiveState.physicalLoad,
          50, // placeholder for compatibility
          cognitiveState.emotionalCompression,
          cognitiveState.recoveryLatency,
          cognitiveState.cognitiveNoise,
        ],
        texts: allAnswers,
        v5State: cognitiveState,
        score: systemLoad,
        timestamp: Date.now(),
      });
      
      // Transition message
      const transitionMsg: ChatMessage = { 
        role: 'guide', 
        text: "One moment — I'm mapping your system.",
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, transitionMsg]);
      
      setTimeout(() => {
        router.push('/result');
      }, 1200);
    }, 800);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage(userText);
    }
  };

  // Loading state before entrance
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

  return (
    <main className="min-h-screen bg-[#0B0B0B] flex flex-col">
      <div className="flex-1 max-w-lg mx-auto w-full px-5 pt-4 pb-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 scrollbar-thin" style={{ scrollBehavior: 'smooth' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
              style={{ animationDelay: `${i * 60}ms` }}
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
          {isProcessing && (
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
        {showInput && !isProcessing && (
          <div className="border-t border-white/[0.06] pt-3 pb-2 animate-fade-up">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder={round === -1 ? "I've been feeling..." : "Type freely..."}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 text-sm outline-none resize-none placeholder:text-white/15 transition-all focus:border-[#C4A862]/30 max-h-32"
              />
              <button
                onClick={() => handleUserMessage(userText)}
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
              {round === -1 
                ? 'There are no wrong answers — just what is true for you right now'
                : `Round ${round + 1} of ${V5_ROUNDS.length}`}
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
