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

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-soft bg-bg-soft">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      {/* 欄數跟著實際渲染的連結組數走 —— 隱藏分頁可能整組被濾掉，
          寫死四欄會在那種情況留下空欄。用 CSS 變數傳值，
          真正的 grid-template-columns 仍掛在 md: 斷點上，手機維持單欄堆疊。 */}
      <div
        className="shell grid gap-12 py-16 md:grid-cols-(--footer-cols) md:py-20"
        style={
          {
            "--footer-cols": `1.4fr ${cols.map(() => "1fr").join(" ")} 1.2fr`,
          } as React.CSSProperties
        }
      >
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo-mark.png" alt="" width={236} height={224} className="h-7 w-auto" />
            <span className="text-sm font-bold text-ink">{event.organizer.name}</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-3">
            {event.fullName}・{event.subtitle}
            <br />
            {event.dateLabelLong}
          </p>
          <p className="font-display mt-4 text-xs tracking-[0.16em] text-ink-4">
            {event.nameEn.toUpperCase()}
          </p>
        </div>

        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title}>
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

        <div>
          <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-4">聯絡</h2>
          <ul className="mt-5 space-y-3 text-sm text-ink-2">
            <li>
              <a href={`mailto:${event.contact.email}`} className="transition-colors hover:text-ink">
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
