import { Check, Info } from "lucide-react";
import { event, forums } from "@/data/event";
import { REGISTER_URL, REGISTER_READY } from "@/lib/config";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";

const included = [
  "兩日論壇全場次入場",
  "現場茶敘與交流時段",
  "品牌攤位區自由參觀",
  "活動紀念手冊",
];

export function Tickets() {
  const plans = [
    {
      key: "early",
      name: "早鳥票",
      nameEn: "Early Bird",
      price: event.tickets.earlyBird,
      original: event.tickets.full,
      note: event.tickets.note,
      featured: true,
    },
    {
      key: "full",
      name: "全天票",
      nameEn: "Full Pass",
      price: event.tickets.full,
      original: null,
      note: "報名開放期間皆可購買",
      featured: false,
    },
  ];

  return (
    <section
      id="tickets"
      className="grain relative flex min-h-[100svh] snap-start items-center overflow-hidden bg-bg-soft pb-16 pt-24 [scroll-margin-top:-88px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-0 h-[40vw] max-h-[540px] w-[40vw] max-w-[540px] rounded-full bg-[radial-gradient(circle,rgb(106_134_255/0.18)_0%,transparent_65%)]"
      />
      <div className="shell relative w-full">
        <Reveal>
          <SectionHead
            eyebrow="REGISTRATION"
            ghost="TICKETS"
            ghostClassName="top-0"
            align="center"
            title="報名資訊"
            lead={`${event.dateLabelLong}，${event.timeLabel}。兩日論壇於同一場地舉行。`}
          />
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {plans.map((p, i) => (
            <Reveal key={p.key} delay={0.08 + i * 0.08}>
              <div
                className={`relative h-full overflow-hidden rounded-card p-8 ${
                  p.featured
                    ? "glass-strong glow-brand border-brand-lift/40"
                    : "glass"
                }`}
              >
                {p.featured && (
                  <span className="absolute right-6 top-6 rounded-pill bg-brand-lift px-3 py-1 text-[11px] font-medium text-white">
                    限量
                  </span>
                )}
                <p className="text-sm font-medium text-ink">{p.name}</p>
                <p className="font-display text-xs tracking-[0.16em] text-ink-4">
                  {p.nameEn.toUpperCase()}
                </p>

                <p className="mt-7 flex items-baseline gap-2">
                  <span className="font-display text-[2.5rem] font-semibold leading-none text-ink">
                    {event.tickets.currency}
                    {p.price.toLocaleString()}
                  </span>
                </p>
                {p.original && (
                  <p className="mt-2 text-sm text-ink-4">
                    原價{" "}
                    <span className="line-through">
                      {event.tickets.currency}
                      {p.original.toLocaleString()}
                    </span>
                  </p>
                )}
                <p className="mt-4 text-[13px] leading-relaxed text-ink-3">{p.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.22}>
          <div className="mx-auto mt-8 max-w-3xl">
            <ul className="grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-ink-2">
                  <Check size={15} className="shrink-0 text-orbit-sky" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <Cta href={REGISTER_URL} size="lg">
                {REGISTER_READY ? "前往報名" : "報名即將開放"}
              </Cta>
              {!REGISTER_READY && (
                <p className="mt-5 inline-flex items-start gap-2 text-left text-[13px] leading-relaxed text-ink-3">
                  <Info size={14} className="mt-0.5 shrink-0 text-ink-4" aria-hidden />
                  報名連結尚未開放。開放後將同步公布於本頁與{" "}
                  <a
                    href="https://www.facebook.com/groups/1169347120648777/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orbit-sky underline-offset-4 hover:underline"
                  >
                    台灣新創投資社團
                  </a>
                  。
                </p>
              )}
            </div>

            <p className="mt-6 text-center text-[13px] text-ink-4">
              {forums.map((f) => `${f.dateLabel.replace(/ /g, "")} ${f.name}`).join("　|　")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
