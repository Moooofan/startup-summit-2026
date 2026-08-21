"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { event } from "@/data/event";

/** 手機版底部固定報名列 —— 滑過 Hero 後才出現。 */
export function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-bg/95 backdrop-blur-md transition-transform duration-400 md:hidden",
        show ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold text-ink">{event.dateLabel}</p>
          <p className="text-[11px] text-ink-3">早鳥 {event.tickets.currency}{event.tickets.earlyBird.toLocaleString()}</p>
        </div>
        <Link
          href="/tickets"
          className="rounded-pill bg-brand-lift px-6 py-3 text-sm font-medium text-white"
        >
          立即報名
        </Link>
      </div>
    </div>
  );
}
