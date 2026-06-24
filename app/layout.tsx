import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "灵枢 LingShu - Your Energy Blueprint",
  description:
    "Discover your Five-Element energy pattern. Personalized wellness plan based on BaZi and Traditional Chinese Medicine.",
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
