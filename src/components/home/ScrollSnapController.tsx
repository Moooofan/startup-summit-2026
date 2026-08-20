"use client";

import { useEffect } from "react";

/**
 * 視窗層級的節點捲動控制（首頁專用，無 UI）。
 *
 * 目標：CSS 單一 snap 模式做不到的「短節點一手勢就跳、長內容區塊維持原生順滑」。
 * - 短節點（內容不超過一個視窗，如 Speakers 開場 / 創辦人論壇 / 投資人論壇）：
 *   一次滾輪／滑動／方向鍵 → 直接平順捲到下一個節點（不用滑好幾下）。
 * - 長內容區塊（About / 創辦人的話右欄 / 講者網格 / Agenda…）：
 *   **不接管**，交還原生捲動 → 順滑；捲到該區塊底端再滑一下才跳下一個。
 * - 用 scrollIntoView({block:"start"})，自動吃到 CSS 的 scroll-padding / scroll-margin，
 *   落點與 CSS 吸附點一致。
 * - 尊重 prefers-reduced-motion：整個關閉，回到一般捲動。
 * - 不攔截 click／tap → 點擊人物卡片照常導航。
 */
export function ScrollSnapController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const getTargets = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".snap-start, .snap-panel"));
    if (getTargets().length === 0) return; // 非首頁 → 不作用

    let locked = false;
    let unlockTimer: number | undefined;
    const vh = () => window.innerHeight;

    const currentIndex = (targets: HTMLElement[]) => {
      let idx = 0;
      const line = vh() * 0.5;
      for (let i = 0; i < targets.length; i++) {
        if (targets[i].getBoundingClientRect().top <= line) idx = i;
        else break;
      }
      return idx;
    };

    const jumpTo = (el: HTMLElement) => {
      locked = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        locked = false;
      }, 800);
    };

    /** 回傳 true = 已接管（呼叫端要 preventDefault）；false = 放手給原生捲動 */
    const step = (dir: number) => {
      const targets = getTargets();
      if (!targets.length) return false;
      const idx = currentIndex(targets);
      const cur = targets[idx];

      // 長內容區塊：若該方向還有內容沒捲完 → 交還原生捲動（順滑）
      const isShort = cur.offsetHeight <= vh() + 24;
      if (!isShort) {
        const r = cur.getBoundingClientRect();
        const moreDown = r.bottom > vh() + 4;
        const moreUp = r.top < -4;
        if ((dir > 0 && moreDown) || (dir < 0 && moreUp)) return false;
      }

      const nextIdx = idx + (dir > 0 ? 1 : -1);
      if (nextIdx < 0 || nextIdx >= targets.length) return false; // 邊界 → 交還頁面（頁尾等）
      if (!locked) jumpTo(targets[nextIdx]);
      return true; // 連 locked 期間也吞掉 → 一手勢只跳一次
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 6) return;
      if (step(e.deltaY > 0 ? 1 : -1)) e.preventDefault();
    };

    let touchY = 0;
    let touchLive = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      touchLive = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchLive) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) < 36) return;
      touchLive = false; // 一次手勢只處理一次
      if (step(dy > 0 ? 1 : -1)) e.preventDefault();
    };
    const onTouchEnd = () => {
      touchLive = false;
    };

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, number> = {
        PageDown: 1,
        PageUp: -1,
        ArrowDown: 1,
        ArrowUp: -1,
        " ": 1,
      };
      if (!(e.key in map)) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (step(map[e.key])) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(unlockTimer);
    };
  }, []);

  return null;
}
