import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { forums } from "@/data/event";
import { speakerCount, speakersByDay } from "@/data/speakers";
import type { Speaker } from "@/data/speakers";
import { photoFocus } from "@/data/speakerPhotoFocus";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * 首頁講者陣容 —— 兩排反向跑馬燈（上排往左、下排往右）。
 *
 * 為什麼是純 CSS、而且是 Server Component：
 * 效果只需要「等速位移 + hover 暫停」，這用 CSS animation 就做得完，
 * 不需要 Swiper／Embla 那類套件（多背 20–40KB，還會讓整段變成 client component）。
 * 位移用 transform → GPU 合成層，不觸發重排重繪 ——
 * 這一點在本專案特別要緊：.glass 的 blur 已經是捲動效能的主因。
 *
 * 無縫循環的原理：軌道把清單「複製一份」接在後面，跑到 -50% 時
 * 畫面上的內容與起點完全相同，接回 0 看不出接縫。
 *
 * 無障礙（見 globals.css 的 .marquee-* ）：
 * - 複製的那一份掛 aria-hidden，否則螢幕閱讀器會把每位講者念兩遍
 * - hover 與 focus-within 都要暫停；只做 hover 的話鍵盤使用者 Tab 進去焦點會被帶著跑
 * - prefers-reduced-motion 直接關掉動畫，改成可手動橫向捲動
 */

/** 兩排各自配速：卡片多的那排跑久一點，讓兩排的視覺速度接近。 */
const SECONDS_PER_CARD = 4.5;

const accent = {
  sky: { text: "text-orbit-sky", line: "via-orbit-sky/70" },
  violet: { text: "text-[#6d47c4]", line: "via-[#6d47c4]/60" },
} as const;

type Tone = (typeof accent)[keyof typeof accent];

