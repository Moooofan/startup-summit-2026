import Image from "next/image";
import type { Edition } from "@/data/review";

/**
 * 歷屆時間軸 —— 垂直捲動，左半邊年份（sticky 釘住）、右半邊內容。
 *
 * 版面決策（業主 2026/8 定案）：
 * - 上下向而非左右向：內容是敘事型（照片＋數據＋名單），水平軸放不下，
 *   且橫向捲動在桌機是反模式。
 * - 左欄年份用 position: sticky → 捲動時使用者永遠知道現在看的是哪一屆。
 * - 右欄每屆「精選一張」照片（非圖廊），業主指定。
 * - 重點數字主打「參與人次」「講者數量」（業主指定），投資機構／天數為次要。
 *
 * 缺料降級：照片缺 → 品牌色漸層＋年份大字；數字為 null → 顯示「—」。
 */

const CN_NO = ["一", "二", "三", "四"] as const;

/** 一格重點數字。null 一律顯示「—」，不開天窗。 */
function Metric({
  value,
  unit,
  label,
  primary = false,
}: {
  value: number | null;
  unit: string;
  label: string;
  primary?: boolean;
}) {
  const missing = value === null;
  return (
    <div>
      <p
        className={`font-display tabular-nums leading-none ${
          primary
            ? "text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold"
            : "text-[clamp(1.1rem,2.6vw,1.4rem)] font-semibold"
        } ${missing ? "text-ink-4" : primary ? "text-orbit" : "text-ink-2"}`}
      >
        {missing ? "—" : value.toLocaleString()}
        {!missing && <span className="ml-1 text-[0.5em] font-medium text-ink-3">{unit}</span>}
      </p>
      <p className="mt-2 text-[12px] leading-tight text-ink-4">{label}</p>
    </div>
  );
}

function EditionRow({ edition: e, index }: { edition: Edition; index: number }) {
  const g = e.growth;
  const isPending = Boolean(e.pending?.length);

  return (
    <article
      id={`edition-${e.no}`}
      className="relative scroll-mt-28 border-t border-line-soft py-12 first:border-t-0 md:py-16"
    >
      <div className="md:grid md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-10 lg:gap-16">
        {/* 左欄：年份，桌機 sticky 釘住 */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="font-display text-[clamp(2.6rem,7vw,4.2rem)] font-bold leading-none text-orbit">
            {e.year}
          </p>
          <p className="mt-3 text-sm font-medium tracking-[0.16em] text-ink-3">
            第{CN_NO[e.no - 1]}屆
          </p>
          {e.theme && (
            <p className="mt-4 text-[15px] font-semibold leading-relaxed text-ink md:text-base">
              {e.theme}
            </p>
          )}
          <p className="mt-4 text-[13px] leading-relaxed text-ink-4">
            {e.dateLabel}
            <br />
            {e.venue}
          </p>
        </div>

        {/* 右欄：精選照片 ＋ 重點數字 */}
        <div className="mt-8 md:mt-0">
          {e.heroPhoto ? (
            <figure className="group relative overflow-hidden rounded-card border border-black/8">
              <Image
                src={e.heroPhoto}
                alt={`${e.year} 年第${CN_NO[e.no - 1]}屆台灣新創投資年會現場`}
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 60vw"
                priority={index === 0}
                className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </figure>
          ) : (
            /* 缺照片 → 品牌色漸層＋年份大字，不開天窗 */
            <div
              aria-hidden
              className="grid aspect-[16/9] w-full place-items-center rounded-card border border-black/8 bg-[linear-gradient(135deg,rgb(76_104_212/0.18),rgb(176_68_122/0.14))]"
            >
              <span className="font-display text-[clamp(2.4rem,8vw,4rem)] font-bold text-white/70">
                {e.year}
              </span>
            </div>
          )}

          {e.oneLiner && (
            <p className="mt-6 text-[15px] leading-[1.9] text-ink-2 md:text-base">{e.oneLiner}</p>
          )}

          {g && (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
              <Metric value={g.attendees} unit="人次" label="參與人次" primary />
              <Metric value={g.speakers} unit="位" label="講者數量" primary />
              <Metric value={g.institutions} unit="家" label="投資機構" />
              <Metric value={g.days} unit="天" label="論壇天數" />
            </dl>
          )}

          {/* 待補提示 —— 上線前這些應全部消失 */}
          {isPending && (
            <details className="mt-8 rounded-lg border border-dashed border-black/15 bg-black/[0.02] px-4 py-3">
              <summary className="cursor-pointer text-[13px] font-medium text-ink-3">
                ⚠️ 此屆有 {e.pending!.length} 項資料待補（僅設計階段顯示）
              </summary>
              <ul className="mt-3 space-y-1.5 pl-1">
                {e.pending!.map((item) => (
                  <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-ink-4">
                    <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </article>
  );
}

export function EditionTimeline({ editions }: { editions: Edition[] }) {
  return (
    <div className="relative">
      {editions.map((e, i) => (
        <EditionRow key={e.no} edition={e} index={i} />
      ))}
    </div>
  );
}
