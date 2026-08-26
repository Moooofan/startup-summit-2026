import Image from "next/image";
import { Quote } from "lucide-react";
import {
  founderProfile,
  founderQuote,
  founderQuotes,
  founderNarrative,
  founderLetter,
} from "@/data/founder";
import { Reveal } from "@/components/ui/Reveal";

export function FounderNote() {
  const paragraphs = founderLetter ? founderLetter.split("\n\n") : founderNarrative;

  return (
    <section
      id="founder"
      /* snap-start + snap-always：從上一段（About 黑底）吸過來時一次到位。
         scroll-margin-top:-88px 抵銷全域 scroll-padding-top，讓深藍底吸到視窗最頂、
         填滿導覽列後方 → 與上一段無區隔。整段高度 > 一頁 → 屬「大吸附區」，
         內部（右欄）可平順捲動，不會被中途吸附。 */
      className="grain relative snap-start snap-always bg-bg-soft [scroll-margin-top:-88px]"
    >
      <div aria-hidden className="hairline absolute inset-x-0 top-0 z-10 h-px" />

      <div className="shell relative">
        <div className="pt-[104px] lg:grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-20 lg:pt-0">
          {/* 左：整段釘住、垂直置中 —— 到位後圖片與名銜不再移動 */}
          <div className="mx-auto max-w-[340px] lg:mx-0 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:max-w-[340px] lg:flex-col lg:justify-center lg:self-start lg:pb-14 lg:pt-[128px]">
            <Reveal>
              <figure className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-3 rounded-[22px] bg-gradient-to-br from-orbit-sky/25 via-transparent to-orbit-rose/25 blur-xl"
                />
                <div className="relative overflow-hidden rounded-[18px] border border-black/10">
                  <Image
                    src={founderProfile.photo}
                    alt={`${founderProfile.name}｜${founderProfile.title}`}
                    width={1462}
                    height={2047}
                    sizes="(max-width: 1024px) 340px, 380px"
                    className="h-auto w-full object-cover"
                  />
                </div>
                <figcaption className="mt-5 px-1">
                  <p className="text-lg font-bold text-ink">
                    {founderProfile.name}
                    <span className="font-display ml-2 text-sm font-medium text-ink-3">
                      {founderProfile.nameEn}
                    </span>
                  </p>
                  <p className="mt-1 text-[17px] text-ink-3">{founderProfile.title}</p>
                  <p className="text-[17px] text-ink-3">{founderProfile.subtitle}</p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* 右：正常流動的內文 —— 平順上下捲動，不吸附。到底再滾一下就吸去講者頁。 */}
          <div className="pb-[16vh] pt-12 lg:pb-[18vh] lg:pt-[calc(88px+7vh)]">
            <Reveal delay={0.08}>
              <p className="mb-4 flex items-center gap-3 text-[16px] font-medium tracking-[0.24em] text-gold">
                <span aria-hidden className="h-px w-8 bg-gold/60" />
                FOUNDER&apos;S NOTE
              </p>
              <h2 className="text-[clamp(1.75rem,4.2vw,2.5rem)] font-bold leading-tight text-ink">
                創辦人的話
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <blockquote className="relative mt-10 border-l-2 border-brand-lift/60 pl-6 md:pl-8">
                <Quote
                  aria-hidden
                  size={26}
                  className="absolute -left-[14px] -top-3 fill-bg-soft text-brand-lift"
                />
                <p className="text-[clamp(1.15rem,2.6vw,1.5rem)] font-medium leading-[1.75] text-ink">
                  「{founderQuote.text}」
                </p>
                <footer className="mt-4 text-[17px] text-ink-4">— {founderQuote.source}</footer>
              </blockquote>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12 space-y-6">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-[18px] leading-[2] text-ink-2 md:text-base">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {founderQuotes.map((q) => (
                  <div key={q.source} className="glass rounded-card p-6">
                    <p className="text-[18px] leading-[1.85] text-ink-2">「{q.text}」</p>
                    <p className="mt-3 text-xs text-ink-4">{q.source}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-12 border-t border-black/8 pt-8">
                <h3 className="text-xs tracking-[0.2em] text-ink-4">經歷</h3>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {founderProfile.career.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-[18px] text-ink-2">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orbit-sky" />
                      {c}
                    </li>
                  ))}
                </ul>
                <a
                  href={founderProfile.links.group}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 text-sm text-orbit-sky transition-colors hover:text-ink"
                >
                  加入台灣新創投資社團
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
