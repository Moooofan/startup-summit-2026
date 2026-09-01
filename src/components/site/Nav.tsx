"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { event } from "@/data/event";
import { useCountdown } from "@/lib/useCountdown";
import { isPublicRoute, REGISTER_URL, REGISTER_READY } from "@/lib/config";

/** 全站導覽項目。實際顯示的是下面經 isPublicRoute 過濾後的 links ——
 *  隱藏中的分頁保留在這裡不刪，恢復時只需改 config 的 PUBLIC_ROUTES。 */
const allLinks = [
  { href: "/about", label: "關於年會" },
  { href: "/speakers", label: "講者陣容" },
  { href: "/agenda", label: "論壇主題" },
  { href: "/tickets", label: "報名資訊" },
  { href: "/sponsor", label: "贊助方案" },
  { href: "/review", label: "歷屆回顧" },
];

const links = allLinks.filter((l) => isPublicRoute(l.href));

/** 報名 CTA 的去向：/tickets 隱藏時就不該再指過去，改用設定的報名連結。 */
const registerHref = isPublicRoute("/tickets") ? "/tickets" : REGISTER_URL;
const showRegisterCta = isPublicRoute("/tickets") || REGISTER_READY;

function NavCountdown() {
  const t = useCountdown(event.startDate);
  if (!t || t.done) return null;
  return (
    <div className="hidden items-center gap-2 text-xs text-ink-3 xl:flex">
      <span className="tracking-wide">距開幕</span>
      <span className="font-display text-sm font-semibold tabular-nums text-ink">
        {t.days}
        <span className="mx-0.5 text-ink-3">天</span>
        {String(t.hours).padStart(2, "0")}
        <span className="mx-0.5 text-ink-3">:</span>
        {String(t.minutes).padStart(2, "0")}
        <span className="mx-0.5 text-ink-3">:</span>
        {String(t.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-black/8 bg-bg/90 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-bg/90 to-transparent"
      )}
    >
      <nav className="shell flex h-[72px] items-center justify-between gap-6 md:h-[88px]">
        <Link href="/" className="group flex items-center gap-3" aria-label={event.fullName}>
          <Image
            src="/logo-mark.png"
            alt=""
            width={236}
            height={224}
            priority
            className="h-7 w-auto transition-transform duration-300 group-hover:scale-105 md:h-8"
          />
          <span className="leading-tight">
            <span className="block text-[17px] font-bold tracking-wide text-ink md:text-sm">
              台灣新創投資年會
            </span>
            {/* 這行刻意不吃全站字級級距，維持原始的 10px。
                它是 logo 的副標，字級一旦追上上方主標（17px）就變成階層倒置 ——
                全站字級曾整條上調（10→12→14→16），這行被一起帶上去後又調了回來。
                下次再做全域字級調整時，請把這行排除。 */}
            <span className="font-display block text-[10px] tracking-[0.18em] text-ink-3">
              2026 · 4TH
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative text-sm text-ink-2 transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brand-glow after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <NavCountdown />
          {showRegisterCta && (
            <Link
              href={registerHref}
              className="btn-glass btn-glass-on-dark hidden rounded-pill border border-white/35 bg-[rgb(76_104_212/0.76)] px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-white/55 md:inline-flex"
            >
              立即報名
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg text-ink lg:hidden"
            aria-label={open ? "關閉選單" : "開啟選單"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* 手機選單
          展開高度用 grid-template-rows 0fr → 1fr，不用 max-h 的魔術數字：
          原本寫死 max-h-[420px]，字級一調大（六個連結 + 報名鈕約 467px）就把最後的
          「立即報名」裁掉。0fr/1fr 由內容自己撐開，往後改字級或加選單項都不會再爆。
          子層必須有 min-h-0 + overflow-hidden，收合時才塌得回 0。
          padding 一定要放在 overflow-hidden 那層的「內側」：overflow-hidden + min-h-0 只壓得掉
          內容，壓不掉元素自己的 padding（border-box 高度不會低於 padding-top + padding-bottom）。
          先前 py-4 與 overflow-hidden 同掛在 <ul> 上，收合時軌道仍被撐出 32px，父層的
          bg-bg/95 就在導覽列正下方畫出一條白霧橫條 —— 因為容器是 lg:hidden，只有手機／平板看得到。 */}
      <div
        className={cn(
          "grid border-t border-black/8 bg-bg/95 backdrop-blur-md transition-[grid-template-rows] duration-500 lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-transparent"
        )}
      >
        {/* 這層只負責被 grid 軌道壓扁：不帶 padding／border，自動最小尺寸才真的是 0 */}
        <div className="min-h-0 overflow-hidden">
          {/* 捲動要開在 <ul> 上，不能開在上面那層：那層的 overflow-hidden + min-h-0 是收合
              能塌回 0 的關鍵，換成 overflow-y-auto 會在收合時留下一條捲軸殘影。
              為什麼需要捲動：展開時 body 被鎖 overflow-hidden，選單本身又是 overflow-hidden，
              六個連結加報名鈕約 467px —— 在橫向手機（視窗高 360–400px）會有項目既點不到也捲不到。
              72px = 手機版導覽列高度（md 以上是 88px，但這塊本來就只在 lg 以下出現）。 */}
          <ul className="shell flex max-h-[calc(100svh-72px)] flex-col overflow-y-auto overscroll-contain py-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block border-b border-black/5 py-4 text-[18px] text-ink-2 transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {showRegisterCta && (
              <li className="pt-5">
                <Link
                  href={registerHref}
                  className="btn-glass btn-glass-on-dark block rounded-pill border border-white/35 bg-[rgb(76_104_212/0.76)] py-3.5 text-center text-[18px] font-semibold"
                >
                  立即報名
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
