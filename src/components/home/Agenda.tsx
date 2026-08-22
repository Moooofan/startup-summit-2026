import { Fragment } from "react";
import Link from "next/link";
import { Info, ChevronDown } from "lucide-react";
import { forums } from "@/data/event";
import { tracksByDay } from "@/data/tracks";
import { speakersByTrack } from "@/data/speakers";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const slotLabel: Record<string, string> = {
  morning: "上午",
  afternoon: "下午",
  evening: "會後",
};

const formatLabel: Record<string, string> = {
  keynote: "Keynote",
  panel: "Panel",
  session: "Session",
  social: "Networking",
};

// 日別色調：Day 1 藍 / Day 2 紫
const dayTone = {
  sky: {
    text: "text-orbit-sky",
    badge: "bg-orbit-sky/15 text-orbit-sky",
    glow: "rgb(47 127 176 / 0.12)",
    line: "via-orbit-sky/60",
    corner:
      "radial-gradient(circle, rgb(47 127 176 / 0.4) 0%, rgb(47 127 176 / 0.1) 45%, transparent 70%)",
  },
  violet: {
    text: "text-[#6d47c4]",
    badge: "bg-[#6d47c4]/15 text-[#6d47c4]",
    glow: "rgb(109 71 196 / 0.12)",
    line: "via-[#6d47c4]/60",
    corner:
      "radial-gradient(circle, rgb(109 71 196 / 0.42) 0%, rgb(109 71 196 / 0.12) 45%, transparent 70%)",
  },
} as const;

/** 日別文字節點（同講者陣容 ForumNode 的設計） */
function DayNode({
  f,
  order,
  tracks,
  id,
}: {
  f: (typeof forums)[number];
  order: number;
  tracks: ReturnType<typeof tracksByDay>;
  id?: string;
}) {
  const t = dayTone[f.accent];
  return (
    <div
      id={id}
      className="snap-panel relative flex min-h-[100svh] items-center justify-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] max-h-[720px] w-[70vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${t.glow} 0%, transparent 66%)` }}
      />
      <Reveal>
        <div className="relative px-6 text-center">
          <span
            aria-hidden
            className="ghost-head pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-[58%] text-[clamp(9rem,30vw,24rem)] leading-none opacity-[0.38]"
          >
            {String(order).padStart(2, "0")}
          </span>
          <p className={cn("font-display text-sm font-semibold tracking-[0.32em]", t.text)}>
            {f.label} · {f.nameEn}
          </p>
          <h3 className="mt-5 text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[1.05] text-ink">
            {f.name}
          </h3>
          <p className="mt-6 font-display text-xl text-ink-2 md:text-2xl">
            {f.dateLabel}（{f.weekday}）· {f.time}
          </p>
          {/* 議程專屬：主題軌預覽 chips（和講者陣容節點做出區隔） */}
          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2.5">
            {tracks.map((tk) => (
              <li
                key={tk.key}
                className="rounded-pill border border-black/10 bg-white/50 px-3.5 py-1.5 text-[13px] text-ink-2"
              >
                {tk.title}
              </li>
            ))}
          </ul>
          <span
            className={cn(
              "mt-12 inline-flex flex-col items-center gap-2 text-[13px] tracking-[0.24em]",
              t.text
            )}
          >
            向下滑看完整議程
            <ChevronDown size={20} aria-hidden className="animate-bounce motion-reduce:animate-none" />
          </span>
        </div>
      </Reveal>
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto h-px w-2/3 max-w-4xl bg-gradient-to-r from-transparent to-transparent",
          t.line
        )}
      />
    </div>
  );
}

