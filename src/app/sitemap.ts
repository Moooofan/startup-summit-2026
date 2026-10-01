import type { MetadataRoute } from "next";
import { speakers } from "@/data/speakers";
import { notes } from "@/data/notes";
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
      { path: "/notes", changeFrequency: "weekly" as const, priority: 0.8 },
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

  // 內頁跟著 /notes 的開關走：列表還沒對外時，文章也不該先被收錄
  const noteRoutes: MetadataRoute.Sitemap = isPublicRoute("/notes")
    ? notes.map((n) => ({
        url: `${site.url}/notes/${n.slug}`,
        lastModified: new Date(n.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    : [];

  return [...staticRoutes, ...speakerRoutes, ...noteRoutes];
}
