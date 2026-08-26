"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { event } from "@/data/event";
import { useCountdown } from "@/lib/useCountdown";

const links = [
  { href: "/about", label: "關於年會" },
  { href: "/speakers", label: "講者陣容" },
  { href: "/agenda", label: "論壇主題" },
  { href: "/tickets", label: "報名資訊" },
  { href: "/sponsor", label: "贊助方案" },
  { href: "/review", label: "歷屆回顧" },
];

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
            <span className="font-display block text-[16px] tracking-[0.18em] text-ink-3">
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
          <Link
            href="/tickets"
            className="btn-glass btn-glass-on-dark hidden rounded-pill border border-white/35 bg-[rgb(76_104_212/0.76)] px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-white/55 md:inline-flex"
          >
            立即報名
          </Link>
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

      {/* 手機選單 */}
      <div
        className={cn(
          "overflow-hidden border-t border-black/8 bg-bg/95 backdrop-blur-md transition-[max-height] duration-500 lg:hidden",
          open ? "max-h-[420px]" : "max-h-0 border-t-transparent"
        )}
      >
        <ul className="shell flex flex-col py-4">
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
          <li className="pt-5">
            <Link
              href="/tickets"
              className="btn-glass btn-glass-on-dark block rounded-pill border border-white/35 bg-[rgb(76_104_212/0.76)] py-3.5 text-center text-[18px] font-semibold"
            >
              立即報名
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
