import { event } from "@/data/event";

/**
 * 團報優惠對照表 —— 首頁票卡下方與 /tickets 票種頁共用（業主 2026/9 定案的四段級距）。
 *
 * 為什麼不塞進票卡內部：首頁手機版票卡是 SwipeDeck 牌堆，卡寬 76vw ——
 * 320px 螢幕扣掉卡片 p-6 後內容區只剩 195px，四段價目擠不進去。
 * 拆成卡片下方的獨立對照表，兩種版型都不必為它讓位。
 *
 * 版型分兩套（同 review/PastSpeakerRoster 與 app/sponsor 的做法），兩者吃同一份
 * groupTiers、斷點互斥：
 * - md 以上：人數當「欄」的 5 欄橫表，兩列分別是早鳥票／一般票。
 * - md 以下：轉置成人數當「列」的 3 欄表。
 *   不是「加 overflow-x-auto 讓它橫捲」就好：5 欄在 320px 螢幕（.shell 內只剩 280px）
 *   每欄約 56px，而「2,500」這種四位數加千分位在 17px 字級下就要 40px 上下、幾乎貼死欄寬。
 *   轉置後 3 欄各約 93px 才讀得完，也不必要求使用者橫向拖曳。
 */

const rows = [
  { key: "early", label: "早鳥票", price: (t: (typeof event.tickets.groupTiers)[number]) => t.earlyBird },
  { key: "full", label: "一般票", price: (t: (typeof event.tickets.groupTiers)[number]) => t.full },
] as const;

export function TicketGroupTable() {
  const tiers = event.tickets.groupTiers;

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[18px] font-medium text-ink">團報優惠</h3>
        <p className="text-[17px] text-ink-4">
          {event.tickets.currency}／人・人數越多單價越低
        </p>
      </div>

      {/* md 以上：人數當欄 */}
      <div className="mt-4 hidden overflow-hidden rounded-card border border-line-soft md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-black/[0.03]">
              <th scope="col" className="px-5 py-3 text-[17px] font-medium tracking-wide text-ink-4">
                票種
              </th>
              {tiers.map((t) => (
                <th
                  key={t.people}
                  scope="col"
                  className="px-5 py-3 text-right text-[17px] font-medium tracking-wide text-ink-4"
                >
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-line-soft">
                <th scope="row" className="px-5 py-4 text-[18px] font-medium text-ink">
                  {r.label}
                </th>
                {tiers.map((t) => (
                  <td
                    key={t.people}
                    className="font-display px-5 py-4 text-right text-[18px] tabular-nums text-ink-2"
                  >
                    {r.price(t).toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* md 以下：轉置，人數當列 */}
      <div className="mt-4 overflow-hidden rounded-card border border-line-soft md:hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-black/[0.03]">
              <th scope="col" className="px-4 py-3 text-[17px] font-medium tracking-wide text-ink-4">
                人數
              </th>
              {rows.map((r) => (
                <th
                  key={r.key}
                  scope="col"
                  className="px-4 py-3 text-right text-[17px] font-medium tracking-wide text-ink-4"
                >
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.people} className="border-t border-line-soft">
                <th scope="row" className="px-4 py-3.5 text-[18px] font-medium text-ink">
                  {t.label}
                </th>
                {rows.map((r) => (
                  <td
                    key={r.key}
                    className="font-display px-4 py-3.5 text-right text-[18px] tabular-nums text-ink-2"
                  >
                    {r.price(t).toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
