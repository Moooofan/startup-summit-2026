import { Check, Info, ChevronDown } from "lucide-react";
import { event, forums } from "@/data/event";
import { REGISTER_URL, REGISTER_READY } from "@/lib/config";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";
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

/**
 * 首頁報名資訊，拆成兩個滿版節點（與全站一致的一節一螢幕 STICK 版型）：
 *   1. 報名資訊大標＋日期時間小標，獨立一屏置中。
 *   2. 再往下捲一屏 → 藍→紫雙層渲染票卡（早鳥／全天）。
 * 票卡樣式沿用 /tickets 的相框設計：外白框 + 內襯漸層（左上藍 orbit-sky → 右下紫 #6d47c4）。
 */
export function Tickets() {
  return (
    <>
      {/* 節點一：報名資訊大標，滿版置中 */}
      <section
        id="tickets"
        className="grain relative flex min-h-[100svh] snap-start items-center justify-center overflow-hidden bg-bg-soft pb-16 pt-24 [scroll-margin-top:-88px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-0 h-[40vw] max-h-[540px] w-[40vw] max-w-[540px] rounded-full bg-[radial-gradient(circle,rgb(106_134_255/0.18)_0%,transparent_65%)]"
        />
        <div className="shell relative w-full">
          <Reveal>
            <SectionHead
              eyebrow="REGISTRATION"
              ghost="TICKETS"
              ghostClassName="top-0"
              align="center"
              title="報名資訊"
              lead={`${event.dateLabelLong}，${event.timeLabel}。兩日論壇於同一場地舉行。`}
            />
          </Reveal>

          {/* 向下滑提示（桌機顯示，與 Agenda 開場一致） */}
          <div className="pointer-events-none mt-14 hidden justify-center md:flex">
            <span className="inline-flex flex-col items-center gap-2 text-[17px] tracking-[0.24em] text-orbit-sky">
              向下滑看票種
              <ChevronDown size={20} aria-hidden className="animate-bounce motion-reduce:animate-none" />
            </span>
          </div>
        </div>
      </section>

      {/* 節點二：藍→紫雙層渲染票卡 */}
      <section
        id="tickets-plans"
        className="relative flex min-h-[100svh] snap-start items-center overflow-hidden pb-16 pt-24 [scroll-margin-top:-88px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-8%] bottom-[6%] h-[38vw] max-h-[520px] w-[38vw] max-w-[520px] rounded-full bg-[radial-gradient(circle,rgb(109_71_196/0.16)_0%,transparent_65%)]"
        />
        <div className="shell relative w-full">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 sm:gap-7">
            {plans.map((p, i) => (
              <Reveal key={p.key} delay={0.08 + i * 0.08}>
                <TicketCard plan={p} />
              </Reveal>
            ))}
          </div>

          {!REGISTER_READY && (
            <Reveal delay={0.24}>
              <div className="glass relative mx-auto mt-8 max-w-xl overflow-hidden rounded-card px-5 py-4">
                <p className="relative inline-flex items-start gap-2 text-[17px] leading-relaxed text-ink-3">
                  <Info size={14} className="mt-0.5 shrink-0 text-ink-4" aria-hidden />
                  <span>
                    報名連結尚未開放。開放後將同步公布於本頁與{" "}
                    <a
                      href="https://www.facebook.com/groups/1169347120648777/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orbit-sky underline-offset-4 hover:underline"
                    >
                      台灣新創投資社團
                    </a>
                    。
                  </span>
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}

/**
 * 票卡：平面雙層相框（沿用 /tickets）——
 * 外白框 + 內襯漸層（左上藍 orbit-sky → 右下紫 #6d47c4），內含票價、含括權益與報名鈕。
 */
function TicketCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div
      className={cn(
        "h-full rounded-[20px] border bg-white/85 p-2.5 shadow-[0_28px_70px_-28px_rgba(24,34,66,0.4)] sm:p-3",
        plan.featured ? "border-brand-lift/45" : "border-line"
      )}
    >
      <div
        className={cn(
          // flex-col + 下方 CTA 區 mt-auto：兩張卡在 grid 已被撐成等高，
          // 把 CTA 推到底端 → 左右卡的「報名」鈕水平對齊（不必手動補右卡間距）。
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
