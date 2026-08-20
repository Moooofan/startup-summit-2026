import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { event, forums, stats } from "@/data/event";
import { tracksByDay } from "@/data/tracks";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 md:py-32">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="ABOUT THE SUMMIT"
            ghost="SUMMIT"
            title={
              <>
                一年一度，
                <br className="sm:hidden" />
                台灣資本與創新的交會點
              </>
            }
            lead={
              <>
                {event.fullName}以「{event.subtitle}」形式舉行 —— 一天屬於創辦人，一天屬於投資人。
                由擁有 {event.organizer.members}的{event.organizer.name}主辦，
                自 2023 年起連續舉辦四屆，是台灣少數把投融資交易本身當作主題的年度論壇。
              </>
            }
          />
        </Reveal>

        {/* 數據 */}
        <Reveal delay={0.1}>
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line-soft bg-line-soft md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-bg-soft px-6 py-8 text-center md:py-10">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-display text-orbit block text-[clamp(1.9rem,4.5vw,2.75rem)] font-semibold">
                    {s.value}
                  </span>
                  <span className="mt-2 block text-[13px] text-ink-3">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 兩天論壇 */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {forums.map((f, i) => {
            const dayTracks = tracksByDay(f.key);
            return (
              <Reveal key={f.key} delay={0.12 + i * 0.08}>
                <article className="glass group relative h-full overflow-hidden rounded-card p-8 transition-colors duration-500 hover:border-white/20 md:p-10">
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-80 ${
                      f.accent === "sky"
                        ? "bg-orbit-sky/20 opacity-50"
                        : "bg-orbit-violet/20 opacity-50"
                    }`}
                  />
                  <div className="relative">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-xs tracking-[0.22em] text-ink-4">
                        {f.label}
                      </span>
                      <span className="font-display text-2xl font-semibold text-ink-2">
                        {f.dateLabel}
                        <span className="ml-2 text-sm text-ink-4">（{f.weekday}）</span>
                      </span>
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-ink md:text-[1.75rem]">{f.name}</h3>
                    <p className="font-display mt-1.5 text-xs tracking-[0.14em] text-ink-4">
                      {f.nameEn.toUpperCase()}
                    </p>

                    <p className="mt-5 text-[15px] leading-[1.9] text-ink-2">{f.description}</p>

                    <p className="mt-6 text-[13px] text-ink-3">
                      <span className="text-ink-4">主要聽眾｜</span>
                      {f.audience}
                    </p>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {dayTracks.map((t) => (
                        <li
                          key={t.key}
                          className="rounded-pill border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-ink-2"
                        >
                          {t.title}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="#agenda"
                      className="mt-8 inline-flex items-center gap-1.5 text-sm text-orbit-sky transition-colors hover:text-ink"
                    >
                      查看 {f.name}主題
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