export function Agenda() {
  return (
    <section id="agenda" className="relative">
      {/* 開場大字報頁（同講者陣容） */}
      <div className="snap-panel relative flex min-h-[100svh] items-center overflow-hidden">
        <div className="shell relative w-full">
          <Reveal>
            <SectionHead
              className="mt-14"
              eyebrow="PROGRAM"
              ghost="AGENDA"
              title="兩天，十二條主題軌"
              lead="10/14 從創業實戰走到技術分軌，10/15 從機構投資人的資本配置談到 AI 與生醫的投資判準。"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 inline-flex max-w-2xl items-start gap-2.5 rounded-card border border-black/8 bg-black/[0.03] px-5 py-4 text-sm leading-relaxed text-ink-3">
              <Info size={16} className="mt-0.5 shrink-0 text-ink-4" aria-hidden />
              目前公布的是主題軌與講者歸屬，逐時段完整議程表將於活動前公布。議程時間將依現場流程與講者安排保留調整彈性。
            </p>
          </Reveal>
        </div>

        {/* 向下滑提示 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <span className="inline-flex flex-col items-center gap-2 text-[12px] tracking-[0.24em] text-orbit-sky">
            向下滑看兩天議程
            <ChevronDown size={20} aria-hidden className="animate-bounce motion-reduce:animate-none" />
          </span>
        </div>
      </div>

      {forums.map((f, fi) => {
        const dayTracks = tracksByDay(f.key);
        const tone = dayTone[f.accent];
        return (
          <Fragment key={f.key}>
            {/* 日別節點 */}
            <DayNode f={f} order={fi + 1} tracks={dayTracks} id={f.key} />

            {/* 課程格 */}
            <div className="snap-panel min-h-[100svh] pb-16 pt-6">
              <div className="shell">
                <Reveal>
                  <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-black/8 pb-5">
                    <span className={cn("font-display text-sm font-semibold tracking-[0.2em]", tone.text)}>
                      {f.label}
                    </span>
                    <h3 className="text-2xl font-bold text-ink md:text-3xl">{f.name}</h3>
                    <span className="font-display text-base text-ink-3">
                      {f.dateLabel}（{f.weekday}）　{f.time}
                    </span>
                    <span className="ml-auto text-sm text-ink-4">{dayTracks.length} 條主題軌</span>
                  </header>
                </Reveal>

                <ul className="mt-10 grid gap-6 lg:grid-cols-2">
                  {dayTracks.map((t, i) => {
                    const list = speakersByTrack(t.key);
                    return (
                      <Reveal key={t.key} delay={0.04 * i}>
                        {/* 雙層白框 + 角落漸層（同聯絡資訊卡） */}
                        <li className="group relative h-full overflow-hidden rounded-[18px] border border-line bg-white/50 p-2.5 shadow-[0_18px_50px_-24px_rgba(24,34,66,0.35)] transition-colors duration-300 hover:border-brand-lift/40">
                          <span
                            aria-hidden
                            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-xl"
                            style={{ background: tone.corner }}
                          />
                          <div className="relative h-full rounded-[13px] border border-line-soft bg-white/35 p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "font-display grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-semibold",
                                  tone.badge
                                )}
                              >
                                {t.no}
                              </span>
                              <span className="text-xs tracking-[0.14em] text-ink-4">
                                {slotLabel[t.slot]}・{formatLabel[t.format]}
                              </span>
                            </div>

                            <h4 className="mt-5 text-xl font-bold text-ink">{t.title}</h4>
                            <p className="font-display mt-1.5 text-xs font-semibold tracking-[0.12em] text-gold">
                              {t.titleEn.toUpperCase()}
                            </p>

                            <p className="mt-4 text-[15px] leading-[1.9] text-ink-2">{t.summary}</p>

                            {list.length > 0 ? (
                              <ul className="mt-6 flex flex-wrap gap-2">
                                {list.map((s) => (
                                  <li key={s.slug}>
                                    <Link
                                      href={`/speakers/${s.slug}`}
                                      className="inline-flex items-center gap-1.5 rounded-pill border border-black/10 bg-white/60 px-3.5 py-2 text-[13px] text-ink-2 transition-colors hover:border-black/25 hover:text-ink"
                                    >
                                      {s.name}
                                      {s.role === "moderator" && (
                                        <span className="text-[11px] text-ink-4">主持</span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-6 text-sm text-ink-4">講者陣容確認中</p>
                            )}
                          </div>
                        </li>
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}
