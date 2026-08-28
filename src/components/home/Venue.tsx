import { MapPin, Users, LayoutGrid, UtensilsCrossed, ArrowUpRight } from "lucide-react";
import { event } from "@/data/event";
import { venueZones } from "@/data/sponsors";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

const zoneIcons = [LayoutGrid, UtensilsCrossed, Users];

export function Venue() {
  return (
    <section
      id="venue"
      className="relative flex snap-start items-center pb-16 pt-24 md:min-h-[100svh] [scroll-margin-top:-88px]"
    >
      <div className="shell w-full">
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
                <dd className="text-[18px] leading-relaxed text-ink-2">
                  {event.venue.address || (
                    <span className="text-ink-3">
                      完整地址與交通指引將於報名開放時公布。
                    </span>
                  )}
                  {event.venue.mapUrl && (
                    <a
                      href={event.venue.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex w-fit items-center gap-1.5 text-sm text-orbit-sky underline-offset-4 transition-colors hover:text-brand-glow hover:underline"
                    >
                      在 Google 地圖開啟
                      <ArrowUpRight size={14} className="shrink-0" />
                    </a>
                  )}
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="shrink-0 text-ink-4">
                  <Users size={18} />
                  <span className="sr-only">規模</span>
                </dt>
                <dd className="text-[18px] leading-relaxed text-ink-2">
                  {event.capacity.seats} 席・{event.capacity.attendance}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass relative overflow-hidden rounded-card">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-orbit-violet/35 blur-3xl"
              />
              <div className="relative">
              <div className="border-b border-black/8 px-7 py-5">
                <h3 className="text-sm font-medium text-ink">會場分區</h3>
              </div>
              <ul className="divide-y divide-black/5">
                {venueZones.map((z, i) => {
                  const Icon = zoneIcons[i] ?? LayoutGrid;
                  return (
                    <li key={z.zone} className="flex items-start gap-5 px-7 py-6">
                      <Icon
                        size={26}
                        strokeWidth={1.5}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-orbit-sky"
                      />
                      <div className="min-w-0">
                        <p className="text-[18px] font-medium text-ink">{z.name}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-3">{z.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
