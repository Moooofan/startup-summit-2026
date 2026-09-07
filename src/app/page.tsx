import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { SpeakersPreview } from "@/components/home/SpeakersPreview";
import { Tickets } from "@/components/home/Tickets";
import { FounderNote } from "@/components/home/FounderNote";
import { Faq } from "@/components/home/Faq";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";
import { SiteJsonLd, EventJsonLd, FaqJsonLd } from "@/components/site/JsonLd";
import { speakers } from "@/data/speakers";

/**
 * 首頁（2026/9 業主第二次定序）。左邊是業主給的名稱，右邊是實作：
 *   1. 活動基本資訊 ＋ 2. 活動倒數  —— Hero（標題、日期、場地、報名鈕、翻牌倒數同一屏）
 *   3. 活動介紹                 —— About
 *   4. 兩日議程                 —— HomeAgenda（**掛在 About 內部**，見 About.tsx）
 *   5. 講者照片牆               —— SpeakersPreview（兩排移動式講者卡）
 *   6. 報名資訊（售票）          —— Tickets（票價、團報級距、報名連結）
 *   7. 創辦人介紹               —— FounderNote
 *   8. QA                     —— Faq
 *
 * 與前一版的差別有兩處：創辦人介紹從第 2 位移到報名之後（原本一進站就先看主辦人的個人敘事），
 * 講者照片牆移到報名之前（原本是「議程 → 報名」直接收單，現在讓陣容先當說服材料）。
 * 前一版註解寫的「議程看完馬上接報名（轉換點），講者陣容往後放」已經**不再成立**，勿據此還原。
 *
 * 要換順序只改這裡的 JSX，各區塊不互相依賴；但 4 是 3 的子節點，
 * 要把議程單獨挪走得先把 <HomeAgenda /> 從 About.tsx 拉出來。
 *
 * 這些區塊原本散在 /about、/speakers、/tickets；那些分頁的程式碼與路由都還在，
 * 只是目前從導覽列隱藏（見 lib/config 的 PUBLIC_ROUTES），所以這裡是「共用」而非「搬走」。
 *
 * 註：掛 ScrollSnapController（業主定案，2026/8）—— 讓首頁在桌機也走「一節一螢幕」的
 * 磁吸捲動（報名大字報 → 票卡 → FAQ 這尾段要求滿版磁吸，見 Tickets）。控制器只吸
 * 短節點、長內容（創辦人／議程／講者網格）維持原生順滑捲到底再吸，且手機/觸控完全不接管，
 * 所以先前「區塊高度不一會跳躍」的顧慮已由控制器本身的長短判斷處理掉。
 * 每個要參與磁吸的區塊都需帶 .snap-start／.snap-panel 標記，否則會被當死區一次捲過。
 */
export default function HomePage() {
  return (
    <>
      <ScrollSnapController />
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
      <About />
      <SpeakersPreview />
      <Tickets />
      <FounderNote />
      <Faq />
    </>
  );
}
