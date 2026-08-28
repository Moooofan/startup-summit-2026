import { Check, Info } from "lucide-react";
import { event, forums } from "@/data/event";
import { REGISTER_URL, REGISTER_READY } from "@/lib/config";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";
import { Reflective } from "@/components/home/Reflective";
import { GlassBlock } from "@/components/home/GlassBlock";

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
                className={`group relative h-full overflow-hidden rounded-card border p-8 ${
                  p.featured
                    ? "glow-brand border-brand-lift/40"
                    : "border-line"
                }`}
              >
                {/* 真玻璃板（MeshTransmissionMaterial）；不支援時回退 CSS 玻璃 */}
                <GlassBlock featured={p.featured} />
                {/* 玻璃頂緣高光 —— 讓 BLOCK 更透光、更立體 */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
                />

                <div className="relative">
                  {p.featured && (
                    <span className="absolute right-0 top-0 rounded-pill bg-brand-lift px-3 py-1 text-[16px] font-medium text-white shadow-[0_0_18px_rgb(106_134_255/0.5)]">
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
                  <p className="mt-4 text-[17px] leading-relaxed text-ink-3">{p.note}</p>
                </div>
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
              {/* three.js 反光質感的報名按鈕 */}
              <span className="relative inline-flex overflow-hidden rounded-pill">
                <Cta href={REGISTER_URL} size="lg">
                  {REGISTER_READY ? "前往報名" : "報名即將開放"}
                </Cta>
                <Reflective mode="fill" radius={1} intensity={0.5} />
              </span>

              {!REGISTER_READY && (
                <div className="glass relative mx-auto mt-5 max-w-xl overflow-hidden rounded-card px-5 py-4 text-left">
                  <Reflective mode="fill" radius={0.28} intensity={0.32} />
                  <p className="relative inline-flex items-start gap-2 text-[17px] leading-relaxed text-ink-3">
                    <Info size={14} className="mt-0.5 shrink-0 text-ink-4" aria-hidden />
                    <span>
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
                    </span>
                  </p>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-[17px] text-ink-4">
              {forums.map((f) => `${f.dateLabel.replace(/ /g, "")} ${f.name}`).join("　|　")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
