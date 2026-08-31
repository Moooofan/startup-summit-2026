"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { event, forums } from "@/data/event";
import { Cta } from "@/components/ui/Cta";
import { OrbitRing } from "@/components/home/OrbitRing";
import { FlipClock } from "@/components/home/FlipClock";
import { HomeBackdrop } from "@/components/home/HomeBackdrop";
import { isPublicRoute } from "@/lib/config";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // 文字區塊與玻璃環共用同一組捲動位移/淡出 → 兩者永遠平行、一起移動，不獨立漂移
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // 進場更俐落：縮短 stagger 與 duration → 最後元素約 1.1s 就收尾（原本 1.57s）。
  // 這同時把玻璃環能安全掛載的「閘門」往前移 → 玻璃盤更早出現而不搶幀（見 OrbitRing 1150ms）。
  const rise = {
    hidden: { opacity: 0, y: 22 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.08 * i, duration: 0.62, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
      <section
        ref={ref}
        className="grain relative flex min-h-[100svh] snap-start items-center overflow-hidden pt-[72px] md:pt-[88px] [scroll-margin-top:-88px]"
      >
        {/* 首頁第一屏專屬：左半滿版歷屆活動照 + 右緣撕紙斜線（只在 Hero，捲走即回歸原背景） */}
        <HomeBackdrop />

        {/* 底層光暈 */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-[10%] top-[-14%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgb(76_104_212/0.12)_0%,transparent_62%)]" />
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
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="font-display text-[clamp(0.95rem,2.3vw,1.45rem)] font-medium tracking-[0.3em] text-gold">
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
            {/* 2026 用淺色（brand-glow 淺靛藍）把搶眼的漸層讓給下方主標語；
                日期則加深（ink-2）保住可讀性 —— 淺色在淺底上對比不足。 */}
            <span className="font-display text-[clamp(2.2rem,6vw,3.5rem)] font-semibold tracking-[0.22em] text-brand-glow">
              2026
            </span>
            <span className="font-display text-[clamp(1.1rem,3.4vw,1.6rem)] font-medium tracking-wide text-ink-2">
              {event.dateLabel}
            </span>
          </motion.div>

          {/* 3. 台灣新創投資年會 —— 標題後方加圓弧霧面玻璃（玻璃環 z-5 之上、文字之下），
              環的邊緣掠過標題時，透過這片霧面看起來像被稍微阻擋。radial 遮罩讓邊緣柔化成弧形透鏡。 */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
            className="relative mt-3 w-fit"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-12 -inset-y-6 -z-[1] rounded-full"
              style={{
                // 半透明霧面片：在文字之下、玻璃環之上 → 遮住後方的環，
                // 環的邊緣轉到標題後方時被擋住、轉出去再顯現。backdrop-blur 為加成（部分情境有效）。
                background:
                  "radial-gradient(72% 62% at 50% 50%, rgba(214,226,255,0.20) 0%, rgba(214,226,255,0.11) 46%, rgba(214,226,255,0.03) 74%, transparent 100%)",
                backdropFilter: "blur(9px)",
                WebkitBackdropFilter: "blur(9px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            />
            <h1 className="relative whitespace-nowrap text-[clamp(2.1rem,7vw,4.9rem)] font-black leading-[1.02] tracking-[0.18em] text-ink">
              <span>台灣新創投資年會</span>
            </h1>
          </motion.div>

          {/* 主標語（取代原本的 tagline 句）：點出「社群出身、年度最大規模」的定位。
              custom 用 2.6（非整數）刻意夾在標題 2 與下段 3 之間，讓進場多這一段仍不會把
              最後一個元素推過 OrbitRing 的掛載閘門（~1150ms，見上方 rise 註解）。 */}
          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2.6}
            className="mt-4 w-fit text-[clamp(1.05rem,3.4vw,1.55rem)] font-semibold leading-snug tracking-[0.04em]"
            style={{
              // 沿用原本 2026 的斜向光軌漸層（藍→紫→粉）；w-fit 讓漸層貼齊文字寬度、
              // 色階分佈與 2026 一致，而非攤在整行。
              backgroundImage: "linear-gradient(118deg,#6d8bd6 0%,#8f7fd0 55%,#c58bb0 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            社群原生，年度最盛大的新創投資年會
          </motion.p>

          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-3 max-w-xl text-[18px] leading-[1.8] text-ink-2 md:text-base"
          >
            兩天雙峰論壇，
            {/* /agenda 隱藏期間降級為純文字 —— 內容仍要讀得到，只是不再是連結。 */}
            {forums.map((f, i) => (
              <span key={f.key}>
                {i > 0 && "、"}
                {isPublicRoute("/agenda") ? (
                  <Link
                    href={`/agenda#${f.key}`}
                    className="font-bold text-ink underline-offset-4 transition-colors hover:text-brand-lift hover:underline"
                  >
                    {f.dateLabel.replace(/ /g, "")} {f.name}
                  </Link>
                ) : (
                  <span className="font-bold text-ink">
                    {f.dateLabel.replace(/ /g, "")} {f.name}
                  </span>
                )}
              </span>
            ))}
            。
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
              <MapPin size={15} className="shrink-0 text-gold" />
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
            {/* 兩顆刻意互為鏡像（藍→紫 / 紫→藍），用色向做出主次差異。
                alpha 同樣由 0.78 遞減到 0.64，右端最透。

                之所以能安全反轉，是因為兩端都是靖藍 #4c68d4 與紫 #8b6ed8，
                白字對比 3.4:1 / 2.9:1 都還撐得住。
                ⚠️ 若日後又在漸層裡加入淺藍／青色，就不能再鏡像 ——
                高亮度的青色一旦轉到文字底下，白字會掉到約 1.9:1。
                ⚠️ 這裡若寫回不透明的 hex，會蓋掉半透明底 → 玻璃效果整個失效。 */}
            {/* 目的地跟著可見分頁走：/about、/tickets 隱藏期間改導向仍公開的頁面，
                避免首頁主要 CTA 把人送到看不到的分頁（見 lib/config 的 PUBLIC_ROUTES）。 */}
            <Cta
              href={isPublicRoute("/about") ? "/about" : "/speakers"}
              variant="gradient"
              size="lg"
              className="[background-image:linear-gradient(110deg,rgb(76_104_212/0.78)_0%,rgb(139_110_216/0.64)_100%)]"
            >
              查看詳情
            </Cta>
            <Cta
              href={isPublicRoute("/tickets") ? "/tickets" : "/review"}
              variant="gradient"
              size="lg"
              className="[background-image:linear-gradient(110deg,rgb(139_110_216/0.78)_0%,rgb(76_104_212/0.64)_100%)]"
            >
              {isPublicRoute("/tickets") ? "立即報名" : "歷屆回顧"}
            </Cta>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={6}
            className="mt-6 border-t border-black/8 pt-4"
          >
            <p className="mb-3 text-[16px] tracking-[0.24em] text-ink-4">距離開幕</p>
            <FlipClock target={event.startDate} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
