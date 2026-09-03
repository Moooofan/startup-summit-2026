import { ChevronDown } from "lucide-react";
import { event } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { TicketPlans } from "@/components/home/TicketPlans";

/**
 * 首頁報名資訊，拆成兩個節點：
 *   1. 報名資訊大標＋日期時間小標。
 *   2. 藍→紫雙層渲染票卡（早鳥／全天）。
 * 桌機（md+）走全站一致的一節一螢幕 STICK 版型（各自滿版、磁吸）；
 * 手機不觸發 STICK：兩節不強制滿版，大標接著票卡自然流動、只留一點間距。
 * 票卡樣式沿用 /tickets 的相框設計；票卡的桌機並排／手機滑動牌堆都在 TicketPlans。
 */
export function Tickets() {
  return (
    <>
      {/* 節點一：報名資訊大標，滿版置中 */}
      <section
        id="tickets"
        className="grain relative flex snap-start items-center justify-center overflow-hidden bg-bg-soft pb-6 pt-20 md:min-h-[100svh] md:pb-16 md:pt-24 [scroll-margin-top:-88px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-0 h-[40vw] max-h-[540px] w-[40vw] max-w-[540px] rounded-full bg-[radial-gradient(circle,rgb(90_170_255/0.26)_0%,transparent_65%)]"
        />
        <div className="shell relative w-full">
          <Reveal>
            <SectionHead
              eyebrow="REGISTRATION"
              ghost="TICKETS"
              align="center"
              title="報名資訊"
              lead={`${event.dateLabelLong}，${event.timeLabel}。兩日論壇於同一場地舉行。`}
            />
          </Reveal>

          {/* 向下滑提示（桌機顯示，與 Agenda 開場一致） */}
          <div className="pointer-events-none mt-14 hidden justify-center md:flex">
            <span className="inline-flex flex-col items-center gap-2 text-[17px] tracking-[0.24em] text-orbit-sky">
              向下看票種
              <ChevronDown size={20} aria-hidden className="animate-bounce motion-reduce:animate-none" />
            </span>
          </div>
        </div>
      </section>

      {/* 節點二：藍→紫雙層渲染票卡 */}
      <section
        id="tickets-plans"
        className="relative flex snap-start items-center overflow-hidden pb-16 pt-6 md:min-h-[100svh] md:pt-24 [scroll-margin-top:-88px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-8%] bottom-[6%] h-[38vw] max-h-[520px] w-[38vw] max-w-[520px] rounded-full bg-[radial-gradient(circle,rgb(140_110_255/0.2)_0%,transparent_65%)]"
        />
        <div className="shell relative w-full">
          <Reveal>
            <TicketPlans />
          </Reveal>
        </div>
      </section>
    </>
  );
}
