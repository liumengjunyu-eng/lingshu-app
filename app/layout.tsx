import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "灵枢 LingShu - 你的能量状态诊断",
  description:
    "三个问题，了解你的能量状态。免费、匿名、30 秒完成。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0D0D15] text-[#F5F5F7]" style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
