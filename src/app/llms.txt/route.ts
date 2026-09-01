import { event, forums } from "@/data/event";
import { speakers } from "@/data/speakers";
import { tracks } from "@/data/tracks";
import { tiers } from "@/data/sponsors";
import { editions } from "@/data/review";
import { founderProfile } from "@/data/founder";
import { site, isPublicRoute } from "@/lib/config";

export const dynamic = "force-static";

/** llms.txt —— 讓 AI 搜尋引擎能一次讀懂這場活動的事實。內容自資料檔生成，不會過期。 */
export function GET() {
  const byDay = (key: string) => speakers.filter((s) => s.day === key);

  const body = `# ${event.fullName}・${event.subtitle}

> ${event.nameEn}。${event.dateLabelLong}於${event.venue.name}舉行的兩日論壇：10/14 創辦人論壇、10/15 投資人論壇。由${event.organizer.name}（${event.organizer.members}）主辦，自 2023 年起每年舉辦，${event.year} 年為第 ${event.edition} 屆。

## 活動事實
- 名稱：${event.fullName}（${event.nameEn}）
- 日期：${event.dateLabelLong}，每日 ${event.timeLabel}
- 地點：${event.venue.name} ${event.venue.detail}（臺北市）
- 規模：${event.capacity.seats} 席，${event.capacity.attendance}
- 票價：單日票（10/14 與 10/15 分開售票、價格相同）。早鳥票 ${event.tickets.currency}${event.tickets.earlyBird.toLocaleString()}／人、一般票 ${event.tickets.currency}${event.tickets.full.toLocaleString()}／人（皆為 1 人價）
- 團報單價（${event.tickets.currency}／人）：${event.tickets.groupTiers
    .map((t) => `${t.label} 早鳥 ${t.earlyBird.toLocaleString()}／正常 ${t.full.toLocaleString()}`)
    .join("；")}
- 主辦：${event.organizer.name}｜主辦人 ${founderProfile.name}（${founderProfile.title}）
- 會後另有 ${event.dinner.name}

## 兩日論壇
${forums
  .map(
    (f) =>
      `- ${f.dateLabel.replace(/ /g, "")}（${f.weekday}）${f.name}：主要聽眾為${f.audience}。${f.description}`
  )
  .join("\n")}

## 主題軌
${tracks.map((t) => `- ${t.title}（${t.titleEn}）：${t.summary}`).join("\n")}

## 講者（${speakers.length} 位已公布，國際開幕講者確認中）
### 創辦人論壇 10/14
${byDay("founder").map((s) => `- [${s.name}](${site.url}/speakers/${s.slug})：${s.org} ${s.title}`).join("\n")}

### 投資人論壇 10/15
${byDay("investor").map((s) => `- [${s.name}](${site.url}/speakers/${s.slug})：${s.org} ${s.title}`).join("\n")}

## 贊助方案
${tiers.map((t) => `- ${t.name}（${t.nameEn}）${t.priceLabel}：${t.tagline}`).join("\n")}
詳見 [贊助方案](${site.url}/sponsor)。

## 歷屆回顧
${editions
  .map(
    (e) =>
      `- 第${["一", "二", "三", "四"][e.no - 1]}屆（${e.year}）${e.theme ? `「${e.theme}」` : ""}：${e.venue}${
        e.stats.length ? `。${e.stats.map((s) => `${s.label} ${s.value}`).join("、")}` : ""
      }`
  )
  .join("\n")}
詳見 [歷屆回顧](${site.url}/review)。

## 主要頁面
${[
  { path: "/", label: "首頁", desc: "活動主視覺與入口" },
  { path: "/about", label: "關於年會", desc: "活動總覽、創辦人的話、會場地點、常見問題" },
  { path: "/speakers", label: "講者陣容", desc: `${speakers.length} 位講者` },
  { path: "/agenda", label: "論壇主題", desc: "兩天十二條主題軌" },
  { path: "/tickets", label: "報名資訊", desc: "票價與權益" },
  { path: "/sponsor", label: "贊助方案", desc: "五級贊助方案與展位規格" },
  { path: "/review", label: "歷屆回顧", desc: "第三屆完整議程、媒體報導與合作夥伴" },
]
  .filter((p) => isPublicRoute(p.path))
  .map((p) => `- [${p.label}](${site.url}${p.path === "/" ? "/" : p.path})：${p.desc}`)
  .join("\n")}

## 聯絡
- ${event.contact.email}
- 台灣新創投資社團：https://www.facebook.com/groups/1169347120648777/
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
