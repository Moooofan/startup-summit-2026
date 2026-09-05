import { Plus } from "lucide-react";
import { faqs } from "@/data/faq";
import { event } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  return (
    <section id="faq" className="relative snap-start py-20 md:py-24">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <div className="lg:grid lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-20">
          {/* 左：整段釘住、靠上對齊（貼齊右側 FAQ 頂端），右側 FAQ 捲動時左側不動 */}
          <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-start lg:self-start lg:pt-[120px]">
            <Reveal>
              <SectionHead eyebrow="FAQ" ghost="FAQ" title="常見問題" />
              <p className="mt-6 text-[18px] leading-[1.9] text-ink-2">
                找不到答案？歡迎來信{" "}
                <a
                  href={`mailto:${event.contact.email}`}
                  className="text-orbit-sky underline-offset-4 hover:underline"
                >
                  {event.contact.email}
                </a>
                ，我們會盡快回覆。
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-12 lg:mt-0">
            <ul className="divide-y divide-line-soft border-y border-line-soft">
              {faqs.map((f) => (
                <li key={f.q}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[18px] font-medium text-ink transition-colors hover:text-orbit-sky md:text-base [&::-webkit-details-marker]:hidden">
                      <span>{f.q}</span>
                      <Plus
                        size={18}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-ink-4 transition-transform duration-300 group-open:rotate-45"
                      />
                    </summary>
                    <p className="pb-7 pr-10 text-[18px] leading-[1.95] text-ink-2">{f.a}</p>
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
