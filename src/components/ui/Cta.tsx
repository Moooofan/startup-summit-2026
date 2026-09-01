import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * 半透明玻璃底色 —— 靖藍 #4c68d4 → 紫 #8b6ed8，alpha 沿橫向由 0.78 遞減到 0.64
 * （左實右透，像玻璃往邊緣變薄）。
 *
 * 這是預設值：實際唯一的使用者是 Hero 的兩顆 CTA，且它們各自用 className 覆寫成
 * 互為鏡像的正／反向斜坡。改這裡時記得 Hero 那兩行不會跟著變。
 *
 * ⚠️ 兩條路已經走過、別再走：
 *
 * 1) 「把底色調深、再降 alpha」以保住白字對比 —— 合成後會變回實心按鈕的樣子，
 *    等於自己把透明感抵銷掉。要看起來變淺，合成後的亮度就得真的上升。
 *
 * 2) 在漸層裡加高亮度的青／淺藍停 —— 曾採用 source/button2.png 的色階
 *    （#8B5FAA → #7C85C0 → #60D2ED），使用者要求撤回。
 *    若日後又要引入，注意它一旦落到文字底下白字會掉到約 1.9:1，
 *    屆時漸層就不能再鏡像（見 Hero.tsx 的註解）。
 *
 * 全站背景合成後約 rgb(238 241 247)，本組色的白字對比為 2.9–3.4:1。
 * 低於 WCAG AA 4.5:1，是使用者確認「白字夠明顯」後的知情選擇。
 * 若日後要真正達標，唯一槓桿是把文字改成深色（--color-brand）。
 */
const GRADIENT_GLASS =
  "[background-image:linear-gradient(110deg,rgb(76_104_212/0.78)_0%,rgb(139_110_216/0.64)_100%)]";

