"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Reflective — TicketSheen 的入口層
   絕對定位、pointer-events-none，鋪在卡片／按鈕底下或上面。
   支援 WebGL → 掛真 shader 反光；否則 → 純 CSS 靜態光暈回退。
   ========================================================================== */

const TicketSheen = dynamic(() => import("@/components/home/TicketSheen"), {
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

type Props = {
  mode?: "frame" | "fill";
  color?: string;
  intensity?: number;
  radius?: number;
  className?: string;
};

export function Reflective({
  mode = "frame",
  color = "#7cc9ff",
  intensity = 1,
  radius = 0.2,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const [gl, setGl] = useState(false);

  useEffect(() => setGl(hasWebGL()), []);

  if (!gl) {
    // CSS 回退：frame → 邊緣柔光；fill → 斜向靜態光澤
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", className)}
        style={
          mode === "frame"
            ? {
                borderRadius: "inherit",
                // 深底上內陰影要更實才看得見（淺色版是 0.18）
                boxShadow: `inset 0 0 26px rgb(120 200 255 / 0.3)`,
              }
            : {
                borderRadius: "inherit",
                background:
                  "linear-gradient(120deg, transparent 30%, rgb(180 225 255 / 0.22) 50%, transparent 70%)",
              }
        }
      />
    );
  }

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <TicketSheen
        mode={mode}
        color={color}
        intensity={intensity}
        radius={radius}
        animate={!reduce}
      />
    </div>
  );
}
