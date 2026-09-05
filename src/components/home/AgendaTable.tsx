import Link from "next/link";
import type { AgendaItem, AgendaSpeaker } from "@/data/agenda";
import { cn } from "@/lib/utils";

/** 日別色調：Day 1 藍 / Day 2 紫，全站一致。
 *  原本住在 TrackCards.tsx，2026/9 主題軌整組移除後搬到這裡，
 *  由議程表與 /agenda 的日別節點共用。
 *  2026/9 深色改版：色值改讀 token（orbit-sky / day2），不再寫死 ——
 *  舊的 #6d47c4 沒有任何 token，散在六個檔案共 13 處，是全站最嚴重的色值重複。 */
export const dayTone = {
  sky: {
    text: "text-orbit-sky",
    badge: "bg-orbit-sky/15 text-orbit-sky",
    glow: "rgb(77 159 240 / 0.16)",
    line: "via-orbit-sky/60",
  },
  violet: {
    text: "text-day2",
    badge: "bg-day2/15 text-day2",
    glow: "rgb(151 126 242 / 0.16)",
    line: "via-day2/60",
  },
} as const;

export type DayTone = (typeof dayTone)[keyof typeof dayTone];

/* ==========================================================================
   逐時段議程表 —— 業主 2026/9：「議程用表格式」。

   欄位對應簡報原表：時間（長度收在時間下方的小字）／演講主題／演講嘉賓。
   原表還有一欄「分段主持人」，那一欄在原表是跨列合併的 —— 攤平成每一列重印一次會很冗，
   所以改掛在該段的分段標題列上（`group.host`），語意一樣、視覺乾淨。

   版型分兩套（同 review/PastSpeakerRoster 與 app/sponsor 的做法），兩者吃同一份 items：
   - md 以上：三欄表格。
   - md 以下：逐列卡片。不是「加 overflow-x-auto 讓它橫捲」就好 ——
     320px 螢幕的 .shell 內只剩 280px，三欄攤下來每欄不到 90px，
     「PRO360 達人網（7839）創辦人兼董事長」這種字串會被壓成十幾行。
   ========================================================================== */

/** 簡報該欄留白時的對外說法（業主 2026/9 指定）。空欄不是版面 bug，是還沒公布。
 *  data/agenda.ts 的 agendaMarkdown()（llms.txt 用）刻意維持「講者待公布」：
 *  那份是給機器讀的事實檔，精確比行銷語氣重要。兩邊用詞不同是刻意的，不是漏改。 */
const TBA = "陸續揭曉，敬請期待";

