/**
 * SiteBackdrop —— 全站固定背景層，重製 2026 主視覺（`source/背景.jpg`）的構圖。
 *
 * 取代原本的「/bg.jpg 水墨圖 + blur(26px) + 白霧」淺色底。為什麼不直接把那張 KV
 * 當背景圖鋪上去：原稿是點陣圖、且標題文字燒在圖上（左半整片都是字），
 * 鋪成背景會和站上的真實 HTML 標題疊字。改成用 SVG 把它的**幾何語彙**重畫一次 ——
 * 細線三角、同心弧帶、水平線填色塊、青色高光 —— 解析度無上限、也不會撞字。
 *
 * 構圖沿用 KV 的分工，這同時就是可讀性的保障：
 *   左半 = 近乎純色的深靛（放文字），右半 = 線構圖與光（放視覺）。
 * 左側那層 scrim 不是「壓暗裝飾」而已，它是文字對比的地板 —— 調淡之前先確認
 * 深色底上的 ink-4（4.8:1）不會掉到 4.5 以下。
 *
 * 純 Server Component：整層沒有任何互動、也不需要瀏覽器 API，
 * 唯一的動態是 .animate-kv-breathe（CSS，reduced-motion 於 globals.css 已全域處理）。
 *
 * ## 橫式與直式是兩套構圖，不是同一套的裁切
 *
 * 起初只有一套 16:9 的 viewBox，配 `xMaxYMid slice` 讓它在各尺寸「填滿」。
 * 那在桌機成立，在直式手機上會壞掉，而且壞得很徹底：slice 是靠**高度**撐滿的，
 * 390x844 的螢幕只看得到 1600 單位裡的約 416 單位、還靠右對齊，
 * 於是住在 x 620-1210 的「4」只剩 4% 在畫面內 —— 主視覺最有辨識度的量體整個消失。
 * 實測「4」的入鏡比例：iPhone SE 20%、iPhone 14 4%、Pixel 7 3%、iPad 48%、桌機 100%。
 *
 * 這不是參數調得不夠好，是 16:9 的橫式構圖放不進 0.46 的直式畫面 ——
 * 任何裁切法都得犧牲掉某一半。所以手機給一套自己的直式構圖：
 * 同一組語彙（斜筆「4」、同心弧、青色橫帶、細線填充、細線扇），重新排位。
 *
 * 直式 viewBox 440x950（比例 0.463）刻意貼著主流手機：
 * 390x844 上縮放約 0.888，等於幾乎 1:1 對映，上下左右都不太裁 ——
 * 座標可以當成「就是螢幕上的位置」來調，不必再心算裁切後的可見範圍。
 *
 * 兩顆 svg 的 `<defs>` 一律用 `gradientUnits="userSpaceOnUse"`，座標綁在各自的 viewBox 上，
 * 所以**不能共用一組 defs**，id 一律加 `-m` 後綴區分（兩顆都在 DOM 裡，撞 id 會取到前一個）。
 */

/* ==========================================================================
   橫式（md 以上）：16:9，對應 KV 原稿的比例
   ========================================================================== */
const VB_W = 1600;
const VB_H = 900;

/* 「4」字斜筆：由左下往右上的三角形，是整張 KV 最主要的量體。
   兩組座標（實心線 + 外擴的輪廓線）刻意分開寫，方便日後各自微調角度。 */
const WEDGE = "620,900 1210,150 1210,900";
const WEDGE_OUTLINE = "512,900 1150,60 1150,240";

/* 右側同心弧帶（KV 的圓角「D」）：同心圓半徑由內而外，畫成右半圓。
   八條、間距 13 —— 少於六條看起來像隨手畫的圓，多於十條在手機上會糊成一塊。 */
const ARC_CENTER = { x: 1180, y: 620 };
const ARC_RADII = [188, 201, 214, 227, 240, 253, 266, 279];

/* ==========================================================================
   直式（md 以下）：440x950

   量體佔畫面的比例比橫式版大一階是刻意的 —— 直式畫面窄，同樣的視覺重量需要更大的佔比，
   照橫式的比例等比縮小會變成「角落一個小圖示」，等於換個方式再消失一次。
   ========================================================================== */
