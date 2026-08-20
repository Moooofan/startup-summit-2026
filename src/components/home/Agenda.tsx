import Link from "next/link";
import { Info } from "lucide-react";
import { forums } from "@/data/event";
import { tracksByDay } from "@/data/tracks";
import { speakersByTrack } from "@/data/speakers";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

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

export function Agenda() {
  return (
    <section id="agenda" className="relative scroll-mt-24 py-24 md:py-32">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="PROGRAM"
            ghost="AGENDA"
            title="兩天，十二條主題軌"
            lead="10/14 從創業實戰走到技術分軌，10/15 從機構投資人的資本配置談到 AI 與生醫的投資判準。"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 inline-flex items-start gap-2.5 rounded-card border border-white/8 bg-white/[0.03] px-5 py-4 text-[13px] leading-relaxed text-ink-3">
            <Info size={15} className="mt-0.5 shrink-0 text-ink-4" aria-hidden />
            目前公布的是主題軌與講者歸屬，逐時段完整議程表將於活動前公布。議程時間將依現場流程與講者安排保留調整彈性。
          </p>
        </Reveal>

        <div className="mt-14 space-y-16">
          {forums.map((f) => {
            const dayTracks = tracksByDay(f.key);
            return (
              <div key={f.key}>
                <Reveal>
                  <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-white/8 pb-5">
                    <span className="font-display text-xs tracking-[0.2em] text-ink-4">
                      {f.label}
                    </span>
                    <h3 className="text-xl font-bold text-ink md:text-2xl">{f.name}</h3>
                    <span className="font-display text-sm text-ink-3">
                      {f.dateLabel}（{f.weekday}）　{f.time}
                    </span>
                  </header>
                </Reveal>

                <ul className="mt-8 grid gap-5 lg:grid-cols-2">
                  {dayTracks.map((t, i) => {
                    const list = speakersByTrack(t.key);
                    return (
                      <Reveal key={t.key} delay={0.04 * i}>
                        <li className="glass h-full rounded-card p-7 transition-colors duration-500 hover:border-white/20">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-3">
                                <span className="font-display grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-lift/20 text-[11px] font-semibold text-orbit-sky">
                                  {t.no}
                                </span>
                                <span className="text-[11px] tracking-[0.14em] text-ink-4">
                                  {slotLabel[t.slot]}・{formatLabel[t.format]}
                                </span>
                              </div>
                              <h4 className="mt-4 text-lg font-bold text-ink">{t.title}</h4>
                              <p className="font-display mt-1 text-[11px] tracking-[0.12em] text-ink-4">
                                {t.titleEn.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <p className="mt-4 text-[14px] leading-[1.9] text-ink-2">{t.summary}</p>

                          {list.length > 0 ? (
                            <ul className="mt-5 flex flex-wrap gap-2">
                              {list.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    href={`/speakers/${s.slug}`}
                                    className="inline-flex items-center gap-1.5 rounded-pill border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-ink-2 transition-colors hover:border-white/25 hover:text-ink"
                                  >
                                    {s.name}
                                    {s.role === "moderator" && (
                                      <span className="text-[10px] text-ink-4">主持</span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-5 text-[13px] text-ink-4">講者陣容確認中</p>
                          )}
                        </li>
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
