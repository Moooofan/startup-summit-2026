"use client";

import { useState } from "react";
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
 * 第三屆的講者欄位是簡報原文整串（「Kdan凱鈿創辦人兼執行長蘇柏州」），
 * 無法安全自動拆解 → name 為空字串時直接顯示 org 原文，待業主校對後再拆。
 */

const CN_NO = ["一", "二", "三", "四"] as const;

function SpeakerCell({ s }: { s: PastSpeaker }) {
  // name 為空 = 尚未拆解的簡報原文，整串顯示
  if (!s.name) return <span className="text-ink-2">{s.org}</span>;
  return (
    <span className="text-ink-2">
      <span className="font-medium text-ink">{s.name}</span>
      <span className="mx-1.5 text-ink-4">·</span>
      {s.org}
      {s.title && <span className="text-ink-4">　{s.title}</span>}
    </span>
  );
}

function EditionPanel({ edition: e }: { edition: Edition }) {
  const [open, setOpen] = useState(false);
  const list = e.pastSpeakers ?? [];
  const panelId = `roster-${e.no}`;

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
            {e.theme && <span className="text-[15px] text-ink-3">{e.theme}</span>}
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="text-[13px] text-ink-4">
              {list.length > 0 ? `${list.length} 場` : "資料整理中"}
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
        <div id={panelId} className="pb-8">
          {list.length === 0 ? (
            <p className="rounded-lg border border-dashed border-black/15 bg-black/[0.02] px-4 py-4 text-[14px] text-ink-4">
              這一屆的議程與講者名單尚未取得，資料整理中。
            </p>
          ) : (
            <div className="overflow-hidden rounded-card border border-line-soft">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-black/[0.03]">
                    <th
                      scope="col"
                      className="w-[46%] px-4 py-3 text-[12px] font-medium tracking-wide text-ink-4 md:px-5"
                    >
                      講題
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-[12px] font-medium tracking-wide text-ink-4 md:px-5"
                    >
                      講者單位與姓名
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((s, i) => (
                    <tr
                      key={`${s.topic}-${i}`}
                      className="border-t border-line-soft align-top transition-colors hover:bg-black/[0.02]"
                    >
                      <td className="px-4 py-4 text-[14px] leading-relaxed text-ink md:px-5">
                        {s.day && (
                          <span className="font-display mr-2 text-[11px] text-ink-4">
                            D{s.day}
                          </span>
                        )}
                        {s.topic ?? "（講題待補）"}
                      </td>
                      <td className="px-4 py-4 text-[14px] leading-relaxed md:px-5">
                        <SpeakerCell s={s} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
