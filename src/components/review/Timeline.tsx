import type { PastForum } from "@/data/review";

const formatLabel: Record<string, string> = {
  keynote: "演講",
  panel: "對談",
  fireside: "爐邊對談",
  break: "休息",
  networking: "交流",
};

export function Timeline({ forum }: { forum: PastForum }) {
  return (
    <ol className="relative space-y-0 border-l border-line-soft pl-6 md:pl-8">
      {forum.sessions.map((s, i) => {
        const isBreak = s.format === "break";
        return (
          <li key={`${s.time}-${i}`} className="relative py-4">
            <span
              aria-hidden
              className={`absolute -left-[calc(1.5rem+4.5px)] top-[1.55rem] h-[9px] w-[9px] rounded-full md:-left-[calc(2rem+4.5px)] ${
                isBreak ? "bg-line" : "bg-orbit-sky"
              }`}
            />
            <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-6">
              <div className="shrink-0 sm:w-32">
                <p
                  className={`font-display text-[17px] tabular-nums ${
                    isBreak ? "text-ink-4" : "text-ink-2"
                  }`}
                >
                  {s.time}
                </p>
                {s.duration && <p className="text-[16px] text-ink-4">{s.duration}</p>}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[18px] leading-relaxed ${
                    isBreak ? "text-ink-4" : "font-medium text-ink"
                  }`}
                >
                  {s.title}
                </p>
                {s.speaker && (
                  <p className="mt-1.5 text-[17px] leading-relaxed text-ink-3">{s.speaker}</p>
                )}
                {s.format && !isBreak && s.format !== "keynote" && (
                  <span className="mt-2.5 inline-block rounded-pill border border-white/14 px-2.5 py-0.5 text-[16px] text-ink-4">
                    {formatLabel[s.format] ?? s.format}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
