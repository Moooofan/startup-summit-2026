import type { Metadata } from "next";
import { Agenda } from "@/components/home/Agenda";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";

export const metadata: Metadata = {
  title: "論壇主題",
  description:
    "兩天，十二條主題軌。10/14 從創業實戰走到技術分軌，10/15 從機構投資人的資本配置談到 AI 與生醫的投資判準。",
  alternates: { canonical: "/agenda" },
  // 本頁目前不在 PUBLIC_ROUTES（業主 2026/8 指示暫時隱藏）：導覽列與 sitemap 都不給入口，
  // 但路由仍打得開。少了這行，外部連結一旦指過來就會被索引成沒有入口的孤兒頁
  // （/about 更會與首頁輸出同一份 FAQPage，形成重複結構化資料）。
  // 恢復對外時連同 PUBLIC_ROUTES 一起移除這行。
  robots: { index: false, follow: true },
};

export default function AgendaPage() {
  return (
    <>
      <ScrollSnapController />
      <Agenda />
    </>
  );
}
