"use client";

import { Check } from "lucide-react";
import { event, forums } from "@/data/event";
import { REGISTER_URL, REGISTER_READY } from "@/lib/config";
import { Cta } from "@/components/ui/Cta";
import { SwipeDeck } from "@/components/ui/SwipeDeck";
import { cn } from "@/lib/utils";

const included = [
  "兩日論壇全場次入場",
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
    name: "全天票",
    nameEn: "Full Pass",
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
    </div>
  );
}

/**
 * 票卡：平面雙層相框（沿用 /tickets）——
 * 外白框 + 內襯漸層（左上藍 orbit-sky → 右下紫 #6d47c4），內含票價、含括權益與報名鈕。
 */
function TicketCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "h-full rounded-[20px] border bg-white/85 p-2.5 shadow-[0_28px_70px_-28px_rgba(24,34,66,0.4)] sm:p-3",
        plan.featured ? "border-brand-lift/45" : "border-line"
      )}
    >
      <div
        className={cn(
          // flex-col + 下方 CTA 區 mt-auto：兩張卡等高時把「報名」鈕推到底端 → 左右卡水平對齊。
          "relative flex h-full flex-col overflow-hidden rounded-[13px] border bg-gradient-to-br from-orbit-sky/18 via-white/45 to-[#6d47c4]/18 p-5 sm:p-7",
          plan.featured ? "border-brand-lift/30" : "border-line-soft"
        )}
      >
        {plan.featured && (
          <span className="absolute right-4 top-4 inline-flex items-center rounded-pill border-2 border-gold/60 bg-gold/15 px-3 py-1 text-[16px] font-bold text-gold sm:right-5 sm:top-5">
            限量
          </span>
        )}
        <p className="text-sm font-medium text-ink">{plan.name}</p>
        <p className="font-display text-xs tracking-[0.16em] text-ink-4">
          {plan.nameEn.toUpperCase()}
        </p>

        <p className="mt-5 flex items-baseline gap-2 sm:mt-6">
          <span className="font-display text-[2.1rem] font-semibold leading-none text-ink sm:text-[2.6rem]">
            {event.tickets.currency}
            {plan.price.toLocaleString()}
          </span>
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

        <p className="mt-3 text-[17px] text-ink-4">
          {forums.map((f) => `${f.dateLabel.replace(/ /g, "")} ${f.name}`).join("　|　")}
        </p>
      </div>
    </div>
  );
}
