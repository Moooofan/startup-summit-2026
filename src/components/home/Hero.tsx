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
import { isPublicRoute, REGISTER_URL } from "@/lib/config";

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
          {/* 兩團光的位置沿用原構圖，色相改吃主視覺：右上是中藍量體、左下是深靛的餘光。
              左下那團原本是洋紅 —— 新主視覺整張圖沒有暖色，改成低彩度的藍紫，
              才不會在深靛底上冒出一塊突兀的粉。 */}
          <div className="absolute -right-[10%] top-[-14%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgb(43_92_255/0.22)_0%,transparent_62%)]" />
          <div className="absolute -left-[18%] bottom-[-22%] h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] rounded-full bg-[radial-gradient(circle,rgb(96_78_210/0.18)_0%,transparent_65%)]" />
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
            className="flex"
          >
            {/* 主視覺左上角那顆「第四屆」徽章：圓角膠囊、銀紫漸層底、細亮框。
                原本是「金色小圓點 + 純文字」，改成徽章是為了對上 KV 的第一個視覺物件。
                w-fit + inline-flex：膠囊要貼齊文字寬度，不能撐滿整列。 */}
            <span className="inline-flex w-fit items-center gap-2.5 rounded-pill border border-white/25 px-4 py-1.5 backdrop-blur-sm [background-image:linear-gradient(120deg,rgb(143_142_173/0.34)_0%,rgb(253_254_249/0.16)_48%,rgb(108_113_171/0.28)_100%)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
              </span>
              <span className="font-display text-[clamp(0.85rem,2vw,1.15rem)] font-medium tracking-[0.28em] text-ink">
                {event.editionLabel}・{event.subtitle}
              </span>
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
            {/* 深色版：2026 改吃主視覺的青色高光（#8cf5ff，全圖最亮的那一點），
                日期退到 ink-2 —— 兩者的亮度差本身就是階層，不必再靠字重拉開。
                字重一併降到 light，對齊 KV 的細筆畫拉丁字。 */}
            <span className="font-display text-[clamp(2.2rem,6vw,3.5rem)] font-light tracking-[0.24em] text-aqua">
              2026
            </span>
            <span className="font-display text-[clamp(1.1rem,3.4vw,1.6rem)] font-light tracking-[0.14em] text-ink-2">
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
                // 深色版必須改成「壓暗」而非淺色版的「提亮」：在深靛底上疊一片淺霧
                // 會變成一塊發亮的橢圓，比它要遮的玻璃環還搶眼。
                background:
                  "radial-gradient(72% 62% at 50% 50%, rgba(4,9,42,0.62) 0%, rgba(4,9,42,0.42) 46%, rgba(4,9,42,0.14) 74%, transparent 100%)",
                backdropFilter: "blur(9px)",
                WebkitBackdropFilter: "blur(9px)",
                boxShadow: "inset 0 1px 0 rgba(160,190,255,0.12)",
              }}
            />
            {/* max-[359px] 這段是給 320px 級距（iPhone SE 1 代）的救命索，不是設計調整：
                clamp 的下限 2.1rem（33.6px）搭配 whitespace-nowrap 與 tracking-[0.18em]，
                八個字實際要 8 × 1.18em ≈ 317px，但 320px 螢幕扣掉 .shell 左右各 20px 只剩 280px
                → 標題右緣被本 section 的 overflow-hidden 裁掉（不會有捲軸，所以很容易漏看）。
                降到 1.7rem 後約 257px，留 23px 餘裕。360px 以上不觸發，視覺完全不變 ——
                刻意不改 clamp 下限，因為那會連帶把 360–393px 的常見手機一起縮小。 */}
            {/* 字重 font-light（300）而非原本的 font-black：主視覺的中文標題是細筆畫、
                大字距的處理，粗黑體會把 KV 的空氣感整個吃掉。
                中文是等寬字（全形 1em advance），改字重不影響行寬 ——
                上面那條 320px 的救命索算式因此完全不受影響，仍然成立。
                tracking 維持 0.18em，不要調大：0.22em 會讓 360px 螢幕溢出約 8px。 */}
            <h1 className="text-kv relative whitespace-nowrap text-[clamp(2.1rem,7vw,4.9rem)] font-light leading-[1.02] tracking-[0.18em] max-[359px]:text-[1.7rem]">
              <span>台灣新創投資年會</span>
            </h1>
          </motion.div>

          {/* 主視覺中文標題正下方那行拉丁字。KV 有這一行，站上原本沒有 ——
              它是把 KV 的「中文主標 + 英文副標」雙層鎖定搬過來，不是新增文案：
              字串直接取自 event.nameEn，沒有另外編。
              手機容不容得下交給 wrap（tracking 也跟著收）：43 個字元在 320px 螢幕
              放不下一行，硬用 nowrap 會被 section 的 overflow-hidden 裁掉右緣。 */}
          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2.3}
            className="font-display mt-3 max-w-xl text-[clamp(0.66rem,1.7vw,0.86rem)] font-light leading-[2] tracking-[0.18em] text-ink-3 sm:tracking-[0.26em]"
          >
            {event.nameEn.toUpperCase()}
          </motion.p>

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
              // 主視覺色帶：青 #8cf5ff → 電光藍 → logo 紫。
              // w-fit 讓漸層貼齊文字寬度，色階分佈才不會攤在整行變成一片單色。
              backgroundImage: "linear-gradient(118deg,#8cf5ff 0%,#6f9bff 52%,#b48cf5 100%)",
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
              <MapPin size={15} className="shrink-0 text-aqua" />
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
                alpha 同樣由 0.88 遞減到 0.72，右端最透。

                之所以能安全反轉，是因為兩端都是電光藍 #2b5cff 與 logo 紫 #7e5cf0，
                在深靛底上合成後白字對比 6.1:1 / 7.0:1，兩個方向都過 AA。
                若日後在漸層裡加入主視覺那支青色 #8cf5ff 就不能再鏡像 ——
                高亮度的青色一旦轉到文字底下，白字會掉到 2:1 上下。
                這裡若寫回不透明的 hex，會蓋掉半透明底 → 玻璃效果整個失效。 */}
            {/* 主 CTA 用 REGISTER_URL 而非寫死 "#tickets"：那個常數的角色就是「報名去向」
                （見 lib/config 的註解），目前值是首頁報名資訊那一節的錨點，Accupass 連結一填
                就會自動改指過去，不必再回來改 Hero。Nav 與 TicketPlans 也都吃同一個常數。

                刻意用原生錨點跳轉，不做 JS 平滑捲動，兩個理由：
                1. globals.css 已載明全站不開 scroll-behavior: smooth（會害「回上一頁」的
                   位置還原先跳到最上方再滑下來）。
                2. 首頁加了完整議程表之後，Hero 到報名資訊之間隔了創辦人的話 + 兩天 35 列議程，
                   距離接近十個螢幕高 —— 平滑捲動要滑一兩秒、中間畫面糊成一片，比直接跳更差。
                導覽列的偏移由 globals.css 的 scroll-padding-top: 88px 處理。 */}
            <Cta
              href={REGISTER_URL}
              variant="gradient"
              size="lg"
              className="[background-image:linear-gradient(110deg,rgb(43_92_255/0.88)_0%,rgb(126_92_240/0.72)_100%)]"
            >
              立即報名
            </Cta>
            <Cta
              href="/review"
              variant="gradient"
              size="lg"
              className="[background-image:linear-gradient(110deg,rgb(126_92_240/0.88)_0%,rgb(43_92_255/0.72)_100%)]"
            >
              歷屆回顧
            </Cta>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={6}
            className="mt-6 border-t border-white/10 pt-4"
          >
            <p className="mb-3 text-[16px] tracking-[0.24em] text-ink-4">距離開幕</p>
            <FlipClock target={event.startDate} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
