import { event } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { ForumCards } from "@/components/home/ForumCards";
import { HomeAgenda } from "@/components/home/HomeAgenda";

/**
 * 區塊導言（業主 2026/9 交付的定位文案，四段）。
 *
 * 為什麼不放進 SectionHead 的 lead：那支 prop 被包在**單一 <p>** 裡
 * （見 ui/SectionHead.tsx 左對齊分支），塞多個段落會變成 <p> 巢狀 ——
 * 瀏覽器 parser 會自行拆開，跟 React 的輸出對不上而產生 hydration 警告。
 * 改用站內既有的多段落寫法（同 FounderNote 與講者內頁），行高取 1.9 而非那兩處的 2，
 * 是為了對齊原本 lead 的樣式，讀起來仍是同一段導言而不是另一種內文。
 *
 * 四個內插值與 event.ts 的欄位一字不差（5 萬名成員／台灣新創投資社團／第四屆／雙峰論壇），
 * 刻意不寫死：社團人數與屆數每年都會動，寫死就得記得回來改這一段。
 */
const intro = [
  "AI、半導體供應鏈與資本市場正在重塑，創辦人和投資人必須更早做決定。如果你正在決定公司未來的發展和投資方向，你將在這場新創投資年會獲得啟發。講者們走過創業、投資、上市櫃、併購與海外擴張等階段，會分享他們如何解構與定義高變動性的現代，以及如何做出帶來長期優勢的決策。",
  `2023 年起，${event.name}集結全台頂尖早期投資人與創業者，並由擁有 ${event.organizer.members}的${event.organizer.name}主辦，今年邁入${event.editionLabel}，以「${event.subtitle}」形式舉行 — 一天屬於創辦人，一天屬於投資人。`,
  `今年的主軸是「${event.theme}」，將探討當過去的規則失效，未來局勢又尚未明朗時，如何提出深刻的洞察、整合跨領域的資訊，為產業注入創新的影響力。`,
  "用兩天的時間，與在場的創業家、投資人鏈結，共創台灣新創投資圈的嶄新價值。",
];

export function About() {
  return (
    <section
      id="about"
      className="relative snap-start pb-24 pt-24 md:pb-28 md:pt-40 [scroll-margin-top:-88px]"
    >
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <Reveal>
          {/* 大標即本屆主軸，字串來自 event.theme —— 標題與下方第三段內文引用同一個常數，
              不在這裡另外補「 · 」之類的標點。標題只有 9 個字元，手機不需要強制折行，
              所以舊版那個 <br className="sm:hidden" /> 一併移除。 */}
          <SectionHead eyebrow="ABOUT THE SUMMIT" ghost="SUMMIT" title={event.theme} />
        </Reveal>

        <Reveal delay={0.06}>
          {/* max-w-2xl 與原本 SectionHead 的 lead 同寬，換行位置因此不會跳掉 */}
          <div className="mt-5 max-w-2xl space-y-5">
            {intro.map((p, i) => (
              <p key={i} className="text-[18px] leading-[1.9] text-ink-2">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {/* 兩天論壇（桌機並排 / 手機滑動牌堆，見 ForumCards） */}
        <ForumCards />

        {/* 今年議程（業主 2026/9：兩張論壇卡下面要放主題與講者名單）。
            About 同時被首頁與 /about 使用 → /about 也會出現這段議程。兩頁目前都不是
            導覽列上的入口（/about 隱藏中，見 lib/config 的 PUBLIC_ROUTES），影響有限；
            日後若 /about 重新開放、又不想與 /agenda 重複，把這行移到 app/page.tsx 即可。 */}
        <HomeAgenda />
      </div>
    </section>
  );
}
