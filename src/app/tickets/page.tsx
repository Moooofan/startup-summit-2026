import type { Metadata } from "next";
import { Tickets } from "@/components/home/Tickets";
import { Contact } from "@/components/home/Contact";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";

export const metadata: Metadata = {
  title: "報名資訊",
  description:
    "2026 第四屆台灣新創投資年會的報名方案、入場權益與聯絡方式。兩日雙峰論壇於華南金控國際會議中心舉行。",
  alternates: { canonical: "/tickets" },
};

export default function TicketsPage() {
  return (
    <>
      <ScrollSnapController />
      <Tickets />
      <Contact />
    </>
  );
}
