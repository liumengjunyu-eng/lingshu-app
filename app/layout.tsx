import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LingShu - 恢复状态测评',
  description: '你不是累。你是恢复方式不对。',
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
