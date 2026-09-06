import Image from "next/image";
import { event, forums } from "@/data/event";

/* 頁尾的兩欄導覽（活動／參與，共八條連結）2026/9 移除。
   直接原因是它讀起來像壞掉的：PUBLIC_ROUTES 目前只開 / 、/speakers、/review，
   八條裡有六條被 isPublicRoute 濾掉，畫面上只剩「活動：講者陣容」「參與：歷屆回顧」
   兩個各只有一項的欄位（業主回報「最下面這幾個好像怪怪的，不知道要幹嘛的」）。

   注意根因是路由被隱藏、不是這份清單有問題 —— 之後 /about、/agenda、/tickets、
   /sponsor 開放時，把這一段連同 cols 的過濾邏輯從 git 歷史取回即可（此 commit 的父版本）。 */

// 頁尾用短寫法，不吃 event.dateLabelLong：長寫法在 17px 下約 356px，
// 320px 螢幕的內容寬只有 280px，一定會折成兩行（業主要求一行）。短寫法約 257px。
const dateCompact = `${event.year}.${event.dateFrom}（${forums[0].weekday}）— ${event.dateTo}（${forums[1].weekday}）`;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-soft bg-bg-soft">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      {/* 欄數跟著實際渲染的連結組數走 —— 隱藏分頁可能整組被濾掉，
          寫死四欄會在那種情況留下空欄。用 CSS 變數傳值，手機維持單欄堆疊。
          變數版型改掛在 lg: 而非 md:：768px 時四欄各只有約 118–142px，
          但聯絡欄的信箱是不可斷的長字串（≈145px），grid item 預設 min-width:auto
          → 欄位被撐開、整頁多出水平捲軸。平板先走兩欄，桌機才展開成完整欄數。
          同理下面每個 grid 子項都要 min-w-0，否則長字串照樣能撐破欄寬。 */}
      <div
        className="shell grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-(--footer-cols)"
        style={
          {
            // 導覽兩欄移除後只剩品牌欄與聯絡欄。保留自訂變數而不寫死 grid-cols-2：
            // 欄寬比例（品牌較寬、聯絡次之）仍然要，且日後加回欄位只改這一行。
            "--footer-cols": "1.4fr 1.2fr",
          } as React.CSSProperties
        }
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <Image src="/logo-mark-v2.png" alt="" width={472} height={448} className="h-7 w-auto" />
            <span className="text-sm font-bold text-ink">{event.organizer.name}</span>
          </div>
          {/* max-w-xs 只留給 md 以上：手機是單欄堆疊，.shell 給的內容寬是 350px，
              320px 的上限等於自己少用 30px；md 兩欄各 320px 是 no-op，
              lg 的品牌欄約 599px（1.4fr）才真的被這個上限收住。 */}
          <p className="mt-5 text-sm leading-relaxed text-ink-3 md:max-w-xs">
            {/* 中文沒有詞界，預設任何字元邊界都能斷 ——「雙峰論壇」會被拆成「雙峰 ／ 論壇」。
                活動全名與副標各自鎖成整體後，放不下時只會斷在中間的「・」之後。
                只鎖這三段、不整段 nowrap：nowrap 撐不下時會溢出而非斷行，footer 的
                overflow-hidden 會把字裁掉。三段在 320px（內容寬 280px）都放得下。 */}
            <span className="whitespace-nowrap">{event.fullName}</span>・
            <span className="whitespace-nowrap">{event.subtitle}</span>
            <br />
            <span className="whitespace-nowrap">{dateCompact}</span>
          </p>
          <p className="font-display mt-4 text-balance text-xs tracking-[0.16em] text-ink-4">
            {event.nameEn.toUpperCase()}
          </p>
        </div>


        <div className="min-w-0">
          <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-4">聯絡</h2>
          <ul className="mt-5 space-y-3 text-sm text-ink-2">
            <li>
              {/* break-words：信箱是唯一不可自然斷行的長字串，欄位變窄時要能斷 */}
              <a
                href={`mailto:${event.contact.email}`}
                className="break-words transition-colors hover:text-ink"
              >
                {event.contact.email}
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/groups/1169347120648777/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                台灣新創投資社團
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-soft">
        <div className="shell flex flex-col gap-3 py-6 text-xs text-ink-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {event.year} {event.organizer.name}. All rights reserved.</p>
          <p>主辦人：{event.organizer.host}｜{event.organizer.hostTitle}</p>
        </div>
      </div>
    </footer>
  );
}
