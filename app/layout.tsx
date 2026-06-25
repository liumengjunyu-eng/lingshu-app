import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "灵枢 - 你的恢复指南",
  description:
    "1分钟了解你的真实状态，找到适合你的恢复节奏。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
