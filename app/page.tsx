'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EXAMPLES = [
 'Running on empty',
 "Can't switch off at night",
 'Everything feels delayed',
];

export default function HomePage() {
 const router = useRouter();
 const [input, setInput] = useState('');
 const [showCTA, setShowCTA] = useState(false);

 useEffect(() => {
 const timer = setTimeout(() => setShowCTA(true), 1200);
 return () => clearTimeout(timer);
 }, []);

 const handleSubmit = () => {
 if (input.trim()) {
 router.push(`/diagnose?input=${encodeURIComponent(input)}`);
 }
 };

 return (
 <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
 <div className="max-w-xl w-full text-center">
 {/* 呼吸圆 */}
 <div className="w-16 h-16 mx-auto rounded-full border border-gold/20 animate-breath mb-8" />

 {/* 主标题 */}
 <h1 className="text-hero font-light text-white leading-[1.15] tracking-tight">
 You are not broken.
 <br />
 <span className="text-gold">You are just operating beyond your recovery capacity.</span>
 </h1>

 {/* 输入框 */}
 <div className="mt-8 relative">
 <div className="absolute inset-0 bg-gold/5 blur-2xl rounded-xl" />
 <textarea
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Describe your current state in one sentence."
 className="relative w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-body placeholder:text-white/20 outline-none focus:border-gold/50 transition resize-none min-h-[80px]"
 onKeyDown={(e) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleSubmit();
 }
 }}
 />
 </div>

 {/* 案例气泡 */}
 <div className="mt-4 flex flex-wrap justify-center gap-2">
 {EXAMPLES.map((text) => (
 <button
 key={text}
 onClick={() => setInput(text)}
 className="px-4 py-1.5 text-meta text-white/40 border border-white/5 rounded-full hover:border-gold/30 hover:text-white/70 transition"
 >
 {text}
 </button>
 ))}
 </div>

 {/* CTA */}
 <div className={`mt-8 transition-opacity duration-700 ${showCTA ? 'opacity-100' : 'opacity-0'}`}>
 <button
 onClick={handleSubmit}
 className="w-full py-3 bg-gold text-bg rounded-full font-medium hover:opacity-90 transition text-body"
 >
 Analyze My System
 </button>
 <p className="text-meta text-white/15 mt-3">Free · 2 minutes</p>
 </div>
 </div>
 </main>
 );
}
