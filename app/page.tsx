"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    birthMinute: "0",
    gender: "male",
    bloodType: "",
    intent: "health",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim()) { setError("Please enter your name."); setLoading(false); return; }
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      setError("Please fill in all required birth date fields."); setLoading(false); return;
    }

    try {
      const params = new URLSearchParams({
        name: formData.name.trim(),
        year: formData.birthYear,
        month: formData.birthMonth,
        day: formData.birthDay,
        hour: formData.birthHour || "",
        gender: formData.gender,
        bloodType: formData.bloodType || "",
        intent: formData.intent || "health",
      });
      router.push(`/report?${params.toString()}`);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#0D0D15] text-[#F5F5F7]">

      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#C9A96E]/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#C9A96E]/40 rounded-full animate-float-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-[#C9A96E]/30 rounded-full animate-float-slower" />

        <div className="relative z-10 text-center max-w-3xl">
          <div className="text-xs text-[#636366] mb-4 tracking-[0.2em] uppercase font-semibold">
            Ancient Wisdom · Modern Science
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Energy
            <br />
            <span className="bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] bg-clip-text text-transparent">
              Blueprint
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#A1A1A6] mb-10 leading-relaxed max-w-2xl mx-auto">
            Discover the hidden patterns of your body, mind, and destiny.
            <br className="hidden md:block" />
            Rooted in BaZi, backed by AI.
          </p>
          <button
            onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-5 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#0D0D15] font-bold text-lg rounded-xl hover:scale-105 transition shadow-lg shadow-[#C9A96E]/20"
          >
            Start Your Analysis →
          </button>
          <p className="mt-4 text-xs text-[#636366]">Free · 3 minutes · No sign-up required</p>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-xs text-[#636366] tracking-widest">SCROLL</span>
          <div className="w-5 h-8 border-2 border-[#636366] rounded-full flex justify-center">
            <div className="w-1 h-2 bg-[#C9A96E] rounded-full mt-2 animate-scroll-dot" />
          </div>
        </div>
      </section>

      {/* ==================== 三大入口 ==================== */}
      <section id="three-dimensions" className="py-28 px-6 bg-gradient-to-b from-[#0D0D15] to-[#111122]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-[#636366] mb-3 tracking-[0.2em] uppercase font-semibold">
              Three Dimensions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Do You Want to
              <span className="text-[#C9A96E]"> Understand</span>?
            </h2>
            <p className="text-[#A1A1A6] max-w-xl mx-auto">
              Choose the area that matters most to you right now.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 身体状态 */}
            <div
              onClick={() => {
                setFormData(prev => ({ ...prev, intent: "health" }));
                document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group bg-[#1A1A2E] rounded-2xl p-8 border border-[#333] hover:border-[#C9A96E] transition cursor-pointer hover:-translate-y-1 duration-300 relative"
            >
              {formData.intent === "health" && <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#C9A96E] rounded-full shadow-lg shadow-[#C9A96E]/50" />}
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold mb-3 text-[#F5F5F7] group-hover:text-[#C9A96E] transition">
                Body & Energy
              </h3>
              <p className="text-[#A1A1A6] text-sm leading-relaxed mb-6">
                Why am I tired all the time? Why can&apos;t I sleep? What does my body need right now?
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Insomnia</span>
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Fatigue</span>
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Anxiety</span>
              </div>
            </div>

            {/* 人生方向 */}
            <div
              onClick={() => {
                setFormData(prev => ({ ...prev, intent: "career" }));
                document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group bg-[#1A1A2E] rounded-2xl p-8 border border-[#333] hover:border-[#C9A96E] transition cursor-pointer hover:-translate-y-1 duration-300 relative"
            >
              {formData.intent === "career" && <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#C9A96E] rounded-full shadow-lg shadow-[#C9A96E]/50" />}
              <div className="text-4xl mb-4">🧭</div>
              <h3 className="text-2xl font-bold mb-3 text-[#F5F5F7] group-hover:text-[#C9A96E] transition">
                Life Direction
              </h3>
              <p className="text-[#A1A1A6] text-sm leading-relaxed mb-6">
                Should I change careers? Start a business? Move to a new city?
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Career</span>
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Entrepreneurship</span>
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Life choices</span>
              </div>
            </div>

            {/* 情感关系 */}
            <div
              onClick={() => {
                setFormData(prev => ({ ...prev, intent: "relationship" }));
                document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group bg-[#1A1A2E] rounded-2xl p-8 border border-[#333] hover:border-[#C9A96E] transition cursor-pointer hover:-translate-y-1 duration-300 relative"
            >
              {formData.intent === "relationship" && <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#C9A96E] rounded-full shadow-lg shadow-[#C9A96E]/50" />}
              <div className="text-4xl mb-4">💞</div>
              <h3 className="text-2xl font-bold mb-3 text-[#F5F5F7] group-hover:text-[#C9A96E] transition">
                Relationships
              </h3>
              <p className="text-[#A1A1A6] text-sm leading-relaxed mb-6">
                Why do we keep fighting? Are we compatible? How can I understand my partner better?
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Compatibility</span>
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Communication</span>
                <span className="px-3 py-1 bg-[#0D0D15] text-xs text-[#A1A1A6] rounded-full border border-[#333]">Family</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6个案例 ==================== */}
      <section className="py-28 px-6 bg-[#0D0D15]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-[#636366] mb-3 tracking-[0.2em] uppercase font-semibold">
              Real Transformations
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              People Like You,<span className="text-[#C9A96E]"> Real Results</span>
            </h2>
            <p className="text-[#A1A1A6] max-w-xl mx-auto">
              *Simulated examples based on common user patterns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* 身体案例 1 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333] hover:border-green-500/50 transition group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full font-medium">Body & Energy</span>
                <span className="text-xs text-[#636366]">Simulated</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#C9A96E] transition">
                3-Year Insomnia Improved
              </h3>
              <p className="text-sm text-[#A1A1A6] mb-3 leading-relaxed">
                &ldquo;I hadn&apos;t slept through the night in three years. Doctors said it was stress. 
                LingShu showed my Fire element was depleted—I was literally running on empty.&rdquo;
              </p>
              <div className="text-xs text-[#636366] border-t border-[#333] pt-3 mt-3">
                <span className="text-green-400">✓</span> Sleep quality improved 70% after following energy-balancing routines
              </div>
            </div>

            {/* 身体案例 2 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333] hover:border-green-500/50 transition group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full font-medium">Body & Energy</span>
                <span className="text-xs text-[#636366]">Simulated</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#C9A96E] transition">
                Chronic Fatigue Recovery
              </h3>
              <p className="text-sm text-[#A1A1A6] mb-3 leading-relaxed">
                &ldquo;I needed three coffees just to get through the morning. The report identified 
                a Wood-Earth imbalance draining my digestive energy. Simple dietary changes changed everything.&rdquo;
              </p>
              <div className="text-xs text-[#636366] border-t border-[#333] pt-3 mt-3">
                <span className="text-green-400">✓</span> Energy levels stabilized within 3 weeks of personalized adjustments
              </div>
            </div>

            {/* 人生案例 1 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333] hover:border-[#C9A96E]/50 transition group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 bg-[#C9A96E]/20 text-[#C9A96E] rounded-full font-medium">Life Direction</span>
                <span className="text-xs text-[#636366]">Simulated</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#C9A96E] transition">
                Found Direction After Startup Failure
              </h3>
              <p className="text-sm text-[#A1A1A6] mb-3 leading-relaxed">
                &ldquo;My second startup failed. I didn&apos;t know if I should try again or give up 
                on entrepreneurship. The fortune cycle analysis showed I was in a transition phase—
                the perfect time to learn, not build.&rdquo;
              </p>
              <div className="text-xs text-[#636366] border-t border-[#333] pt-3 mt-3">
                <span className="text-[#C9A96E]">✓</span> Took a strategic 6-month break. Third startup is now profitable.
              </div>
            </div>

            {/* 人生案例 2 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333] hover:border-[#C9A96E]/50 transition group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 bg-[#C9A96E]/20 text-[#C9A96E] rounded-full font-medium">Life Direction</span>
                <span className="text-xs text-[#636366]">Simulated</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#C9A96E] transition">
                Career Shift That Changed Everything
              </h3>
              <p className="text-sm text-[#A1A1A6] mb-3 leading-relaxed">
                &ldquo;I was an engineer making good money but felt empty. My BaZi showed strong 
                Water-Metal—I was meant for creative work, not logic. I transitioned to product design. 
                Best decision of my life.&rdquo;
              </p>
              <div className="text-xs text-[#636366] border-t border-[#333] pt-3 mt-3">
                <span className="text-[#C9A96E]">✓</span> Within one year, income increased 40% and job satisfaction skyrocketed
              </div>
            </div>

            {/* 情感案例 1 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333] hover:border-pink-500/50 transition group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 bg-pink-900/30 text-pink-400 rounded-full font-medium">Relationships</span>
                <span className="text-xs text-[#636366]">Simulated</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#C9A96E] transition">
                Breaking the Argument Cycle
              </h3>
              <p className="text-sm text-[#A1A1A6] mb-3 leading-relaxed">
                &ldquo;My partner and I fought about the same things every month. The compatibility 
                analysis showed our elemental conflict—my Fire to his Water. Understanding this 
                didn&apos;t fix everything, but it stopped us from taking it personally.&rdquo;
              </p>
              <div className="text-xs text-[#636366] border-t border-[#333] pt-3 mt-3">
                <span className="text-pink-400">✓</span> Relationship satisfaction improved significantly after 2 months
              </div>
            </div>

            {/* 情感案例 2 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333] hover:border-pink-500/50 transition group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 bg-pink-900/30 text-pink-400 rounded-full font-medium">Relationships</span>
                <span className="text-xs text-[#636366]">Simulated</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#C9A96E] transition">
                Climbing Out of Emotional Low
              </h3>
              <p className="text-sm text-[#A1A1A6] mb-3 leading-relaxed">
                &ldquo;I was stuck in a dark place after a breakup. The report didn&apos;t just tell me 
                &apos;it gets better&apos;—it showed me which elements I needed to rebuild, and gave me 
                concrete daily practices. That specificity saved me.&rdquo;
              </p>
              <div className="text-xs text-[#636366] border-t border-[#333] pt-3 mt-3">
                <span className="text-pink-400">✓</span> Reported feeling &ldquo;like myself again&rdquo; within 6 weeks
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 灵枢方法论 ==================== */}
      <section className="py-28 px-6 bg-gradient-to-b from-[#111122] to-[#0D0D15]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-[#636366] mb-3 tracking-[0.2em] uppercase font-semibold">
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ancient Framework,<span className="text-[#C9A96E]"> Modern Intelligence</span>
            </h2>
            <p className="text-[#A1A1A6] max-w-xl mx-auto">
              Three layers of analysis, one personalized report.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#C9A96E]">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">BaZi Decoding</h3>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">
                Based on your birth date and gender, we calculate your Four Pillars of Destiny—
                the eight characters that map your elemental blueprint.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#C9A96E]">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Interpretation</h3>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">
                Our AI engine—trained on classical Chinese medicine texts and BaZi theory—
                translates your raw chart into actionable insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#C9A96E]">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Wellness Plan</h3>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">
                A practical 6-dimension plan tailored to your energy pattern—covering diet, 
                movement, rest, environment, and emotional practices.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-[#1A1A2E] rounded-xl px-8 py-6 border border-[#333] max-w-2xl">
              <p className="text-sm text-[#A1A1A6] leading-relaxed">
                <span className="text-[#C9A96E] font-bold">LingShu</span> is not fortune-telling. 
                We don&apos;t predict your future—we decode your energy pattern so 
                <span className="text-[#F5F5F7]"> you</span> can make better decisions about it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 用户反馈 ==================== */}
      <section className="py-28 px-6 bg-[#0D0D15]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-[#636366] mb-3 tracking-[0.2em] uppercase font-semibold">
              What People Say
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by <span className="text-[#C9A96E]">Early Users</span>
            </h2>
            <p className="text-[#A1A1A6] max-w-xl mx-auto">
              *Simulated feedback based on common user experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333]">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(i => <span key={i} className="text-[#C9A96E]">★</span>)}
              </div>
              <p className="text-[#F5F5F7] text-sm leading-relaxed mb-4">
                &ldquo;I was skeptical—another personality test? But this felt different. 
                The insights were uncannily specific to things I&apos;ve been struggling with 
                for years. It&apos;s like someone finally sees me.&rdquo;
              </p>
              <div className="text-xs text-[#636366]">— Sarah, 32, Singapore</div>
            </div>

            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333]">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(i => <span key={i} className="text-[#C9A96E]">★</span>)}
              </div>
              <p className="text-[#F5F5F7] text-sm leading-relaxed mb-4">
                &ldquo;The wellness plan was a game-changer. I&apos;ve tried meditation apps, 
                therapy, supplements—none of them addressed the root cause like this did. 
                Three weeks in and my sleep has completely transformed.&rdquo;
              </p>
              <div className="text-xs text-[#636366]">— Marcus, 28, London</div>
            </div>

            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333]">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(i => <span key={i} className="text-[#C9A96E]">★</span>)}
              </div>
              <p className="text-[#F5F5F7] text-sm leading-relaxed mb-4">
                &ldquo;I used it after a painful breakup just to&apos;see what it says.&apos; 
                The relationship insight made me realize patterns I&apos;d been blind to. 
                It didn&apos;t heal me overnight, but it pointed me in the right direction.&rdquo;
              </p>
              <div className="text-xs text-[#636366]">— Yuki, 27, Tokyo</div>
            </div>

            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-[#333]">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(i => <span key={i} className="text-[#C9A96E]">★</span>)}
              </div>
              <p className="text-[#F5F5F7] text-sm leading-relaxed mb-4">
                &ldquo;I&apos;m a product manager and I approached this analytically. 
                The BaZi chart alignment with my actual life patterns was startling. 
                I use the daily energy tips as a decision-making filter now.&rdquo;
              </p>
              <div className="text-xs text-[#636366]">— David, 35, San Francisco</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 付费报告介绍 ==================== */}
      <section className="py-28 px-6 bg-gradient-to-b from-[#111122] to-[#0D0D15]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-[#636366] mb-3 tracking-[0.2em] uppercase font-semibold">
              Premium
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Go Deeper With<span className="text-[#C9A96E]"> Full Report</span>
            </h2>
            <p className="text-[#A1A1A6] max-w-xl mx-auto">
              Your free preview shows your core energy pattern. Unlock the complete picture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 免费版 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-[#333]">
              <div className="text-[#636366] text-sm font-semibold mb-4 tracking-widest uppercase">Free</div>
              <div className="text-3xl font-bold text-[#F5F5F7] mb-6">$0</div>
              <ul className="space-y-3 text-sm text-[#A1A1A6]">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Five Elements energy chart</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>BaZi Four Pillars preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>6-dimension wellness overview</span>
                </li>
                <li className="flex items-start gap-2 text-[#636366]">
                  <span className="text-[#636366]">✗</span>
                  <span>Detailed AI interpretation</span>
                </li>
                <li className="flex items-start gap-2 text-[#636366]">
                  <span className="text-[#636366]">✗</span>
                  <span>10-year fortune cycles</span>
                </li>
              </ul>
            </div>

            {/* 付费版（高亮） */}
            <div className="bg-gradient-to-b from-[#1A1A2E] to-[#242438] rounded-2xl p-8 border-2 border-[#C9A96E] relative scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A96E] text-[#0D0D15] text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <div className="text-[#C9A96E] text-sm font-semibold mb-4 tracking-widest uppercase">Full Report</div>
              <div className="text-4xl font-bold text-[#F5F5F7] mb-1">$9.99</div>
              <div className="text-xs text-[#636366] mb-6">One-time · Instant access</div>
              <ul className="space-y-3 text-sm text-[#A1A1A6] mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] mt-0.5">✓</span>
                  <span className="text-[#F5F5F7]">Everything in Free</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] mt-0.5">✓</span>
                  <span className="text-[#F5F5F7]">Full AI BaZi interpretation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] mt-0.5">✓</span>
                  <span className="text-[#F5F5F7]">10-Year DaYun fortune cycles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] mt-0.5">✓</span>
                  <span className="text-[#F5F5F7]">Personalized daily guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] mt-0.5">✓</span>
                  <span className="text-[#F5F5F7]">Relationship compatibility</span>
                </li>
              </ul>
            </div>

            {/* 空白占位，让付费版居中 */}
            <div className="hidden md:block" />
          </div>
        </div>
      </section>

      {/* ==================== 表单 ==================== */}
      <section id="form-section" className="py-28 px-6 bg-[#0D0D15]">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs text-[#636366] mb-3 tracking-[0.2em] uppercase font-semibold">
              Start Now
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Enter Your<span className="text-[#C9A96E]"> Information</span>
            </h2>
            <p className="text-[#A1A1A6] text-sm">
              Free report in under 3 minutes. No account needed.
            </p>
            {/* intent 指示器 */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs bg-[#C9A96E]/10 text-[#C9A96E] px-3 py-1 rounded-full border border-[#C9A96E]/20">
                {formData.intent === "health" ? "🌿" : formData.intent === "career" ? "🧭" : "💞"}
                {' '}
                {formData.intent === "health" ? "Focus: Body & Energy" : formData.intent === "career" ? "Focus: Life Direction" : "Focus: Relationships"}
              </span>
              <button
                type="button"
                onClick={() => document.getElementById("three-dimensions")?.scrollIntoView({ behavior: "smooth" })}
                className="text-xs text-[#636366] hover:text-[#C9A96E] transition underline"
              >
                Change
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 姓名 */}
            <div>
              <label htmlFor="name" className="block text-sm text-[#A1A1A6] mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] placeholder-[#636366] focus:border-[#C9A96E] focus:outline-none transition"
                required
              />
              <p className="text-xs text-[#636366] mt-1">Use your real name for accurate analysis</p>
            </div>

            {/* 出生日期 */}
            <div>
              <label className="block text-sm text-[#A1A1A6] mb-2">
                Birth Date <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <select id="birthYear" name="birthYear" value={formData.birthYear} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition" required>
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select id="birthMonth" name="birthMonth" value={formData.birthMonth} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition" required>
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select id="birthDay" name="birthDay" value={formData.birthDay} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition" required>
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 出生时辰 */}
            <div>
              <label htmlFor="birthHour" className="block text-sm text-[#A1A1A6] mb-2">
                Birth Hour (optional)
              </label>
              <select id="birthHour" name="birthHour" value={formData.birthHour} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition">
                <option value="">Unknown / Not sure</option>
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <option key={hour} value={hour}>{hour}:00</option>
                ))}
              </select>
              <p className="text-xs text-[#636366] mt-1">If unknown, we analyze based on date alone</p>
            </div>

            {/* 血型 */}
            <div>
              <label htmlFor="bloodType" className="block text-sm text-[#A1A1A6] mb-2">
                Blood Type <span className="text-[#636366] text-xs">(optional, for personality analysis)</span>
              </label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition appearance-none"
              >
                <option value="">Select blood type (optional)</option>
                <option value="A">Type A</option>
                <option value="B">Type B</option>
                <option value="O">Type O</option>
                <option value="AB">Type AB</option>
              </select>
              <p className="text-xs text-[#636366] mt-1">
                💡 Blood type personality analysis is popular in Japan, Korea, and beyond
              </p>
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm text-[#A1A1A6] mb-2">Gender</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, gender: "male" }))}
                  className={`flex-1 py-3 rounded-lg border transition font-medium ${
                    formData.gender === "male"
                      ? "bg-[#C9A96E] text-[#0D0D15] border-[#C9A96E]"
                      : "bg-[#1A1A2E] text-[#A1A1A6] border-[#333] hover:border-[#C9A96E]"
                  }`}>Male</button>
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, gender: "female" }))}
                  className={`flex-1 py-3 rounded-lg border transition font-medium ${
                    formData.gender === "female"
                      ? "bg-[#C9A96E] text-[#0D0D15] border-[#C9A96E]"
                      : "bg-[#1A1A2E] text-[#A1A1A6] border-[#333] hover:border-[#C9A96E]"
                  }`}>Female</button>
              </div>
            </div>

            {/* 错误 */}
            {error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3 text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* 提交 */}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#0D0D15] font-bold text-lg rounded-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#C9A96E]/20">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-[#0D0D15] border-t-transparent rounded-full animate-spin"></div><span>Generating...</span></>
              ) : (
                <><span>Generate My Energy Report</span><span>→</span></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#636366]">
            Your data is encrypted and never shared. We don&apos;t require an account.
          </p>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-28 px-6 bg-gradient-to-b from-[#111122] to-[#0D0D15]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-[#636366] mb-3 tracking-[0.2em] uppercase font-semibold">
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Common<span className="text-[#C9A96E]"> Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is this fortune-telling?",
                a: "No. We don't predict your future. BaZi (Four Pillars of Destiny) is a framework for understanding your innate energy pattern—think of it as a user manual for your body and mind. What you do with that information is entirely up to you."
              },
              {
                q: "How accurate is this?",
                a: "BaZi has been refined over a thousand years of practice. Our AI engine is trained on classical texts and modern interpretations. That said, no system can capture the full complexity of a human life. Use the insights as a guide, not a verdict."
              },
              {
                q: "Is my data safe?",
                a: "Yes. Your birth information is encrypted in transit and never stored. We don't require sign-up, email, or any personal contact information."
              },
              {
                q: "What if I don't know my birth hour?",
                a: "No problem. We'll analyze based on your birth date alone. Adding the hour improves precision—especially for fortune cycle calculations—but the core analysis works without it."
              },
              {
                q: "What's the difference between free and paid?",
                a: "The free report shows your core Five Elements energy chart and a wellness overview. The full report ($9.99) adds detailed AI-powered BaZi interpretation, 10-year fortune cycles, and personalized daily guidance."
              },
              {
                q: "Is this related to traditional Chinese medicine?",
                a: "Yes. The Five Elements framework at the core of BaZi is the same system used in traditional Chinese medicine, acupuncture, and dietary therapy. Our wellness recommendations draw from this tradition."
              }
            ].map((item, i) => (
              <details key={i} className="group bg-[#1A1A2E] rounded-xl border border-[#333] open:border-[#C9A96E]/50 transition">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer text-[#F5F5F7] font-medium hover:text-[#C9A96E] transition">
                  {item.q}
                  <span className="text-[#C9A96E] text-xl transition group-open:rotate-180">▾</span>
                </summary>
                <div className="px-6 pb-5 text-sm text-[#A1A1A6] leading-relaxed border-t border-[#333] pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-16 px-6 bg-[#0D0D15] border-t border-[#1A1A2E]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-[#C9A96E] mb-2">灵枢</div>
          <p className="text-sm text-[#636366] mb-6">LingShu · Your Energy Blueprint</p>
          <div className="flex justify-center gap-6 text-xs text-[#636366] mb-8">
            <span>BaZi Analysis</span>
            <span className="text-[#333]">·</span>
            <span>Five Elements</span>
            <span className="text-[#333]">·</span>
            <span>Traditional Wisdom</span>
            <span className="text-[#333]">·</span>
            <span>AI-Powered</span>
          </div>
          <p className="text-xs text-[#636366]">
            LingShu is for informational and educational purposes. Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>

    </main>
  );
}