/** 一位講者：對得上 speakers.ts 的連內頁，其餘純文字（見 data/agenda.ts 的 slug 說明）。 */
function SpeakerLine({ s }: { s: AgendaSpeaker }) {
  const body = (
    <>
      <span className="font-medium text-ink">{s.name}</span>
      {s.org && (
        <>
          <span className="mx-1.5 text-ink-4">/</span>
          <span className="text-ink-2">{s.org}</span>
        </>
      )}
    </>
  );
  return (
    <p className="text-[17px] leading-relaxed">
      {/* 寫法與簡報原表一致：「Moderator: 沈立平 / 益鼎創投副總經理」。
          冒號後面那個半形空格是必要的，不是可有可無的排版空白 ——
          早先只用 mr-1.5（6px）當間距、沒有冒號，灰色拉丁字緊貼粗體中文名，
          讀起來像連在一起的一個詞（「Moderator沈立平」）。用字串常值寫死，
          避免日後有人整理 JSX 縮排時把行尾空格吃掉。 */}
      {s.moderator && <span className="text-ink-4">{"Moderator: "}</span>}
      {s.slug ? (
        <Link
          href={`/speakers/${s.slug}`}
          className="underline-offset-4 transition-colors hover:text-brand-lift hover:underline"
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </p>
  );
}

function Speakers({ list }: { list: AgendaSpeaker[] }) {
  // 簡報這一列的嘉賓欄是空的 —— 據實說還沒公布，不猜人
  if (list.length === 0) return <p className="text-[17px] text-ink-4">{TBA}</p>;
  return (
    <div className="space-y-1.5">
      {list.map((s, i) => (
        <SpeakerLine key={`${s.name}-${i}`} s={s} />
      ))}
    </div>
  );
}

function Time({ time, duration }: { time?: string; duration?: string }) {
  return (
    <>
      <span className="font-display block whitespace-nowrap tabular-nums text-[17px] text-ink">
        {time ?? "時間待定"}
      </span>
      {duration && <span className="mt-0.5 block text-[16px] text-ink-4">{duration}</span>}
    </>
  );
}

function GroupHead({ item }: { item: Extract<AgendaItem, { type: "group" }> }) {
  return (
    <>
      {/* 分段標題刻意**不**吃日別色調（業主 2026/9：兩天議程要同一個格式）——
          接回 tone.text 的話 Day 2 會變成紫色，兩天的表看起來就不一樣了。
          區分兩天是上方「Day 1／Day 2」標籤的職責，不是議程內容的。
          用品牌藍而非任一日別色：與這一列的藍霧底同色系，且刻意避開 Day 1 的 orbit-sky
          與 Day 2 的 day2，免得看起來還在標日別。
          深色版用 brand-bright 而非 brand：brand 是給大面積色塊當底的深藍，
          對頁底只有 1.63:1，拿來當文字會直接看不見。 */}
      <span className="text-[18px] font-bold text-brand-bright">{item.title}</span>
      {item.host && (
        <span className="mt-1 block text-[16px] text-ink-4 sm:mt-0 sm:ml-3 sm:inline">
          主持｜{item.host}
        </span>
      )}
    </>
  );
}

/** md 以下：逐列卡片 */
function AgendaCards({ items }: { items: AgendaItem[] }) {
  return (
    <ul className="mt-8 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft md:hidden">
      {items.map((item, i) => {
        if (item.type === "group") {
          return (
            <li key={i} className="bg-white/[0.025] px-4 py-3">
              <GroupHead item={item} />
            </li>
          );
        }
        if (item.type === "break") {
          return (
            <li key={i} className="flex flex-wrap items-baseline gap-x-3 bg-white/[0.018] px-4 py-3">
              {item.time && (
                <span className="font-display tabular-nums text-[16px] text-ink-4">
                  {item.time}
                </span>
              )}
              <span className="text-[17px] text-ink-3">{item.label}</span>
            </li>
          );
        }
        return (
          <li key={i} className="px-4 py-4">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-display tabular-nums text-[17px] text-ink">
                {item.time ?? "時間待定"}
              </span>
              {item.duration && <span className="text-[16px] text-ink-4">{item.duration}</span>}
            </p>
            {/* 一律渲染：沒講題時不能整行消失，而是換成淡灰的佔位字，
                否則卡片看起來像少了一塊。真講題才加粗加深，兩者一眼分得出來。 */}
            <p
              className={cn(
                "mt-2 text-[18px] leading-relaxed",
                item.topic ? "font-medium text-ink" : "text-ink-4"
              )}
            >
              {item.topic ?? TBA}
            </p>
            <div className="mt-2">
              <Speakers list={item.speakers} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** 連續多列都沒有講題時，把佔位字併成一格，別讓同一句話在同一欄裡重複印。
 *  回傳與 items 等長的陣列：大於 0 = 由這一列輸出 <td rowSpan>，0 = 這一列不輸出主題欄。
 *
 *  分段標題列與休息列會中斷連續段 —— 它們用 colSpan 佔掉了主題欄，rowSpan 跨不過去。
 *  做法與 review/PastSpeakerRoster 的 groupByTopic() 同一套。 */
function tbaRowSpans(items: AgendaItem[]): number[] {
  const spans = new Array<number>(items.length).fill(0);
  let i = 0;
  while (i < items.length) {
    const it = items[i];
    if (it.type !== "talk" || it.topic) {
      i += 1;
      continue;
    }
    let j = i + 1;
    while (j < items.length) {
      const next = items[j];
      if (next.type !== "talk" || next.topic) break;
      j += 1;
    }
    spans[i] = j - i;
    i = j;
  }
  return spans;
}

/** md 以上：三欄表格 */
function AgendaGrid({ items }: { items: AgendaItem[] }) {
  const tbaSpans = tbaRowSpans(items);

  return (
    <div className="mt-8 hidden overflow-hidden rounded-card border border-line-soft md:block">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-white/[0.025]">
            <th
              scope="col"
              className="w-[14%] px-5 py-3 text-[17px] font-medium tracking-wide text-ink-4"
            >
              時間
            </th>
            <th
              scope="col"
              className="w-[30%] px-5 py-3 text-[17px] font-medium tracking-wide text-ink-4"
            >
              演講主題
            </th>
            <th
              scope="col"
              className="px-5 py-3 text-[17px] font-medium tracking-wide text-ink-4"
            >
              演講嘉賓
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            if (item.type === "group") {
              return (
                <tr key={i} className="border-t border-line-soft bg-[rgb(95_137_255/0.1)]">
                  <td colSpan={3} className="px-5 py-3">
                    <GroupHead item={item} />
                  </td>
                </tr>
              );
            }
            if (item.type === "break") {
              return (
                <tr key={i} className="border-t border-line-soft bg-white/[0.018]">
                  <td className="px-5 py-3 align-top">
                    <Time time={item.time} duration={item.duration} />
                  </td>
                  <td colSpan={2} className="px-5 py-3 text-[17px] text-ink-3">
                    {item.label}
                  </td>
                </tr>
              );
            }
            return (
              <tr
                key={i}
                className="border-t border-line-soft align-top transition-colors hover:bg-white/[0.035]"
              >
                <td className="px-5 py-4">
                  <Time time={item.time} duration={item.duration} />
                </td>
                {/* 沒講題時只由連續段的第一列輸出一個跨列的格，其餘各列不輸出本欄。
                    講題／佔位字／嘉賓三格一律 align-middle（業主 2026/9）——
                    <tr> 的 align-top 因此只剩時間欄在吃，那是刻意的：時間是這一列的錨點，
                    四人 Panel 那種高列要讓時間釘在頂端、講題與講者落在中間。 */}
                {item.topic ? (
                  <td className="px-5 py-4 align-middle text-[18px] leading-relaxed text-ink">
                    {item.topic}
                  </td>
                ) : tbaSpans[i] > 0 ? (
                  <td
                    rowSpan={tbaSpans[i]}
                    className="px-5 py-4 align-middle text-[18px] leading-relaxed text-ink-4"
                  >
                    {TBA}
                  </td>
                ) : null}
                <td className="px-5 py-4 align-middle">
                  <Speakers list={item.speakers} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AgendaTable({ items }: { items: AgendaItem[] }) {
  return (
    <>
      <AgendaCards items={items} />
      <AgendaGrid items={items} />
    </>
  );
}
