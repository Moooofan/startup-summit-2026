"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { forums } from "@/data/event";
import { Reveal } from "@/components/ui/Reveal";
import { SwipeDeck } from "@/components/ui/SwipeDeck";
import { isPublicRoute } from "@/lib/config";

type Forum = (typeof forums)[number];

/**
 * 首頁兩天論壇卡。md 以上兩張並排 grid；md 以下改成 /tickets 式
 * 「重疊卡片＋滑動切換」牌堆（原本是上下堆疊，業主要求比照 /tickets）。
 * 兩種版型共用同一個 ForumCard。
 *
 * ⚠️ 牌堆邊界原本是 lg，等於 768–1023px 的平板也吃手機版 —— SwipeDeck 的卡片寬是
 *    w-[76vw] max-w-[360px]，在 900px 寬的平板上會變成一張 360px 的卡置中、兩側大片空白。
 *    改成 md 之後 768px 時每張卡約 332px，扣掉 md:p-10 還有 252px，日期列（223px）放得下。
 *    票卡（TicketPlans）的邊界是 sm 而非 md，因為票卡內容量少得多、更早就排得下兩張。
 */
export function ForumCards() {
  return (
    <div className="mt-14 md:mt-16">
      {/* 平板與桌機：兩張並排 */}
      <div className="hidden gap-6 md:grid md:grid-cols-2">
        {forums.map((f, i) => (
          <Reveal key={f.key} delay={0.12 + i * 0.08}>
            <ForumCard f={f} />
          </Reveal>
        ))}
      </div>

      {/* 手機：重疊牌堆，滑動或點側卡、或點下方頁籤切換 */}
      <SwipeDeck
        className="md:hidden"
        items={forums}
        getKey={(f) => f.key}
        labels={forums.map((f) => f.name)}
        renderItem={(f) => <ForumCard f={f} />}
      />
    </div>
  );
}

function ForumCard({ f }: { f: Forum }) {
  return (
    /* 內距在牌堆版降到 p-6：卡片寬是 76vw，320px 螢幕只有 243px，p-8 之後內容區只剩 179px，
       對內文太窄。p-6 之後是 195px。
       ⚠️ 但**光靠 p-6 救不了下面那條日期列** —— 舊註解寫「日期列要 181px」是錯的：
          那是把「Day 1」當中文字用 17px 估出來的。它其實是 Montserrat 拉丁字（16px）加
          tracking-[0.22em] ＝ 59.7px，右側 10 / 14 是 font-display 26px ＝ 88.4px，
          再加（三）59px 與 gap-4，實際要 223px > 195px。正解見日期列自己的註解。 */
    <article className="glass group relative h-full overflow-hidden rounded-card p-6 transition-colors duration-500 hover:border-black/20 sm:p-8 md:p-10">
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-80 ${
          f.accent === "sky"
            ? "bg-orbit-sky/20 opacity-50"
            : "bg-[rgb(150_115_225)]/40 opacity-90"
        }`}
      />
      <div className="relative">
        {/* ⚠️ sm 以下改上下堆疊，不要再追那幾個像素：
            這一列固有寬 ＝ Day 1(59.7) + 10 / 14(88.4) + （三）+ml-2(59) + gap-4(16) ＝ 223px，
            但 320px 螢幕的卡片內容區只有 76vw(243) − p-6(48) ＝ 195px，360px 也只多 2.6px ——
            靠縮字級／縮間距去湊，餘裕會落在測量誤差內，換個字型或改文案就再爆一次。
            堆疊後第二行只需 147px，怎麼算都夠。sm 以上（卡片至少 296px 內容區）維持左右對齊。 */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          {/* whitespace-nowrap 是保險：這行是「Day 1」這種短標，一旦被擠到換行會變成兩層樓 */}
          <span className="font-display whitespace-nowrap text-xs tracking-[0.22em] text-ink-4">
            {f.label}
          </span>
          <span className="font-display text-2xl font-semibold text-ink-2">
            {f.dateLabel}
            <span className="ml-2 text-sm text-ink-4">（{f.weekday}）</span>
          </span>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-ink md:text-[1.75rem]">{f.name}</h3>
        <p className="font-display mt-1.5 text-xs font-semibold tracking-[0.14em] text-gold">
          {f.nameEn.toUpperCase()}
        </p>

        <p className="mt-5 text-[18px] leading-[1.9] text-ink-2">{f.description}</p>

        <p className="mt-6 text-[17px] text-ink-3">
          <span className="text-ink-4">主要聽眾｜</span>
          {f.audience}
        </p>

        {/* /agenda 隱藏期間不顯示這顆連結（見 lib/config 的 PUBLIC_ROUTES）。
            卡片上原本有四個主題軌 chips，2026/9 拿掉：議程已經就在兩張卡片正下方
            完整列出（見 HomeAgenda），同一屏內不要把同一批標題印兩次。 */}
        {isPublicRoute("/agenda") && (
          <Link
            href="/agenda"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-orbit-sky transition-colors hover:text-ink"
          >
            查看 {f.name}主題
            <ArrowUpRight size={15} />
          </Link>
        )}
      </div>
    </article>
  );
}
