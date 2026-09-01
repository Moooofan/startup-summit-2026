"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Edition, PastSpeaker } from "@/data/review";

/**
 * 歷屆講者名單 —— 區塊 3（業主 2026/8 定案）。
 *
 * 「下方分別寫第一屆、第二屆、第三屆，點擊之後往下展開每一屆的議程，
 *   然後有講者的單位和名字。」
 *
 * 因此：屆數當標題列 → 點擊展開 → 表格式列表（講題／講者單位＋姓名），不放時間表。
 *
 * 兩天的屆別（第二、三屆）依 day 分成兩張表，日別寫在表格上方。
 * 原本是把 D1／D2 印在每一列的講題前面 —— 每列重印一次太冗，兩天的分界也看不出來。
 *
 * 同一場多位講者（第三屆的《新創圈的小欣欣之約》Panel 有主持人＋兩位與談人）：
 * 資料是一人一列，但講題欄用 rowSpan 併成一格、垂直置中，右側講者仍逐列分開 ——
 * 否則同一個講題會連續印三次，看起來像三場不同的議程。
 *
 * 版型分兩套：md 以上是雙欄表格（SessionTable），md 以下降級成逐場卡片（SessionCards）——
 * 兩者吃同一份 items，只是斷點互斥。理由見 SessionCards 的註解。
 */

const CN_NO = ["一", "二", "三", "四"] as const;

/** 日別配色：沿用全站「第一天藍／第二天紫」的色碼（同 Speakers.tsx 的 accent 對照表）。
 *  以日序決定，與該日是創辦人場或投資人場無關 —— 各屆的日別性質本來就不一樣。 */
const DAY_TONE = {
  1: "text-orbit-sky",
  2: "text-[#6d47c4]",
} as const;

/** 依 day 把名單切成連續區段。
 *  刻意用「相鄰保序」而非 filter(s => s.day === d)：資料本來就按日別排好，結果相同，
 *  但沒有 day 的列（第一屆是單日場，整份都沒標）不會被濾掉，會自成一組無標題的表。 */
function groupByDay(list: PastSpeaker[]): { day?: 1 | 2; items: PastSpeaker[] }[] {
  const groups: { day?: 1 | 2; items: PastSpeaker[] }[] = [];
  for (const s of list) {
    const last = groups[groups.length - 1];
    if (last && last.day === s.day) last.items.push(s);
    else groups.push({ day: s.day, items: [s] });
  }
  return groups;
}

/** 把相鄰、講題相同的列併成「一場」。Panel 那種一場多位講者的情況資料是一人一列，
 *  版面上要當成同一場處理（表格 rowSpan、卡片同一張、場次計數只算一次）。
 *  講題為 undefined 時不併 —— 那是缺料，不是同一場。 */
function groupByTopic(items: PastSpeaker[]): PastSpeaker[][] {
  const groups: PastSpeaker[][] = [];
  for (const s of items) {
    const last = groups[groups.length - 1];
    if (last && s.topic !== undefined && last[0].topic === s.topic) last.push(s);
    else groups.push([s]);
  }
  return groups;
}

function SpeakerCell({ s }: { s: PastSpeaker }) {
  return (
    <span className="text-ink-2">
      <span className="font-medium text-ink">{s.name}</span>
      <span className="mx-1.5 text-ink-4">·</span>
      {s.org}
      {s.title && <span className="text-ink-4">　{s.title}</span>}
    </span>
  );
}

/** 手機版（< md）：表格降級成逐場卡片。
 *  不是「加個 overflow-x-auto 讓它橫捲」就好：兩欄 46%／54% 加上儲存格 px-4，
 *  在 320px 螢幕（.shell 內只剩 280px）講題欄的實際文字寬只有約 97px —— 一行五個字，
 *  「心元資本：從天使到機構基金…」這種長講題會拉成十幾行，整張表讀不下去。
 *  版型沿用 /sponsor 的「桌機表格 + 手機卡片」同一套做法（見 app/sponsor/page.tsx）。 */
