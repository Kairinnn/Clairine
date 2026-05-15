import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import ScrollTop from "@/components/ScrollTop";

const myFont = localFont({
  src: "./fonts/Clairine.woff2",
  variable: "--font-custom",
});

export const metadata: Metadata = {
  title: "Kairin's Daydream",
  description: "·˙°ʚElectronic etherɞ°˙·",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={myFont.variable}>
      <body className="min-h-screen">
        <div className="bg-pattern" />
        <div className="bg-overlay" />
        {children}
        <ScrollTop />
      </body>
    </html>
  );
}
