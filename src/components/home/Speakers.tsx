import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { speakers, speakerCount, type Speaker } from "@/data/speakers";
import { photoFocus } from "@/data/speakerPhotoFocus";
import { forums } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Forum = (typeof forums)[number];

const accent: Record<Forum["accent"], { text: string; glow: string; line: string }> = {
  sky: {
    text: "text-orbit-sky",
    glow: "rgb(70 190 245 / 0.14)",
    line: "via-orbit-sky/70",
  },
  violet: {
    text: "text-[#a98bff]",
    glow: "rgb(150 130 255 / 0.14)",
    line: "via-[#a98bff]/60",
  },
};

function SpeakerCard({
  s,
  index,
  tone,
}: {
  s: Speaker;
  index: number;
  tone: { text: string; line: string };
}) {
  return (
    <li>
      <Link
        href={`/speakers/${s.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-glow"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-white/10 bg-surface">
          <Image
            src={s.photo}
            alt={`${s.name}｜${s.org} ${s.title}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            style={{ objectPosition: photoFocus(s.slug) }}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            loading={index < 8 ? "eager" : "lazy"}
          />
          {s.status === "pending" && (
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
            {s.name}
            <ArrowUpRight
              size={14}
              aria-hidden
              className="shrink-0 text-ink-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </p>
          <p className={cn("mt-1 text-[17px] font-medium leading-snug", tone.text)}>{s.org}</p>
          <p className="mt-0.5 text-[17px] leading-snug text-ink-3">{s.title}</p>
        </div>
      </Link>
    </li>
  );
}

/** 只顯示文字的節點 — 滾動時吸附成一整頁，向下滑才進到當日陣容 */
function ForumNode({ f, order, count }: { f: Forum; order: number; count: number }) {
  const a = accent[f.accent];
  // 手機為什麼要整段左對齊：桌機每個節點各自佔滿 md:min-h-[100svh]，是獨立一屏，置中沒問題；
  // 但手機上那個 min-h 不生效、ScrollSnapController 也在 innerWidth < 768 直接 return，
  // 五個 panel 會塌成一條連續捲軸 —— 置中的節點夾在靠左的 SectionHead 與網格表頭之間，
  // 讀者就看到 左→中→左→中→左 的跳動。手機一律靠左，桌機用 md: 還原置中。
  // py-20 則是替代那一屏的呼吸空間：沒有 min-h 時節點會塌成內容高度並貼死上下鄰居。
  return (
    <div
      id={f.key}
      className="snap-panel relative flex items-center justify-start overflow-hidden py-20 md:min-h-[100svh] md:justify-center md:py-0"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] max-h-[720px] w-[70vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${a.glow} 0%, transparent 66%)` }}
      />
      {/* Reveal 吐出的 motion.div 沒有寬度類別，在 justify-center 的 flex 父層裡是 shrink-to-fit ——
          左緣會隨 f.description 的長度浮動（Day 1／Day 2 描述不等長），手機要它撐滿才對得齊 */}
      <Reveal className="w-full md:w-auto">
        {/* px-5 = 20px，與 .shell 的手機邊距逐像素對齊：上方 SectionHead 與下方網格表頭的左緣自此同一條線 */}
        <div className="relative px-5 text-left md:px-6 md:text-center">
          {/* 手機：30vw 的數字會蓋滿整段正文變成一團色塊，改成左錨、縮到 20vw、退到標題後方 */}
          <span
            aria-hidden
            className="ghost-head pointer-events-none absolute left-0 top-0 -z-10 -translate-y-[26%] text-[clamp(5.5rem,20vw,24rem)] leading-none opacity-[0.3] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-[58%] md:text-[clamp(9rem,30vw,24rem)] md:opacity-[0.38]"
          >
            {String(order).padStart(2, "0")}
          </span>
          {/* 手機補一條與 SectionHead 眉標同款的短橫線，讓它和上方「— SPEAKERS」是同一套語彙 */}
          <p
            className={cn(
              "flex items-center gap-3 font-display text-[17px] tracking-[0.32em] md:block",
              a.text
            )}
          >
            <span aria-hidden className="h-px w-8 bg-current/50 md:hidden" />
            {f.label} · {f.nameEn}
          </p>
          <h3 className="text-kv mt-5 text-[clamp(2.25rem,8vw,5rem)] font-light leading-[1.05]">
            {f.name}
          </h3>
          <p className="mt-6 font-display text-lg text-ink-2 md:text-xl">
            {f.dateLabel}（{f.weekday}）· {f.time}
          </p>
          {/* max-w-[34ch]：Day 2 的「創投 / CVC / 基金 LP / 高資產投資人」在 390px 會頂到兩邊 */}
          <p className="mt-2 max-w-[34ch] text-[17px] tracking-wide text-ink-4 md:max-w-none">
            對象 · {f.audience}
          </p>
          <p className="mt-8 max-w-xl text-[18px] leading-[1.9] text-ink-2 md:mx-auto">
            {f.description}
          </p>
          {/* 手機改單行、箭頭在字尾；tracking-[0.24em] 套在中文上會被拉散成「向 下 滑 看」，只留給桌機 */}
          <span
            className={cn(
              "mt-10 inline-flex items-center gap-2 text-[17px] tracking-[0.06em] md:mt-14 md:flex-col md:tracking-[0.24em]",
              a.text
            )}
          >
            向下滑看 {count} 位講者
            <ChevronDown
              size={20}
              aria-hidden
              className="animate-bounce motion-reduce:animate-none"
            />
          </span>
        </div>
      </Reveal>
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto h-px w-2/3 max-w-4xl bg-gradient-to-r from-transparent to-transparent",
          a.line
        )}
      />
    </div>
  );
}

export function Speakers() {
  return (
    <section
      id="speakers"
      className="grain relative scroll-mt-24 bg-bg-soft"
    >
      <div aria-hidden className="hairline absolute inset-x-0 top-0 z-10 h-px" />

      {/* 第一頁：開場標題 */}
      <div className="snap-panel relative flex items-center overflow-hidden pb-4 pt-24 md:min-h-[100svh] md:pb-0 md:pt-0">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[10%] top-[12%] h-[34vw] max-h-[440px] w-[34vw] max-w-[440px] rounded-full bg-[radial-gradient(circle,rgb(43_92_255/0.16)_0%,transparent_66%)]"
        />
        <div className="shell relative w-full">
          <Reveal>
            <SectionHead
              className="md:mt-16"
              eyebrow="SPEAKERS"
              ghost="LINE-UP"
              title={`${speakerCount} 位講者，兩天分場登台`}
              lead="從剛掛牌的創業家、Edge AI 與半導體團隊，到管理國際基金的機構投資人。點開任何一位，看他們正在解的題目。"
            />
          </Reveal>
        </div>

        {/* 向下滑提示：頁面中間下方（常駐，不用 whileInView 門檻，否則初次落在視窗邊界不顯示） */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center md:flex">
          <span className="inline-flex flex-col items-center gap-2 text-[17px] tracking-[0.24em] text-orbit-sky">
            向下滑看兩天陣容
            <ChevronDown size={20} aria-hidden className="animate-bounce motion-reduce:animate-none" />
          </span>
        </div>
      </div>

      {forums.map((f, fi) => {
        const list = speakers.filter((s) => s.day === f.key);
        const a = accent[f.accent];
        const isLast = fi === forums.length - 1;
        return (
          <Fragment key={f.key}>
            {/* 節點頁：只有文字 */}
            <ForumNode f={f} order={fi + 1} count={list.length} />

            {/* 講者網格頁：標題吸到最上方（靠 html scroll-padding-top 避開導覽列），內容比一頁高時自由捲動 */}
            <div className="snap-panel pb-16 pt-6 md:min-h-[100svh]">
              <div className="shell">
                <Reveal>
                  <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-white/10 pb-5">
                    <span className={cn("font-display text-xs font-semibold tracking-[0.2em]", a.text)}>
                      {f.label}
                    </span>
                    <h3 className="text-xl font-bold text-ink md:text-2xl">{f.name}</h3>
                    {/* 手機強制折行：basis-full 讓這個 0 高度的元素獨佔一行，後面的項目一定落到第二行。
                        這一列固有寬 ＝ Day 1(56) + 論壇名(110) + 日期(108) + 計數(41) + gap ＝ 375px，
                        比 390px 手機的可用寬（350px）還寬 —— 也就是任何手機都排不下、必定換行。
                        放著讓它自己 wrap 的話折點會隨字串長度飄；明確指定折點後：
                        第一行 Day 1＋論壇名(186px)、第二行 日期＋計數。 */}
                    <span aria-hidden className="basis-full sm:hidden" />
                    <span className="font-display text-sm text-ink-3">
                      {f.dateLabel}（{f.weekday}）
                    </span>
                    {/* ml-auto 只給 sm 以上：手機把計數推到右端，第二行會變成「日期靠左、計數靠右」
                        的分裂排版，和 ForumNode／SectionHead 一路靠左的左緣打架 —— 手機讓它接在日期後面。 */}
                    <span className="text-[17px] text-ink-4 sm:ml-auto">{list.length} 位</span>
                  </header>
                </Reveal>

                <Reveal delay={0.08}>
                  <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
                    {list.map((s, i) => (
                      <SpeakerCard key={s.slug} s={s} index={fi === 0 ? i : i + 100} tone={a} />
                    ))}
                  </ul>
                </Reveal>

                {isLast && (
                  <p className="mt-14 text-[17px] leading-relaxed text-ink-4">
                    ※ 標示「確認中」者為邀請中或行程確認中的講者，最終陣容以官方公告為準。
                  </p>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}
