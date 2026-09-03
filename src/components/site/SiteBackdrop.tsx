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
 * preserveAspectRatio 用 xMaxYMid slice 而非常見的 xMidYMid：
 * 直立手機（比例 0.46 vs viewBox 的 1.78）會被裁掉大半寬度，xMid 會只留下中間那段
 * 空白的過渡區；xMax 保證「右側的弧帶與方塊」永遠在畫面內，構圖才不會整個消失。
 */

// viewBox 尺寸：與 KV 同為 16:9，座標值可直接照原圖比例換算
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

/** 右半圓路徑：從正上方順時針掃到正下方。 */
function halfArc(r: number) {
  const { x, y } = ARC_CENTER;
  return `M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x} ${y + r}`;
}

export function SiteBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1／底色：深靛。取樣自 KV 左半（#01003d 一帶），往右上與右下各放一團藍光，
          對應原圖「右上中藍、右下電光藍」的分佈。 */}
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

      {/* 2／線構圖。手機降透明度：xMax 裁切後弧帶會放得很大、直接壓在正文後方。 */}
      <div className="absolute inset-0 opacity-50 md:opacity-100">
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
              <path key={r} d={halfArc(r)} />
            ))}
          </g>

          {/* 細線扇：從斜筆的斜邊往左下鋪開，補住左半與右半之間的過渡 */}
          <g stroke="#b1bee8" strokeOpacity="0.14" strokeWidth="1">
            {Array.from({ length: 9 }, (_, i) => {
              const t = i / 8;
              return (
                <line
                  key={i}
                  x1={640 + t * 250}
                  y1={900}
                  x2={1150}
                  y2={620 - t * 430}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* 3／青色高光：疊在弧帶與橫帶交會處，緩慢呼吸。
          放在 SVG 之外用 CSS 漸層做，是為了讓它吃 mix-blend-mode: screen ——
          SVG 內的 filter 在 Safari 上對 slice 裁切後的座標系表現不一致。 */}
      <div
        className="animate-kv-breathe absolute right-[-6%] top-[46%] h-[46vw] max-h-[620px] w-[46vw] max-w-[620px] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(120 235 255 / 0.3) 0%, rgb(50 120 255 / 0.16) 42%, transparent 68%)",
          mixBlendMode: "screen",
        }}
      />

      {/* 4／左側 scrim：KV 的左半本來就是近乎純色的深靛（給文字用）。
          這層同時是全站文字對比的地板，見檔頭說明。 */}
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
