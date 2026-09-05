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

/* 深色版換色的兩條規則方向相反，不要一起「調亮」或「調暗」：
   1) 有顏色的填色 alpha 要上調 —— 5% 的色疊在近白上看得見，疊在近黑上幾乎沒有變化。
   2) 白色描邊與 inset 高光要下調 —— 白線在白底是稜線，在近黑底是刺眼的線框，
      而這裡有九片乘十道，整個環會變成鉻線稿。
   例外是鏡面掃光與外光暈：深底上它們才是「這是發光體」的主要線索，要上調。

   亮端整組換成 KV 青階、暗端換成電光藍與深場藍。原本的暗端（#001a5e、#0c1730）
   是更早那版深色主題的殘留 —— 色相方向對，但彩度太低，放在新的高飽和藍場上會讀成灰。
   必須維持剛好 11 組：R_JITTER / LEN_JITTER 都是長度 11、查表是 GRADS[i % length]，
   改數量會讓每一片碎玻璃默默換到別的顏色。 */
const GRADS: [string, string][] = [
  ["#a9ffff", "#0326c4"],
  ["#85f6fa", "#0220b7"],
  ["#68d1ee", "#0319a7"],
  ["#48a9e2", "#020877"],
  ["#7aeaf5", "#0207e9"],
  ["#2f85d7", "#02085e"],
  ["#5fb8e8", "#0a19f9"],
  ["#9fd8f2", "#010148"],
  ["#44ade5", "#020455"],
  ["#b762aa", "#2a1a8e"], // 全環唯一暖色：KV logo 粉，配一顆偏藍的紫暗端
  ["#8fb8f5", "#010139"],
];

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${a})`;
}

export function OrbitRingCss({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  /* 必須是 useLayoutEffect，而且要在 observe 之前先同步量一次：
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
                  background: `linear-gradient(135deg, ${rgba(to, 0.62)}, ${rgba("#000018", 0.72)})`,
                  border: `1px solid ${rgba(from, 0.3)}`,
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
                  background: `linear-gradient(115deg, transparent 32%, ${rgba("#d8fbff", 0.62)} 47%, transparent 56%), linear-gradient(135deg, ${rgba(from, 0.34)}, ${rgba(to, 0.22)})`,
                  border: `1px solid ${rgba("#7aeaf5", 0.5)}`,
                  boxShadow: [
                    `0 0 26px ${rgba(from, 0.55)}`,
                    `inset 1px 1px 1.5px ${rgba("#e8feff", 0.6)}`,
                    `inset -1px -2px 3px ${rgba("#000018", 0.55)}`,
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
                background: `linear-gradient(135deg, ${rgba(from, 0.1 + front * 0.14)}, ${rgba(to, 0.07 + front * 0.1)})`,
                border: `1px solid ${rgba("#7aeaf5", 0.08 + front * 0.22)}`,
                boxShadow: [
                  `inset 1px 1px 1px ${rgba("#d8fbff", front * 0.3)}`,
                  `inset -1px -1px 2px ${rgba("#000018", 0.4)}`,
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
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgb(95_137_255/0.34)_0%,transparent_62%)] blur-2xl" />
      <div className="absolute inset-[26%] rounded-full bg-[radial-gradient(circle,rgb(183_98_170/0.2)_0%,transparent_66%)] blur-2xl" />

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
