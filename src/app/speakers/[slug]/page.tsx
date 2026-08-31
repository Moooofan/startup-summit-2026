import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import { speakers, getSpeaker } from "@/data/speakers";
import { photoFocus } from "@/data/speakerPhotoFocus";
import { trackMap } from "@/data/tracks";
import { event, forums } from "@/data/event";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";
import { BackLink } from "@/components/site/BackLink";
import { PersonJsonLd } from "@/components/site/JsonLd";
import { isPublicRoute } from "@/lib/config";

export function generateStaticParams() {
  return speakers.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getSpeaker(slug);
  if (!s) return {};

  const desc = s.bio
    ? s.bio.replace(/\s+/g, " ").slice(0, 155)
    : `${s.org} ${s.title}${s.name}，${event.fullName}講者。`;

  return {
    title: `${s.name}｜${s.org} ${s.title}`,
    description: desc,
    alternates: { canonical: `/speakers/${s.slug}` },
    openGraph: {
      type: "profile",
      title: `${s.name}｜${s.org} ${s.title}`,
      description: desc,
      url: `/speakers/${s.slug}`,
      images: [{ url: s.photo, alt: s.name }],
    },
  };
}

export default async function SpeakerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSpeaker(slug);
  if (!s) notFound();

  const idx = speakers.findIndex((x) => x.slug === slug);
  const prev = idx > 0 ? speakers[idx - 1] : null;
  const next = idx < speakers.length - 1 ? speakers[idx + 1] : null;
  const track = trackMap[s.track];
  const forum = forums.find((f) => f.key === s.day);
  const paragraphs = s.bio ? s.bio.split("\n\n").filter(Boolean) : [];

  return (
    <>
      <PersonJsonLd
        name={s.name}
        nameEn={s.nameEn}
        title={s.title}
        org={s.org}
        slug={s.slug}
        bio={s.bio}
        photo={s.photo}
      />

      <article className="grain relative overflow-hidden pb-24 pt-[112px] md:pt-[148px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[16%] -top-[14%] h-[46vw] max-h-[620px] w-[46vw] max-w-[620px] rounded-full bg-[radial-gradient(circle,rgb(76_104_212/0.2)_0%,transparent_66%)]"
        />

        <div className="shell relative">
          <Reveal y={12}>
            <BackLink
              fallbackHref="/speakers"
              className="inline-flex items-center gap-2 text-[17px] text-ink-3 transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} />
              回到講者陣容
            </BackLink>
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
            {/* 人像 */}
            <Reveal>
              <div className="lg:sticky lg:top-32">
                <div className="relative mx-auto max-w-[280px] lg:mx-0 lg:max-w-none">
                  <div
                    aria-hidden
                    className="absolute -inset-2.5 rounded-[20px] bg-gradient-to-br from-orbit-sky/25 via-transparent to-orbit-rose/25 blur-lg"
                  />
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] border border-black/10 bg-surface">
                    <Image
                      src={s.photo}
                      alt={`${s.name}｜${s.org} ${s.title}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 280px, 320px"
                      style={{ objectPosition: photoFocus(s.slug) }}
                      className="object-cover"
                    />
                  </div>
                </div>

                <dl className="mt-8 space-y-4 text-[17px]">
                  {forum && (
                    <div className="flex gap-3">
                      <dt className="shrink-0 text-ink-4">
                        <Calendar size={15} />
                        <span className="sr-only">場次</span>
                      </dt>
                      <dd className="text-ink-2">
                        {forum.dateLabel.replace(/ /g, "")}（{forum.weekday}）{forum.name}
                      </dd>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <dt className="shrink-0 text-ink-4">
                      <MapPin size={15} />
                      <span className="sr-only">地點</span>
                    </dt>
                    <dd className="text-ink-2">{event.venue.name}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            {/* 內容 */}
            <div>
              <Reveal delay={0.06}>
                {track && (
                  <Link
                    href={isPublicRoute("/agenda") ? "/agenda" : "/speakers"}
                    className="inline-flex items-center gap-2 rounded-pill border border-black/10 bg-black/[0.04] px-4 py-1.5 text-[17px] text-ink-2 transition-colors hover:border-black/25 hover:text-ink"
                  >
                    {track.title}
                    {s.role === "moderator" && <span className="text-ink-4">・主持人</span>}
                  </Link>
                )}

                <h1 className="mt-6 text-[clamp(2rem,5vw,3rem)] font-black leading-tight text-ink">
                  {s.name}
                  {s.nameEn && (
                    <span className="font-display ml-3 text-[0.45em] font-medium tracking-wide text-ink-3">
                      {s.nameEn}
                    </span>
                  )}
                </h1>

                <p className="mt-4 text-lg text-orbit-sky">{s.org}</p>
                <p className="mt-1 text-[18px] text-ink-2">{s.title}</p>

                {s.status === "pending" && (
                  <p className="mt-5 inline-block rounded-lg border border-black/8 bg-black/[0.03] px-4 py-2 text-[17px] text-ink-3">
                    出席確認中，最終陣容以官方公告為準
                  </p>
                )}

                {s.tags && s.tags.length > 0 && (
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-pill border border-black/8 px-3 py-1 text-[17px] text-ink-3"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-10 space-y-5 border-t border-black/8 pt-10">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, i) => (
                      <p key={i} className="text-[18px] leading-[2] text-ink-2 md:text-base">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="text-[18px] text-ink-3">講者簡介即將公布。</p>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-12 border-t border-black/8 pt-10">
                  {isPublicRoute("/tickets") && <Cta href="/tickets">報名參加{forum?.name}</Cta>}
                </div>
              </Reveal>
            </div>
          </div>

          {/* 上下一位 */}
          <Reveal delay={0.1}>
            <nav
              aria-label="其他講者"
              className="mt-20 grid gap-4 border-t border-black/8 pt-10 sm:grid-cols-2"
            >
              {prev ? (
                <Link
                  href={`/speakers/${prev.slug}`}
                  replace
                  className="glass group flex items-center gap-4 rounded-card p-5 transition-colors hover:border-black/20"
                >
                  <ArrowLeft size={16} className="shrink-0 text-ink-4" />
                  <span className="min-w-0">
                    <span className="block text-[16px] text-ink-4">上一位</span>
                    <span className="mt-0.5 block truncate text-[18px] font-medium text-ink">
                      {prev.name}
                    </span>
                    <span className="block truncate text-[17px] text-ink-3">{prev.org}</span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`/speakers/${next.slug}`}
                  replace
                  className="glass group flex items-center justify-end gap-4 rounded-card p-5 text-right transition-colors hover:border-black/20 sm:col-start-2"
                >
                  <span className="min-w-0">
                    <span className="block text-[16px] text-ink-4">下一位</span>
                    <span className="mt-0.5 block truncate text-[18px] font-medium text-ink">
                      {next.name}
                    </span>
                    <span className="block truncate text-[17px] text-ink-3">{next.org}</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-ink-4" />
                </Link>
              )}
            </nav>
          </Reveal>
        </div>
      </article>
    </>
  );
}
