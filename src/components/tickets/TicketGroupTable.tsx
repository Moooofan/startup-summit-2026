import { Fragment } from "react";
import { event, forums } from "@/data/event";

/**
 * 票價明細 —— 首頁票卡下方與 /tickets 票種頁共用（業主 2026/9 定案的四段級距）。
 *
 * 職責在 2026/9/8 擴大了：除了團報對照表，末尾另掛一個「個人贊助票」區塊。
 * 那張票刻意**不**放進表格裡 —— 表格標題是「團報優惠」而它不是團報，
 * 它也不分早鳥／正常、沒有人數級距，塞進去只能靠 colSpan 硬湊。
 * 業主給的票價總覽本身也是把它獨立成第三張表。
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

type Tier = (typeof event.tickets.groupTiers)[number];

const rows = [
  { key: "early", label: "早鳥票", price: (t: Tier) => t.earlyBird },
  { key: "full", label: "一般票", price: (t: Tier) => t.full },
] as const;

/**
 * 把相鄰、同名的級距併成一組。
 *
 * 5 人與 10 人共用「新創機構／天使會團體套票」這個名字（見 event.ts 的 groupTiers）。
 * 同一個 12 字的長名在相鄰兩欄各印一次，欄寬只剩約 167px —— 中文沒有詞界，
 * 瀏覽器就斷在「團體｜套票」中間，還把孤兒「套票」推成第二行（業主 2026/9 回報）。
 * 併成一組後名稱橫跨兩欄（約 334px）只印一次，一行就放得下，不必去猜折行點。
 *
 * 用「相鄰保序」而非 groupBy，理由同 review/PastSpeakerRoster 的 groupByDay()：
 * 資料本來就照人數排好，保序才不會把級距順序打亂。
 */
function groupByName(list: readonly Tier[]): { name: string; tiers: Tier[] }[] {
  const groups: { name: string; tiers: Tier[] }[] = [];
  for (const t of list) {
    const last = groups[groups.length - 1];
    if (last && last.name === t.name) last.tiers.push(t);
    else groups.push({ name: t.name, tiers: [t] });
  }
  return groups;
}

export function TicketGroupTable() {
  const tiers = event.tickets.groupTiers;
  const groups = groupByName(tiers);

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[18px] font-medium text-ink">團報優惠</h3>
        <p className="text-[17px] text-ink-4">
          {event.tickets.currency}／人
        </p>
      </div>

      {/* md 以上：人數當欄 */}
      {/* 表格也要實底 —— 原本整張表透明，KV 的線與青帶會穿到數字後面
          （業主回報「這邊底圖也是，字被主視覺吃掉」）。值與票卡同步。 */}
      <div className="mt-4 hidden overflow-hidden rounded-card border border-line-soft card-solid md:block">
        <table className="w-full border-collapse text-left">
          {/* 表頭兩列：票種名一列（同名級距併欄，見 groupByName）、人數一列。
              兩列都要帶底色，表頭才是連續的一塊（border-collapse 下不會有縫）。 */}
          <thead>
            <tr className="bg-white/[0.025]">
              <th
                rowSpan={2}
                scope="col"
                className="px-5 py-3 align-bottom text-[17px] font-medium tracking-wide text-ink-4"
              >
                票種
              </th>
              {groups.map((g) => (
                <th
                  key={g.name}
                  colSpan={g.tiers.length}
                  scope="colgroup"
                  className="px-5 pt-3 text-center text-[17px] font-medium tracking-wide text-ink-3"
                >
                  {g.name}
                </th>
              ))}
            </tr>
            <tr className="bg-white/[0.025]">
              {tiers.map((t) => (
                <th
                  key={t.people}
                  scope="col"
                  className="px-5 pb-3 pt-0.5 text-center text-[16px] font-medium tracking-wide text-ink-4"
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
                {/* 置中的前提是「所有價目同寬」：目前八個值都是四位數加千分位（2,500／1,600），
                    配 tabular-nums 每一位仍然上下對齊。若日後出現三位數或五位數的價目，
                    要改回 text-right，否則數字會參差。 */}
                {tiers.map((t) => (
                  <td
                    key={t.people}
                    className="font-display px-5 py-4 text-center text-[18px] tabular-nums text-ink-2"
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
      <div className="mt-4 overflow-hidden rounded-card border border-line-soft card-solid md:hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            {/* 兩個價格欄用 w-[1%] + whitespace-nowrap 縮到內容寬，剩下的寬度全部讓給列首。
                320px 螢幕可用 280px，價格欄各約 78px，列首因此拿得到約 120px。
                長票種名不靠這一欄裝下 —— 它由下方橫跨整列的組標題承擔（見 tbody）。 */}
            <tr className="bg-white/[0.025]">
              <th scope="col" className="px-4 py-3 text-[17px] font-medium tracking-wide text-ink-4">
                票種
              </th>
              {rows.map((r) => (
                <th
                  key={r.key}
                  scope="col"
                  className="w-[1%] whitespace-nowrap px-3 py-3 text-right text-[17px] font-medium tracking-wide text-ink-4"
                >
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g.name}>
                {/* 多級距的組（目前只有團體套票）用一列橫跨整列的組標題承載長票名 ——
                    整列約 280px，12 個字一行放得下，列首就不必再擠。做法同 AgendaTable 的分段標題列。
                    單級距的組不輸出這一列：「單人票」自己一列、再一列「1 人」讀起來很蠢，
                    而那兩個名字只有三個字，直接內嵌在列首就好。 */}
                {g.tiers.length > 1 && (
                  <tr className="border-t border-line-soft bg-white/[0.018]">
                    <th
                      colSpan={1 + rows.length}
                      scope="colgroup"
                      className="px-4 py-2.5 text-left text-[17px] font-normal text-ink-3"
                    >
                      {g.name}
                    </th>
                  </tr>
                )}
                {g.tiers.map((t) => (
                  <tr key={t.people} className="border-t border-line-soft">
                    <th
                      scope="row"
                      className="px-4 py-3.5 align-middle text-[18px] font-medium text-ink"
                    >
                      {g.tiers.length > 1 ? (
                        t.label
                      ) : (
                        <>
                          <span className="block text-[17px] font-normal leading-snug text-ink-3">
                            {t.name}
                          </span>
                          <span className="mt-0.5 block">{t.label}</span>
                        </>
                      )}
                    </th>
                    {rows.map((r) => (
                      <td
                        key={r.key}
                        className="font-display w-[1%] whitespace-nowrap px-3 py-3.5 text-right align-middle text-[18px] tabular-nums text-ink-2"
                      >
                        {r.price(t).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 個人贊助票。獨立於上面兩張表之外，理由見檔頭。
          兩日說明由 forums 組出：站上論壇名只有 forums[].name 一個出處，
          票價總覽上的「創業者論壇／投資者論壇」是另一套講法，不要引進來。 */}
      <div className="card-solid mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 rounded-card border border-line-soft px-4 py-4 md:px-5">
        <div>
          <p className="text-[18px] font-medium text-ink">{event.tickets.sponsorTicket.name}</p>
          <p className="mt-1 text-[17px] text-ink-4">
            {forums.map((f) => `${f.dateLabel.replace(/ /g, "")} ${f.name}`).join(" & ")}　兩日皆可入場
          </p>
        </div>
        <p className="font-display text-[18px] tabular-nums text-ink-2">
          {event.tickets.currency}
          {event.tickets.sponsorTicket.price.toLocaleString()}
          <span className="ml-1 text-[17px] text-ink-4">／張</span>
        </p>
      </div>
    </div>
  );
}
