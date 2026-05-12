import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/Clairine.woff2',
  variable: '--font-custom',
})

export const metadata: Metadata = {
  title: "Kairin's Daydream",
  description: "·˙°ʚElectronic etherɞ°˙·",
  openGraph: {
    title: "Kairin's Daydream",
    description: "·˙°ʚElectronic etherɞ°˙·",
    url: "https://kairin.cc",
    siteName: "Kairin's Daydream",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
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
