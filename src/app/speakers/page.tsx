import type { Metadata } from "next";
import { Speakers } from "@/components/home/Speakers";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";

export const metadata: Metadata = {
  title: "講者陣容",
  description:
    "34 位講者，兩天分場登台 —— 從剛掛牌的創業家、Edge AI 與半導體團隊，到管理國際基金的機構投資人。",
  alternates: { canonical: "/speakers" },
};

export default function SpeakersPage() {
  return (
    <>
      <ScrollSnapController />
      <Speakers />
    </>
  );
}
