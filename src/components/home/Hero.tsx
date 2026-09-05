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

  /* 「查看詳情」的平滑捲動。只掛在這一顆按鈕上，不是全域行為 ——
     globals.css 那條「全站不開 scroll-behavior: smooth」的禁令原封不動（理由見下方 CTA 註解）。

     用 scrollIntoView 而不是 window.scrollTo：它會自動吃到 CSS 的 scroll-padding-top: 88px
     與 FounderNote 自己的 [scroll-margin-top:-88px]（兩者相消 → 區塊上緣貼齊視窗頂、
     深藍底延伸到導覽列後方，那是該區塊刻意的無縫設計）。落點因此與原生錨點跳轉、
     以及 ScrollSnapController 的節點跳轉完全一致 —— 那支控制器用的也是同一個 API。

     找不到元素就不 preventDefault，交還瀏覽器原生錨點跳轉（漸進增強，JS 壞掉照樣能用）。
     刻意不碰 history：preventDefault 後網址不會多出 #founder，正好避開
     「回上一頁的位置還原」那攤水，而這顆按鈕只是往下捲一屏，沒有需要被分享的落點。 */
  const scrollToFounder = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("founder");
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

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
          <div className="absolute -right-[10%] top-[-14%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgb(95_137_255/0.07)_0%,rgb(95_137_255/0.025)_40%,transparent_72%)]" />
          <div className="absolute -left-[18%] bottom-[-22%] h-[64vw] max-h-[860px] w-[64vw] max-w-[860px] rounded-full bg-[radial-gradient(circle,rgb(183_98_170/0.07)_0%,rgb(183_98_170/0.025)_40%,transparent_72%)]" />
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
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-display text-[clamp(0.95rem,2.3vw,1.45rem)] font-medium tracking-[0.3em] text-accent">
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
            {/* 淺色版的用意是「2026 用淺色、把搶眼的漸層讓給下方主標語」。
                深色版這個階序會反過來：brand-glow 在深底上變成很亮的一支，
                反而比下方標語更搶眼。目前先維持原 token，待業主看截圖決定
                是否降到 ink-3。日期維持 ink-2。 */}
            <span className="font-display text-[clamp(2.2rem,6vw,3.5rem)] font-semibold tracking-[0.22em] text-brand-glow">
              2026
            </span>
            <span className="font-display text-[clamp(1.1rem,3.4vw,1.6rem)] font-medium tracking-wide text-ink-2">
              {event.dateLabel}
            </span>
          </motion.div>

          {/* 3. 台灣新創投資年會。

              這裡曾經有一片圓弧霧面玻璃（radial 暗片 + backdrop-blur），夾在玻璃環 z-5 與文字之間，
              用來遮住標題後方的光軌。深色改版後移除，**別再加回來** —— 兩個成因都是「局部遮蔽」
              本身的性質，調參數救不回：

              1. backdrop-filter 只作用在元素**範圍內** → 背後的照片在片內模糊、片外清晰，
                 那道接縫就是一圈看得見的膠囊形邊界。淺色版時背後是均勻白霧，模糊與否看不出差別，
                 所以這個缺陷一直存在卻沒被發現。
              2. 深底上「模糊」擋得住形狀、擋不住亮度（發光的碎玻璃糊成 9px 後仍然發光），
                 遮蔽只能改由顏色承擔；而一塊夠深的色斑蓋在 HomeBackdrop 的活動照上，
                 就會把左側那些人臉壓暗成一個明顯的橢圓 —— 業主 2026/9 指出的正是這個。

              要壓住光軌，請改調下方 z-[7] 那層**滿高度**的文字遮罩：它右端已是 to-transparent，
              怎麼調都不會產生邊界。全域漸層讀起來是環境明暗，局部色塊讀起來是一個物件。 */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
            className="relative mt-3 w-fit"
          >
            {/* max-[359px] 這段是給 320px 級距（iPhone SE 1 代）的救命索，不是設計調整：
                clamp 的下限 2.1rem（33.6px）搭配 whitespace-nowrap 與 tracking-[0.18em]，
                八個字實際要 8 × 1.18em ≈ 317px，但 320px 螢幕扣掉 .shell 左右各 20px 只剩 280px
                → 標題右緣被本 section 的 overflow-hidden 裁掉（不會有捲軸，所以很容易漏看）。
                降到 1.7rem 後約 257px，留 23px 餘裕。360px 以上不觸發，視覺完全不變 ——
                刻意不改 clamp 下限，因為那會連帶把 360–393px 的常見手機一起縮小。 */}
            <h1 className="relative whitespace-nowrap text-[clamp(2.1rem,7vw,4.9rem)] font-black leading-[1.02] tracking-[0.18em] text-ink max-[359px]:text-[1.7rem]">
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
              // 青→白（業主 2026/9）。原本的藍→紫→粉是舊主視覺遺留，新 KV 沒有紫與粉。
              // 中停刻意比線性內插更偏青，不然句子中段就洗白、尾巴整段沒有顏色。
              // w-fit 讓漸層貼齊文字寬度，色階不會攤在整行。
              backgroundImage: "linear-gradient(118deg,#68d1ee 0%,#9adef4 52%,#f2f6ff 100%)",
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
              <MapPin size={15} className="shrink-0 text-accent" />
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
            {/* 深藍玻璃底 + KV 青描邊（業主 2026/9 定案）。
                **主次差異靠描邊亮度**（accent/85 對 accent/55），不再靠色向鏡像 ——
                舊版的「藍→紫 / 紫→藍」裡那個紫是舊主視覺方案 C 的遺留，新 KV 沒有紫，
                而且兩顆飽和度太高，在深底上會蓋過標題與光軌。

                描邊是結構不是裝飾：按鈕填色對頁底只有 1.36:1，輪廓完全靠它撐著，
                調淡按鈕就會消失在背景裡。最壞情況（疊在 HomeBackdrop 照片最亮處）
                主 5.81:1、次 3.34:1，都壓在非文字對比 3:1 以上。

                刻意不用 border-2 做主次區別：兩顆在同一列 flex 裡，2px 高度差看得出來。
                也刻意不加外光暈 —— Tailwind 的 shadow-* / ring-* 會整條覆寫 box-shadow，
                連 .btn-glass 的兩道 inset 鏡面高光一起消失（見 globals.css 的同一個坑）。

                「青色不得進入填色」這條禁令仍然有效：這裡的青只在 1px 描邊上。
                高亮度的青一旦轉到文字底下，白字會掉到約 1.9:1。
                這裡若寫回不透明的 hex，會蓋掉半透明底 → 玻璃效果整個失效。 */}
            {/* 主 CTA 用 REGISTER_URL 而非寫死網址：那個常數的角色就是「報名去向」
                （見 lib/config 的註解）。2026/9 已由佔位錨點 "#tickets" 換成 Accupass 活動頁，
                這裡一行都不用改就自動改指過去 —— 那正是它存在的理由。
                外部網址的 target="_blank" 由 Cta 依 isExternalHref 自動加，不必在此傳。
                Nav 與 TicketPlans 也都吃同一個常數。

                以下是「值還是站內錨點」時的決策紀錄。若日後 REGISTER_URL 換回錨點，
                這兩個理由仍然成立 —— 屆時請維持原生錨點跳轉，不要改成 JS 平滑捲動：
                1. globals.css 已載明全站不開 scroll-behavior: smooth（會害「回上一頁」的
                   位置還原先跳到最上方再滑下來）。
                2. 首頁加了完整議程表之後，Hero 到報名資訊之間隔了創辦人的話 + 兩天 35 列議程，
                   距離接近十個螢幕高 —— 平滑捲動要滑一兩秒、中間畫面糊成一片，比直接跳更差。
                錨點情境下導覽列的偏移由 globals.css 的 scroll-padding-top: 88px 處理。

                注意這條禁令的**適用範圍**：理由 1 是針對全域 CSS（html 的 scroll-behavior），
                理由 2 是針對長距離跳轉。下面那顆「查看詳情」只跳一屏、且用的是掛在單顆按鈕上的
                handler，兩個理由都不成立，所以它有平滑捲動並不是違反這裡 —— 詳見該處註解。 */}
            {/* 主 CTA 的底色改吃 globals.css 的 .btn-gradient-primary（同一組值，只是換個寫法）。
                導覽列的報名鈕 2026/9 起也用同一支 —— 兩顆在這一屏同時看得到，色值只能有一個
                定義點。描邊留在呼叫端：亮度差（這顆 accent/85、次 CTA accent/55）就是主次之分。 */}
            <Cta
              href={REGISTER_URL}
              variant="gradient"
              size="lg"
              className="btn-gradient-primary border-accent/85 hover:border-accent"
            >
              立即報名
            </Cta>
            {/* 次要 CTA：業主 2026/9 由「歷屆回顧 → /review」改成「查看詳情 → 同頁的創辦人的話」，
                第一屏的動線因此收斂成「報名」＋「往下看內容」兩件事。
                /review 仍有導覽列（桌機＋手機選單）與頁尾兩個常駐入口，不會變成孤島。

                href 用裸的 #founder，與 layout.tsx 的 skip link（#main）一致 ——
                站內同頁錨點就是這樣寫；帶斜線的 /#xxx 只用在跨頁指回首頁（如講者內頁的 /#agenda）。

                這裡加了 JS 平滑捲動，與上方主 CTA 註解裡「不要改成 JS 平滑捲動」**不衝突**，
                因為那條禁令的兩個理由在這裡都不成立：
                1. 那條講的是**全域 CSS**（html 的 scroll-behavior）。我們沒動它，
                   這只是掛在單一顆按鈕上的 handler，回上一頁的位置還原完全不受影響。
                2. 那條講的是**距離**（Hero 到報名資訊隔了將近十個螢幕）。FounderNote 是
                   首頁第二個區塊、就在 Hero 正下方，只有一屏，不會有「滑一兩秒、畫面糊掉」的問題。
                捲動本身尊重 prefers-reduced-motion，見上方 scrollToFounder。 */}
            <Cta
              href="#founder"
              variant="gradient"
              size="lg"
              onClick={scrollToFounder}
              className="[background-image:linear-gradient(110deg,rgb(22_34_78/0.82)_0%,rgb(16_26_64/0.72)_100%)] border-accent/55 hover:border-accent/85"
            >
              查看詳情
            </Cta>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={6}
            className="mt-6 border-t border-line-soft pt-4"
          >
            <p className="mb-3 text-[16px] tracking-[0.24em] text-ink-4">距離開幕</p>
            <FlipClock target={event.startDate} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