function SpeakerCard({ s, tone }: { s: Speaker; tone: Tone }) {
  return (
    <Link
      href={`/speakers/${s.slug}`}
      className="group block w-[172px] shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-glow sm:w-[196px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-black/8 bg-surface">
        <Image
          src={s.photo}
          alt={`${s.name}｜${s.org} ${s.title}`}
          fill
          sizes="196px"
          style={{ objectPosition: photoFocus(s.slug) }}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
        />
        {s.status === "pending" && (
          <span className="absolute right-2.5 top-2.5 rounded-pill bg-bg/80 px-2.5 py-1 text-[15px] text-ink-3 backdrop-blur">
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
      <div className="mt-3">
        <p className="flex items-center gap-1.5 text-[17px] font-bold text-ink">
          {s.name}
          <ArrowUpRight
            size={13}
            aria-hidden
            className="shrink-0 text-ink-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </p>
        <p className={cn("mt-0.5 line-clamp-1 text-[16px] font-medium", tone.text)}>{s.org}</p>
        <p className="mt-0.5 line-clamp-1 text-[16px] text-ink-3">{s.title}</p>
      </div>
    </Link>
  );
}

function MarqueeRow({
  list,
  tone,
  reverse,
}: {
  list: Speaker[];
  tone: Tone;
  reverse?: boolean;
}) {
  return (
    /* 兩側羽化由 .marquee-viewport 的 mask 處理（見 globals.css）——
       疊漸層色塊在這裡行不通，底下是水墨背景圖而非純色。 */
    <div className="marquee-viewport relative overflow-hidden">
      <div
        className={cn("marquee-track gap-5", reverse && "marquee-track-reverse")}
        style={{ ["--marquee-duration" as string]: `${list.length * SECONDS_PER_CARD}s` }}
      >
        {list.map((s) => (
          <SpeakerCard key={s.slug} s={s} tone={tone} />
        ))}
        {/* 複製一份湊成無縫循環。aria-hidden + tabIndex -1：
            不重複念給螢幕閱讀器，也不讓鍵盤 Tab 進到看不出差別的第二份。 */}
        <div aria-hidden className="contents">
          {list.map((s) => (
            <div key={`dup-${s.slug}`} className="contents [&_a]:pointer-events-none">
              <SpeakerCard s={s} tone={tone} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 日別標題（可點）：整行連到 /speakers 的該日錨點，取代原本的「看完整陣容」按鈕。 */
function DayHeading({ forum, count }: { forum: (typeof forums)[number]; count: number }) {
  return (
    <div className="shell">
      <Link
        href={`/speakers#${forum.key}`}
        aria-label={`看 ${forum.name}完整講者陣容`}
        className="group inline-flex flex-wrap items-center gap-x-3 gap-y-1"
      >
        <span
          className={cn(
            "text-sm font-semibold tracking-[0.2em] underline-offset-4 transition-colors group-hover:underline",
            accent[forum.accent].text
          )}
        >
          {forum.label}　{forum.name}
        </span>
        <span className="text-sm font-normal tracking-normal text-ink-4">
          {forum.dateLabel}・{count} 位
        </span>
        <ArrowUpRight
          size={15}
          aria-hidden
          className="shrink-0 text-ink-4 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-2"
        />
      </Link>
    </div>
  );
}

export function SpeakersPreview() {
  const [day1, day2] = forums;
  const list1 = speakersByDay(day1.key);
  const list2 = speakersByDay(day2.key);

  return (
    <>
      {/* 節點一：講者大字報，滿版一屏（方案 B：大字報獨立一頁） */}
      <section
        id="speakers"
        className="grain relative flex snap-start items-center overflow-hidden bg-bg-soft pb-6 pt-20 md:min-h-[100svh] md:py-20 [scroll-margin-top:-88px]"
      >
        <div aria-hidden className="hairline absolute inset-x-0 top-0 z-10 h-px" />

        <div className="shell relative w-full">
          <Reveal>
            <SectionHead
              className="md:mt-8"
              eyebrow="SPEAKERS"
              ghost="LINE-UP"
              title={`${speakerCount} 位講者，兩天分場登台`}
              lead="從剛掛牌的創業家、Edge AI 與半導體團隊，到管理國際基金的機構投資人。點開任何一位，看他們正在解的題目。"
            />
          </Reveal>

          {/* 向下滑提示（桌機顯示，與 Agenda 開場一致） */}
          <div className="pointer-events-none mt-14 hidden justify-center md:flex">
            <span className="inline-flex flex-col items-center gap-2 text-[17px] tracking-[0.24em] text-orbit-sky">
              向下看兩天講者陣容
              <ChevronDown size={20} aria-hidden className="animate-bounce motion-reduce:animate-none" />
            </span>
          </div>
        </div>
      </section>

      {/* 節點二：兩行反向跑馬燈。桌機（md+）才滿版一屏、垂直置中：
          pt-[104px]（≥ nav 88px + 呼吸）是「地板」，justify-center 再怎麼置中，內容頂端
          都壓不到固定導覽列下面 → 不同縮放/字級都不會把 Day1 標籤切掉。
          手機不觸發 STICK：不強制滿版，接在大字報下方自然流動、只留一點上緣間距。
          overflow-x-hidden（非 overflow-hidden）：只擋跑馬燈左右溢出，垂直永不裁切。 */}
      <section className="relative flex snap-start flex-col justify-center overflow-x-hidden pb-16 pt-4 md:min-h-[100svh] md:pt-[104px] [scroll-margin-top:-88px]">
        {/* 跑馬燈不放進 .shell —— 要滿版跑到螢幕邊緣，羽化才有「持續延伸」的感覺 */}
        <div className="relative space-y-6">
          <DayHeading forum={day1} count={list1.length} />
          <MarqueeRow list={list1} tone={accent[day1.accent]} />

          <div className="pt-4">
            <DayHeading forum={day2} count={list2.length} />
          </div>
          <MarqueeRow list={list2} tone={accent[day2.accent]} reverse />
        </div>

        <div className="shell">
          <Reveal delay={0.1}>
            <p className="mt-10 text-[17px] text-ink-4">
              ※ 標示「確認中」者為邀請中，最終陣容以官方公告為準。點日別標題可看該日完整講者。
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
