import { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { forums } from "@/data/event";
import { agendaByDay, talkCount } from "@/data/agenda";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { AgendaTable, dayTone } from "@/components/home/AgendaTable";
import { cn } from "@/lib/utils";

/** 日別文字節點（同講者陣容 ForumNode 的設計） */
function DayNode({
  f,
  order,
  id,
}: {
  f: (typeof forums)[number];
  order: number;
  id?: string;
}) {
  const t = dayTone[f.accent];
  return (
    <div
      id={id}
      className="snap-panel relative flex items-center justify-center overflow-hidden md:min-h-[100svh]"
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
          <span
            className={cn(
              "mt-12 inline-flex flex-col items-center gap-2 text-[17px] tracking-[0.24em]",
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
  const totalTalks = forums.reduce((n, f) => n + talkCount(agendaByDay(f.key)), 0);

  return (
    <section id="agenda" className="relative">
      {/* 開場大字報頁（同講者陣容） */}
      <div className="snap-panel relative flex items-center overflow-hidden pt-24 md:min-h-[100svh] md:pt-0">
        <div className="shell relative w-full">
          <Reveal>
            <SectionHead
              className="md:mt-14"
              eyebrow="PROGRAM"
              ghost="AGENDA"
              title={`兩天，${totalTalks} 場議程`}
              lead="10/14 從創業實戰、新 IPO 對談走到 Edge AI 與 AI 軟體，10/15 從焦點創投與 CVC 談到生醫與半導體的投資判準。"
            />
          </Reveal>
        </div>

        {/* 向下滑提示 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center md:flex">
          <span className="inline-flex flex-col items-center gap-2 text-[17px] tracking-[0.24em] text-orbit-sky">
            向下滑看兩天議程
            <ChevronDown size={20} aria-hidden className="animate-bounce motion-reduce:animate-none" />
          </span>
        </div>
      </div>

      {forums.map((f, fi) => {
        const items = agendaByDay(f.key);
        const tone = dayTone[f.accent];
        return (
          <Fragment key={f.key}>
            {/* 日別節點 */}
            <DayNode f={f} order={fi + 1} id={f.key} />

            {/* 課程格 */}
            <div className="snap-panel pb-16 pt-6 md:min-h-[100svh]">
              <div className="shell">
                <Reveal>
                  <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-black/8 pb-5">
                    <span className={cn("font-display text-sm font-semibold tracking-[0.2em]", tone.text)}>
                      {f.label}
                    </span>
                    <h3 className="text-2xl font-bold text-ink md:text-3xl">{f.name}</h3>
                    {/* 手機強制折行，同 Speakers.tsx 的標題列（那邊有完整說明）。
                        這一列更長：Day 1(60) + 論壇名(130) + 日期時間(252) + 條數(82) + gap ＝ 584px，
                        手機可用寬最多 350px → 放著自己 wrap 會斷成三四行且折點不固定。
                        指定折點後：第一行 Day 1＋論壇名(190px)、第二行 日期＋時間(252px)，
                        條數再落第三行靠右 —— 行數沒少，但每次都一樣，不會隨文案跳動。 */}
                    <span aria-hidden className="basis-full sm:hidden" />
                    <span className="font-display text-base text-ink-3">
                      {f.dateLabel}（{f.weekday}）　{f.time}
                    </span>
                    <span className="ml-auto text-sm text-ink-4">{talkCount(items)} 場</span>
                  </header>
                </Reveal>

                <AgendaTable items={items} />
              </div>
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}
