"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* ==========================================================================
   OrbitRingCss — 破碎的立體玻璃手鐲（純 CSS 版）
   WebGL 版 <OrbitGlass /> 的回退：手機 / 關閉動效 / 不支援 WebGL 時使用。
   每片碎塊由數層沿軸向堆疊的半透明玻璃片疊出厚度，CSS 3D 傾斜自轉。
   ========================================================================== */

const DESIGN = 560;
const R = 196;
const COUNT = 11;
const PITCH = 360 / COUNT;
const LEN = 74;
const THICK = 28;
const LAYERS = 9;
const DZ = 11;

const R_JITTER = [0, 10, -8, 6, -12, 8, -4, 12, -6, 4, -10];
const LEN_JITTER = [0, -8, 6, -10, 4, -6, 10, -4, 8, -12, 6];
const SKIP = new Set([7]);

const GRADS: [string, string][] = [
  ["#D6F4FF", "#16233f"],
  ["#7FB2FF", "#001a5e"],
  ["#B4ADFF", "#123a9e"],
  ["#D7BFFF", "#4a2b8e"],
  ["#FFD0E7", "#7a2e6b"],
  ["#F0A891", "#7a2a20"],
  ["#FFC27A", "#a13f6e"],
  ["#B6C1FF", "#0b4d63"],
  ["#8FB0E0", "#0c1730"],
  ["#A7C4FF", "#12224a"],
  ["#E3D2FF", "#3a2a6e"],
];

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${a})`;
}

export function OrbitRingCss({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  /* ⚠️ 必須是 useLayoutEffect，而且要在 observe 之前先同步量一次：
     scale 初始值是 1，等於「用 DESIGN=560 的原尺寸畫」。手機上容器只有約 370px，
     ResizeObserver 回呼是下一幀才到 → 中間那一幀整個環超出容器，被 Hero 的
     overflow-hidden 裁掉，表現為進場閃一下。改成 layout effect 就在瀏覽器繪製前完成縮放。
     本元件只在 OrbitRing 決策為 "css" 後才掛載（決策在 useEffect 裡），不參與 SSR，
     所以用 useLayoutEffect 不會有 server 端警告。 */
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    setScale(el.clientWidth / DESIGN);
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / DESIGN));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const blocks = Array.from({ length: COUNT }, (_, i) => {
    if (SKIP.has(i)) return null;
    const angle = i * PITCH;
    const r = R + R_JITTER[i];
    const len = LEN + LEN_JITTER[i];
    const [from, to] = GRADS[i % GRADS.length];

    const tiles = Array.from({ length: LAYERS }, (_, l) => {
      const front = l / (LAYERS - 1);
      const z = (l - (LAYERS - 1) / 2) * DZ;
      const isCap = l === LAYERS - 1;
      const isBack = l === 0;
      return { l, z, front, isCap, isBack };
    });

    return (
      <div
        key={i}
        className="absolute left-1/2 top-1/2"
        style={{
          width: 0,
          height: 0,
          transform: `rotate(${angle}deg) translateY(-${r}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {tiles.map(({ l, z, front, isCap, isBack }) => {
          if (isBack) {
            return (
              <div
                key={l}
                className="absolute left-0 top-0"
                style={{
                  width: len,
                  height: THICK,
                  marginLeft: -len / 2,
                  marginTop: -THICK / 2,
                  borderRadius: 5,
                  transform: `translateZ(${z}px)`,
                  background: `linear-gradient(135deg, ${rgba(to, 0.55)}, ${rgba("#05070f", 0.7)})`,
                  border: `1px solid ${rgba(from, 0.22)}`,
                }}
              />
            );
          }
          if (isCap) {
            return (
              <div
                key={l}
                className="absolute left-0 top-0"
                style={{
                  width: len,
                  height: THICK,
                  marginLeft: -len / 2,
                  marginTop: -THICK / 2,
                  borderRadius: 5,
                  transform: `translateZ(${z}px)`,
                  background: `linear-gradient(115deg, transparent 32%, ${rgba("#ffffff", 0.55)} 47%, transparent 56%), linear-gradient(135deg, ${rgba(from, 0.24)}, ${rgba(to, 0.14)})`,
                  border: `1px solid ${rgba("#ffffff", 0.7)}`,
                  boxShadow: [
                    `0 0 22px ${rgba(from, 0.4)}`,
                    `inset 1px 1px 1.5px ${rgba("#ffffff", 0.75)}`,
                    `inset -1px -2px 3px ${rgba("#05070f", 0.45)}`,
                  ].join(", "),
                }}
              />
            );
          }
          return (
            <div
              key={l}
              className="absolute left-0 top-0"
              style={{
                width: len,
                height: THICK,
                marginLeft: -len / 2,
                marginTop: -THICK / 2,
                borderRadius: 5,
                transform: `translateZ(${z}px)`,
                background: `linear-gradient(135deg, ${rgba(from, 0.05 + front * 0.09)}, ${rgba(to, 0.04 + front * 0.07)})`,
                border: `1px solid ${rgba("#ffffff", 0.1 + front * 0.28)}`,
                boxShadow: [
                  `inset 1px 1px 1px ${rgba("#ffffff", front * 0.35)}`,
                  `inset -1px -1px 2px ${rgba("#05070f", 0.3)}`,
                ].join(", "),
              }}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none relative aspect-square w-full ${className}`}
    >
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgb(76_104_212/0.28)_0%,transparent_62%)] blur-2xl" />
      <div className="absolute inset-[26%] rounded-full bg-[radial-gradient(circle,rgb(176_68_122/0.16)_0%,transparent_66%)] blur-2xl" />

      <div className="absolute inset-0 grid place-items-center">
        <div
          style={{
            width: DESIGN,
            height: DESIGN,
            perspective: "1500px",
            transform: `scale(${scale})`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(54deg) rotateZ(-20deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                animation: reduce ? undefined : "orbit-spin 46s linear infinite",
              }}
            >
              {blocks}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
