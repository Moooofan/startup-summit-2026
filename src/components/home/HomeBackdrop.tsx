/**
 * 首頁第一屏（Hero）專屬背景層 —— 左半滿版的歷屆活動照，右緣是一條「/」斜線的撕紙邊。
 *
 * 只出現在 Hero：本元件由 Hero 以 absolute inset-0 掛在其內，捲到第二屏時隨 Hero 捲走 →
 * 之後回歸全站原本的水墨底。
 *
 * 形狀：左／上／下都外擴超出畫面（滿版、切齊邊緣），只有右緣是斜線 —— 斜率呼應底圖
 * 那條「/」暗色斜浪（左下 → 右上）。右緣用 feTurbulence + feDisplacementMap 弄成撕紙鋸齒。
 *
 * 層次：照片後方再墊一張「同形狀、右緣多外擴 GRAY_GAP」的灰色撕紙 → 沿右緣露出一條
 * 灰色鋸齒鑲邊，像撕開的紙有底襯，增加層次。
 *
 * 可讀性：照片降飽和 + 疊靛藍 + 整層低透明度；撕紙手法是把位移貼在「遮罩形狀」上，
 * 照片內部不扭曲。所有可調數值集中在下方常數。
 */

// 歷屆活動照（大合照／觀眾席／舞台），由上到下堆滿左半區
const PHOTOS = [
  "/review/group-photo.jpg",
  "/review/second-edition-audience.jpg",
  "/review/stage-keynote-venture-plus.jpg",
  "/review/first-edition-audience.jpg",
];

// 右緣斜線（viewBox 1200×1600）：頂端 x=820、底端 x=360 → 由右上到左下的「/」斜率
const TOP_RIGHT_X = 820;
const BOT_RIGHT_X = 360;
const GRAY_GAP = 26; // 灰色底襯比照片右緣多外擴多少 → 露出的鑲邊寬度
const TEAR_SCALE = 26; // 撕裂強度：位移越大鋸齒越明顯
const GRAY = "#9aa3b2"; // 鑲邊灰（冷調）
const TINT = "#28324e"; // 照片統一色（靛藍）
const TINT_OPACITY = 0.3;
const LAYER_OPACITY = 0.22; // 整層透明度：越低越不搶文字

// 左／上／下外擴到畫面外，確保滿版且撕裂位移不會在邊緣露出破口
const PHOTO_SHAPE = `-80,-80 ${TOP_RIGHT_X},-80 ${BOT_RIGHT_X},1680 -80,1680`;
const GRAY_SHAPE = `-80,-80 ${TOP_RIGHT_X + GRAY_GAP},-80 ${BOT_RIGHT_X + GRAY_GAP},1680 -80,1680`;

export function HomeBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ opacity: LAYER_OPACITY }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMid slice"
        // 照片降飽和、微提亮 → 融進冷色調、不喧賓奪主
        style={{ filter: "saturate(0.7) brightness(1.03)" }}
      >
        <defs>
          {/* 撕紙邊緣濾鏡：亂數雜訊 → 位移貼在遮罩形狀上。filter 區域放大避免鋸齒被裁掉 */}
          <filter id="bd-tear" x="-15%" y="-8%" width="130%" height="116%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.014 0.03"
              numOctaves={3}
              seed={12}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={TEAR_SCALE}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* 照片的撕紙遮罩形狀（白=顯示） */}
          <mask id="bd-shape" maskUnits="userSpaceOnUse" x="-120" y="-120" width="1440" height="1840">
            <polygon points={PHOTO_SHAPE} fill="#fff" filter="url(#bd-tear)" />
          </mask>
        </defs>

        {/* 灰色底襯（右緣多外擴 → 露出撕紙鑲邊），墊在照片後方 */}
        <polygon points={GRAY_SHAPE} fill={GRAY} filter="url(#bd-tear)" />

        {/* 照片，裁進撕紙形狀 */}
        <g mask="url(#bd-shape)">
          {PHOTOS.map((src, i) => (
            <image
              key={src}
              href={src}
              x={-80}
              y={i * 400 - 40}
              width={960}
              height={440}
              preserveAspectRatio="xMidYMid slice"
            />
          ))}
          {/* 靛藍調色：把雜色照片統一到全站冷色調 */}
          <rect x="-120" y="-120" width="1440" height="1840" fill={TINT} opacity={TINT_OPACITY} />
        </g>
      </svg>
    </div>
  );
}
