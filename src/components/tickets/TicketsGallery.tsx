"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Mail,
  Handshake,
  Users,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { event, forums, lowestGroupPrice } from "@/data/event";
import { REGISTER_URL, REGISTER_READY, SPONSOR_CONTACT } from "@/lib/config";
import { Cta } from "@/components/ui/Cta";
import { SectionHead } from "@/components/ui/SectionHead";
import { TicketGroupTable } from "@/components/tickets/TicketGroupTable";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TicketsGallery — /tickets 的橫向三頁「相框畫廊」（平面版，無 WebGL）
   靈感：pmndrs image-gallery（相框、點擊/滑動切換、大小＋左右位移），
   但去掉 3D 前後景深、改純 CSS 平面切換。
   頁1 標題＋說明 → 頁2 票種相框（早鳥／全天，點擊或滑動切換）→ 頁3 聯絡資訊。
   邊緣箭頭帶「上一頁／下一頁 + 目的頁名」小字提示；支援鍵盤 ←→ 與觸控滑動。
   ========================================================================== */

const PAGE_NAMES = ["報名資訊", "票種資訊", "聯絡資訊"] as const;

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
    original: event.tickets.full,
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

const FB_GROUP = "https://www.facebook.com/groups/1169347120648777/";
const channels = [
  { icon: Mail, label: "一般 / 報名洽詢", value: event.contact.email, href: `mailto:${event.contact.email}`, external: false },
  { icon: Handshake, label: "贊助洽談", value: event.contact.sponsorEmail, href: SPONSOR_CONTACT, external: false },
  { icon: Users, label: "社群", value: event.organizer.name, href: FB_GROUP, external: true },
];

// 三張聯絡卡右上角漸層（各自飽和、都讀得出來）：紫 / 藍紫 / 淺藍
const cornerBlob = [
  "radial-gradient(circle, rgb(147 97 226 / 0.55) 0%, rgb(147 97 226 / 0.16) 45%, transparent 70%)",
  "radial-gradient(circle, rgb(108 122 236 / 0.52) 0%, rgb(108 122 236 / 0.15) 45%, transparent 70%)",
  "radial-gradient(circle, rgb(84 160 232 / 0.52) 0%, rgb(84 160 232 / 0.15) 45%, transparent 70%)",
];

/* -------------------------------------------------------------------------- */

