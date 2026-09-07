import type { Metadata } from "next";
import { Speakers } from "@/components/home/Speakers";
import { speakers } from "@/data/speakers";
import { BreadcrumbJsonLd, SpeakerListJsonLd } from "@/components/site/JsonLd";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";

export const metadata: Metadata = {
  title: "講者陣容",
  description:
    "41 位講者，兩天分場登台 —— 從剛掛牌的創業家、Edge AI 與 AI 軟體團隊，到管理國際基金的機構投資人。",
  alternates: { canonical: "/speakers" },
};

export default function SpeakersPage() {
  return (
    <>
      <SpeakerListJsonLd
        people={speakers.map((s) => ({ name: s.name, slug: s.slug }))}
      />
      <BreadcrumbJsonLd
        trail={[
          { name: "首頁", path: "/" },
          { name: "講者陣容", path: "/speakers" },
        ]}
      />
      <ScrollSnapController />
      <Speakers />
    </>
  );
}