export function Cta({ href, children, variant = "solid", size = "md", className }: Props) {
  // gradient 變體 ＝ 參考 button2.png：左紫 → 右藍的膠囊 + 右端「圓框箭頭」徽章。
  // 文字靠左、箭頭圓貼右緣（pr 很小），圓框近乎撐滿按鈕高度。
  if (variant === "gradient") {
    /* ⚠️ lg 在 sm 斷點以下整組收窄，否則首頁那兩顆 CTA 幾乎在所有手機上都會換行成上下排：
       一顆 = pl-8(32) + 四個中文字 ×18px(72) + gap-4(16) + 圓框 h-11(44) + pr-1.5(6) + 邊框(2)
            = 172px
       兩顆 + Hero 容器的 gap-4(16) = 360px
       但 .shell 左右各 20px → 320/360/375/390px 的螢幕分別只剩 280/320/335/350px，
       全數不足；要到 430px（Pro Max 級）才排得下。這不是邊緣case，是多數手機的常態。

       收窄後一顆 = pl-4(16) + 16px 字 ×4(64) + gap-2(8) + 圓框 h-8(32) + pr-1(4) + 邊框(2)
                  = 126px → 兩顆 + gap-4 = 268px，320px 螢幕都放得下（留 12px 餘裕）。
       高度仍是 py-1.5×2 + 32 = 44px，觸控目標沒有變小。
       sm 以上完全維持原尺寸 —— 桌機不受影響。 */
    const pad = {
      sm: "gap-2.5 py-1 pl-5 pr-1 text-sm",
      md: "gap-3 py-1.5 pl-6 pr-1.5 text-[18px]",
      lg: "gap-2 py-1.5 pl-4 pr-1 text-[16px] sm:gap-4 sm:pl-8 sm:pr-1.5 sm:text-base",
    };
    const circle = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-8 w-8 sm:h-11 sm:w-11" };
    /* 箭頭尺寸走 class 而非 lucide 的 size prop —— size 是 svg 的呈現屬性，給不了斷點。
       CSS 的 width/height 會蓋過呈現屬性，所以 sm/md 換成等值的任意值後輸出不變。 */
    const chev = {
      sm: "h-[15px] w-[15px]",
      md: "h-[17px] w-[17px]",
      lg: "h-4 w-4 sm:h-5 sm:w-5",
    };
    return (
      <Link
        href={href}
        className={cn(
          // font-semibold（非 medium）：淺底上的白字對比只有 3.08:1，加字重是零成本的可讀性補償
          "btn-glass btn-glass-on-dark group inline-flex items-center rounded-pill border border-white/40 font-semibold transition-all duration-300",
          GRADIENT_GLASS,
          "hover:border-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glow",
          pad[size],
          className
        )}
      >
        {/* hover 掃光：寬亮帶中夾一條窄鏡面線 —— 兩段亮度一起掠過，像光掃過玻璃曲面。
            .btn-glass 的 ::before / ::after 已用 z-index:-1 壓到內容層之下，
            這層維持預設堆疊即可蓋在其上。 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 [background-image:linear-gradient(90deg,transparent_0%,rgb(255_255_255/0.16)_34%,rgb(255_255_255/0.55)_50%,rgb(255_255_255/0.16)_66%,transparent_100%)] [transform:translateX(-250%)_skewX(-12deg)] group-hover:[animation:sheen_0.85s_ease-out]"
        />
        <span className="relative">{children}</span>
        <span
          aria-hidden
          className={cn(
            // 圓框落在漸層最透的右端（alpha 0.64，合成後約 rgb(175 157 227)）→
            // 白框要夠實才立得住。別跟著底色一起調淡。
            "relative grid shrink-0 place-items-center rounded-full border-2 border-white/85 bg-white/25",
            circle[size]
          )}
        >
          <ChevronRight className={chev[size]} strokeWidth={2.4} />
        </span>
      </Link>
    );
  }

  const base =
    "btn-glass group inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glow";
  /* ⚠️ lg 同樣要在 sm 以下收窄，理由與上面 gradient 那組一模一樣 ——
     站內兩處把兩顆 lg 並排：/sponsor 的「來信洽談贊助(192px) + 了解年會(136px)」＝ 344px、
     /review 的「查看本屆資訊(172px) + 講者陣容連結(139px)」＝ 327px，
     但手機可用寬只有 280–350px（.shell 左右各 20px）→ 兩顆都會被擠成上下排。
     收窄後 /sponsor ＝ 150+98+16 ＝ 264px、/review ＝ 130+133+16 ＝ 279px，320px 都放得下。
     lg 的非 gradient 使用者全站只有那三顆，改這裡不會波及別處。 */
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[18px]",
    lg: "px-4 py-3 text-[16px] sm:px-8 sm:py-4 sm:text-base",
  };
  // hover 一律不改底色（使用者指定）—— 回饋交給掃光、邊框提亮與 .btn-glass:hover 的陰影抬升。
  const variants = {
    // 平塗版：brand-lift #4c68d4 原色降到 0.76（合成後約 rgb(115 137 220)，白字 3.32:1），
    // 與 Hero 鏡像漸層的兩個端點同色系。
    solid:
      "btn-glass-on-dark border border-white/35 bg-[rgb(76_104_212/0.76)] font-semibold hover:border-white/55",
    // .glass 自帶深色細邊框，不再套白色鏡框 → 淺底按鈕維持原本的輕盈感
    ghost: "glass text-ink hover:border-black/25",
    // 藍色外框 + 淺藍底 + 藍字（報名按鈕）
    outline:
      "border border-orbit-sky/70 bg-orbit-sky/12 text-orbit-sky hover:border-orbit-sky",
  };

  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant as "solid" | "ghost" | "outline"], className)}
    >
      {/* 掃光只給深底的 solid —— 白色亮帶掃過 ghost / outline 的淺底幾乎看不見，
          那兩個變體的光感由 .btn-glass 的常駐微光與上緣高光提供。 */}
      {variant === "solid" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 [background-image:linear-gradient(90deg,transparent_0%,rgb(255_255_255/0.16)_34%,rgb(255_255_255/0.55)_50%,rgb(255_255_255/0.16)_66%,transparent_100%)] [transform:translateX(-250%)_skewX(-12deg)] group-hover:[animation:sheen_0.85s_ease-out]"
        />
      )}
      <span className="relative">{children}</span>
    </Link>
  );
}
