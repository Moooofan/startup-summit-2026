import Link from "next/link";
import type { AgendaItem, AgendaSpeaker } from "@/data/agenda";

/** 日別色調：Day 1 藍 / Day 2 紫，全站一致。
 *  原本住在 TrackCards.tsx，2026/9 主題軌整組移除後搬到這裡（色值未動），
 *  由議程表與 /agenda 的日別節點共用。 */
export const dayTone = {
  sky: {
    text: "text-orbit-sky",
    badge: "bg-orbit-sky/15 text-orbit-sky",
    glow: "rgb(47 127 176 / 0.12)",
    line: "via-orbit-sky/60",
  },
  violet: {
    text: "text-[#6d47c4]",
    badge: "bg-[#6d47c4]/15 text-[#6d47c4]",
    glow: "rgb(109 71 196 / 0.12)",
    line: "via-[#6d47c4]/60",
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
   - md 以下：逐列卡片。⚠️ 不是「加 overflow-x-auto 讓它橫捲」就好 ——
     320px 螢幕的 .shell 內只剩 280px，三欄攤下來每欄不到 90px，
     「PRO360 達人網（7839）創辦人兼董事長」這種字串會被壓成十幾行。
   ========================================================================== */

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
          ⚠️ 冒號後面那個半形空格是必要的，不是可有可無的排版空白 ——
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
  // 簡報這一列的嘉賓欄是空的 —— 據實寫「待公布」，不猜人
  if (list.length === 0) return <p className="text-[17px] text-ink-4">講者待公布</p>;
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
      {/* ⚠️ 分段標題刻意**不**吃日別色調（業主 2026/9：兩天議程要同一個格式）——
          接回 tone.text 的話 Day 2 會變成紫色，兩天的表看起來就不一樣了。
          區分兩天是上方「Day 1／Day 2」標籤的職責，不是議程內容的。
          用品牌靛藍而非任一日別色：與這一列的藍霧底 rgb(76 104 212 / 0.06) 同色系但更深，
          且刻意避開 Day 1 的 #2f7fb0 與 Day 2 的 #6d47c4，免得看起來還在標日別。 */}
      <span className="text-[18px] font-bold text-brand">{item.title}</span>
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
            <li key={i} className="bg-black/[0.03] px-4 py-3">
              <GroupHead item={item} />
            </li>
          );
        }
        if (item.type === "break") {
          return (
            <li key={i} className="flex flex-wrap items-baseline gap-x-3 bg-black/[0.02] px-4 py-3">
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

/** md 以上：三欄表格 */
function AgendaGrid({ items }: { items: AgendaItem[] }) {
  return (
    <div className="mt-8 hidden overflow-hidden rounded-card border border-line-soft md:block">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-black/[0.03]">
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
                <tr key={i} className="border-t border-line-soft bg-[rgb(76_104_212/0.06)]">
                  <td colSpan={3} className="px-5 py-3">
                    <GroupHead item={item} />
                  </td>
                </tr>
              );
            }
            if (item.type === "break") {
              return (
                <tr key={i} className="border-t border-line-soft bg-black/[0.02]">
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
                className="border-t border-line-soft align-top transition-colors hover:bg-black/[0.02]"
              >
                <td className="px-5 py-4">
                  <Time time={item.time} duration={item.duration} />
                </td>
                <td className="px-5 py-4 text-[18px] leading-relaxed text-ink">{item.topic}</td>
                <td className="px-5 py-4">
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
