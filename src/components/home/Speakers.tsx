import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { speakers, speakerCount, type Speaker } from "@/data/speakers";
import { photoFocus } from "@/data/speakerPhotoFocus";
import { forums } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Forum = (typeof forums)[number];

const accent: Record<Forum["accent"], { text: string; glow: string; line: string }> = {
  sky: {
    text: "text-orbit-sky",
    glow: "rgb(94 174 220 / 0.10)",
    line: "via-orbit-sky/70",
  },
  violet: {
    text: "text-[#6d47c4]",
    glow: "rgb(182 185 220 / 0.10)",
    line: "via-[#6d47c4]/60",
  },
};

function SpeakerCard({
  s,
  index,
  tone,
}: {
  s: Speaker;
  index: number;
  tone: { text: string; line: string };
}) {
  return (
    <li>
      <Link
        href={`/speakers/${s.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-glow"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-black/8 bg-surface">
          <Image
            src={s.photo}
            alt={`${s.name}｜${s.org} ${s.title}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            style={{ objectPosition: photoFocus(s.slug) }}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            loading={index < 8 ? "eager" : "lazy"}
          />
          {s.status === "pending" && (
            <span className="absolute right-3 top-3 rounded-pill bg-bg/80 px-2.5 py-1 text-[10px] text-ink-3 backdrop-blur">
              確認中
            </span>
          )}
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
              tone.line
            )}
          />
        </div>
        <div className="mt-3.5">
          <p className="flex items-center gap-1.5 text-[15px] font-bold text-ink">
            {s.name}
            <ArrowUpRight
              size={14}
              aria-hidden
              className="shrink-0 text-ink-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </p>
          <p className={cn("mt-1 text-[12.5px] font-medium leading-snug", tone.text)}>{s.org}</p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">{s.title}</p>
        </div>
      </Link>
    </li>
  );
}

/** 只顯示文字的節點 — 滾動時吸附成一整頁，向下滑才進到當日陣容 */
function ForumNode({ f, order, count }: { f: Forum; order: number; count: number }) {
  const a = accent[f.accent];
  return (
    <div className="snap-panel relative flex items-center justify-center overflow-hidden md:min-h-[100svh]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] max-h-[720px] w-[70vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${a.glow} 0%, transparent 66%)` }}
      />
      <Reveal>
        <div className="relative px-6 text-center">
          <span
            aria-hidden
            className="ghost-head pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-[58%] text-[clamp(9rem,30vw,24rem)] leading-none opacity-[0.38]"
          >
            {String(order).padStart(2, "0")}
          </span>
          <p className={cn("font-display text-[13px] tracking-[0.32em]", a.text)}>
            {f.label} · {f.nameEn}
          </p>
          <h3 className="mt-5 text-[clamp(2.25rem,8vw,5rem)] font-bold leading-[1.05] text-ink">
            {f.name}
          </h3>
          <p className="mt-6 font-display text-lg text-ink-2 md:text-xl">
            {f.dateLabel}（{f.weekday}）· {f.time}
          </p>
          <p className="mt-2 text-[13px] tracking-wide text-ink-4">對象 · {f.audience}</p>
          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-[1.9] text-ink-2">
            {f.description}
          </p>
          <span
            className={cn(
              "mt-14 inline-flex flex-col items-center gap-2 text-[12px] tracking-[0.24em]",
              a.text
            )}
          >
            向下滑看 {count} 位講者
            <ChevronDown
              size={20}
              aria-hidden
              className="animate-bounce motion-reduce:animate-none"
            />
          </span>
        </div>
      </Reveal>
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto h-px w-2/3 max-w-4xl bg-gradient-to-r from-transparent to-transparent",
          a.line
        )}
      />
    </div>
  );
}

export function Speakers() {
  return (
    <section
      id="speakers"
      className="grain relative scroll-mt-24 bg-bg-soft"
    >
      <div aria-hidden className="hairline absolute inset-x-0 top-0 z-10 h-px" />

      {/* 第一頁：開場標題 */}
      <div className="snap-panel relative flex items-center overflow-hidden pt-24 md:min-h-[100svh] md:pt-0">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[10%] top-[12%] h-[34vw] max-h-[440px] w-[34vw] max-w-[440px] rounded-full bg-[radial-gradient(circle,rgb(76_104_212/0.08)_0%,transparent_66%)]"
        />
        <div className="shell relative w-full">
          <Reveal>
            <SectionHead
              className="md:mt-16"
              eyebrow="SPEAKERS"
              ghost="LINE-UP"
              title={`${speakerCount} 位講者，兩天分場登台`}
              lead="從剛掛牌的創業家、Edge AI 與半導體團隊，到管理國際基金的機構投資人。點開任何一位，看他們正在解的題目。"
            />
          </Reveal>
        </div>

        {/* 向下滑提示：頁面中間下方（常駐，不用 whileInView 門檻，否則初次落在視窗邊界不顯示） */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center md:flex">
          <span className="inline-flex flex-col items-center gap-2 text-[12px] tracking-[0.24em] text-orbit-sky">
            向下滑看兩天陣容
            <ChevronDown size={20} aria-hidden className="animate-bounce motion-reduce:animate-none" />
          </span>
        </div>
      </div>

      {forums.map((f, fi) => {
        const list = speakers.filter((s) => s.day === f.key);
        const a = accent[f.accent];
        const isLast = fi === forums.length - 1;
        return (
          <Fragment key={f.key}>
            {/* 節點頁：只有文字 */}
            <ForumNode f={f} order={fi + 1} count={list.length} />

            {/* 講者網格頁：標題吸到最上方（靠 html scroll-padding-top 避開導覽列），內容比一頁高時自由捲動 */}
            <div className="snap-panel pb-16 pt-6 md:min-h-[100svh]">
              <div className="shell">
                <Reveal>
                  <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-black/8 pb-5">
                    <span className={cn("font-display text-xs font-semibold tracking-[0.2em]", a.text)}>
                      {f.label}
                    </span>
                    <h3 className="text-xl font-bold text-ink md:text-2xl">{f.name}</h3>
                    <span className="font-display text-sm text-ink-3">
                      {f.dateLabel}（{f.weekday}）
                    </span>
                    <span className="ml-auto text-[13px] text-ink-4">{list.length} 位</span>
                  </header>
                </Reveal>

                <Reveal delay={0.08}>
                  <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
                    {list.map((s, i) => (
                      <SpeakerCard key={s.slug} s={s} index={fi === 0 ? i : i + 100} tone={a} />
                    ))}
                  </ul>
                </Reveal>

                {isLast && (
                  <p className="mt-14 text-[13px] leading-relaxed text-ink-4">
                    ※ 標示「確認中」者為邀請中或行程確認中的講者，最終陣容以官方公告為準。
                  </p>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}
