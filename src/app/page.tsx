import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FounderNote } from "@/components/home/FounderNote";
import { Speakers } from "@/components/home/Speakers";
import { Agenda } from "@/components/home/Agenda";
import { Venue } from "@/components/home/Venue";
import { Tickets } from "@/components/home/Tickets";
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

      <Hero />
      <About />
      <FounderNote />
      <Speakers />
      <Agenda />
      <Venue />
      <Tickets />
      <Faq />
    </>
  );
}
