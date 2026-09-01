import Link from "next/link";
import { isPublicRoute } from "@/lib/config";
import Image from "next/image";
import { event } from "@/data/event";

// 隱藏中的分頁保留在清單裡不刪，僅由 isPublicRoute 過濾掉（見 lib/config）
const allCols = [
  {
    title: "活動",
    links: [
      { href: "/about", label: "關於年會" },
      { href: "/speakers", label: "講者陣容" },
      { href: "/agenda", label: "論壇主題" },
      { href: "/about#venue", label: "活動場地" },
    ],
  },
  {
    title: "參與",
    links: [
      { href: "/tickets", label: "報名資訊" },
      { href: "/sponsor", label: "贊助方案" },
      { href: "/review", label: "歷屆回顧" },
      { href: "/about#faq", label: "常見問題" },
    ],
  },
];

// 逐組過濾掉隱藏分頁；整組都被濾光就不渲染該欄
const cols = allCols
  .map((c) => ({ ...c, links: c.links.filter((l) => isPublicRoute(l.href)) }))
  .filter((c) => c.links.length > 0);

// event.dateLabelLong 是「起 — 迄」的長日期，字串裡的半形空格讓瀏覽器可以斷在
// 「10 月 15」和「日（四）」中間 —— 日期被腰斬。拆成破折號前後兩半、各自鎖成不可斷的整體，
// 要斷就只能斷在破折號後面。相依於 dateLabelLong 內含「—」；event.ts 改格式時這裡要跟著改。
const [dateFrom, dateTo] = event.dateLabelLong.split("—");

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
            "--footer-cols": `1.4fr ${cols.map(() => "1fr").join(" ")} 1.2fr`,
          } as React.CSSProperties
        }
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <Image src="/logo-mark.png" alt="" width={236} height={224} className="h-7 w-auto" />
            <span className="text-sm font-bold text-ink">{event.organizer.name}</span>
          </div>
          {/* max-w-xs 只留給 md 以上：手機是單欄堆疊，.shell 給的內容寬是 350px，
              320px 的上限等於自己少用 30px；md（兩欄各 320px）與 lg（1.4fr 約 309px）
              欄寬本來就 ≤320px，那兩檔的上限是 no-op，視覺不受影響。 */}
          <p className="mt-5 text-sm leading-relaxed text-ink-3 md:max-w-xs">
            {/* 中文沒有詞界，預設任何字元邊界都能斷 ——「雙峰論壇」會被拆成「雙峰 ／ 論壇」。
                活動全名與副標各自鎖成整體後，放不下時只會斷在中間的「・」之後。
                只鎖這四段、不整段 nowrap：nowrap 撐不下時會溢出而非斷行，footer 的
                overflow-hidden 會把字裁掉。這四段在 320px（內容寬 280px）都放得下。 */}
            <span className="whitespace-nowrap">{event.fullName}</span>・
            <span className="whitespace-nowrap">{event.subtitle}</span>
            <br />
            <span className="whitespace-nowrap">{dateFrom.trimEnd()}—</span>{" "}
            <span className="whitespace-nowrap">{dateTo.trim()}</span>
          </p>
          <p className="font-display mt-4 text-balance text-xs tracking-[0.16em] text-ink-4">
            {event.nameEn.toUpperCase()}
          </p>
        </div>

        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title} className="min-w-0">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-4">{col.title}</h2>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

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
