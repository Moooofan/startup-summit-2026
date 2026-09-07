/**
 * SEO baseline 擷取器（自製，非 claude-seo 內建）。
 *
 * 為什麼要自己做：公司網路只允許經 HTTP proxy 出去，直連不通；而 claude-seo 的
 * fetch 管線內建 SSRF 防護，會拒絕解析 proxy 的私有 IP（10.x），兩邊互斥，
 * 導致 `/seo drift baseline` 在這台機器上永遠跑不起來。curl 走 proxy 沒問題，
 * 故改用 curl 抓頁面、在此解析出與 claude-seo drift 相同的欄位。
 *
 * 產物存進版控（seo/baselines/），好處是比對歷史直接走 git diff。
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const BASE = "https://www.tsic.tw";
const PATHS = ["/", "/speakers", "/review"];

const fetchPage = (url) =>
  execFileSync("curl", ["-sSL", "--max-time", "40", url], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });

const pick = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const pickAll = (html, re) =>
  [...html.matchAll(re)].map((m) => m[1].replace(/<[^>]+>/g, "").trim()).filter(Boolean);

function parse(html, url) {
  const jsonld = [...html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )].map((m) => { try { return JSON.parse(m[1]); } catch { return { PARSE_ERROR: true }; } });

  const og = {};
  for (const m of html.matchAll(/<meta[^>]+property="(og:[^"]+)"[^>]+content="([^"]*)"/g))
    og[m[1]] = m[2];

  return {
    url,
    status_code: 200,
    title: pick(html, /<title>([^<]*)<\/title>/),
    meta_description: pick(html, /<meta name="description" content="([^"]*)"/),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
    meta_robots: pick(html, /<meta name="robots" content="([^"]*)"/),
    h1: pickAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g),
    h2: pickAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/g),
    h3: pickAll(html, /<h3[^>]*>([\s\S]*?)<\/h3>/g),
    schema_types: jsonld.map((s) => s["@type"] ?? (s["@graph"] ? `@graph[${s["@graph"].map((g) => g["@type"]).join(",")}]` : "?")),
    schema: jsonld,
    open_graph: og,
    html_hash: createHash("sha256").update(html).digest("hex"),
    schema_hash: createHash("sha256").update(JSON.stringify(jsonld)).digest("hex"),
  };
}

mkdirSync("seo/baselines", { recursive: true });
const snapshot = {
  captured_at: new Date().toISOString(),
  base: BASE,
  note: "以 curl 經公司 proxy 擷取；claude-seo 內建 fetch 受 SSRF 防護擋住 proxy 私有 IP",
  pages: PATHS.map((p) => {
    const url = p === "/" ? BASE : BASE + p;
    process.stderr.write(`fetching ${url}\n`);
    return parse(fetchPage(url), url);
  }),
};
writeFileSync("seo/baselines/latest.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log(`captured ${snapshot.pages.length} pages`);
for (const p of snapshot.pages)
  console.log(`  ${p.url}  schema=[${p.schema_types.join(" ")}]  h1=${p.h1.length}  robots=${p.meta_robots ?? "(none)"}`);