export function TicketsGallery() {
  const [page, setPage] = useState(0); // 0 intro / 1 tickets / 2 contact
  const [ticket, setTicket] = useState(0); // 0 早鳥 / 1 全天

  const clamp = (n: number) => Math.max(0, Math.min(2, n));
  const go = (n: number) => setPage(clamp(n));

  // 深連結：/tickets?p=1 直接開到票種頁（也方便截圖驗證）
  useEffect(() => {
    const p = Number(new URLSearchParams(window.location.search).get("p"));
    if (p >= 1 && p <= 2) setPage(p);
  }, []);

  // 鍵盤 ←→ 切頁
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") setPage((p) => clamp(p + 1));
      else if (e.key === "ArrowLeft") setPage((p) => clamp(p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 觸控/滑鼠 水平滑動切頁（滑到票種卡上的手勢由卡片自行處理並 stopPropagation）
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
    setPage((p) => clamp(p + (dx < 0 ? 1 : -1)));
  };
  const onPointerCancel = () => {
    start.current = null;
  };

  // trackpad 水平滑動切頁（只吃 deltaX，垂直捲動留給頁面 → footer）
  const wheelLock = useRef(false);
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    if (wheelLock.current) return;
    wheelLock.current = true;
    setPage((p) => clamp(p + (e.deltaX > 0 ? 1 : -1)));
    window.setTimeout(() => (wheelLock.current = false), 700);
  };

  return (
    <section
      id="tickets"
      className="relative h-[100svh] overflow-hidden"
      style={{ touchAction: "pan-y" }} // 垂直留給頁面捲動；橫向手勢交給 JS 切頁
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onWheel={onWheel}
    >
      {/* 柔光背景 */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-[8%] h-[42vw] max-h-[560px] w-[42vw] max-w-[560px] rounded-full bg-[radial-gradient(circle,rgb(106_134_255/0.16)_0%,transparent_65%)]"
      />

      {/* 橫向三頁軌道 */}
      <div
        className="flex h-full w-full transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${page * 100}%)` }}
      >
        <IntroPanel active={page === 0} onNext={() => go(1)} />
        <TicketsPanel ticket={ticket} setTicket={setTicket} />
        <ContactPanel />
      </div>

      {/* 邊緣導覽箭頭（帶目的頁小字） */}
      {page > 0 && (
        <NavArrow dir="left" kicker="上一頁" label={PAGE_NAMES[page - 1]} onClick={() => go(page - 1)} />
      )}
      {page < 2 && (
        <NavArrow dir="right" kicker="下一頁" label={PAGE_NAMES[page + 1]} onClick={() => go(page + 1)} />
      )}

      {/* 底部控制列：頁碼點；手機另夾 ‹ › 箭頭（側邊箭頭在手機隱藏） */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          aria-label={page > 0 ? `上一頁：${PAGE_NAMES[page - 1]}` : "上一頁"}
          className="btn-glass grid h-10 w-10 place-items-center rounded-full border border-line bg-white/55 text-ink-3 transition-colors hover:text-brand-lift disabled:pointer-events-none disabled:opacity-30 sm:hidden"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <div className="flex items-center gap-2.5">
          {PAGE_NAMES.map((name, i) => (
            <button
              key={name}
              onClick={() => go(i)}
              aria-label={name}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                // 頁碼點只有 2px 高，掛 .btn-glass 沒有意義（微光會被 overflow 裁掉）→ 只降不透明度
                // 可點區用 ::after 往上下各撐 16px（8 + 32 = 40px）：這是每個斷點都看得到的
                // 主要換頁控制，8px 高的觸控目標在手機上按不到。用偽元素而非加 padding／改高度，
                // 是為了不動視覺位置（這一列是 absolute bottom-6，改高度會把點往上推）。
                "relative after:absolute after:-inset-x-0.5 after:-inset-y-4 after:content-['']",
                i === page ? "w-7 bg-[rgb(76_104_212/0.76)]" : "w-2 bg-ink/20 hover:bg-ink/40"
              )}
            />
          ))}
        </div>
        <button
          onClick={() => go(page + 1)}
          disabled={page === 2}
          aria-label={page < 2 ? `下一頁：${PAGE_NAMES[page + 1]}` : "下一頁"}
          className="btn-glass grid h-10 w-10 place-items-center rounded-full border border-line bg-white/55 text-ink-3 transition-colors hover:text-brand-lift disabled:pointer-events-none disabled:opacity-30 sm:hidden"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function NavArrow({
  dir,
  kicker,
  label,
  onClick,
}: {
  dir: "left" | "right";
  kicker: string;
  label: string;
  onClick: () => void;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={`${kicker}：${label}`}
      className={cn(
        // 手機隱藏側邊箭頭（會壓到卡片）→ 改用底部控制列；sm+ 才顯示
        "group absolute top-1/2 z-30 hidden -translate-y-1/2 items-center gap-3 sm:flex",
        dir === "left" ? "left-4 sm:left-6" : "right-4 sm:right-6 flex-row-reverse"
      )}
    >
      <span
        className={cn(
          "btn-glass grid h-12 w-12 place-items-center rounded-full border border-line bg-white/55 text-ink-3 transition-all duration-300",
          // hover 光暈要連 inset 高光一起寫，否則整條 box-shadow 被蓋掉 → 玻璃的上緣鏡面線會消失
          "group-hover:border-orbit-sky group-hover:bg-orbit-sky/12 group-hover:text-orbit-sky",
          "group-hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.58),inset_0_-1px_0_rgb(255_255_255/0.16),0_0_20px_rgb(47_127_176/0.28)]",
          dir === "left" ? "animate-nudge-l" : "animate-nudge-r"
        )}
      >
        <Icon size={22} aria-hidden />
      </span>
      <span
        className={cn(
          "hidden select-none sm:block",
          dir === "left" ? "text-left" : "text-right"
        )}
      >
        <span className="block text-[16px] tracking-[0.2em] text-ink-4/70">{kicker}</span>
        <span className="block text-[17px] font-medium text-ink-3 transition-colors group-hover:text-brand-lift">
          {label}
        </span>
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * 單頁外殼。外層負責捲動、內層負責置中 —— 兩層不能合併：
 * 直接在同一層寫 flex + items-center + overflow-y-auto，內容比容器高時
 * 上緣會被切掉且捲不回去（flex 置中的老問題）。拆成「外層捲動 + 內層 min-h-full 置中」
 * 才能做到「放得下就置中、放不下就往下捲」。
 * 這頁是 h-[100svh] 的固定高橫向畫廊，字級一調大票卡就撐破一頁 —— 原本是 overflow-hidden
 * 直接裁掉，改成可捲動後矮螢幕也看得完整張卡。
 * 垂直捲動不會被外層 section 攔走：那邊的 onWheel 只吃 deltaX，touchAction 也留了 pan-y。
 */
function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full shrink-0 overflow-y-auto overflow-x-hidden px-5 pb-24 pt-[80px] sm:px-20 sm:pb-16 sm:pt-[88px]">
      <div className="flex min-h-full items-center justify-center">{children}</div>
    </div>
  );
}

function IntroPanel({ active, onNext }: { active: boolean; onNext: () => void }) {
  return (
    <PanelShell>
      <div
        className={cn(
          "relative max-w-2xl text-center transition-all duration-700",
          active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        )}
      >
        {/* 與其他頁一致的大字報設計，只是置中（手機端大字報自動隱藏） */}
        <SectionHead
          as="h1"
          align="center"
          eyebrow="REGISTRATION"
          ghost="TICKETS"
          title="報名資訊"
          lead={
            <>
              {event.dateLabelLong}，{event.timeLabel}。兩日論壇於同一場地舉行，分開售票、票價相同。
            </>
          }
        />

        {/* 向右瀏覽提示：文字 + 金色能量段向右掃，前端帶箭頭 → 明確暗示右邊還有內容 */}
        <button
          onClick={onNext}
          aria-label="向右瀏覽票種與聯絡資訊"
          className="group mx-auto mt-11 block w-[min(90vw,680px)]"
        >
          <span className="block text-[17px] font-medium tracking-wide text-ink-3 transition-colors group-hover:text-gold">
            向右瀏覽票種與聯絡資訊
          </span>
          <span className="relative mt-3 block h-8 w-full overflow-hidden">
            {/* 靜態底軌 */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gold/15"
            />
            {/* 移動能量：漸層拖尾 + 前端大箭頭，一起向右掃 → 明確指向右方 */}
            <span
              aria-hidden
              className="animate-track-right absolute inset-y-0 left-0 flex w-1/3 items-center"
            >
              <span className="h-[3px] flex-1 rounded-full bg-gradient-to-r from-transparent to-gold" />
              <ChevronRight size={30} strokeWidth={3} className="-ml-3 shrink-0 text-gold" />
            </span>
          </span>
        </button>
      </div>
    </PanelShell>
  );
}

/* -------------------------------------------------------------------------- */

function TicketsPanel({
  ticket,
  setTicket,
}: {
  ticket: number;
  setTicket: (n: number) => void;
}) {
  // 票卡舞台上「橫向滑動」→ 切票種，並 stopPropagation 讓外層不切頁；
  // 舞台以外的橫向滑動仍由外層 section 處理 → 切頁。桌機點側邊卡（onClick）照舊。
  const swipeX = useRef<number | null>(null);
  const clampT = (n: number) => Math.max(0, Math.min(plans.length - 1, n));
  const onStageDown = (e: React.PointerEvent) => {
    swipeX.current = e.clientX;
    e.stopPropagation();
  };
  const onStageUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    const s = swipeX.current;
    swipeX.current = null;
    if (s == null) return;
    const dx = e.clientX - s;
    if (Math.abs(dx) < 40) return; // 位移太小 → 視為點擊，交給卡片 onClick
    setTicket(clampT(ticket + (dx < 0 ? 1 : -1)));
  };
  return (
    <PanelShell>
      <div className="w-full max-w-4xl">
        {/* 相框切換舞台（橫向滑動切票種）
            高度不再寫死。原本是 h-[58vh] max-h-[560px] min-h-[420px]，而所有票卡都是
            absolute（不撐高度）—— 字級一調大，卡片（約 520px）就撐破舞台被裁掉。
            改用下面那張隱形卡當「高度撐架」：舞台永遠等於最高那張卡的高度，
            切換票種時也不會跳動（兩張卡差一列「原價」）。 */}
        <div
          className="relative mx-auto flex items-center justify-center"
          onPointerDown={onStageDown}
          onPointerUp={onStageUp}
          onPointerCancel={() => (swipeX.current = null)}
        >
          {/* 高度撐架：唯一在流內的卡片，只佔位不顯示。
              plans[0] 是早鳥票（多一列「原價」）＝ 最高的一張；調動 plans 順序時要一起改。
              visibility:hidden → 不進 tab 順序、不被螢幕閱讀器讀到。 */}
          <div
            aria-hidden
            className="pointer-events-none invisible w-[76vw] max-w-[360px] sm:w-[360px]"
          >
            <TicketCard plan={plans[0]} interactive={false} />
          </div>

          {plans.map((p, i) => {
            const isActive = i === ticket;
            const side = i < ticket ? -1 : i > ticket ? 1 : 0; // 非作用中往自己那側 peek
            return (
              <div
                key={p.key}
                onClick={() => !isActive && setTicket(i)}
                aria-hidden={!isActive}
                className={cn(
                  // 手機縮窄 → 側邊卡露出可點；桌機固定寬
                  "absolute w-[76vw] max-w-[360px] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[360px]",
                  isActive
                    ? "z-20 scale-100 opacity-100"
                    : "z-10 scale-[0.82] cursor-pointer opacity-40 hover:opacity-60"
                )}
                style={{
                  transform: `translateX(${side * 58}%) scale(${isActive ? 1 : 0.82})`,
                }}
              >
                <TicketCard plan={p} interactive={isActive} />
              </div>
            );
          })}
        </div>

        {/* 票種切換頁籤 */}
        <div className="mt-9 flex items-center justify-center gap-3">
          {plans.map((p, i) => (
            <button
              key={p.key}
              onClick={() => setTicket(i)}
              className={cn(
                "btn-glass rounded-pill border-2 px-5 py-2 text-sm font-bold transition-all duration-300",
                i === ticket
                  ? "border-brand-lift bg-brand-lift/18 text-brand-lift"
                  : "border-line bg-white/42 text-ink-3 hover:border-brand-lift/50 hover:text-brand-lift"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* 團報級距不放進票卡（卡寬只有 76vw／360px），改掛在頁籤下方。
            PanelShell 本身是 overflow-y-auto + min-h-full 置中，內容超過一頁會自己捲，
            不必為了它調整舞台高度。 */}
        <TicketGroupTable />
      </div>
    </PanelShell>
  );
}

function TicketCard({
  plan,
  interactive,
}: {
  plan: (typeof plans)[number];
  interactive: boolean;
}) {
  return (
    // 相框：平面（無玻璃）— 外框 + 內襯，呼應畫廊相框
    <div
      className={cn(
        "rounded-[20px] border bg-white/85 p-2.5 shadow-[0_28px_70px_-28px_rgba(24,34,66,0.4)] sm:p-3",
        plan.featured ? "border-brand-lift/45" : "border-line"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[13px] border bg-gradient-to-br from-orbit-sky/18 via-white/45 to-[#6d47c4]/18 p-5 sm:p-7",
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

        {/* 主價一律是「1 人價」；團報級距在票種頁下方的對照表，這裡只帶一句最低價當鉤子 */}
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

        <div className="mt-4 sm:mt-5">
          <Cta
            href={REGISTER_URL}
            size="md"
            variant="outline"
            className={interactive ? "" : "pointer-events-none"}
          >
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

/* -------------------------------------------------------------------------- */

function ContactPanel() {
  return (
    <PanelShell>
      <div className="w-full max-w-3xl">
        <SectionHead
          align="center"
          eyebrow="CONTACT"
          ghost="CONTACT"
          title="聯絡資訊"
          lead="報名、贊助或任何合作洽談，歡迎透過以下方式與我們聯繫。"
        />

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
          {channels.map(({ icon: Icon, label, value, href, external }, i) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group relative block h-full overflow-hidden rounded-[16px] border border-line bg-white/45 p-2 shadow-[0_18px_50px_-24px_rgba(24,34,66,0.35)] transition-colors duration-300 hover:border-brand-lift/45"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-xl"
                style={{ background: cornerBlob[i] }}
              />
              {/* 相框內襯（比照早鳥票的外框＋內襯，但更透明） */}
              <div className="relative flex h-full flex-row items-center gap-4 rounded-[10px] border border-line-soft bg-white/25 p-4 sm:flex-col sm:items-start sm:gap-0 sm:p-5">
                <span className="shrink-0 text-brand-lift">
                  <Icon size={26} aria-hidden />
                </span>
                <span className="min-w-0 sm:mt-5">
                  <span className="block text-[17px] tracking-[0.14em] text-gold">{label}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-[18px] font-medium text-ink transition-colors group-hover:text-brand-lift sm:mt-1.5">
                    {value}
                    <ArrowUpRight size={14} className="shrink-0 text-ink-4 transition-colors group-hover:text-brand-lift" />
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-7 flex items-start justify-center gap-2 text-center text-[17px] leading-relaxed text-ink-3 sm:mt-8">
          <Info size={14} className="mt-0.5 shrink-0 text-ink-4" aria-hidden />
          主辦單位｜{event.organizer.name}・
          {event.organizer.host}　{event.organizer.hostTitle}
        </p>
      </div>
    </PanelShell>
  );
}
