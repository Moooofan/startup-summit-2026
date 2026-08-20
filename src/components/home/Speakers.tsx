import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { speakers, speakerCount, type Speaker } from "@/data/speakers";
import { photoFocus } from "@/data/speakerPhotoFocus";
import { forums } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

function SpeakerCard({ s, index }: { s: Speaker; index: number }) {
  return (
    <li>
      <Link
        href={`/speakers/${s.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-glow"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-white/8 bg-surface">
          <Image
            src={s.photo}
            alt={`${s.name}｜${s.org} ${s.title}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            style={{ objectPosition: photoFocus(s.slug) }}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            loading={index < 8 ? "eager" : "lazy"}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-bg/85 via-transparent to-transparent"
          />
          {s.status === "pending" && (
            <span className="absolute right-3 top-3 rounded-pill bg-bg/80 px-2.5 py-1 text-[10px] text-ink-3 backdrop-blur">
              確認中
            </span>
          )}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orbit-sky/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
          <p className="mt-1 text-[12.5px] leading-snug text-orbit-sky">{s.org}</p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">{s.title}</p>
        </div>
      </Link>
    </li>
  );
}

export function Speakers() {
  return (
    <section
      id="speakers"
      className="grain relative scroll-mt-24 overflow-hidden bg-bg-soft py-24 md:py-32"
    >
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[14%] top-[8%] h-[44vw] max-h-[600px] w-[44vw] max-w-[600px] rounded-full bg-[radial-gradient(circle,rgb(76_104_212/0.16)_0%,transparent_66%)]"
      />
      <div className="shell relative">
        <Reveal>
          <SectionHead
            eyebrow="SPEAKERS"
            ghost="LINE-UP"
            title={`${speakerCount} 位講者，兩天分場登台`}
            lead="從剛掛牌的創業家、Edge AI 與半導體團隊，到管理國際基金的機構投資人。點開任何一位，看他們正在解的題目。"
          />
        </Reveal>

        {forums.map((f, fi) => {
          const list = speakers.filter((s) => s.day === f.key);
          return (
            <div key={f.key} className={fi === 0 ? "mt-16" : "mt-20"}>
              <Reveal>
                <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-white/8 pb-5">
                  <span className="font-display text-xs tracking-[0.2em] text-ink-4">
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
                    <SpeakerCard key={s.slug} s={s} index={fi === 0 ? i : i + 100} />
                  ))}
                </ul>
              </Reveal>
            </div>
          );
        })}

        <Reveal delay={0.1}>
          <p className="mt-14 text-[13px] leading-relaxed text-ink-4">
            ※ 標示「確認中」者為邀請中或行程確認中的講者，最終陣容以官方公告為準。
          </p>
        </Reveal>
      </div>
    </section>
  );
}
