"use client";

import { Check } from "lucide-react";
import { event, forums, lowestGroupPrice } from "@/data/event";
import { REGISTER_URL, REGISTER_READY } from "@/lib/config";
import { Cta } from "@/components/ui/Cta";
import { SwipeDeck } from "@/components/ui/SwipeDeck";
import { TicketGroupTable } from "@/components/tickets/TicketGroupTable";
import { cn } from "@/lib/utils";

const included = [
  // 單日票：一張票只進一天的場（業主 2026/9 定案），文案不可再寫「兩日」
  "單日論壇全場次入場",
  "現場茶敘與交流時段",
  "品牌攤位區自由參觀",
  "活動紀念手冊",
];

const plans = [
  {
    key: "early",
    name: "早鳥票",
    nameEn: "Early Bird",
    price: event.tickets.earlyBird,
    original: event.tickets.full as number | null,
    note: event.tickets.note,
    featured: true,
  },
  {
    key: "full",
    // 單日票制下不再有「全天票」。簡報價目表寫「正常票」，業主 2026/9 指定站上用「一般票」
    name: "一般票",
    nameEn: "Regular",
    price: event.tickets.full,
    original: null as number | null,
    note: "報名開放期間皆可購買",
    featured: false,
  },
];

type Plan = (typeof plans)[number];

/**
 * 首頁票種。桌機維持兩張並排 grid；手機改成 /tickets 式「重疊卡片＋滑動切換」牌堆
 * （原本手機是上下堆疊，業主要求比照 /tickets 左右重疊、可滑動）。
 * 兩種版型共用同一個 TicketCard，用 sm 斷點各自顯示其一。
 *
 * 票卡只顯示 1 人價，四段團報級距交給下方的 TicketGroupTable（業主 2026/9 定案）。
 * 加了對照表之後，外層 #tickets-plans 的高度會超過一屏 —— 這會讓
 * ScrollSnapController 把它判為「長內容區塊」（isShort 為 false）而交還原生捲動，
 * 要捲到底才跳下一節。這是控制器的既定行為、不是壞掉，別為此把表格搬走。
 */
export function TicketPlans() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* 桌機：兩張並排 */}
      <div className="mx-auto hidden max-w-4xl gap-7 sm:grid sm:grid-cols-2">
        {plans.map((p) => (
          <TicketCard key={p.key} plan={p} />
        ))}
      </div>

      {/* 手機：重疊牌堆，滑動或點側卡、或點下方頁籤切換 */}
      <SwipeDeck
        className="sm:hidden"
        items={plans}
        getKey={(p) => p.key}
        labels={plans.map((p) => p.name)}
        renderItem={(p) => <TicketCard plan={p} />}
      />

      <TicketGroupTable />
    </div>
  );
}

/**
 * 票卡：平面雙層相框（沿用 /tickets）——
 * 外白框 + 內襯漸層（左上藍 orbit-sky → 右下紫 #a98bff），內含票價、含括權益與報名鈕。
 */
function TicketCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "h-full rounded-[20px] border bg-[rgb(9_16_54/0.72)] p-2.5 shadow-[0_28px_70px_-28px_rgba(1,4,24,0.78)] sm:p-3",
        plan.featured ? "border-brand-lift/45" : "border-line"
      )}
    >
      <div
        className={cn(
          // flex-col + 下方 CTA 區 mt-auto：兩張卡等高時把「報名」鈕推到底端 → 左右卡水平對齊。
          "relative flex h-full flex-col overflow-hidden rounded-[13px] border bg-gradient-to-br from-orbit-sky/16 via-[rgb(12_22_70/0.5)] to-[#a98bff]/16 p-5 sm:p-7",
          plan.featured ? "border-brand-lift/30" : "border-line-soft"
        )}
      >
        {plan.featured && (
          <span className="absolute right-4 top-4 inline-flex items-center rounded-pill border-2 border-aqua/60 bg-aqua/18 px-3 py-1 text-[16px] font-bold text-aqua sm:right-5 sm:top-5">
            限量
          </span>
        )}
        <p className="text-sm font-medium text-ink">{plan.name}</p>
        <p className="font-display text-xs tracking-[0.16em] text-ink-4">
          {plan.nameEn.toUpperCase()}
        </p>

        {/* 主價一律是「1 人價」；團報級距在下方對照表，這裡只帶一句最低價當鉤子 */}
        {/* max-[359px] 是 320px 級距的救命索，且這裡的破法是「直接被切掉」而非換行：
            這一列沒有 flex-wrap，而 NT$2,500 是 Montserrat 的一串拉丁字元（無斷行點）——
            33.6px 下約 161px，加 gap-2(8) 與「／人」(34) 共 203px，
            但 320px 螢幕的卡片內容區只有 76vw(243) − p-2.5(20) − p-5(40) ＝ 183px，
            而內層包洗是 overflow-hidden → 數字尾巴直接不見。
            降到 1.75rem(28px) 後為 134+8+34 ＝ 176px，360px 以上一個像素都不動。 */}
        <p className="mt-5 flex items-baseline gap-2 sm:mt-6">
          <span className="font-display text-[2.1rem] font-semibold leading-none text-ink max-[359px]:text-[1.75rem] sm:text-[2.6rem]">
            {event.tickets.currency}
            {plan.price.toLocaleString()}
          </span>
          <span className="text-[17px] text-ink-4">／人</span>
        </p>
        {plan.original && (
          <p className="mt-2 text-sm text-ink-4">
            原價{" "}
            <span className="line-through">
              {event.tickets.currency}
              {plan.original.toLocaleString()}
            </span>
          </p>
        )}
        <p className="mt-2 text-[17px] text-ink-3">
          團報最低{" "}
          <span className="font-medium text-ink-2">
            {event.tickets.currency}
            {(plan.key === "early"
              ? lowestGroupPrice.earlyBird
              : lowestGroupPrice.full
            ).toLocaleString()}
            ／人
          </span>
        </p>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-3">{plan.note}</p>

        <ul className="mt-3.5 grid gap-1.5 border-t border-line-soft pt-3.5 sm:mt-4 sm:pt-4">
          {included.map((item) => (
            <li key={item} className="flex items-center gap-2 text-[17px] text-ink-2">
              <Check size={14} className="shrink-0 text-brand-lift" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4 sm:pt-5">
          <Cta href={REGISTER_URL} size="md" variant="outline">
            {REGISTER_READY ? "前往報名" : "報名即將開放"}
          </Cta>
        </div>

        {/* 兩行都必要：上行說明有哪兩場，下行說明它們是分開賣的 ——
            只留上行的話，這張卡在單日票語意下會被讀成「一張票通兩天」。 */}
        <p className="mt-3 text-[17px] text-ink-4">
          {forums.map((f) => `${f.dateLabel.replace(/ /g, "")} ${f.name}`).join("　|　")}
          <span className="mt-1 block">兩天分開售票、票價相同</span>
        </p>
      </div>
    </div>
  );
}
