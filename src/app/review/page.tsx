import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { editions, testimonials, featuredMedia } from "@/data/review";
import { event } from "@/data/event";
import { isPublicRoute } from "@/lib/config";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { EditionTimeline } from "@/components/review/EditionTimeline";
import { PastSpeakerRoster } from "@/components/review/PastSpeakerRoster";
import { Testimonials } from "@/components/review/Testimonials";
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
      {/* overflow-x-clip 而非 overflow-hidden，**別順手改回去**：
          區塊光暈是 880px 高，這個頁首只有約 400px（pt-176 + SectionHead + pb），裝不下。
          overflow-hidden 會把光暈在區塊底部切出一條水平硬邊（業主 2026/9 回報）。
          也不能用 overflow-x-hidden：CSS 規定只要一軸不是 visible，另一軸的 visible
          就會被算成 auto → 反而在區塊內生出一個垂直捲動容器。
          overflow: clip 沒有這個耦合，overflow-x: clip 搭 overflow-y: visible 合法且有效 ——
          橫向仍擋住溢位（光暈定位在負值，超出視窗會產生水平捲軸），縱向放它自然溢出。
          溢出不會蓋到下一段：後續 section 同為 relative 且 DOM 在後，內容畫在光暈之上。 */}
      <section className="grain relative overflow-x-clip pb-12 pt-[132px] md:pb-16 md:pt-[176px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[12%] -top-[20%] h-[64vw] max-h-[880px] w-[64vw] max-w-[880px] rounded-full bg-[radial-gradient(circle,rgb(95_137_255/0.07)_0%,rgb(95_137_255/0.025)_40%,transparent_72%)]"
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
                lead={`第${["一", "二", "三", "四"][latest.no - 1]}屆會後獲主流財經媒體 ${latest.media.length} 則報導。`}
              />
            </Reveal>
            <Reveal delay={0.08}>
              {/* 只露出 featuredMedia 那四則（業主 2026/9），不再提供展開全部 */}
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {featuredMedia.map((m) => (
                  <a
                    key={m.url}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass group flex items-start justify-between gap-4 rounded-card p-5 transition-colors hover:border-white/22"
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
              {isPublicRoute("/tickets") && (
                <Cta href="/tickets" size="lg">
                  查看本屆資訊
                </Cta>
              )}
              {/* 手機縮一級：這顆與左邊的 lg 按鈕要並排在同一列，
                  兩者相加必須壓在 280px（320px 螢幕的可用寬）以內，見 ui/Cta.tsx 的算式 */}
              <Link
                href="/speakers"
                className="inline-flex items-center gap-1.5 px-2 py-4 text-[16px] text-ink-2 transition-colors hover:text-ink sm:text-sm"
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
