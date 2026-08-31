/**
 * 首頁專用背景層 —— 在全站水墨底（layout 的 -z-10）之上、內容（z-0+）之下疊一塊
 * 「上寬下窄的垂直梯形」歷屆活動照，模擬「貼在背景上、邊緣像撕開的紙」的效果。
 *
 * 為什麼這樣分層：
 * - fixed + -z-[5]：固定不隨捲動（和 layout 底圖一致），且永遠在文字之下 → 不影響可讀性。
 * - 撕紙邊緣的做法：feTurbulence + feDisplacementMap 只作用在「遮罩形狀」而非照片本身，
 *   所以被弄粗糙的是梯形的「邊界」（像撕開的紙），照片內部維持清晰、不會扭曲。
 *   （這是常見做法：位移貼在 mask 上，而不是貼在內容上。）
 * - 遮罩再乘一層垂直漸層 → 梯形上下淡出、柔和融入背景。
 * - 照片降飽和 + 疊一層靛藍 + 整體低透明度 → 冷色調統一、且夠淡不搶文字。
 *
 * 這些數值（梯形寬窄、撕裂強度 scale、透明度、色調）都刻意集中、好調 —— 見下方註記。
 */

// 歷屆活動照（觀眾席／舞台／大合照），由上到下堆滿梯形
const PHOTOS = [
  "/review/group-photo.jpg",
  "/review/second-edition-audience.jpg",
  "/review/stage-keynote-venture-plus.jpg",
  "/review/first-edition-audience.jpg",
];

// 梯形（viewBox 1200×1600 座標）：頂端寬 360→840，底端窄 480→720
const TRAPEZOID = "360,0 840,0 720,1600 480,1600";
const TEAR_SCALE = 26; // 撕裂強度：位移越大邊緣越破碎
const LAYER_OPACITY = 0.22; // 整層透明度：越低越不搶文字

export function HomeBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden"
      // 提升成獨立合成層 → 捲動時不重繪這塊（濾鏡較重，避免吃到捲動效能）
      style={{ transform: "translateZ(0)", opacity: LAYER_OPACITY }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMid slice"
        // 照片降飽和、微提亮 → 融進冷色調、不喧賓奪主
        style={{ filter: "saturate(0.7) brightness(1.03)" }}
      >
        <defs>
          {/* 撕紙邊緣濾鏡：亂數雜訊 → 位移貼圖。filter 區域放大，避免位移後的邊緣被裁掉 */}
          <filter id="bd-tear" x="-20%" y="-8%" width="140%" height="116%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.024"
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

          {/* 上下淡出（遮罩用亮度：白=顯示、黑=隱藏） */}
          <linearGradient id="bd-vfade" x1="0" y1="0" x2="0" y2="1600" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.1" stopColor="#fff" />
            <stop offset="0.82" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>

          {/* 梯形遮罩：形狀 × 垂直淡出，再過撕裂濾鏡讓「邊界」破碎成撕紙感 */}
          <mask id="bd-trap" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="1600">
            <polygon points={TRAPEZOID} fill="url(#bd-vfade)" filter="url(#bd-tear)" />
          </mask>
        </defs>

        <g mask="url(#bd-trap)">
          {PHOTOS.map((src, i) => (
            <image
              key={src}
              href={src}
              // 每張佔 1/4 高度，橫向蓋滿梯形最寬處（略外擴讓撕裂邊有素材可位移）
              x={330}
              y={i * 400}
              width={540}
              height={400}
              preserveAspectRatio="xMidYMid slice"
            />
          ))}
          {/* 靛藍調色：把雜色照片統一到全站冷色調 */}
          <rect x="0" y="0" width="1200" height="1600" fill="#28324e" opacity="0.32" />
        </g>
      </svg>
    </div>
  );
}
