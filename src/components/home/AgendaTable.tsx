import Link from "next/link";
import type { AgendaItem, AgendaSpeaker } from "@/data/agenda";

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

   欄位對應官方版議程表：時間（長度收在時間下方的小字）／演講主題／演講嘉賓。
   0902 內部工作表另有一欄「分段主持人」，曾以 `group.host` 掛在分段標題列右側；
   2026/9 業主提供的官方版（source/1.jpg、2.jpg）沒有這一欄，整組已移除。

   版型分兩套（同 review/PastSpeakerRoster 與 app/sponsor 的做法），兩者吃同一份 items：
   - md 以上：三欄表格。
   - md 以下：逐列卡片。不是「加 overflow-x-auto 讓它橫捲」就好 ——
     320px 螢幕的 .shell 內只剩 280px，三欄攤下來每欄不到 90px，
     「PRO360 達人網（7839）創辦人兼董事長」這種字串會被壓成十幾行。
   ========================================================================== */

/* 原本留白的欄位會印「陸續揭曉，敬請期待」，業主 2026/9 指示整句移除 ——
   空欄就留空，不再用文案去填。三處呼叫點（手機卡的講題、表格的講題跨列格、
   兩種版型共用的嘉賓欄）改成不輸出文字。

   表格的講題欄**仍要輸出一個空的 <td>**：那格帶著 rowSpan、是這一欄的佔位，
   拿掉會讓該列少一欄、後面的嘉賓欄整個位移。

   給機器讀的 llms.txt 不受影響：data/agenda.ts 的 agendaMarkdown() 維持「講者待公布」，
   那份是事實檔，欄位空白必須說出來，不能靜默。 */

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
  // 簡報這一列的嘉賓欄是空的 —— 留空，不猜人也不補文案（業主 2026/9）
  if (list.length === 0) return null;
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
      {/* 這一列原本還會在標題右側印「主持｜某某」。2026/9 依官方版議程表整欄移除
          （source/1.jpg、2.jpg 沒有分段主持人這一欄），分段標題現在只有標題本身。 */}
      <span className="text-[18px] font-bold text-brand-bright">{item.title}</span>
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
            {/* 沒講題就整行不印。原本會印一行淡灰的佔位字撐住卡片，
                業主 2026/9 指示拿掉那句文案 —— 留一個空段落只會多一段空白。 */}
            {item.topic && (
              <p className="mt-2 text-[18px] font-medium leading-relaxed text-ink">{item.topic}</p>
            )}
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
                  /* 沒講題的連續段，合併成一格並放一個破折號。
                     整格全空會讓那一欄看起來像渲染失敗（業主 2026/9 回報「空掉看起來怪怪的」），
                     但也不能放回「陸續揭曉，敬請期待」那句文案 —— 那是同一輪指示要拿掉的。
                     破折號是表格慣例的「此欄無值」記號，不是行銷語句，兩個要求都滿足。
                     aria-hidden：對螢幕閱讀器來說，這一欄沒有內容就該是沉默的，
                     念出一個破折號只是噪音。 */
                  <td rowSpan={tbaSpans[i]} className="px-5 py-4 align-middle">
                    <span aria-hidden className="text-[18px] text-ink-4">
                      —
                    </span>
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