const VB_W_M = 440;
const VB_H_M = 950;

const WEDGE_M = "110,790 365,205 365,790";
const WEDGE_OUTLINE_M = "58,845 328,118 328,232";

/* 弧帶圓心壓在接近右邊界處：右半圓有一半在畫面外，讓構圖「出血」而不是擺一個完整的圓
   —— 完整的圓會讀成一個圖示，半個才讀得出是更大構圖的一部分。
   半徑間距 12（橫式是 13）：直式縮放約 0.888、橫式約 0.9，間距等比縮才對得起來。 */
const ARC_CENTER_M = { x: 378, y: 585 };
const ARC_RADII_M = [126, 138, 150, 162, 174, 186, 198, 210];

/** 右半圓路徑：從正上方順時針掃到正下方。 */
function halfArc(r: number, c: { x: number; y: number }) {
  return `M ${c.x} ${c.y - r} A ${r} ${r} 0 0 1 ${c.x} ${c.y + r}`;
}

export function SiteBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1／底色：深靛。取樣自 KV 左半（#01003d 一帶），往右上與右下各放一團藍光，
          對應原圖「右上中藍、右下電光藍」的分佈。橫式直式共用這一層。 */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(120% 88% at 84% 12%, rgb(19 46 158 / 0.85) 0%, transparent 58%)",
            "radial-gradient(96% 76% at 96% 78%, rgb(13 39 250 / 0.55) 0%, transparent 56%)",
            "radial-gradient(70% 60% at 58% 100%, rgb(10 26 130 / 0.5) 0%, transparent 62%)",
            "linear-gradient(158deg, #030726 0%, #04093a 38%, #030621 78%, #02040f 100%)",
          ].join(","),
        }}
      />

      {/* 2a／線構圖・橫式。
          xMaxYMid 而非常見的 xMidYMid：md-lg 之間仍會裁掉一些寬度，
          xMax 保證「右側的弧帶與方塊」永遠在畫面內，構圖不會只剩中間的空白過渡區。 */}
      <div className="absolute inset-0 hidden md:block">
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
        >
          <defs>
            {/* KV 的招牌質感：塊面不是實心填色，而是等距水平細線。
                patternUnits 用 userSpaceOnUse → 線距固定在 viewBox 座標，
                塊面大小改變時線不會跟著被拉粗或壓扁。 */}
            <pattern id="kv-hatch" width="10" height="9" patternUnits="userSpaceOnUse">
              <rect width="10" height="1" fill="#b1bee8" opacity="0.34" />
            </pattern>
            <pattern id="kv-hatch-dense" width="10" height="6" patternUnits="userSpaceOnUse">
              <rect width="10" height="1" fill="#cfe6ff" opacity="0.3" />
            </pattern>

            {/* 斜筆的量體漸層：左下暗、右上帶電光藍，與底層的光團同向 */}
            <linearGradient id="kv-wedge" x1="620" y1="900" x2="1210" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#050b34" stopOpacity="0" />
              <stop offset="0.45" stopColor="#12308f" stopOpacity="0.5" />
              <stop offset="1" stopColor="#2b5cff" stopOpacity="0.72" />
            </linearGradient>

            {/* 中央那條青色橫帶 —— KV 全圖唯一的高彩度區，也是視覺焦點 */}
            <linearGradient id="kv-cyan" x1="820" y1="0" x2="1330" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1a4ae0" stopOpacity="0.15" />
              <stop offset="0.62" stopColor="#5fd8f5" stopOpacity="0.62" />
              <stop offset="1" stopColor="#8cf5ff" stopOpacity="0.28" />
            </linearGradient>

            {/* 弧帶的漸層描邊：上端淡、中段亮、下端再淡 → 線像繞著看不見的球面走 */}
            <linearGradient id="kv-arc" x1="1180" y1="340" x2="1180" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#b1bee8" stopOpacity="0.12" />
              <stop offset="0.45" stopColor="#cfe6ff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#7fa0ff" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="kv-block" x1="1240" y1="120" x2="1600" y2="760" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1836b8" stopOpacity="0.42" />
              <stop offset="1" stopColor="#0a1663" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* 右緣色塊：KV 右側是幾片深淺不一的藍色矩形，讓右半不至於只有線 */}
          <rect x="1246" y="96" width="354" height="664" fill="url(#kv-block)" />
          <rect x="1330" y="620" width="270" height="280" fill="#0d27fa" opacity="0.16" />

          {/* 「4」斜筆：量體 + 線填充 + 一條亮邊。
              線填充疊在量體之上（同一組座標畫兩次）—— 若把 hatch 併進漸層 fill，
              線的透明度會被漸層的 stopOpacity 乘掉，右上角的線就會消失。 */}
          <polygon points={WEDGE} fill="url(#kv-wedge)" />
          <polygon points={WEDGE} fill="url(#kv-hatch)" opacity="0.55" />
          <polygon points={WEDGE_OUTLINE} stroke="#b1bee8" strokeOpacity="0.22" strokeWidth="1" />

          {/* 中央青色橫帶：KV 的視覺焦點，線填充用較密的一組 */}
          <g>
            <rect x="820" y="470" width="510" height="132" fill="url(#kv-cyan)" />
            <rect x="820" y="470" width="510" height="132" fill="url(#kv-hatch-dense)" />
          </g>

          {/* 右側同心弧帶 */}
          <g stroke="url(#kv-arc)" strokeWidth="1.25">
            {ARC_RADII.map((r) => (
              <path key={r} d={halfArc(r, ARC_CENTER)} />
            ))}
          </g>

          {/* 細線扇：從斜筆的斜邊往左下鋪開，補住左半與右半之間的過渡 */}
          <g stroke="#b1bee8" strokeOpacity="0.14" strokeWidth="1">
            {Array.from({ length: 9 }, (_, i) => {
              const t = i / 8;
              return <line key={i} x1={640 + t * 250} y1={900} x2={1150} y2={620 - t * 430} />;
            })}
          </g>
        </svg>
      </div>

      {/* 2b／線構圖・直式（手機）。
          opacity 0.72：直式版的「4」佔畫面近三分之二高，滿版強度會壓過正文；
          橫式版不需要這層折減，因為量體大半落在文字區之外。
          舊版這裡是 0.5，是為了壓住「被 xMax 裁切後放得過大的弧帶」——
          那個成因已經不存在（手機不再吃橫式構圖），所以折減可以放鬆。
          要調整手機背景的存在感，改這個數字就好，別去動幾何。 */}
      <div className="absolute inset-0 opacity-[0.72] md:hidden">
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${VB_W_M} ${VB_H_M}`}
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            {/* 線距與橫式版同為 9 / 6：兩邊的縮放比接近（0.888 vs 0.9），
                同一種材質在手機與桌機上的線距才會是同一個視覺密度。
                改這裡要連 globals.css 的 .kv-hatch 一起改。 */}
            <pattern id="kv-hatch-m" width="10" height="9" patternUnits="userSpaceOnUse">
              <rect width="10" height="1" fill="#b1bee8" opacity="0.34" />
            </pattern>
            <pattern id="kv-hatch-dense-m" width="10" height="6" patternUnits="userSpaceOnUse">
              <rect width="10" height="1" fill="#cfe6ff" opacity="0.3" />
            </pattern>

            <linearGradient id="kv-wedge-m" x1="110" y1="790" x2="365" y2="205" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#050b34" stopOpacity="0" />
              <stop offset="0.45" stopColor="#12308f" stopOpacity="0.5" />
              <stop offset="1" stopColor="#2b5cff" stopOpacity="0.72" />
            </linearGradient>

            <linearGradient id="kv-cyan-m" x1="150" y1="0" x2="440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1a4ae0" stopOpacity="0.15" />
              <stop offset="0.62" stopColor="#5fd8f5" stopOpacity="0.62" />
              <stop offset="1" stopColor="#8cf5ff" stopOpacity="0.28" />
            </linearGradient>

            <linearGradient id="kv-arc-m" x1="378" y1="375" x2="378" y2="950" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#b1bee8" stopOpacity="0.12" />
              <stop offset="0.45" stopColor="#cfe6ff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#7fa0ff" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="kv-block-m" x1="296" y1="86" x2="440" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1836b8" stopOpacity="0.42" />
              <stop offset="1" stopColor="#0a1663" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* 右上色塊：橫式版右緣有兩片矩形，直式畫面只容得下一片。
              擺在「4」的頂點旁邊當支點，右邊界出血。 */}
          <rect x="296" y="86" width="144" height="212" fill="url(#kv-block-m)" />
          <rect x="296" y="86" width="144" height="212" fill="url(#kv-hatch-m)" opacity="0.4" />

          {/* 「4」斜筆：量體 + 線填充 + 亮邊，疊法與橫式版相同（理由見上）。
              頂點 y=205、底邊 y=790 —— 在 390x844 上約等於距頂 182px、距頂 702px，
              也就是整個畫面高度的六成，這就是「手機上看得到主視覺」的那個尺寸。 */}
          <polygon points={WEDGE_M} fill="url(#kv-wedge-m)" />
          <polygon points={WEDGE_M} fill="url(#kv-hatch-m)" opacity="0.55" />
          <polygon points={WEDGE_OUTLINE_M} stroke="#b1bee8" strokeOpacity="0.22" strokeWidth="1" />

          {/* 青色橫帶：橫過畫面中段並穿出右邊界，與「4」交會處就是視覺焦點 */}
          <g>
            <rect x="150" y="468" width="290" height="92" fill="url(#kv-cyan-m)" />
            <rect x="150" y="468" width="290" height="92" fill="url(#kv-hatch-dense-m)" />
          </g>

          {/* 同心弧帶：圓心壓在接近右邊界處，只看得到左半段的弧線 */}
          <g stroke="url(#kv-arc-m)" strokeWidth="1.25">
            {ARC_RADII_M.map((r) => (
              <path key={r} d={halfArc(r, ARC_CENTER_M)} />
            ))}
          </g>

          {/* 細線扇：七條（橫式九條）—— 直式寬度只有一半，九條會擠成一片灰 */}
          <g stroke="#b1bee8" strokeOpacity="0.14" strokeWidth="1">
            {Array.from({ length: 7 }, (_, i) => {
              const t = i / 6;
              return <line key={i} x1={104 + t * 130} y1={950} x2={330} y2={600 - t * 320} />;
            })}
          </g>
        </svg>
      </div>

      {/* 3／青色高光：疊在弧帶與橫帶交會處，緩慢呼吸。
          放在 SVG 之外用 CSS 漸層做，是為了讓它吃 mix-blend-mode: screen ——
          SVG 內的 filter 在 Safari 上對 slice 裁切後的座標系表現不一致。
          直式構圖的交會處比橫式高一些、畫面也窄，故手機另給一組 top 與尺寸。 */}
      <div
        className="animate-kv-breathe absolute right-[-6%] top-[40%] h-[52vw] max-h-[620px] w-[52vw] max-w-[620px] -translate-y-1/2 rounded-full md:top-[46%] md:h-[46vw] md:w-[46vw]"
        style={{
          background:
            "radial-gradient(circle, rgb(120 235 255 / 0.3) 0%, rgb(50 120 255 / 0.16) 42%, transparent 68%)",
          mixBlendMode: "screen",
        }}
      />

      {/* 4／左側 scrim：KV 的左半本來就是近乎純色的深靛（給文字用）。
          這層同時是全站文字對比的地板，見檔頭說明。
          100deg 在直式畫面上會變成「左上暗、右下透」，正好把直式構圖偏右下的「4」讓出來，
          所以手機不必另寫一條 —— 但這代表調角度時兩種畫面都要看過。 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgb(3 6 33 / 0.94) 0%, rgb(3 6 33 / 0.78) 26%, rgb(3 6 33 / 0.42) 52%, rgb(3 6 33 / 0.12) 76%, transparent 100%)",
        }}
      />

      {/* 5／顆粒：KV 原圖帶明顯底噪，深色大面積漸層也需要它壓色帶。
          .grain 是 ::after，需要一個有 position 的宿主。 */}
      <div className="grain absolute inset-0" />
    </div>
  );
}
