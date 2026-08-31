import type { MetadataRoute } from "next";
import { speakers } from "@/data/speakers";
import { site, isPublicRoute } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 隱藏中的分頁不列入 sitemap，避免搜尋引擎收錄（路由本身仍在，直接輸入網址打得開）
  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { path: "/", changeFrequency: "weekly" as const, priority: 1 },
      { path: "/about", changeFrequency: "weekly" as const, priority: 0.9 },
      { path: "/speakers", changeFrequency: "weekly" as const, priority: 0.9 },
      { path: "/agenda", changeFrequency: "weekly" as const, priority: 0.9 },
      { path: "/tickets", changeFrequency: "weekly" as const, priority: 0.9 },
      { path: "/sponsor", changeFrequency: "monthly" as const, priority: 0.8 },
      { path: "/review", changeFrequency: "monthly" as const, priority: 0.7 },
    ] as const
  )
    .filter((r) => isPublicRoute(r.path))
    .map((r) => ({
      url: r.path === "/" ? site.url : `${site.url}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }));

  const speakerRoutes: MetadataRoute.Sitemap = speakers.map((s) => ({
    url: `${site.url}/speakers/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...speakerRoutes];
}
