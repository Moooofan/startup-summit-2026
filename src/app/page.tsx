import { Hero } from "@/components/home/Hero";
import { SiteJsonLd, EventJsonLd } from "@/components/site/JsonLd";
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

      <Hero />
    </>
  );
}
