"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown, MapPin } from "lucide-react";
import { event, forums } from "@/data/event";
import { speakerCount } from "@/data/speakers";
import { REGISTER_URL } from "@/lib/config";
import { useCountdown } from "@/lib/useCountdown";
import { Cta } from "@/components/ui/Cta";

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

  const orbitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 170]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 14]);
  const orbitScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.14]);
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
      className="grain relative flex min-h-[100svh] items-center overflow-hidden pt-[72px] md:pt-[88px]"
    >
      {/* 底層光暈 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[10%] top-[-14%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgb(76_104_212/0.34)_0%,transparent_62%)]" />
        <div className="absolute -left-[18%] bottom-[-22%] h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] rounded-full bg-[radial-gradient(circle,rgb(176_68_122/0.20)_0%,transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* KV 光軌（取自主視覺方案 C，去底轉為發光體） */}
      <motion.div
        aria-hidden
        style={{ y: orbitY, rotate: orbitRotate, scale: orbitScale }}
        className="pointer-events-none absolute right-[-34%] top-[66%] w-[150vw] max-w-[1180px] -translate-y-1/2 opacity-50 md:right-[-14%] md:top-1/2 md:w-[86vw] md:opacity-100 lg:right-[-6%] lg:w-[64vw]"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -16, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <Image
            src="/kv/orbit-bloom-v2.png"
            alt=""
            width={955}
            height={755}
            priority
            className="absolute inset-0 h-full w-full opacity-70 mix-blend-screen"
          />
          <Image
            src="/kv/orbit-glow-v2.png"
            alt=""
            width={955}
            height={755}
            priority
            className="relative h-auto w-full opacity-90"
          />
        </motion.div>
      </motion.div>

      {/* 手機版：光軌在文字正後方，加一層遮罩保住可讀性 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-bg/75 to-bg/20 md:hidden"
      />

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="shell relative z-10 py-14">
        <div className="max-w-2xl">
          <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
            <span className="glass inline-flex items-center gap-2.5 rounded-pill px-4 py-2 text-[13px] text-ink-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orbit-sky opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orbit-sky" />
              </span>
              {event.editionLabel}・{event.subtitle}
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-[clamp(2.4rem,7.6vw,4.7rem)] font-black leading-[1.06] tracking-tight"
          >
            <span className="text-fade block">台灣新創</span>
            <span className="text-fade block">投資年會</span>
          </motion.h1>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-3"
          >
            <span className="font-display text-orbit text-[clamp(2.4rem,7vw,4rem)] font-semibold tracking-[0.22em]">
              2026
            </span>
            <span className="font-display text-[clamp(1.1rem,3.4vw,1.6rem)] font-medium tracking-wide text-ink-2">
              {event.dateLabel}
            </span>
          </motion.div>

          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-6 max-w-xl text-[15px] leading-[1.9] text-ink-2 md:text-base"
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
            className="mt-5 flex items-center gap-2 text-sm text-ink-3"
          >
            <MapPin size={15} className="shrink-0" />
            <span>
              {event.venue.name}　{event.venue.detail}
            </span>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-8 flex flex-wrap items-center gap-4"
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
            className="mt-10 border-t border-white/8 pt-6"
          >
            <p className="mb-3 text-[11px] tracking-[0.24em] text-ink-4">距離開幕</p>
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
