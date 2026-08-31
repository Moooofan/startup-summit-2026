import { event } from "@/data/event";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { ForumCards } from "@/components/home/ForumCards";

export function About() {
  return (
    <section
      id="about"
      className="relative snap-start pb-24 pt-24 md:pb-28 md:pt-40 [scroll-margin-top:-88px]"
    >
      <div aria-hidden className="hairline absolute inset-x-0 top-0 h-px" />
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="ABOUT THE SUMMIT"
            ghost="SUMMIT"
            title={
              <>
                一年一度，
                <br className="sm:hidden" />
                台灣資本與創新的交會點
              </>
            }
            lead={
              <>
                {event.fullName}以「{event.subtitle}」形式舉行 —— 一天屬於創辦人，一天屬於投資人。
                由擁有 {event.organizer.members}的{event.organizer.name}主辦，
                自 2023 年起連續舉辦四屆，是台灣少數把投融資交易本身當作主題的年度論壇。
              </>
            }
          />
        </Reveal>

        {/* 兩天論壇（桌機並排 / 手機滑動牌堆，見 ForumCards） */}
        <ForumCards />
      </div>
    </section>
  );
}
