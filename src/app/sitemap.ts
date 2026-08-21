import type { MetadataRoute } from "next";
import { speakers } from "@/data/speakers";
import { site } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/speakers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/agenda`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/tickets`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/sponsor`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/review`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const speakerRoutes: MetadataRoute.Sitemap = speakers.map((s) => ({
    url: `${site.url}/speakers/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...speakerRoutes];
}
