import { cn } from "@/lib/utils";

interface Props {
  /** 頁面主標題請傳 "h1"，區塊標題維持預設 h2 */
  as?: "h1" | "h2";
  eyebrow?: string;
  ghost?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** 覆寫巨型背景字的定位（例如某些置中裁切的區塊要把 ghost 往下移，避免被切掉）*/
  ghostClassName?: string;
}

export function SectionHead({
  as: Heading = "h2",
  eyebrow,
  ghost,
  title,
  lead,
  align = "left",
  className,
  ghostClassName,
}: Props) {
  // 置中版：大字報整體置中，金字用 absolute 釘在大字報的左緣、垂直置中（和左對齊版一致）。
  // 手機端大字報隱藏（hidden md:block），金字則回到一般流排、置中顯示。
  if (align === "center") {
    return (
      <header className={cn("relative text-center", className)}>
        {/* 大字報 + 金字為一個置中的 inline-block；大字報 in-flow 撐出寬度，金字釘其左上角 */}
        <div className="relative inline-block text-left">
          {ghost && (
            <span
              aria-hidden
              className={cn(
                "ghost-head pointer-events-none hidden select-none text-[clamp(4rem,10vw,8.5rem)] leading-[0.8] md:block",
                ghostClassName
              )}
            >
              {ghost}
            </span>
          )}
          {/* 垂直位置用比例而非固定 px：原本是 md:top-2（8px），大字報字級是
              clamp(4rem,10vw,8.5rem)——視窗一寬、字一大，8px 就相對變得極小，
              金字會點在大字報最上緣（1440px 實測約 16%），而左對齊版是落在字身中段（約 52%）
              —— 兩組摆在一起就看得出不一致。
              這裡的定位容器就是大字報那個 inline-block，高度等於它的行框（leading-[0.8]）；
              Montserrat 的字身在行框內約落在 0.06em–0.76em，視覺中心約在 51%，
              所以 top-1/2 + -translate-y-1/2 就能跟左對齊版對齊，且字級隨視窗縮放時不會再跑掉。 */}
          {eyebrow && (
            <p className="mb-3 flex items-center justify-center gap-3 text-[16px] font-medium tracking-[0.24em] text-gold md:absolute md:left-1 md:top-1/2 md:mb-0 md:-translate-y-1/2 md:justify-start">
              <span aria-hidden className="h-px w-8 bg-gold/60" />
              {eyebrow}
            </p>
          )}
        </div>
        <Heading
          className={cn(
            "relative z-10 text-[clamp(1.75rem,4.2vw,2.75rem)] font-bold leading-tight text-ink",
            ghost && "md:-mt-8 lg:-mt-10"
          )}
        >
          {title}
        </Heading>
        {lead && (
          <p className="mx-auto mt-5 max-w-2xl text-[18px] leading-[1.9] text-ink-2">{lead}</p>
        )}
      </header>
    );
  }

  // 左對齊版（About / Venue / Agenda / Speakers）——維持原樣。
  return (
    <header className={cn("relative", className)}>
      {ghost && (
        <span
          aria-hidden
          className={cn(
            "ghost-head pointer-events-none absolute -top-10 left-0 hidden text-[clamp(4rem,10vw,8.5rem)] md:block",
            ghostClassName
          )}
        >
          {ghost}
        </span>
      )}
      <div className="relative">
        {eyebrow && (
          <p className="relative -left-1 -top-3 mb-3 flex items-center gap-3 text-[16px] font-medium tracking-[0.24em] text-gold">
            <span aria-hidden className="h-px w-8 bg-gold/60" />
            {eyebrow}
          </p>
        )}
        <Heading className="text-[clamp(1.75rem,4.2vw,2.75rem)] font-bold leading-tight text-ink">
          {title}
        </Heading>
        {lead && (
          <p className="mt-5 max-w-2xl text-[18px] leading-[1.9] text-ink-2">{lead}</p>
        )}
      </div>
    </header>
  );
}
