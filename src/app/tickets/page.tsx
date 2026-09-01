import type { Metadata } from "next";
import { TicketsGallery } from "@/components/tickets/TicketsGallery";

export const metadata: Metadata = {
  title: "報名資訊",
  description:
    "2026 第四屆台灣新創投資年會報名資訊：單日票的早鳥與一般票價、團報級距、含括權益，以及開幕日期與地點。",
  alternates: { canonical: "/tickets" },
};

export default function TicketsPage() {
  return <TicketsGallery />;
}
