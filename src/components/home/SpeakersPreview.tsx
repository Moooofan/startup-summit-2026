import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { forums } from "@/data/event";
import { speakers, speakerCount, speakersByDay } from "@/data/speakers";
import { photoFocus } from "@/data/speakerPhotoFocus";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * 首頁用的講者陣容「預覽」 —— 刻意不是 /speakers 那一套。
 *
 * /speakers 的 <Speakers /> 是五個滿版 snap-panel（開場 + 兩個日別節點 + 兩頁網格），
 * 整段搬進首頁會吃掉五個螢幕高度，把後面的售票與 FAQ 推到很下面 ——
 * 首頁要的是「看得到陣容 + 想看更多就點進去」，不是把整個講者頁重播一次。
 *
 * 因此這裡壓成一段：每個論壇各取前 N 位，其餘導去 /speakers。
 */

const PER_FORUM = 5;

const accent = {
  sky: { text: "text-orbit-sky", line: "via-orbit-sky/70" },
  violet: { text: "text-[#6d47c4]", line: "via-[#6d47c4]/60" },
} as const;

function MiniCard({
  slug,
  photo,
  name,
  org,
  title,
  status,
  tone,
  eager,
}: {
  slug: string;
  photo: string;
  name: string;
  org: string;
  title: string;
  status?: string;
  tone: (typeof accent)[keyof typeof accent];
  eager: boolean;
}) {
  return (
    <li>
      <Link
        href={`/speakers/${slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-glow"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-black/8 bg-surface">
          <Image
            src={photo}
            alt={`${name}｜${org} ${title}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
            style={{ objectPosition: photoFocus(slug) }}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            loading={eager ? "eager" : "lazy"}
          />
          {status === "pending" && (
            <span className="absolute right-3 top-3 rounded-pill bg-bg/80 px-2.5 py-1 text-[16px] text-ink-3 backdrop-blur">
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
          <p className="flex items-center gap-1.5 text-[18px] font-bold text-ink">
            {name}
            <ArrowUpRight
              size={14}
              aria-hidden
              className="shrink-0 text-ink-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </p>
          <p className={cn("mt-1 text-[17px] font-medium leading-snug", tone.text)}>{org}</p>
          <p className="mt-0.5 text-[17px] leading-snug text-ink-3">{title}</p>
        </div>
      </Link>
    </li>
  );
}

export function SpeakersPreview() {
  return (
    <section id="speakers" className="grain relative scroll-mt-24 bg-bg-soft py-20 md:py-28">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 z-10 h-px" />
      <div className="shell relative">
        <Reveal>
          <SectionHead
            eyebrow="SPEAKERS"
            ghost="LINE-UP"
            title={`${speakerCount} 位講者，兩天分場登台`}
            lead="從剛掛牌的創業家、Edge AI 與半導體團隊，到管理國際基金的機構投資人。"
          />
        </Reveal>

        {forums.map((f, fi) => {
          const list = speakersByDay(f.key);
          const shown = list.slice(0, PER_FORUM);
          const tone = accent[f.accent];
          return (
            <div key={f.key} className={fi === 0 ? "mt-12" : "mt-16"}>
              <Reveal>
                <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-black/8 pb-5">
                  <span
                    className={cn("font-display text-sm font-semibold tracking-[0.2em]", tone.text)}
                  >
                    {f.label}
                  </span>
                  <h3 className="text-xl font-bold text-ink md:text-2xl">{f.name}</h3>
                  <span className="font-display text-[17px] text-ink-3">
                    {f.dateLabel}（{f.weekday}）
                  </span>
                  <span className="ml-auto text-[17px] text-ink-4">{list.length} 位</span>
                </header>
              </Reveal>

              <Reveal delay={0.08}>
                <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
                  {shown.map((s, i) => (
                    <MiniCard
                      key={s.slug}
                      slug={s.slug}
                      photo={s.photo}
                      name={s.name}
                      org={s.org}
                      title={s.title}
                      status={s.status}
                      tone={tone}
                      eager={fi === 0 && i < 5}
                    />
                  ))}
                </ul>
              </Reveal>
            </div>
          );
        })}

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/speakers"
              className="inline-flex items-center gap-1.5 rounded-pill border border-black/12 bg-white/55 px-6 py-3 text-[17px] font-medium text-ink-2 transition-colors hover:border-black/25 hover:text-ink"
            >
              看完整 {speakers.length} 位講者陣容
              <ArrowUpRight size={16} aria-hidden />
            </Link>
            <p className="text-[17px] text-ink-4">
              ※ 標示「確認中」者為邀請中，最終陣容以官方公告為準。
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
