/**
 * 首頁第一屏（Hero）專屬背景層 —— 左半滿版的歷屆活動照輪播，右緣是一條「/」斜線的撕紙邊。
 *
 * 只出現在 Hero：本元件由 Hero 以 absolute inset-0 掛在其內，捲到第二屏時隨 Hero 捲走 →
 * 之後回歸全站原本的水墨底。
 *
 * 形狀：左／下外擴超出畫面（滿版、切齊邊緣），右緣是斜線 —— 斜率呼應底圖那條
 * 「/」暗色斜浪（左下 → 右上）。右緣用 feTurbulence + feDisplacementMap 做成撕紙鋸齒。
 *
 * 頂端刻意淡出（bd-fade）：導覽列是半透明的（未捲動時是 from-bg/90 → transparent 漸層），
 * 照片若一路鋪到 y=0 會透到 header 後面，看起來像背景長到標題列上。淡出後照片改從
 * 導覽列下方浮現。
 *
 * 層次：照片後方再墊一張「同形狀、右緣多外擴 GRAY_GAP」的灰色撕紙 → 沿右緣露出一條
 * 灰色鋸齒鑲邊，像撕開的紙有底襯。
 *
 * 輪播是純 CSS（.bd-slide，見 globals.css）—— 背景層維持 Server Component，
 * 不為了輪播把它變成 client；prefers-reduced-motion 下只顯示第一張。
 */

// 歷屆活動照（大合照／觀眾席／舞台），輪流淡入淡出
const PHOTOS = [
  "/review/group-photo.jpg",
  "/review/second-edition-audience.jpg",
  "/review/stage-keynote-venture-plus.jpg",
  "/review/audience-and-stage.jpg",
  "/review/third-edition-keynote-hofeipeng.jpg",
];

const CYCLE_SECONDS = 30; // 一輪走完所有照片的總時間

// viewBox 用橫幅比例（貼近桌機 Hero）→ slice 裁切少，斜線角度比較接近設定值
const VB_W = 1600;
const VB_H = 900;

// 右緣斜線：頂端 x=1260、底端 x=650 → 由右上到左下的「/」斜率。
// 佔畫面寬 79%（頂）到 41%（底）、平均約 60% —— 原本是 65%/27%（平均 46%），
// 視覺上「不到一半」，業主要求放大到過半。頂底差維持 610 不變，
// 等於整條邊往右平移 220，斜線角度不會跟著變陡或變平。
const TOP_RIGHT_X = 1260;
const BOT_RIGHT_X = 650;
const GRAY_GAP = 26; // 灰色底襯比照片右緣多外擴多少 → 露出的鑲邊寬度
const TEAR_SCALE = 24; // 撕裂強度：位移越大鋸齒越明顯
const GRAY = "#9aa3b2"; // 鑲邊灰（冷調）
const TINT = "#28324e"; // 照片統一色（靛藍）
const TINT_OPACITY = 0.3;
const LAYER_OPACITY = 0.22; // 整層透明度：越低越不搶文字

// 左／上／下外擴到畫面外，確保滿版且撕裂位移不會在邊緣露出破口
const PHOTO_SHAPE = `-80,-60 ${TOP_RIGHT_X},-60 ${BOT_RIGHT_X},${VB_H + 60} -80,${VB_H + 60}`;
const GRAY_SHAPE = `-80,-60 ${TOP_RIGHT_X + GRAY_GAP},-60 ${BOT_RIGHT_X + GRAY_GAP},${VB_H + 60} -80,${VB_H + 60}`;

export function HomeBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ opacity: LAYER_OPACITY }}
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        // 照片降飽和、微提亮 → 融進冷色調、不喧賓奪主
        style={{ filter: "saturate(0.7) brightness(1.03)" }}
      >
        <defs>
          {/* 撕紙邊緣濾鏡：亂數雜訊 → 位移貼在遮罩形狀上。filter 區域放大避免鋸齒被裁掉 */}
          <filter id="bd-tear" x="-15%" y="-10%" width="130%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016 0.032"
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

          {/* 頂端淡出：讓照片從半透明導覽列下方才浮現（白=顯示、黑=隱藏） */}
          <linearGradient id="bd-vfade" x1="0" y1="0" x2="0" y2={VB_H} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.17" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <mask id="bd-fade" maskUnits="userSpaceOnUse" x="-120" y="-120" width={VB_W + 240} height={VB_H + 240}>
            <rect x="-120" y="-120" width={VB_W + 240} height={VB_H + 240} fill="url(#bd-vfade)" />
          </mask>

          {/* 照片的撕紙遮罩形狀 */}
          <mask id="bd-shape" maskUnits="userSpaceOnUse" x="-120" y="-120" width={VB_W + 240} height={VB_H + 240}>
            <polygon points={PHOTO_SHAPE} fill="#fff" filter="url(#bd-tear)" />
          </mask>
        </defs>

        <g mask="url(#bd-fade)">
          {/* 灰色底襯（右緣多外擴 → 露出撕紙鑲邊），墊在照片後方 */}
          <polygon points={GRAY_SHAPE} fill={GRAY} filter="url(#bd-tear)" />

          {/* 照片輪播，整組裁進撕紙形狀 */}
          <g mask="url(#bd-shape)">
            {PHOTOS.map((src, i) => (
              <image
                key={src}
                href={src}
                className="bd-slide"
                x={-80}
                y={-60}
                width={TOP_RIGHT_X + GRAY_GAP + 160}
                height={VB_H + 120}
                preserveAspectRatio="xMidYMid slice"
                style={
                  {
                    "--bd-cycle": `${CYCLE_SECONDS}s`,
                    "--bd-delay": `${(i * CYCLE_SECONDS) / PHOTOS.length}s`,
                  } as React.CSSProperties
                }
              />
            ))}
            {/* 靛藍調色：把雜色照片統一到全站冷色調 */}
            <rect
              x="-120"
              y="-120"
              width={VB_W + 240}
              height={VB_H + 240}
              fill={TINT}
              opacity={TINT_OPACITY}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
