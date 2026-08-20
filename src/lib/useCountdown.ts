"use client";

import { useEffect, useState } from "react";

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diff(target: number): Remaining {
  const ms = target - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  };
}

/**
 * 倒數計時。SSR 時回傳 null 以避免 hydration 不一致，
 * 呼叫端需自行處理載入中的骨架。
 */
export function useCountdown(iso: string): Remaining | null {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const target = new Date(iso).getTime();
    setRemaining(diff(target));
    const id = setInterval(() => setRemaining(diff(target)), 1000);
    return () => clearInterval(id);
  }, [iso]);

  return remaining;
}
