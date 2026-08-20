import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // AI 爬蟲 —— 明確允許，減少判讀歧義
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Cohere-ai", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
