import { Plus } from "lucide-react";
import { faqs } from "@/data/faq";
import { event } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-24 md:py-32">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <SectionHead eyebrow="FAQ" ghost="FAQ" title="常見問題" />
              <p className="mt-6 text-[15px] leading-[1.9] text-ink-2">
                找不到答案？歡迎來信{" "}
                <a
                  href={`mailto:${event.contact.email}`}
                  className="text-orbit-sky underline-offset-4 hover:underline"
                >
                  {event.contact.email}
                </a>
                ，我們會盡快回覆。
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="divide-y divide-white/8 border-y border-white/8">
              {faqs.map((f) => (
                <li key={f.q}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[15px] font-medium text-ink transition-colors hover:text-orbit-sky md:text-base [&::-webkit-details-marker]:hidden">
                      <span>{f.q}</span>
                      <Plus
                        size={18}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-ink-4 transition-transform duration-300 group-open:rotate-45"
                      />
                    </summary>
                    <p className="pb-7 pr-10 text-[15px] leading-[1.95] text-ink-2">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
