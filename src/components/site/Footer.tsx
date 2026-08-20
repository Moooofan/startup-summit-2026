import Link from "next/link";
import Image from "next/image";
import { event } from "@/data/event";

const cols = [
  {
    title: "活動",
    links: [
      { href: "/#about", label: "關於年會" },
      { href: "/#speakers", label: "講者陣容" },
      { href: "/#agenda", label: "論壇主題" },
      { href: "/#venue", label: "活動場地" },
    ],
  },
  {
    title: "參與",
    links: [
      { href: "/#tickets", label: "報名資訊" },
      { href: "/sponsor", label: "贊助方案" },
      { href: "/review", label: "歷屆回顧" },
      { href: "/#faq", label: "常見問題" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-soft bg-bg-soft">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:py-20">
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
