"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { OrbitRingCss } from "@/components/home/OrbitRingCss";

/* ==========================================================================
   OrbitRing — 右側破碎玻璃手鐲的入口
   決策前只顯示光暈（SSR/首幀都一樣）→ 有能力的裝置永遠不會先閃過 CSS 舊版。
   決策後：桌機 + 支援 WebGL + 未關動效 → 真玻璃 <OrbitGlass />；
   否則（手機 / 關動效 / 不支援）→ 純 CSS 版 <OrbitRingCss />。
   ========================================================================== */

const OrbitGlass = dynamic(() => import("@/components/home/OrbitGlass"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

type Mode = "pending" | "gl" | "css";

export function OrbitRing({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("pending"); // 決策前 = 只有光暈
  const [ready, setReady] = useState(false); // WebGL 畫出第一格才淡入
  const [active, setActive] = useState(true); // 捲離 Hero → 暫停 render loop
  const wrapRef = useRef<HTMLDivElement>(null);

  // 決定並掛載玻璃環。關鍵時序：Hero 進場動畫（文字/按鈕/翻牌鐘，最後一個約 1.5s 才結束）
  // 期間若開始造幾何，會每幀搶走主執行緒時間 → 那些進場動畫卡頓。所以 WebGL 路徑刻意延到
  // 進場動畫跑完（~1.7s）之後、且瀏覽器閒置時才掛 → 進場全程順，玻璃盤本就最後淡入（可接受）。
  useEffect(() => {
    let cancelled = false;
    // 關動效或不支援 WebGL → 直接用輕量 CSS 版（無造幾何、不會搶幀），不需延遲
    if (reduce || !hasWebGL()) {
      setMode("css");
      return;
    }
    // 進場動畫（縮短後最後元素約 1.1s）一結束就掛，不再多等 idle → 玻璃盤盡早出現。
    // 造幾何是分幀的，此刻動畫已收尾，不會搶幀。閘門與 Hero 的 rise 時序連動，勿各改各的。
    const startId = window.setTimeout(() => {
      if (!cancelled) setMode("gl");
    }, 1150);
    return () => {
      cancelled = true;
      clearTimeout(startId);
    };
  }, [reduce]);

  // 只有 Hero 在視窗內才讓玻璃環運轉；捲走就停 → 釋放 GPU，下方各區塊捲動才順
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      rootMargin: "150px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 保險：即使 onReady 沒觸發，也在短暫延遲後淡入玻璃，絕不卡在只剩光暈
  useEffect(() => {
    if (mode !== "gl") return;
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, [mode]);

  return (
    <div ref={wrapRef} className={`pointer-events-none relative aspect-square w-full ${className}`}>
      {/* 圓環背景保持全透明（不再墊色塊光暈，避免出現色差方塊）；
          頁面本身的背景光暈由 Hero 提供 */}

      {/* CSS 版只在回退時掛載，桌機 WebGL 路徑完全不 render → 不會閃過舊版堆疊 */}
      {mode === "css" && (
        <div className="absolute inset-0">
          <OrbitRingCss />
        </div>
      )}

      {/* WebGL 真玻璃：初始化期間只露出上面的光暈，畫出第一格後才淡入 */}
      {mode === "gl" && (
        <div
          className={`absolute inset-0 transition-opacity duration-[400ms] ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <OrbitGlass active={active} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
