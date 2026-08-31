import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FounderNote } from "@/components/home/FounderNote";
import { SpeakersPreview } from "@/components/home/SpeakersPreview";
import { Tickets } from "@/components/home/Tickets";
import { Faq } from "@/components/home/Faq";
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
 * 註：不掛 ScrollSnapController —— 它是給 /about、/agenda 那種
 * 「一節一螢幕」的分頁用的；首頁區塊高度不一，接管捲動會讓閱讀變得跳躍。
 */
export default function HomePage() {
  return (
    <>
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
