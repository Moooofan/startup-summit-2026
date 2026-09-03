import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/config";
import { event } from "@/data/event";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SiteBackdrop } from "@/components/site/SiteBackdrop";

/**
 * 中文字型走 CDN <link> 而非 next/font：
 * Noto Sans TC 的 CSS 含上百段 unicode-range，next/font 會在建置期把每個字重的
 * 所有分片全部下載，導致 build 卡死。改由瀏覽器按需取用需要的字元範圍。
 *
 * 字重清單多了 300（2026/9）：主視覺的「台灣新創投資年會」是細筆畫 + 大字距，
 * Hero 主標與各處大標都吃 font-light。這是 CDN <link>、不走 next/font，
 * 多一個字重只是多一行 @font-face 宣告，不會重演 build 卡死那件事。
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  // 300/400 是 2026 主視覺的拉丁字重（細體 + 大字距的英文全名鎖定）；
  // 少了它們只能用 500 頂替，字面會比 KV 粗一級、與中文標題的細筆畫對不起來。
  weight: ["300", "400", "500", "600", "700"],
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
    images: [{ url: "/og-2026.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}｜${event.subtitle}`,
    description: site.description,
    images: ["/og-2026.jpg"],
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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap"
        />
      </head>
      <body className="text-ink antialiased">
        {/* 全站背景：2026 主視覺的深靛底 + 線構圖（固定不隨捲動）。
            2026/9 從「/bg.jpg 水墨圖 + 白霧」的淺色版整站翻成深色版，
            構圖與可讀性分工說明見 SiteBackdrop 檔頭。 */}
        <SiteBackdrop />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-bright focus:px-4 focus:py-2 focus:text-[#05102e]"
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
