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
 * 三個內插值與 event.ts 的欄位一字不差（5 萬名成員／台灣新創投資社團／第四屆），
 * 刻意不寫死：社團人數與屆數每年都會動，寫死就得記得回來改這一段。
 */
const intro = [
  "AI、半導體供應鏈與資本市場都在重構，創辦人和投資人得比以前更早下判斷。台上的講者們走過創業、募資、上市櫃、併購與海外擴張，他們將分享如怎麼用當時擁有的資訊，做出關鍵決策，以及在決策後如何審視自己的判斷。",
  `年會從 2023 年辦到現在，來的是台灣的早期投資人與創業者，而主辦的${event.organizer.name}有 ${event.organizer.members}。今年是${event.editionLabel}，一樣是一天給創辦人、一天給投資人。`,
  `今年的主軸是「${event.theme}」，面對局勢快速變化，過去熟悉的規則可能已不再適用，而新的方向也尚未明朗。這兩天的議程，想和大家一起聊聊，在這樣的時刻，我們該怎麼分析和判斷，對於未來的變化又該如何布局。`,
  "另外，議程之外的時間 —— 中場、午餐與茶敘都會留給現場的創業家和投資人彼此認識與交流。",
];

/**
 * 這支同時被首頁與 /about 使用，所以標題層級要由呼叫端決定：
 * 首頁的主標是 Hero，這裡只是其中一個區塊（h2）；/about 則以本區塊為頁面主標（h1）。
 * 寫死任一邊都會出錯 —— 首頁會冒出第二個 h1，/about 則整頁沒有 h1。
 */
export function About({ as = "h2" }: { as?: "h1" | "h2" } = {}) {
  return (
    <section
      id="about"
      className="relative snap-start pb-24 pt-24 md:pb-28 md:pt-40 [scroll-margin-top:-88px]"
    >
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <Reveal>
          {/* 大標即本屆主軸，字串來自 event.theme —— 標題與下方第三段內文引用同一個常數，
              不在這裡另外補「 · 」之類的標點。標題只有四個字（2026/9 由九字的
              「等待黎明 · 擁抱變革」縮短而來），手機更不需要強制折行，
              所以舊版那個 <br className="sm:hidden" /> 一併移除。 */}
          <SectionHead as={as} eyebrow="ABOUT THE CONFERENCE" ghost="CONFERENCE" title={event.theme} />
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
