import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kairin's Blog",
  description: "小灰的小窝",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <div className="bg-pattern" />
        <div className="bg-overlay" />
        {children}
      </body>
    </html>
  );
}
