"use client";

import { useEffect, useRef, useState } from "react";
import { useCountdown } from "@/lib/useCountdown";
import { cn } from "@/lib/utils";

/* 單張翻牌：front 顯示現值、back 顯示新值；數字變動時加 .go 觸發向下翻動畫，
   0.6s 後把 front 更新為新值、移除 .go（與 CSS 的 animation-duration 一致）。 */
function FlipCard({ digit }: { digit: string }) {
  const [front, setFront] = useState(digit);
  const [back, setBack] = useState(digit);
  const [go, setGo] = useState(false);
  const prev = useRef(digit);

  useEffect(() => {
    if (digit === prev.current) return;
    prev.current = digit;
    setBack(digit);
    setGo(true);
    const t = setTimeout(() => {
      setFront(digit);
      setGo(false);
    }, 600);
    return () => clearTimeout(t);
  }, [digit]);

  return (
    <span className={cn("flip down", go && "go")}>
      <span className="digital front" data-d={front} />
      <span className="digital back" data-d={back} />
    </span>
  );
}

function Group({ value, label }: { value: number | undefined; label: string }) {
  const str = value === undefined ? "––" : String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {str.split("").map((d, i) => (
          <FlipCard key={i} digit={d} />
        ))}
      </div>
      <span className="text-[16px] tracking-[0.24em] text-ink-4">{label}</span>
    </div>
  );
}

export function FlipClock({ target }: { target: string }) {
  const t = useCountdown(target);
  const colon = (
    <span aria-hidden className="self-start pt-[0.35em] text-[0.8em] font-semibold text-ink-4">
      :
    </span>
  );
  return (
    <div className="font-display flex items-start gap-2 text-[clamp(1.7rem,3.6vw,2.4rem)] font-bold tabular-nums sm:gap-3">
      <Group value={t?.days} label="天" />
      {colon}
      <Group value={t?.hours} label="時" />
      {colon}
      <Group value={t?.minutes} label="分" />
      {colon}
      <Group value={t?.seconds} label="秒" />
    </div>
  );
}
