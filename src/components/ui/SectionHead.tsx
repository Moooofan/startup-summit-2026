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
}

export function SectionHead({ as: Heading = "h2", eyebrow, ghost, title, lead, align = "left", className }: Props) {
  return (
    <header className={cn("relative", align === "center" && "text-center", className)}>
      {ghost && (
        <span
          aria-hidden
          className="ghost-head pointer-events-none absolute -top-10 left-0 hidden text-[clamp(4rem,10vw,8.5rem)] md:block"
          style={align === "center" ? { left: "50%", transform: "translateX(-50%)" } : undefined}
        >
          {ghost}
        </span>
      )}
      <div className="relative">
        {eyebrow && (
          <p
            className={cn(
              "mb-4 flex items-center gap-3 text-[11px] tracking-[0.24em] text-orbit-sky",
              align === "center" && "justify-center"
            )}
          >
            <span aria-hidden className="h-px w-8 bg-orbit-sky/50" />
            {eyebrow}
          </p>
        )}
        <Heading className="text-[clamp(1.75rem,4.2vw,2.75rem)] font-bold leading-tight text-ink">
          {title}
        </Heading>
        {lead && (
          <p
            className={cn(
              "mt-5 max-w-2xl text-[15px] leading-[1.9] text-ink-2",
              align === "center" && "mx-auto"
            )}
          >
            {lead}
          </p>
        )}
      </div>
    </header>
  );
}
