"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   SwipeDeck — 手機端「重疊卡片＋滑動切換」牌堆（參考 /tickets 的 TicketsPanel）。
   桌機用不到（呼叫端以 sm:hidden 只在手機掛它），所以這裡不處理 RWD，只管牌堆行為。

   高度自撐的做法：所有卡片放進「同一個 grid 格子」(col/row-start-1) → 彼此重疊，
   容器高度自動等於最高那張卡，切換時不跳動，也不必像 /tickets 那樣另擺一張隱形撐架卡。
   非作用中的卡往自己那側位移＋縮小＋降透明度露出「peek」，點它或往該側滑動即切換。
   ========================================================================== */

export function SwipeDeck<T>({
  items,
  getKey,
  labels,
  renderItem,
  className,
}: {
  items: T[];
  getKey: (item: T, index: number) => string;
  /** 底部切換頁籤文字；不傳則不顯示頁籤 */
  labels?: string[];
  renderItem: (item: T, active: boolean) => React.ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const clamp = (n: number) => Math.max(0, Math.min(items.length - 1, n));

  // 橫向滑動切卡；位移太小視為點擊。垂直捲動留給頁面（touchAction: pan-y）。
  const swipeX = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => {
    swipeX.current = e.clientX;
  };
  const onUp = (e: React.PointerEvent) => {
    const s = swipeX.current;
    swipeX.current = null;
    if (s == null) return;
    const dx = e.clientX - s;
    if (Math.abs(dx) < 40) return;
    setActive((a) => clamp(a + (dx < 0 ? 1 : -1)));
  };

  return (
    // overflow-hidden：側卡 peek 會位移到容器外，這裡自行裁掉溢出、避免整頁出現橫向捲軸
    //（不必依賴外層 section 各自加 overflow）。py 給卡片陰影一點呼吸空間。
    <div className={cn("overflow-hidden py-6", className)}>
      <div
        className="relative grid"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (swipeX.current = null)}
      >
        {items.map((item, i) => {
          const isActive = i === active;
          const side = i < active ? -1 : i > active ? 1 : 0; // 非作用中往自己那側 peek
          return (
            <div
              key={getKey(item, i)}
              onClick={() => !isActive && setActive(i)}
              aria-hidden={!isActive}
              className={cn(
                // 同格重疊 → 容器高＝最高卡；卡片本身窄於容器並置中，側卡才有空間 peek
                "col-start-1 row-start-1 mx-auto w-[76vw] max-w-[360px] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive ? "z-20 opacity-100" : "z-10 cursor-pointer opacity-40"
              )}
              style={{ transform: `translateX(${side * 58}%) scale(${isActive ? 1 : 0.82})` }}
            >
              {renderItem(item, isActive)}
            </div>
          );
        })}
      </div>

      {labels && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {labels.map((label, i) => (
            <button
              key={label}
              onClick={() => setActive(i)}
              className={cn(
                "btn-glass rounded-pill border-2 px-5 py-2 text-sm font-bold transition-all duration-300",
                i === active
                  ? "border-brand-lift bg-brand-lift/18 text-brand-lift"
                  : "border-line bg-white/42 text-ink-3 hover:border-brand-lift/50 hover:text-brand-lift"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
