import type { Metadata } from "next";
import { Agenda } from "@/components/home/Agenda";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";

export const metadata: Metadata = {
  title: "論壇主題",
  description:
    "兩天，十二條主題軌。10/14 從創業實戰走到技術分軌，10/15 從機構投資人的資本配置談到 AI 與生醫的投資判準。",
  alternates: { canonical: "/agenda" },
};

export default function AgendaPage() {
  return (
    <>
      <ScrollSnapController />
      {/* 獨立頁的第一段是頂端對齊的標題，補上固定 Nav 的高度避免被蓋 */}
      <div className="pt-[72px] md:pt-[88px]">
        <Agenda />
      </div>
    </>
  );
}
