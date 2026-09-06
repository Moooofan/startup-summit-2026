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
  "AI、半導體供應鏈與資本市場都在重排，創辦人和投資人得比以前更早下判斷。台上的講者走過創業、募資、上市櫃、併購與海外擴張，他們要談的是當下手上有哪些資訊、憑什麼做了那個決定，以及後來證明哪裡看錯了。",
  `年會從 2023 年辦到現在，來的是台灣的早期投資人與創業者，主辦的${event.organizer.name}有 ${event.organizer.members}。今年是${event.editionLabel}，一樣以「${event.subtitle}」進行 —— 一天給創辦人，一天給投資人。`,
  `今年的主軸是「${event.theme}」。面對局勢快速變化，過去熟悉的方法可能已經不再適用，而新的方向也還在摸索中。這兩天的議程，想和大家一起聊聊，在這樣的時刻，我們該怎麼看、怎麼判斷，也該為接下來的變化做好哪些準備。`,
  "議程之外的時間也算數 —— 中場、午餐與茶敘都留給現場的創業家和投資人彼此認識。",
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
          <SectionHead eyebrow="ABOUT THE CONFERENCE" ghost="CONFERENCE" title={event.theme} />
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
