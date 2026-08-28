import { Mail, Handshake, Users, ArrowUpRight } from "lucide-react";
import { event } from "@/data/event";
import { SPONSOR_CONTACT } from "@/lib/config";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

const FB_GROUP = "https://www.facebook.com/groups/1169347120648777/";

const channels = [
  {
    icon: Mail,
    label: "一般 / 報名洽詢",
    value: event.contact.email,
    href: `mailto:${event.contact.email}`,
    external: false,
  },
  {
    icon: Handshake,
    label: "贊助洽談",
    value: event.contact.sponsorEmail,
    href: SPONSOR_CONTACT,
    external: false,
  },
  {
    icon: Users,
    label: "社群",
    value: event.organizer.name,
    href: FB_GROUP,
    external: true,
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 snap-start py-24 md:py-32">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="CONTACT"
            ghost="CONTACT"
            title="聯絡資訊"
            lead="報名、贊助或任何合作洽談，歡迎透過以下方式與我們聯繫。"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="glass group flex flex-col rounded-card p-7 transition-colors duration-500 hover:border-black/20"
              >
                <span className="text-brand-lift">
                  <Icon size={26} aria-hidden />
                </span>
                <p className="mt-5 text-[17px] tracking-[0.14em] text-ink-4">{label}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[18px] font-medium text-ink transition-colors group-hover:text-brand-lift">
                  {value}
                  <ArrowUpRight size={15} className="shrink-0 text-ink-4 transition-colors group-hover:text-brand-lift" />
                </p>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 text-sm leading-relaxed text-ink-3">
            主辦單位｜{event.organizer.name}・
            {event.organizer.host}　{event.organizer.hostTitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
