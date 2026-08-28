import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { editions, testimonials } from "@/data/review";
import { event } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { EditionTimeline } from "@/components/review/EditionTimeline";
import { PastSpeakerRoster } from "@/components/review/PastSpeakerRoster";
import { Testimonials } from "@/components/review/Testimonials";
import { ExpandableList } from "@/components/review/ExpandableList";
import { Cta } from "@/components/ui/Cta";

export const metadata: Metadata = {
  title: "歷屆回顧",
  description:
    "台灣新創投資年會歷屆回顧：從 2023 年首屆走到 2026 年第四屆，各屆主題、規模、講者名單與媒體露出紀錄。",
  alternates: { canonical: "/review" },
};

/**
 * 歷屆回顧頁（業主 2026/8 定案的三段式結構）：
 *   1. 時間軸  — 垂直捲動，左年份（sticky）右內容（精選照片＋重點數字）
 *   2. 好評留言 — 版位保留，資料未到位時整段不渲染
 *   3. 講者名單 — 屆數收合，點擊展開該屆議程表
 * 贊助名單已依業主指示自本頁移除（/sponsor 頁不受影響）。
 */
export default function ReviewPage() {
  // 時間軸由舊到新，成長敘事才讀得順
  const chronological = [...editions].sort((a, b) => a.no - b.no);
  const latest = editions.find((e) => e.no === Math.max(...editions.map((x) => x.no)));

  return (
    <>
      {/* 頁首 */}
      <section className="grain relative overflow-hidden pb-12 pt-[132px] md:pb-16 md:pt-[176px]">
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
              lead="自 2023 年起，台灣新創投資年會每年集結創業家、創投與機構投資人。以下依年份回顧歷屆的主題、規模與陣容。"
            />
          </Reveal>
        </div>
      </section>

      {/* 1／時間軸 */}
      <section className="relative py-6 md:py-10">
        <div className="shell">
          <EditionTimeline editions={chronological} />
        </div>
      </section>

      {/* 2／好評留言 —— 版位保留；testimonials 為空時整段不渲染 */}
      {testimonials.length > 0 && (
        <section className="relative bg-bg-soft py-20 md:py-28">
          <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
          <div className="shell">
            <Reveal>
              <SectionHead
                eyebrow="TESTIMONIALS"
                title="他們在現場，後來這樣說"
                lead="來自歷屆與會創業家、投資人與生態系夥伴的回饋。"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <Testimonials items={testimonials} />
            </Reveal>
          </div>
        </section>
      )}

      {/* 3／各屆講者名單與主題 */}
      <section className="relative py-20 md:py-28">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="SPEAKERS ARCHIVE"
              title="各屆講者名單與主題"
              lead="點擊屆數展開當年議程，含講題與講者單位。"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <PastSpeakerRoster editions={chronological} />
          </Reveal>
        </div>
      </section>

      {/* 媒體報導（僅最新一屆有資料） */}
      {latest?.media && latest.media.length > 0 && (
        <section className="relative bg-bg-soft py-20 md:py-28">
          <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
          <div className="shell">
            <Reveal>
              <SectionHead
                eyebrow="PRESS"
                title="媒體報導"
                lead={`第${["一", "二", "三", "四"][latest.no - 1]}屆會後累積 ${latest.media.length} 則媒體露出。`}
              />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
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
                      className="glass group flex items-start justify-between gap-4 rounded-card p-5 transition-colors hover:border-black/20"
                    >
                      <span className="min-w-0">
                        <span className="block text-[18px] leading-relaxed text-ink-2 transition-colors group-hover:text-ink">
                          {m.title}
                        </span>
                        <span className="mt-2 block text-[17px] text-ink-4">
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
        </section>
      )}

      {/* 導回本屆 */}
      <section className="relative py-20 md:py-28">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell text-center">
          <Reveal>
            <p className="font-display text-sm tracking-[0.2em] text-orbit-sky">NEXT</p>
            <h2 className="mt-5 text-[clamp(1.6rem,4vw,2.4rem)] font-bold text-ink">
              {event.fullName}
            </h2>
            <p className="mt-4 text-[18px] text-ink-2">
              {event.dateLabelLong}｜{event.venue.name}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Cta href="/tickets" size="lg">
                查看本屆資訊
              </Cta>
              <Link
                href="/speakers"
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
