import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '灵枢 · 你的恢复系统',
  description: '基于身体状态，帮你找到恢复节奏',
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
