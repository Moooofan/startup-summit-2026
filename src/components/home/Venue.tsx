import { MapPin, Users, LayoutGrid, UtensilsCrossed } from "lucide-react";
import { event } from "@/data/event";
import { venueZones } from "@/data/sponsors";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

const zoneIcons = [LayoutGrid, UtensilsCrossed, Users];

export function Venue() {
  return (
    <section id="venue" className="relative scroll-mt-24 py-24 md:py-32">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <Reveal>
            <SectionHead
              eyebrow="VENUE"
              ghost="VENUE"
              title="華南金控國際會議中心"
              lead={
                <>
                  {event.venue.detail}，可容納 {event.capacity.seats} 席。
                  演講廳、交誼餐飲區與品牌攤位區在同一層樓連成一個動線，
                  讓聽完一場演講就能直接走向下一次對話。
                </>
              }
            />

            <dl className="mt-10 space-y-5">
              <div className="flex gap-4">
                <dt className="shrink-0 text-ink-4">
                  <MapPin size={18} />
                  <span className="sr-only">地址</span>
                </dt>
                <dd className="text-[15px] leading-relaxed text-ink-2">
                  {event.venue.address || (
                    <span className="text-ink-3">
                      完整地址與交通指引將於報名開放時公布。
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="shrink-0 text-ink-4">
                  <Users size={18} />
                  <span className="sr-only">規模</span>
                </dt>
                <dd className="text-[15px] leading-relaxed text-ink-2">
                  {event.capacity.seats} 席・{event.capacity.attendance}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass overflow-hidden rounded-card">
              <div className="border-b border-white/8 px-7 py-5">
                <h3 className="text-sm font-medium text-ink">會場分區</h3>
              </div>
              <ul className="divide-y divide-white/5">
                {venueZones.map((z, i) => {
                  const Icon = zoneIcons[i] ?? LayoutGrid;
                  return (
                    <li key={z.zone} className="flex items-start gap-5 px-7 py-6">
                      <span className="font-display grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-semibold text-orbit-sky">
                        {z.zone}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-[15px] font-medium text-ink">
                          <Icon size={15} className="text-ink-4" aria-hidden />
                          {z.name}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-3">{z.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
