import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { editions } from "@/data/review";
import { event } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Timeline } from "@/components/review/Timeline";
import { ExpandableList } from "@/components/review/ExpandableList";
import { Cta } from "@/components/ui/Cta";

export const metadata: Metadata = {
  title: "歷屆回顧",
  description:
    "台灣新創投資年會歷屆回顧：第三屆「贏在不確定的年代」完整議程、35 場演講與對談、64 則媒體露出，以及歷屆合作夥伴。",
  alternates: { canonical: "/review" },
};

export default function ReviewPage() {
  const [latest, ...earlier] = editions;

  return (
    <>
      {/* 頁首 */}
      <section className="grain relative overflow-hidden pb-16 pt-[132px] md:pb-24 md:pt-[176px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[12%] -top-[20%] h-[52vw] max-h-[680px] w-[52vw] max-w-[680px] rounded-full bg-[radial-gradient(circle,rgb(76_104_212/0.24)_0%,transparent_64%)]"
        />
        <div className="shell relative">
          <Reveal>
            <SectionHead
              as="h1"
              eyebrow="PAST EDITIONS"
              ghost="ARCHIVE"
              title={
                <>
                  三屆走下來，
                  <br className="sm:hidden" />
                  留下的不只是一場活動
                </>
              }
              lead="自 2023 年起，台灣新創投資年會每年集結創業家、創投與機構投資人。以下是歷屆的主題、議程與紀錄。"
            />
          </Reveal>

          <Reveal delay={0.12}>
            <nav aria-label="屆數導覽" className="mt-12 flex flex-wrap gap-3">
              {editions.map((e) => (
                <a
                  key={e.no}
                  href={`#edition-${e.no}`}
                  className="glass rounded-pill px-5 py-2.5 text-sm text-ink-2 transition-colors hover:border-white/25 hover:text-ink"
                >
                  第{["一", "二", "三", "四"][e.no - 1]}屆
                  <span className="font-display ml-2 text-ink-4">{e.year}</span>
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {/* 最新一屆：完整呈現 */}
      <section id={`edition-${latest.no}`} className="relative scroll-mt-24 py-20 md:py-28">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell">
          <Reveal>
            <header className="flex flex-col gap-6 border-b border-line-soft pb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-display text-sm tracking-[0.2em] text-orbit-sky">
                  {latest.year} · 第三屆
                </p>
                <h2 className="mt-4 text-[clamp(1.9rem,4.6vw,3rem)] font-bold leading-tight text-ink">
                  {latest.theme}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-3">
                  {latest.dateLabel}
                  <br />
                  {latest.venue}
                  {latest.venueAddress && `（${latest.venueAddress}）`}
                </p>
              </div>
            </header>
          </Reveal>

          {/* 數據 */}
          <Reveal delay={0.08}>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line-soft bg-line-soft sm:grid-cols-4">
              {latest.stats.map((s) => (
                <div key={s.label} className="bg-bg-soft px-4 py-7 text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="font-display text-orbit block text-[clamp(1.4rem,3.4vw,2rem)] font-semibold">
                      {s.value}
                    </span>
                    <span className="mt-1.5 block text-[12px] text-ink-3">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* 重點 */}
          <Reveal delay={0.12}>
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {latest.highlights.map((h) => (
                <li key={h} className="glass rounded-card p-6 text-[15px] leading-[1.9] text-ink-2">
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 照片 */}
          {latest.photos && latest.photos.length > 0 && (
            <Reveal delay={0.16}>
              <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {latest.photos.map((src, i) => (
                  <figure
                    key={src}
                    className={`group relative overflow-hidden rounded-card border border-white/8 ${
                      i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${latest.year} 年第${latest.no}屆台灣新創投資年會現場`}
                      width={1200}
                      height={800}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </figure>
                ))}
              </div>
            </Reveal>
          )}

          {/* 議程 */}
          {latest.forums && (
            <div className="mt-20">
              <Reveal>
                <h3 className="text-xl font-bold text-ink md:text-2xl">完整議程</h3>
                <p className="mt-3 text-sm text-ink-3">
                  {latest.forums.reduce((n, f) => n + f.sessions.length, 0)} 個場次，逐字保留當年議程安排。
                </p>
              </Reveal>
              <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-10">
                {latest.forums.map((f, i) => (
                  <Reveal key={f.day} delay={0.08 + i * 0.06}>
                    <div className="glass rounded-card p-6 md:p-8">
                      <header className="mb-6 border-b border-white/8 pb-5">
                        <p className="font-display text-xs tracking-[0.2em] text-ink-4">
                          DAY {f.day}
                        </p>
                        <h4 className="mt-2 text-lg font-bold text-ink">{f.name}</h4>
                        <p className="font-display mt-1 text-[13px] text-ink-3">{f.date}</p>
                      </header>
                      <Timeline forum={f} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* 合作夥伴 */}
          {latest.sponsors && latest.sponsors.length > 0 && (
            <div className="mt-20">
              <Reveal>
                <h3 className="text-xl font-bold text-ink md:text-2xl">當屆贊助與合作夥伴</h3>
              </Reveal>
              <Reveal delay={0.08}>
                <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line-soft bg-line-soft sm:grid-cols-3 lg:grid-cols-4">
                  {latest.sponsors.map((s) => (
                    <li
                      key={s.logo}
                      className="group grid aspect-[5/3] place-items-center bg-bg-soft p-7"
                      title={`${s.name}（${s.tier}）`}
                    >
                      <span className="grid h-full w-full place-items-center rounded-lg bg-white px-5 py-4 transition-transform duration-300 group-hover:scale-[1.03]">
                        <Image
                          src={s.logo}
                          alt={s.name}
                          width={220}
                          height={110}
                          sizes="200px"
                          className="max-h-[38px] w-auto max-w-full object-contain"
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          )}

          {/* 媒體露出 */}
          {latest.media && latest.media.length > 0 && (
            <div className="mt-20">
              <Reveal>
                <h3 className="text-xl font-bold text-ink md:text-2xl">媒體報導</h3>
                <p className="mt-3 text-sm text-ink-3">共 {latest.media.length} 則露出</p>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <ExpandableList
                    total={latest.media.length}
                    initial={10}
                    labelMore={`展開全部 ${latest.media.length} 則報導`}
                  >
                    {latest.media.map((m) => (
                      <a
                        key={m.url}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass group flex items-start justify-between gap-4 rounded-card p-5 transition-colors hover:border-white/20"
                      >
                        <span className="min-w-0">
                          <span className="block text-[14px] leading-relaxed text-ink-2 transition-colors group-hover:text-ink">
                            {m.title}
                          </span>
                          <span className="mt-2 block text-[12px] text-ink-4">
                            {m.outlet}
                            {m.date && `　${m.date}`}
                          </span>
                        </span>
                        <ExternalLink
                          size={14}
                          aria-hidden
                          className="mt-1 shrink-0 text-ink-4 transition-colors group-hover:text-orbit-sky"
                        />
                      </a>
                    ))}
                  </ExpandableList>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* 更早的屆數 */}
      <section className="relative bg-bg-soft py-20 md:py-28">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3.4vw,2rem)] font-bold text-ink">更早的屆數</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {earlier.map((e, i) => (
              <Reveal key={e.no} delay={0.06 * i}>
                <article
                  id={`edition-${e.no}`}
                  className="glass h-full scroll-mt-24 rounded-card p-8"
                >
                  <p className="font-display text-sm tracking-[0.18em] text-ink-4">{e.year}</p>
                  <h3 className="mt-3 text-xl font-bold text-ink">
                    第{["一", "二", "三"][e.no - 1]}屆{e.theme ? `・${e.theme}` : ""}
                  </h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-3">
                    {e.dateLabel}
                    <br />
                    {e.venue}
                  </p>

                  {e.stats.length > 0 && (
                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                      {e.stats.map((s) => (
                        <div key={s.label}>
                          <dt className="text-[12px] text-ink-4">{s.label}</dt>
                          <dd className="font-display mt-0.5 text-base font-semibold text-ink-2">
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {e.highlights.length > 0 && (
                    <ul className="mt-6 space-y-2.5">
                      {e.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-2">
                          <span
                            aria-hidden
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orbit-sky"
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {!e.dataComplete && (
                    <p className="mt-6 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-ink-4">
                      這一屆的公開紀錄較少，資料整理中。
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 導回本屆 */}
      <section className="relative py-20 md:py-28">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell text-center">
          <Reveal>
            <p className="font-display text-sm tracking-[0.2em] text-orbit-sky">NEXT</p>
            <h2 className="mt-5 text-[clamp(1.6rem,4vw,2.4rem)] font-bold text-ink">
              {event.fullName}
            </h2>
            <p className="mt-4 text-[15px] text-ink-2">
              {event.dateLabelLong}｜{event.venue.name}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Cta href="/#tickets" size="lg">
                查看本屆資訊
              </Cta>
              <Link
                href="/#speakers"
                className="inline-flex items-center gap-1.5 px-2 py-4 text-sm text-ink-2 transition-colors hover:text-ink"
              >
                本屆講者陣容
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
