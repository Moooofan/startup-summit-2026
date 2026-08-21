import type { Metadata } from "next";
import { About } from "@/components/home/About";
import { FounderNote } from "@/components/home/FounderNote";
import { Venue } from "@/components/home/Venue";
import { Faq } from "@/components/home/Faq";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";
import { FaqJsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = {
  title: "關於年會",
  description:
    "2026 第四屆台灣新創投資年會的活動總覽、創辦人的話、會場地點與常見問題。一天屬於創辦人、一天屬於投資人的雙峰論壇。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <FaqJsonLd />
      <ScrollSnapController />
      <About />
      <FounderNote />
      <Venue />
      <Faq />
    </>
  );
}
