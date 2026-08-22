import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/config";
import { event } from "@/data/event";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

/**
 * 中文字型走 CDN <link> 而非 next/font：
 * Noto Sans TC 的 CSS 含上百段 unicode-range，next/font 會在建置期把每個字重的
 * 所有分片全部下載，導致 build 卡死。改由瀏覽器按需取用需要的字元範圍。
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}｜${event.subtitle}`,
    template: `%s｜${event.fullName}`,
  },
  description: site.description,
  keywords: [
    "台灣新創投資年會",
    "新創投資",
    "創投",
    "創辦人論壇",
    "投資人論壇",
    "台灣新創投資社團",
    "林文欽",
    event.nameEn,
  ],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: site.url,
    siteName: site.name,
    title: `${site.name}｜${event.subtitle}`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}｜${event.subtitle}`,
    description: site.description,
    images: ["/og.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={montserrat.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router：此規則針對 pages router，不適用 */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap"
        />
      </head>
      <body className="text-ink antialiased">
        {/* 全站背景：淺色流動水墨圖，模糊霧化 + 一層白霧提升文字可讀性（固定不隨捲動） */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          {/* 統一淺色霧面：白霧覆蓋整張圖 → 全站均勻淺色，任何區塊都不透出深墨浪 */}
          <div className="absolute inset-0 scale-110 bg-[url('/bg.jpg')] bg-cover bg-center blur-[26px]" />
          <div className="absolute inset-0 bg-white/64" />
        </div>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-bright focus:px-4 focus:py-2 focus:text-white"
        >
          跳到主要內容
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
