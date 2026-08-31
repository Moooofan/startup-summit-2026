"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { forums } from "@/data/event";
import { tracksByDay } from "@/data/tracks";
import { Reveal } from "@/components/ui/Reveal";
import { SwipeDeck } from "@/components/ui/SwipeDeck";
import { isPublicRoute } from "@/lib/config";

type Forum = (typeof forums)[number];

// 首頁論壇卡的主題軌 chips 上限（避免創辦人日 9 條全塞爆版面）。
const MAX_CHIPS = 4;

/**
 * 首頁兩天論壇卡。桌機維持 lg 兩張並排 grid；手機（< lg）改成 /tickets 式
 * 「重疊卡片＋滑動切換」牌堆（原本是上下堆疊，業主要求比照 /tickets）。
 * 兩種版型共用同一個 ForumCard。
 */
export function ForumCards() {
  return (
    <div className="mt-14 md:mt-16">
      {/* 桌機：兩張並排 */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-2">
        {forums.map((f, i) => (
          <Reveal key={f.key} delay={0.12 + i * 0.08}>
            <ForumCard f={f} />
          </Reveal>
        ))}
      </div>

      {/* 手機：重疊牌堆，滑動或點側卡、或點下方頁籤切換 */}
      <SwipeDeck
        className="lg:hidden"
        items={forums}
        getKey={(f) => f.key}
        labels={forums.map((f) => f.name)}
        renderItem={(f) => <ForumCard f={f} />}
      />
    </div>
  );
}

function ForumCard({ f }: { f: Forum }) {
  const dayTracks = tracksByDay(f.key);
  const shownTracks = dayTracks.slice(0, MAX_CHIPS);
  const moreCount = dayTracks.length - shownTracks.length;
  return (
    <article className="glass group relative h-full overflow-hidden rounded-card p-8 transition-colors duration-500 hover:border-black/20 md:p-10">
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-80 ${
          f.accent === "sky"
            ? "bg-orbit-sky/20 opacity-50"
            : "bg-[rgb(150_115_225)]/40 opacity-90"
        }`}
      />
      <div className="relative">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-display text-xs tracking-[0.22em] text-ink-4">{f.label}</span>
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

        <ul className="mt-7 flex flex-wrap gap-2">
          {shownTracks.map((t) => (
            <li
              key={t.key}
              className="rounded-pill border border-black/10 bg-black/[0.04] px-3 py-1.5 text-xs text-ink-2"
            >
              {t.title}
            </li>
          ))}
          {moreCount > 0 && (
            <li className="rounded-pill border border-black/8 px-3 py-1.5 text-xs text-ink-4">
              ＋{moreCount} 條主題
            </li>
          )}
        </ul>

        {/* /agenda 隱藏期間不顯示這顆連結（見 lib/config 的 PUBLIC_ROUTES）；
            上方的主題軌 chips 已把該日主題列出來，拿掉不影響資訊完整度。 */}
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
