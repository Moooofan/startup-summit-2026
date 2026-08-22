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

export function Cta({ href, children, variant = "solid", size = "md", className }: Props) {
  // gradient 變體 ＝ 參考 button2.png：左紫 → 右藍的膠囊 + 右端「圓框箭頭」徽章。
  // 文字靠左、箭頭圓貼右緣（pr 很小），圓框近乎撐滿按鈕高度。
  if (variant === "gradient") {
    const pad = {
      sm: "gap-2.5 py-1 pl-5 pr-1 text-sm",
      md: "gap-3 py-1.5 pl-6 pr-1.5 text-[15px]",
      lg: "gap-4 py-1.5 pl-8 pr-1.5 text-base",
    };
    const circle = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-11 w-11" };
    const chev = { sm: 15, md: 17, lg: 20 };
    return (
      <Link
        href={href}
        className={cn(
          "group relative inline-flex items-center overflow-hidden rounded-pill font-medium text-white transition-all duration-300",
          "[background-image:linear-gradient(90deg,#8a66c8_0%,#5a7fd6_50%,#38a6de_100%)]",
          "hover:shadow-[0_12px_30px_-10px_rgb(80_110_220/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glow",
          pad[size],
          className
        )}
      >
        {/* hover 亮面掃過 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent [transform:translateX(-250%)_skewX(-12deg)] group-hover:[animation:sheen_0.85s_ease-out]"
        />
        <span className="relative">{children}</span>
        <span
          aria-hidden
          className={cn(
            "relative grid shrink-0 place-items-center rounded-full border-2 border-white/75 bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5",
            circle[size]
          )}
        >
          <ChevronRight size={chev[size]} strokeWidth={2.4} />
        </span>
      </Link>
    );
  }

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glow";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-4 text-base",
  };
  const variants = {
    solid:
      "bg-brand-lift text-white hover:bg-brand-bright hover:shadow-[0_0_36px_rgb(106_134_255/0.45)]",
    ghost: "glass text-ink hover:border-black/25 hover:bg-black/10",
    // 藍色外框 + 淺藍底 + 藍字（報名按鈕）
    outline:
      "border border-orbit-sky/70 bg-orbit-sky/12 text-orbit-sky hover:border-orbit-sky hover:bg-orbit-sky/20",
  };

  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant as "solid" | "ghost" | "outline"], className)}
    >
      {variant === "solid" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent [transform:translateX(-250%)_skewX(-12deg)] group-hover:[animation:sheen_0.85s_ease-out]"
        />
      )}
      <span className="relative">{children}</span>
    </Link>
  );
}
