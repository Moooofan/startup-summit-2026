import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FounderNote } from "@/components/home/FounderNote";
import { SpeakersPreview } from "@/components/home/SpeakersPreview";
import { Tickets } from "@/components/home/Tickets";
import { Faq } from "@/components/home/Faq";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";
import { HomeBackdrop } from "@/components/home/HomeBackdrop";
import { SiteJsonLd, EventJsonLd, FaqJsonLd } from "@/components/site/JsonLd";
import { speakers } from "@/data/speakers";

/**
 * 首頁（2026/8 業主定案的單頁結構）：
 *   1. Hero            —— 主視覺（維持現狀，未在本次調整範圍）
 *   2. 創辦人的話        —— FounderNote
 *      兩場年會核心議程    —— About（兩張論壇卡 + 各日主題軌）
 *      講者名單          —— SpeakersPreview（首頁精簡版，非 /speakers 的五頁滿版）
 *   3. 售票連結         —— Tickets
 *   4. 常見問題         —— Faq
 *
 * 這些區塊原本散在 /about、/speakers、/tickets；那些分頁的程式碼與路由都還在，
 * 只是目前從導覽列隱藏（見 lib/config 的 PUBLIC_ROUTES），所以這裡是「共用」而非「搬走」。
 *
 * 註：掛 ScrollSnapController（業主定案，2026/8）—— 讓首頁在桌機也走「一節一螢幕」的
 * 磁吸捲動（報名大字報 → 票卡 → FAQ 這尾段要求滿版磁吸，見 Tickets）。控制器只吸
 * 短節點、長內容（創辦人／議程／講者網格）維持原生順滑捲到底再吸，且手機/觸控完全不接管，
 * 所以先前「區塊高度不一會跳躍」的顧慮已由控制器本身的長短判斷處理掉。
 * ⚠️ 每個要參與磁吸的區塊都需帶 .snap-start／.snap-panel 標記，否則會被當死區一次捲過。
 */
export default function HomePage() {
  return (
    <>
      <ScrollSnapController />
      {/* 首頁專屬：歷屆活動照的梯形撕紙背景（固定、在文字之下） */}
      <HomeBackdrop />
      <SiteJsonLd />
      <EventJsonLd
        performers={speakers.map((s) => ({
          name: s.name,
          title: s.title,
          org: s.org,
          slug: s.slug,
        }))}
      />
      {/* FAQ 區塊搬上首頁，結構化資料要跟著一起 */}
      <FaqJsonLd />

      <Hero />
      <FounderNote />
      <About />
      <SpeakersPreview />
      <Tickets />
      <Faq />
    </>
  );
}
