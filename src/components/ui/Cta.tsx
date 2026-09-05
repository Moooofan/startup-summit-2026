import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { isExternalHref } from "@/lib/config";
import { Sheen } from "@/components/ui/Sheen";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  /**
   * 可選的點擊處理。不傳就跟純連結完全一樣 —— 這裡刻意**不**內建任何預設行為
   * （例如「錨點自動平滑捲動」）：那會讓全站每一個錨點連結的行為被這顆共用元件隱性改掉，
   * 正是 globals.css 與 Hero 註解裡再三強調要避免的事。要不要攔截由呼叫端自己決定。
   * 目前唯一的使用者是 Hero 的「查看詳情」（見該處註解）。
   */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

/**
 * 深藍玻璃底色（業主 2026/9 定案）—— 取自 surface 色階，配 KV 青的描邊。
 * 這是「次要」那一階的值；Hero 的主 CTA 用 className 覆寫成亮一階的版本。
 *
 * 這是預設值：實際唯一的使用者是 Hero 的兩顆 CTA（全站唯二的 variant="gradient"），
 * 兩顆都各自用 className 覆寫。改這裡時記得 Hero 那兩行不會跟著變。
 *
 * **主次差異靠描邊亮度，不靠色向。** 舊版是「藍→紫 / 紫→藍」的鏡像漸層，
 * 紫色是舊主視覺方案 C 的遺留、新 KV 裡沒有，且兩顆在深底上會蓋過標題與光軌。
 *
 * 描邊不是裝飾，是結構：按鈕填色合成後約 rgb(26 40 91)，對頁底 rgb(10 16 48)
 * 只有 **1.36:1** —— 按鈕的輪廓完全靠那條青描邊撐著。調淡它按鈕就會消失在背景裡，
 * 所以 alpha 有下限（見各 variant 的 border-accent/xx，最壞情況都壓在 3:1 以上）。
 *
 * 兩條路已經走過、別再走：
 *
 * 1) 「把底色調深、再降 alpha」以保住白字對比 —— 合成後會變回實心按鈕的樣子，
 *    等於自己把透明感抵銷掉。要看起來變淺，合成後的亮度就得真的上升。
 *    這條是物理，與明暗主題無關，換成深色版一樣成立。
 *
 * 2) **青色只能待在 1px 描邊上，絕不能進填色。** 曾採用 source/button2.png 的
 *    青色階（#8B5FAA → #7C85C0 → #60D2ED），使用者要求撤回。
 *    理由到現在都還有效：高亮度的青一旦落到文字底下，白字會掉到約 1.9:1。
 *    這次改版看起來「按鈕變成有青色了」，但那是描邊 —— 禁令沒有解除，
 *    這正是踩在界線上的合規用法。要在填色裡放青，就必須把文字一起改成深色。
 *
 * 白字對比（含疊在 HomeBackdrop 照片最亮處的最壞情況）落在 12.98–17.41:1，
 * 比舊的藍→紫版本（9.5–10.3:1）還高。
 */
const GRADIENT_GLASS =
  "[background-image:linear-gradient(110deg,rgb(22_34_78/0.82)_0%,rgb(16_26_64/0.72)_100%)]";

