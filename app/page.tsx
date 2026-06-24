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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 验证
    if (!formData.name || !formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // 模拟生成报告（暂时跳转到报告页）
    try {
      // TODO: 调用 API 生成报告
      console.log("Form data:", formData);
      
      // 暂时跳转到报告页（带参数）
      const params = new URLSearchParams({
        name: formData.name,
        year: formData.birthYear,
        month: formData.birthMonth,
        day: formData.birthDay,
        hour: formData.birthHour,
        gender: formData.gender,
      });
      router.push(`/report?${params.toString()}`);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-[#0D0D15] to-[#1A1A2E]">
      {/* 品牌名 */}
      <h1 className="text-6xl font-bold text-[#C9A96E] mb-4 animate-fade-in-up">
        灵枢
      </h1>
      <p className="text-xl text-[#A1A1A6] mb-12 animate-fade-in-up animation-delay-200">
        LingShu · Your Energy Blueprint
      </p>

      {/* 输入表单 */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 animate-fade-in-up animation-delay-400">
        {/* 姓名 */}
        <div>
          <label htmlFor="name" className="block text-sm text-[#A1A1A6] mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] placeholder-[#636366] focus:border-[#C9A96E] focus:outline-none transition"
            required
          />
        </div>

        {/* 出生日期 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="birthYear" className="block text-sm text-[#A1A1A6] mb-2">
              Year
            </label>
            <select
              id="birthYear"
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition"
              required
            >
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="birthMonth" className="block text-sm text-[#A1A1A6] mb-2">
              Month
            </label>
            <select
              id="birthMonth"
              name="birthMonth"
              value={formData.birthMonth}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition"
              required
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="birthDay" className="block text-sm text-[#A1A1A6] mb-2">
              Day
            </label>
            <select
              id="birthDay"
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition"
              required
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 出生时辰 */}
        <div>
          <label htmlFor="birthHour" className="block text-sm text-[#A1A1A6] mb-2">
            Birth Hour (approximate)
          </label>
          <select
            id="birthHour"
            name="birthHour"
            value={formData.birthHour}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#1A1A2E] border border-[#333] rounded-lg text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none transition"
          >
            <option value="">Unknown</option>
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
        </div>

        {/* 性别 */}
        <div>
          <label className="block text-sm text-[#A1A1A6] mb-2">Gender</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, gender: "male" }))}
              className={`flex-1 py-3 rounded-lg border transition ${
                formData.gender === "male"
                  ? "bg-[#C9A96E] text-[#0D0D15] border-[#C9A96E]"
                  : "bg-[#1A1A2E] text-[#A1A1A6] border-[#333]"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, gender: "female" }))}
              className={`flex-1 py-3 rounded-lg border transition ${
                formData.gender === "female"
                  ? "bg-[#C9A96E] text-[#0D0D15] border-[#C9A96E]"
                  : "bg-[#1A1A2E] text-[#A1A1A6] border-[#333]"
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] text-[#0D0D15] font-bold text-lg rounded-lg hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate My Energy Report →"}
        </button>
      </form>

      {/* 底部说明 */}
      <p className="mt-12 text-sm text-[#636366] animate-fade-in-up animation-delay-600">
        Free · Based on BaZi & Traditional Chinese Medicine
      </p>
    </main>
  );
}
