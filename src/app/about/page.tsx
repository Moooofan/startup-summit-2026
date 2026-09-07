import type { Metadata } from "next";
import { About } from "@/components/home/About";
import { FounderNote } from "@/components/home/FounderNote";
import { Venue } from "@/components/home/Venue";
import { Faq } from "@/components/home/Faq";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";
import { FaqJsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = {
  title: "關於年會",
  description:
    "2026 第四屆台灣新創投資年會的活動總覽、創辦人的話、會場地點與常見問題。一天屬於創辦人、一天屬於投資人的雙峰論壇。",
  alternates: { canonical: "/about" },
  // 本頁目前不在 PUBLIC_ROUTES（業主 2026/8 指示暫時隱藏）：導覽列與 sitemap 都不給入口，
  // 但路由仍打得開。少了這行，外部連結一旦指過來就會被索引成沒有入口的孤兒頁
  // （/about 更會與首頁輸出同一份 FAQPage，形成重複結構化資料）。
  // 恢復對外時連同 PUBLIC_ROUTES 一起移除這行。
  robots: { index: false, follow: true },
};

export default function AboutPage() {
  return (
    <>
      <FaqJsonLd />
      <ScrollSnapController />
      <About as="h1" />
      <FounderNote />
      <Venue />
      <Faq />
    </>
  );
}
