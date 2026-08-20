"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown, MapPin } from "lucide-react";
import { event, forums } from "@/data/event";
import { speakerCount } from "@/data/speakers";
import { REGISTER_URL } from "@/lib/config";
import { useCountdown } from "@/lib/useCountdown";
import { Cta } from "@/components/ui/Cta";
import { OrbitRing } from "@/components/home/OrbitRing";

function Countdown() {
  const t = useCountdown(event.startDate);
  const cells = [
    { v: t?.days, l: "天" },
    { v: t?.hours, l: "時" },
    { v: t?.minutes, l: "分" },
    { v: t?.seconds, l: "秒" },
  ];
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {cells.map((c, i) => (
        <div key={c.l} className="flex items-center gap-3 sm:gap-4">
          <div className="text-center">
            <div className="font-display min-w-[46px] text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
              {c.v === undefined ? "––" : String(c.v).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[11px] tracking-[0.2em] text-ink-4">{c.l}</div>
          </div>
          {i < cells.length - 1 && <span className="pb-5 text-xl text-ink-4">:</span>}
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // 文字區塊與玻璃環共用同一組捲動位移/淡出 → 兩者永遠平行、一起移動，不獨立漂移
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const rise = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.12 * i, duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
      <section
        ref={ref}
        className="grain relative flex min-h-[100svh] snap-start items-center overflow-hidden pt-[72px] md:pt-[88px] [scroll-margin-top:-88px]"
      >
        {/* 底層光暈 */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-[10%] top-[-14%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgb(76_104_212/0.34)_0%,transparent_62%)]" />
          <div className="absolute -left-[18%] bottom-[-22%] h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] rounded-full bg-[radial-gradient(circle,rgb(176_68_122/0.20)_0%,transparent_65%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg to-transparent" />
        </div>

        {/* KV 光軌 —— 破碎玻璃環：absolute 在 section 內，並套用與文字相同的 copyY / copyOpacity
            → 與文字區塊永遠平行、一起移動與淡出，不獨立漂移。z-[5] 低於文字 z-10。
            外層做置中定位、copyY 放中層（避免與 -translate-y-1/2 的 transform 打架），淡出放內層 */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-60%] top-1/2 z-[5] h-[104vw] w-[104vw] -translate-y-1/2 opacity-70 md:right-[-8%] md:h-[112vh] md:w-[112vh] md:opacity-100 lg:right-[-1%] lg:h-[116vh] lg:w-[116vh]"
        >
          <motion.div style={{ y: copyY }} className="h-full w-full">
            <motion.div style={{ opacity: copyOpacity }} className="h-full w-full">
              <OrbitRing />
            </motion.div>
          </motion.div>
        </div>

        {/* 手機版：光軌在文字正後方，加一層遮罩保住可讀性（z-[6] 蓋在環 z-[5] 之上） */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-b from-bg via-bg/75 to-bg/20 md:hidden"
        />

        {/* 文字區柔化：左側（文字所在）半透明遮罩，往右淡出 → 磚塊轉進文字區會變淡（非全透明），
            轉出去恢復原本透明度。z-[7] 介於環 z-5 與文字 z-10 之間 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[7] hidden w-[66%] bg-gradient-to-r from-bg/70 via-bg/35 to-transparent md:block"
        />

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="shell relative z-10 py-8">
        <div className="max-w-2xl">
          {/* 1. 第四屆・雙峰論壇 —— 放大、去掉底框，改成 eyebrow 標籤 */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0}
            className="flex items-center gap-3"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orbit-sky opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orbit-sky" />
            </span>
            <span className="font-display text-[clamp(0.95rem,2.3vw,1.45rem)] font-medium tracking-[0.3em] text-ink-2">
              {event.editionLabel}・{event.subtitle}
            </span>
          </motion.div>

          {/* 2. 2026 · 10.14 → 15 */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2"
          >
            <span className="font-display text-orbit text-[clamp(2.2rem,6vw,3.5rem)] font-semibold tracking-[0.22em]">
              2026
            </span>
            <span className="font-display text-[clamp(1.1rem,3.4vw,1.6rem)] font-medium tracking-wide text-ink-2">
              {event.dateLabel}
            </span>
          </motion.div>

          {/* 3. 台灣新創投資年會 —— 放大加長、可與圓圈重疊（z-10 壓在圓圈上，圓圈掠過會漸淡漸深） */}
          <motion.h1
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-3 whitespace-nowrap text-[clamp(2.1rem,7vw,4.9rem)] font-black leading-[1.02] tracking-[0.18em]"
          >
            <span className="text-fade">台灣新創投資年會</span>
          </motion.h1>

          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-4 max-w-xl text-[15px] leading-[1.8] text-ink-2 md:text-base"
          >
            {event.tagline}，{event.taglineSub}。
            <br className="hidden sm:block" />
            兩天雙峰論壇，
            {forums.map((f, i) => (
              <span key={f.key}>
                {i > 0 && "、"}
                <span className="text-ink">{f.dateLabel.replace(/ /g, "")} {f.name}</span>
              </span>
            ))}
            ，{speakerCount} 位創業家與機構投資人同場。
          </motion.p>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-3 text-sm text-ink-3"
          >
            <a
              href={event.venue.mapUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 underline-offset-4 transition-colors hover:text-ink-2 hover:underline"
            >
              <MapPin size={15} className="shrink-0" />
              <span>
                {event.venue.name}　{event.venue.detail}
              </span>
            </a>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-5 flex flex-wrap items-center gap-4"
          >
            <Cta href={REGISTER_URL} size="lg">
              立即報名
            </Cta>
            <Cta href="#speakers" variant="ghost" size="lg">
              查看講者陣容
            </Cta>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={6}
            className="mt-6 border-t border-white/8 pt-4"
          >
            <p className="mb-2 text-[11px] tracking-[0.24em] text-ink-4">距離開幕</p>
            <Countdown />
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="向下捲動"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-4 transition-colors hover:text-ink-2 lg:flex"
      >
        <span className="font-display text-[10px] tracking-[0.3em]">SCROLL</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
