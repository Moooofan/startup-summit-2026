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

  // 延到瀏覽器閒置才決定並掛載 WebGL → 先讓頁面內容與互動就緒，不被 three.js 初始化卡住
  useEffect(() => {
    let cancelled = false;
    const decide = () => {
      if (cancelled) return;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      setMode(!reduce && wide && hasWebGL() ? "gl" : "css");
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(decide, { timeout: 1200 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const id = window.setTimeout(decide, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
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
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <OrbitGlass active={active} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
