import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Cta({ href, children, variant = "solid", size = "md", className }: Props) {
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
    ghost:
      "glass text-ink hover:border-black/25 hover:bg-black/10",
  };

  return (
    <Link href={href} className={cn(base, sizes[size], variants[variant], className)}>
      {variant === "solid" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:[animation:sheen_0.9s_ease-out]"
        />
      )}
      <span className="relative">{children}</span>
    </Link>
  );
}
