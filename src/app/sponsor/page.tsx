import type { Metadata } from "next";
import { Check, Minus, Mail } from "lucide-react";
import { event, stats } from "@/data/event";
import {
  tiers,
  benefitRows,
  boothTypes,
  friendModes,
  venueZones,
  boothPricingConflict,
} from "@/data/sponsors";
import { mediaCoverage } from "@/data/review";
import { SPONSOR_CONTACT } from "@/lib/config";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";

export const metadata: Metadata = {
  title: "贊助方案",
  description:
    "2026 第四屆台灣新創投資年會贊助方案：旗艦、領航、同航三級主贊助，以及攤位贊助與友情贊助。600+ 現場席次、34 位講者、5 萬人社群曝光。",
  alternates: { canonical: "/sponsor" },
};

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <>
        <Check size={16} className="mx-auto text-orbit-sky" aria-hidden />
        <span className="sr-only">有</span>
      </>
    );
  if (value === false)
    return (
      <>
        <Minus size={16} className="mx-auto text-ink-4/50" aria-hidden />
        <span className="sr-only">無</span>
      </>
    );
  return <span className="text-[17px] text-ink-2">{value}</span>;
}

const reasons = [
  {
    title: "決策者密度高",
    body: "兩天分別集中創辦人與機構投資人，600–700 席的現場幾乎都是能拍板的人。",
  },
  {
    title: "曝光不只在現場",
    body: `上一屆會後累積 ${mediaCoverage.length} 則媒體露出，涵蓋主流財經媒體，加上 ${event.organizer.members}的社群擴散。`,
  },
  {
    title: "談得成生意的動線",
    body: "演講廳、交誼區與攤位區同層相連，聽完一場演講就能直接走向下一場對話。",
  },
];

