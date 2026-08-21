import { Hero } from "@/components/home/Hero";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";
import { About } from "@/components/home/About";
import { FounderNote } from "@/components/home/FounderNote";
import { Venue } from "@/components/home/Venue";
import { Faq } from "@/components/home/Faq";
import { SiteJsonLd, EventJsonLd, FaqJsonLd } from "@/components/site/JsonLd";
import { speakers } from "@/data/speakers";

export default function HomePage() {
  return (
    <>
      <SiteJsonLd />
      <EventJsonLd
        performers={speakers.map((s) => ({
          name: s.name,
          title: s.title,
          org: s.org,
          slug: s.slug,
        }))}
      />
      <FaqJsonLd />

      <ScrollSnapController />
      <Hero />
      <About />
      <FounderNote />
      <Venue />
      <Faq />
    </>
  );
}