function SessionCards({ items }: { items: PastSpeaker[] }) {
  return (
    <ul className="divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft md:hidden">
      {groupByTopic(items).map((group, gi) => (
        <li key={`${group[0].topic}-${gi}`} className="px-4 py-4">
          <p className="text-[18px] leading-relaxed text-ink">{group[0].topic ?? "（講題待補）"}</p>
          {group.map((s, i) => (
            <p key={i} className="mt-2 text-[17px] leading-relaxed">
              <SpeakerCell s={s} />
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
}

function SessionTable({ items }: { items: PastSpeaker[] }) {
  return (
    <div className="hidden overflow-hidden rounded-card border border-line-soft md:block">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-black/[0.03]">
            <th
              scope="col"
              className="w-[46%] px-4 py-3 text-[17px] font-medium tracking-wide text-ink-4 md:px-5"
            >
              講題
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-[17px] font-medium tracking-wide text-ink-4 md:px-5"
            >
              講者單位與姓名
            </th>
          </tr>
        </thead>
        <tbody>
          {groupByTopic(items).map((group, gi) => (
            <Fragment key={`${group[0].topic}-${gi}`}>
              {group.map((s, i) => (
                <tr
                  key={i}
                  className="border-t border-line-soft align-top transition-colors hover:bg-black/[0.02]"
                >
                  {/* 一場多位講者時，講題只在該場的第一列出現並往下跨列、垂直置中 */}
                  {i === 0 && (
                    <td
                      rowSpan={group.length}
                      className="px-4 py-4 align-middle text-[18px] leading-relaxed text-ink md:px-5"
                    >
                      {s.topic ?? "（講題待補）"}
                    </td>
                  )}
                  <td className="px-4 py-4 text-[18px] leading-relaxed md:px-5">
                    <SpeakerCell s={s} />
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditionPanel({ edition: e }: { edition: Edition }) {
  const [open, setOpen] = useState(false);
  const list = e.pastSpeakers ?? [];
  const panelId = `roster-${e.no}`;
  // 「N 場」算的是場次不是列數 —— 一場多位講者的 Panel 只能算一場
  const sessionCount = groupByTopic(list).length;

  return (
    <div className="border-b border-line-soft">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-ink"
        >
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-lg font-bold text-ink md:text-xl">
              第{CN_NO[e.no - 1]}屆
            </span>
            <span className="font-display text-sm text-ink-4">{e.year}</span>
            {e.theme && <span className="text-[18px] text-ink-3">{e.theme}</span>}
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="text-[17px] text-ink-4">
              {sessionCount > 0 ? `${sessionCount} 場` : "資料整理中"}
            </span>
            <ChevronDown
              size={18}
              aria-hidden
              className={`text-ink-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>
      </h3>

      {open && (
        <div id={panelId} className="space-y-8 pb-8">
          {list.length === 0 ? (
            <p className="rounded-lg border border-dashed border-black/15 bg-black/[0.02] px-4 py-4 text-[18px] text-ink-4">
              這一屆的議程與講者名單尚未取得，資料整理中。
            </p>
          ) : (
            groupByDay(list).map((g, gi) => (
              <div key={gi}>
                {/* 單日場（第一屆）沒有 day → 不掛日別標題，維持單一張表 */}
                {g.day && (
                  <header className="mb-3 flex items-baseline gap-x-4">
                    <h4
                      className={`font-display text-xs font-semibold tracking-[0.2em] ${DAY_TONE[g.day]}`}
                    >
                      DAY {g.day}
                    </h4>
                    <span className="ml-auto text-[17px] text-ink-4">
                      {groupByTopic(g.items).length} 場
                    </span>
                  </header>
                )}
                <SessionCards items={g.items} />
                <SessionTable items={g.items} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function PastSpeakerRoster({ editions }: { editions: Edition[] }) {
  return (
    <div className="mt-10 border-t border-line-soft">
      {editions.map((e) => (
        <EditionPanel key={e.no} edition={e} />
      ))}
    </div>
  );
}
