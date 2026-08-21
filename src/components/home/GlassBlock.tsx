"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   GlassBlock — 票卡背後玻璃層的入口
   支援 WebGL 且未關動效 → 掛真玻璃 <TicketGlass />；否則 → 純 CSS .glass 回退。
   絕對定位鋪滿卡片（rounded 由父層 overflow-hidden 裁切）；文字疊在其上。
   ========================================================================== */

const TicketGlass = dynamic(() => import("@/components/home/TicketGlass"), {
  ssr: false,
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function GlassBlock({ featured = false }: { featured?: boolean }) {
  const reduce = useReducedMotion();
  const [gl, setGl] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setGl(hasWebGL()), []);

  // 保險：onReady 沒觸發也在短延遲後淡入，不卡在只剩 CSS 玻璃
  useEffect(() => {
    if (!gl) return;
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, [gl]);

  const cssGlass = cn("absolute inset-0", featured ? "glass-strong" : "glass");

  if (!gl) {
    return <div aria-hidden className={cssGlass} style={{ borderRadius: "inherit" }} />;
  }

  return (
    <>
      {/* WebGL 就緒前先鋪 CSS 玻璃 → 不閃空白；就緒後淡出 */}
      <div
        aria-hidden
        className={cn(cssGlass, "transition-opacity duration-700", ready && "opacity-0")}
        style={{ borderRadius: "inherit" }}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0"
        )}
      >
        <TicketGlass featured={featured} animate={!reduce} onReady={() => setReady(true)} />
      </div>
    </>
  );
}
