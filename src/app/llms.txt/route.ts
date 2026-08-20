import { event, forums } from "@/data/event";
import { speakers } from "@/data/speakers";
import { tracks } from "@/data/tracks";
import { tiers } from "@/data/sponsors";
import { editions } from "@/data/review";
import { founderProfile } from "@/data/founder";
import { site } from "@/lib/config";

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
- 票價：全天票 ${event.tickets.currency}${event.tickets.full.toLocaleString()}，早鳥票 ${event.tickets.currency}${event.tickets.earlyBird.toLocaleString()}
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
- [首頁](${site.url}/)：活動總覽、講者、主題軌、報名資訊
- [贊助方案](${site.url}/sponsor)：五級贊助方案與展位規格
- [歷屆回顧](${site.url}/review)：第三屆完整議程、媒體報導與合作夥伴

## 聯絡
- ${event.contact.email}
- 台灣新創投資社團：https://www.facebook.com/groups/1169347120648777/
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
