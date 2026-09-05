import { Fragment } from "react";
import { forums } from "@/data/event";
import { agendaByDay, talkCount } from "@/data/agenda";
import { Reveal } from "@/components/ui/Reveal";
import { AgendaTable, dayTone } from "@/components/home/AgendaTable";
import { cn } from "@/lib/utils";

/**
 * 首頁議程 —— 接在 About 的兩張論壇卡下方（業主 2026/9：「day1 day2 兩個字卡下要放今年的議程」，
 * 後續追加「議程用表格式」）。
 *
 * 資料是 data/agenda.ts 的逐時段議程，來源為《…講者名單與議程0817.pptx》投影片 15–18。
 * 早期版本曾用 data/tracks.ts 的十二條「主題軌」卡片代替，
 * 業主 2026/9 指示議程一律用表格，主題軌連同資料檔已從全站移除。
 */
export function HomeAgenda() {
  return (
    <div id="agenda" className="mt-20 md:mt-24">
      {forums.map((f) => {
        const items = agendaByDay(f.key);
        const tone = dayTone[f.accent];
        return (
          <Fragment key={f.key}>
            <Reveal>
              {/* 標題列與 /agenda 課程格的那一列同構（含手機折行元素），視覺才連得起來 */}
              <header className="mt-16 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-line-soft pb-5 md:mt-20">
                <span
                  className={cn("font-display text-sm font-semibold tracking-[0.2em]", tone.text)}
                >
                  {f.label}
                </span>
                <h3 className="text-2xl font-bold text-ink md:text-3xl">{f.name}</h3>
                {/* 手機強制折行：basis-full 讓這個 0 高度的元素獨佔一行，後面的項目一定落到第二行。
                    這一列固有寬約 584px，手機可用寬最多 350px —— 放著自己 wrap 折點會隨文案飄，
                    ml-auto 想把場次數推到右端的意圖也會散掉。完整說明見 Speakers.tsx 的同一列。 */}
                <span aria-hidden className="basis-full sm:hidden" />
                <span className="font-display text-base text-ink-3">
                  {f.dateLabel}（{f.weekday}）　{f.time}
                </span>
                <span className="ml-auto text-sm text-ink-4">{talkCount(items)} 場</span>
              </header>
            </Reveal>

            <AgendaTable items={items} />
          </Fragment>
        );
      })}
    </div>
  );
}
