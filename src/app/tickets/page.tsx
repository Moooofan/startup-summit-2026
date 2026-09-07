import type { Metadata } from "next";
import { TicketsGallery } from "@/components/tickets/TicketsGallery";

export const metadata: Metadata = {
  title: "報名資訊",
  description:
    "2026 第四屆台灣新創投資年會報名資訊：單日票的早鳥與一般票價、團報級距、含括權益，以及開幕日期與地點。",
  alternates: { canonical: "/tickets" },
  // 本頁目前不在 PUBLIC_ROUTES（業主 2026/8 指示暫時隱藏）：導覽列與 sitemap 都不給入口，
  // 但路由仍打得開。少了這行，外部連結一旦指過來就會被索引成沒有入口的孤兒頁
  // （/about 更會與首頁輸出同一份 FAQPage，形成重複結構化資料）。
  // 恢復對外時連同 PUBLIC_ROUTES 一起移除這行。
  robots: { index: false, follow: true },
};

export default function TicketsPage() {
  return <TicketsGallery />;
}
