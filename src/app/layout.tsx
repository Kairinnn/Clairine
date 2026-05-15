import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'
import { Nunito } from "next/font/google";

const codeFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-code",
});

const myFont = localFont({
  src: './fonts/Clairine.woff2',
  variable: '--font-custom',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://kairin.cc"),
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
    <html lang="zh-CN" className={myFont.variable}>
    <html lang="zh-CN" className={`${myFont.variable} ${codeFont.variable}`}>
        <body className="min-h-screen">
        <div className="bg-pattern" />
        <div className="bg-overlay" />
        {children}
import ScrollTop from "@/components/ScrollTop";

      // ...
        {children}
        <ScrollTop />
      </body>
    </html>
  );
}
