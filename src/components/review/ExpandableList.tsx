"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ExpandableList({
  children,
  initial = 12,
  total,
  labelMore,
  labelLess = "收合",
}: {
  children: React.ReactNode[];
  initial?: number;
  total: number;
  labelMore: string;
  labelLess?: string;
}) {
  const [open, setOpen] = useState(false);
  const shown = open ? children : children.slice(0, initial);
  if (total <= initial) return <>{children}</>;

  return (
    <>
      {shown}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="glass btn-glass col-span-full mt-2 inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm text-ink-2 transition-colors hover:border-white/28 hover:text-ink"
      >
        {open ? labelLess : labelMore}
        <ChevronDown
          size={15}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
    </>
  );
}