export default function SponsorPage() {
  return (
    <>
      {/* 頁首 */}
      {/* overflow-x-clip 而非 overflow-hidden，**別順手改回去**：
          區塊光暈是 880px 高，這個頁首只有約 400px（pt-176 + SectionHead + pb），裝不下。
          overflow-hidden 會把光暈在區塊底部切出一條水平硬邊（業主 2026/9 回報）。
          也不能用 overflow-x-hidden：CSS 規定只要一軸不是 visible，另一軸的 visible
          就會被算成 auto → 反而在區塊內生出一個垂直捲動容器。
          overflow: clip 沒有這個耦合，overflow-x: clip 搭 overflow-y: visible 合法且有效 ——
          橫向仍擋住溢位（光暈定位在負值，超出視窗會產生水平捲軸），縱向放它自然溢出。
          溢出不會蓋到下一段：後續 section 同為 relative 且 DOM 在後，內容畫在光暈之上。 */}
      <section className="grain relative overflow-x-clip pb-16 pt-[132px] md:pb-24 md:pt-[176px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[10%] -top-[16%] h-[62vw] max-h-[860px] w-[62vw] max-w-[860px] rounded-full bg-[radial-gradient(circle,rgb(143_179_255/0.07)_0%,rgb(143_179_255/0.025)_40%,transparent_72%)]"
        />
        <div className="shell relative">
          <Reveal>
            <SectionHead
              as="h1"
              eyebrow="SPONSORSHIP"
              ghost="SPONSOR"
              title={
                <>
                  把品牌放進
                  <br className="sm:hidden" />
                  資本與創新的交會現場
                </>
              }
              lead={`${event.dateLabelLong}，${event.venue.name}。三級主贊助方案，另有攤位與友情贊助，可依預算與目的選擇。`}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line-soft bg-line-soft md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-bg-soft px-6 py-8 text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="font-display text-orbit block text-[clamp(1.6rem,4vw,2.4rem)] font-semibold">
                      {s.value}
                    </span>
                    <span className="mt-2 block text-[17px] text-ink-3">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* 為什麼贊助 */}
      <section className="relative py-20 md:py-24">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell grid gap-6 md:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.07}>
              <article className="glass h-full rounded-card p-7">
                <span className="font-display text-xs tracking-[0.2em] text-ink-4">
                  0{i + 1}
                </span>
                <h2 className="mt-4 text-lg font-bold text-ink">{r.title}</h2>
                <p className="mt-3 text-[18px] leading-[1.9] text-ink-2">{r.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 方案對照 */}
      <section id="tiers" className="relative scroll-mt-24 bg-bg-soft py-20 md:py-28">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell">
          <Reveal>
            <SectionHead eyebrow="PACKAGES" title="贊助方案與權益" />
          </Reveal>

          {/* 桌機：對照表 */}
          <Reveal delay={0.1}>
            <div className="mt-12 hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <caption className="sr-only">各級贊助方案權益對照</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[168px] p-4" />
                    {tiers.map((t) => (
                      <th
                        key={t.key}
                        scope="col"
                        className={`rounded-t-card border-x border-t p-6 align-top ${
                          t.featured
                            ? "border-brand-lift/40 bg-brand/15"
                            : "border-line-soft bg-surface/60"
                        }`}
                      >
                        <span className="block text-[18px] font-bold text-ink">{t.name}</span>
                        <span className="font-display mt-1 block text-[16px] tracking-[0.14em] text-ink-4">
                          {t.nameEn.toUpperCase()}
                        </span>
                        <span className="font-display mt-4 block text-lg font-semibold text-orbit-sky">
                          {t.priceLabel}
                        </span>
                        {t.limited && (
                          <span className="mt-2 block text-[16px] text-ink-4">{t.limited}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {benefitRows.map((row) => (
                    <tr key={row.key} className="border-t border-line-soft">
                      <th
                        scope="row"
                        className="p-4 text-[17px] font-normal text-ink-3"
                      >
                        {row.label}
                        {"note" in row && row.note && (
                          <span className="mt-0.5 block text-[16px] text-ink-4">（{row.note}）</span>
                        )}
                      </th>
                      {tiers.map((t) => (
                        <td
                          key={t.key}
                          className={`border-x p-4 text-center align-middle ${
                            t.featured
                              ? "border-brand-lift/40 bg-brand/8"
                              : "border-line-soft bg-surface/30"
                          }`}
                        >
                          <Cell value={t.benefits[row.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* 手機：卡片 */}
          <div className="mt-12 grid gap-5 lg:hidden">
            {tiers.map((t, i) => (
              <Reveal key={t.key} delay={i * 0.05}>
                <article
                  className={`rounded-card p-7 ${
                    t.featured ? "glass-strong border-brand-lift/40" : "glass"
                  }`}
                >
                  <header className="flex items-baseline justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{t.name}</h3>
                      <p className="font-display text-[16px] tracking-[0.14em] text-ink-4">
                        {t.nameEn.toUpperCase()}
                      </p>
                    </div>
                    <p className="font-display shrink-0 text-base font-semibold text-orbit-sky">
                      {t.priceLabel}
                    </p>
                  </header>
                  <p className="mt-4 text-[18px] leading-relaxed text-ink-2">{t.tagline}</p>
                  {t.limited && <p className="mt-2 text-[17px] text-ink-4">{t.limited}</p>}
                  <dl className="mt-5 divide-y divide-line-soft border-t border-line-soft">
                    {benefitRows.map((row) => {
                      const v = t.benefits[row.key];
                      if (v === false) return null;
                      return (
                        <div key={row.key} className="flex items-start justify-between gap-4 py-2.5">
                          <dt className="text-[17px] text-ink-3">{row.label}</dt>
                          <dd className="text-right text-[17px] text-ink">
                            {v === true ? <Check size={15} className="text-orbit-sky" /> : v}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.16}>
            <p className="mt-8 text-[17px] leading-relaxed text-ink-4">
              ※ {boothPricingConflict.note}實際金額與可選項目請來信洽談。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 展位與友情贊助 */}
      <section className="relative py-20 md:py-28">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-2xl font-bold text-ink">展位規格</h2>
              <p className="mt-3 text-[18px] leading-relaxed text-ink-2">
                全場規劃 8–10 個品牌攤位，位於與演講廳同層的 E 區。
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="mt-8 space-y-4">
                {boothTypes.map((b) => (
                  <li key={b.name} className="glass rounded-card p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[18px] font-bold text-ink">{b.name}</h3>
                      <span className="font-display text-[17px] text-ink-3">{b.size}</span>
                    </div>
                    <p className="mt-2.5 text-[17px] text-ink-3">
                      {b.quota}・{b.access}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.14}>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-card border border-line-soft bg-line-soft sm:grid-cols-3">
                {venueZones.map((z) => (
                  <li key={z.zone} className="bg-bg-soft px-5 py-5">
                    <p className="font-display text-xs tracking-[0.18em] text-orbit-sky">
                      {z.zone} 區
                    </p>
                    <p className="mt-2 text-[18px] font-medium text-ink">{z.name}</p>
                    <p className="mt-1 text-[17px] leading-relaxed text-ink-4">{z.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h2 className="text-2xl font-bold text-ink">友情贊助</h2>
              <p className="mt-3 text-[18px] leading-relaxed text-ink-2">
                以現金或等值物資支持年會，適合小型團隊、個人與服務型夥伴。
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="mt-8 space-y-4">
                {friendModes.map((m) => (
                  <li key={m.key} className="glass rounded-card p-6">
                    <h3 className="text-[18px] font-bold text-ink">{m.name}</h3>
                    <p className="mt-3 text-[18px] leading-[1.9] text-ink-2">{m.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 洽談 */}
      <section className="relative bg-bg-soft py-20 md:py-28">
        <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
        <div className="shell text-center">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-bold text-ink">
              想談贊助或設攤？
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[18px] leading-[1.9] text-ink-2">
              方案可依需求調整組合。來信說明貴單位的目標與預算，我們會回覆合適的配置建議與可用檔期。
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Cta href={SPONSOR_CONTACT} size="lg">
                <Mail size={16} className="mr-1" aria-hidden />
                來信洽談贊助
              </Cta>
              <Cta href="/about" variant="ghost" size="lg">
                了解年會
              </Cta>
            </div>
            <p className="mt-6 text-[17px] text-ink-4">{event.contact.sponsorEmail}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