export function Cta({ href, children, variant = "solid", size = "md", className, onClick }: Props) {
  /* 站外網址自動開新分頁，與全站既有的外部連結慣例一致（原生 <a> + target + rel，
     見 Hero 的地圖連結、Footer 的 FB 社團、/review 的媒體報導）。

     刻意用「自動偵測」而不是多開一個要呼叫端自己傳的 external prop：
     這顆按鈕最主要的外部使用者是報名鈕，而它的 href 來自 REGISTER_URL ——
     那支常數的設計意圖就是「報名去向可以隨時換值、呼叫端一行都不用改」
     （值曾是 #tickets 錨點，2026/9 換成 Accupass 外部網址）。
     若改成手動旗標，下次換值就得回頭改 Hero、TicketPlans、TicketsGallery 三處。
     偵測限定 http(s)，所以 /sponsor 那顆丟 mailto: 進來的贊助鈕不受影響。 */
  const externalProps = isExternalHref(href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  // gradient 變體 ＝ 深藍玻璃膠囊 + 青描邊，文字後面接一個裸箭頭。
  // 箭頭原本包在一圈「圓框徽章」裡（參考 button2.png），業主 2026/9 指示拿掉那圈環。
  if (variant === "gradient") {
    /* lg 在 sm 斷點以下整組收窄，否則首頁那兩顆 CTA 幾乎在所有手機上都會換行成上下排。
       .shell 左右各 20px → 320/360/375/390px 的螢幕分別只剩 280/320/335/350px 可用，
       兩顆必須壓在那個寬度內。這不是邊緣 case，是多數手機的常態。

       量法：中文字寬 ＝ 字級，邊框 1px×2。圓框徽章拿掉後重算（舊值 126/172px）：
         手機 一顆 = pl-4(16) + 16px 字×4(64) + gap-2(8) + 箭頭(16) + pr-2.5(10) + 邊框(2) = 116px
                   → 兩顆 + Hero 容器的 gap-4(16) = 248px，320px 螢幕留 32px 餘裕
         桌機 一顆 = pl-8(32) + 18px 字×4(72) + gap-3(12) + 箭頭(20) + pr-6(24) + 邊框(2) = 162px

       右側 padding **刻意小於左側**，這是光學對齊、不是失誤：
       lucide 的 ChevronRight 是 24×24 的 viewBox，但筆畫只佔 x 7.8–16.2（含 strokeWidth 2.4
       的圓端），左右各有約 32% 是透明的。也就是說箭頭的方框右緣到「看得見的箭頭」之間，
       桌機還有 20×0.325 ≈ 6.5px、手機 16×0.325 ≈ 5.2px 的空氣。
       若左右給一樣的 px-8，視覺上右邊會多出那 6.5px，讀起來就是「右邊太長」（業主 2026/9 回報）。
       所以 pr 各自扣掉那一段：桌機 32−6.5 → pr-6(24)、手機 16−5.2 → pr-2.5(10)，
       合成後的視覺留白兩側才等寬。
       換箭頭圖示或改 strokeWidth 時，這個扣除量要重算。 */
    const pad = {
      sm: "gap-2 pl-5 pr-3.5 py-1 text-sm",
      md: "gap-2.5 pl-6 pr-4 py-1.5 text-[18px]",
      lg: "gap-2 pl-4 pr-2.5 py-1.5 text-[16px] sm:gap-3 sm:pl-8 sm:pr-6 sm:text-base",
    };
    /* 箭頭外框。圓環已拿掉，**但這個尺寸表不能刪** —— 按鈕是 inline-flex + 很小的 py，
       高度由最高的子元素決定，而那個子元素就是這裡：
       py-1.5×2 + h-8(32) = 44px（手機）、py-1.5×2 + h-11(44) = 56px（桌機）。
       把它拿掉按鈕會塌成只有文字行高的扁膠囊，觸控目標也跟著掉到 44px 以下。
       只留高度、不給寬度 —— 寬度交給箭頭自己。 */
    const arrowBox = { sm: "h-7", md: "h-9", lg: "h-8 sm:h-11" };
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
        {...externalProps}
        onClick={onClick}
        className={cn(
          // font-semibold（非 medium）：淺色版時這是為了補 3.08:1 的對比；深色版對比已達 9.65:1，
          // 保留字重純粹是造型一致性，不再是可讀性補償
          "btn-glass btn-glass-on-dark group inline-flex items-center rounded-pill border border-accent/55 font-semibold transition-all duration-300",
          GRADIENT_GLASS,
          "hover:border-accent/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glow",
          pad[size],
          className
        )}
      >
        <Sheen />
        <span className="relative">{children}</span>
        <span
          aria-hidden
          className={cn(
            // 環的視覺已拿掉（業主 2026/9），這個 span 留著是為了撐按鈕高度 —— 見 arrowBox 的註解。
            // 箭頭顏色不另外指定：繼承 .btn-glass-on-dark 的白，與文字同色。
            "relative grid shrink-0 place-items-center",
            arrowBox[size]
          )}
        >
          <ChevronRight className={chev[size]} strokeWidth={2.4} />
        </span>
      </Link>
    );
  }

  const base =
    "btn-glass group inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glow";
  /* lg 同樣要在 sm 以下收窄，理由與上面 gradient 那組一模一樣 ——
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
    // 平塗版：brand-fill #1b45cf 降到 0.76（深底上合成後約 rgb(23 56 169)，白字 9.65:1），
    // 與 Hero 鏡像漸層的兩個端點同色系。
    // brand-fill 是深色版新增的 token：同一支色不可能既當白字按鈕底（要暗）
    // 又當連結文字色（要亮），所以把「按鈕實底」從 brand-lift 拆了出來。
    solid:
      "btn-glass-on-dark border border-white/35 bg-brand-fill/76 font-semibold hover:border-white/55",
    // .glass 自帶細邊框，不再套白色鏡框 → 維持原本的輕盈感
    ghost: "glass text-ink hover:border-white/28",
    // 青藍外框 + 淡藍底 + 藍字（報名按鈕）。orbit-sky 對深底 6.67:1，在 12% 同色底上 5.48:1
    outline:
      "border border-orbit-sky/70 bg-orbit-sky/12 text-orbit-sky hover:border-orbit-sky",
  };

  return (
    <Link
      href={href}
      {...externalProps}
      onClick={onClick}
      className={cn(base, sizes[size], variants[variant as "solid" | "ghost" | "outline"], className)}
    >
      {/* 掃光只給深底的 solid —— 白色亮帶掃過 ghost / outline 的淺底幾乎看不見，
          那兩個變體的光感由 .btn-glass 的常駐微光與上緣高光提供。 */}
      {variant === "solid" && <Sheen />}
      <span className="relative">{children}</span>
    </Link>
  );
}
