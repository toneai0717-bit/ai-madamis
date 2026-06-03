import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIマダミス — 霧ヶ峰山荘の惨劇",
  description: "1人で何度でも遊べる、AI生成型の本格マーダーミステリー。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-lodge-bg text-lodge-text antialiased">{children}</body>
    </html>
  );
}
