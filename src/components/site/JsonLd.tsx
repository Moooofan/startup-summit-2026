import { event, forums } from "@/data/event";
import { founderProfile } from "@/data/founder";
import { faqs } from "@/data/faq";
import { site } from "@/lib/config";
import { REGISTER_URL, REGISTER_READY } from "@/lib/config";

function Ld({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* Person.description 的長度上限取 300 字。直接 slice 會從中文句子正中間切斷
   （實測有兩位講者被切在「等」「他聚焦早」這種半句上），送進 schema 會變成
   讀不完的句子。改成退到最後一個句末標點，寧可短一點也要是完整句。 */
function truncateAtSentence(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const head = flat.slice(0, max);
  const cut = Math.max(
    head.lastIndexOf("。"),
    head.lastIndexOf("！"),
    head.lastIndexOf("？"),
  );
  // 找不到句末標點（或句子過長導致切點太靠前）才退回硬切
  return cut > max * 0.5 ? head.slice(0, cut + 1) : head;
}

const organization = {
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: event.organizer.name,
  url: site.url,
  description: `台灣最大的新創投資公開社群，成員逾 ${event.organizer.members}，每年主辦台灣新創投資年會。`,
  sameAs: [
    "https://www.facebook.com/groups/1169347120648777/",
  ],
  founder: {
    "@type": "Person",
    name: founderProfile.name,
    alternateName: founderProfile.nameEn,
    jobTitle: founderProfile.title,
  },
};

/** 全站共用：Organization + WebSite */
export function SiteJsonLd() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@graph": [
          organization,
          {
            "@type": "WebSite",
            "@id": `${site.url}/#website`,
            url: site.url,
            name: site.name,
            description: site.description,
            inLanguage: "zh-Hant-TW",
            publisher: { "@id": `${site.url}/#organization` },
          },
        ],
      }}
    />
  );
}

/** 首頁：Event（含兩天 subEvent、票價、講者） */
export function EventJsonLd({
  performers = [],
}: {
  performers?: { name: string; title: string; org: string; slug: string }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "Event",
        "@id": `${site.url}/#event`,
        name: event.fullName,
        alternateName: event.nameEn,
        description: site.description,
        startDate: event.startDate,
        endDate: event.endDate,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        inLanguage: "zh-Hant-TW",
        url: site.url,
        image: [`${site.url}/og-v2.png`],
        location: {
          "@type": "Place",
          name: `${event.venue.name} ${event.venue.detail}`,
          address: {
            "@type": "PostalAddress",
            // TODO: 取得完整街道地址後補上 streetAddress
            addressLocality: "臺北市",
            addressCountry: "TW",
          },
        },
        organizer: { "@id": `${site.url}/#organization` },
        maximumAttendeeCapacity: 700,
        /* 只掛兩筆「1 人價」的 Offer，刻意不把四段團報級距展開成八筆：
           團報是同一張票的數量折扣，逐段展開會被 Google 讀成八種不同票種、
           且 rich result 只會挑最低價顯示（NT$1,600）造成誤導。以 1 人價當代表價最貼近檢索意圖。 */
        offers: [
          {
            "@type": "Offer",
            name: "早鳥票（單日・1 人）",
            price: event.tickets.earlyBird,
            priceCurrency: "TWD",
            availability: REGISTER_READY
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
            url: REGISTER_READY ? REGISTER_URL : `${site.url}/tickets`,
            validThrough: event.startDate,
          },
          {
            "@type": "Offer",
            name: "一般票（單日・1 人）",
            price: event.tickets.full,
            priceCurrency: "TWD",
            availability: REGISTER_READY
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
            url: REGISTER_READY ? REGISTER_URL : `${site.url}/tickets`,
            validThrough: event.startDate,
          },
        ],
        performer: performers.map((p) => ({
          "@type": "Person",
          name: p.name,
          jobTitle: p.title,
          worksFor: { "@type": "Organization", name: p.org },
          url: `${site.url}/speakers/${p.slug}`,
        })),
        subEvent: forums.map((f) => ({
          "@type": "Event",
          name: `${event.fullName}・${f.name}`,
          description: f.description,
          startDate: `${f.date}T09:00:00+08:00`,
          endDate: `${f.date}T17:00:00+08:00`,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: event.venue.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: "臺北市",
              addressCountry: "TW",
            },
          },
        })),
      }}
    />
  );
}

/** 首頁：FAQPage */
export function FaqJsonLd() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

/* 麵包屑。/speakers/[slug] 是三層路由（首頁 → 講者陣容 → 某位講者），
   SERP 有 BreadcrumbList 才會顯示路徑而不是裸網址。
   name 用畫面上真正的導覽字樣，與頁面標題一致，避免標記與內容不符。 */
export function BreadcrumbJsonLd({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          item: t.path === "/" ? site.url : `${site.url}${t.path}`,
        })),
      }}
    />
  );
}

/* 講者陣容頁：CollectionPage + ItemList。
   讓 Google 讀懂這一頁是「名錄」而不是一般內容頁，並把 41 個講者頁串成一組集合。
   只放 url 不重複整份 Person（各講者頁自己有 Person，用 @id 交叉引用即可）。 */
export function SpeakerListJsonLd({
  people,
}: {
  people: { name: string; slug: string }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${site.url}/speakers#collection`,
        url: `${site.url}/speakers`,
        name: "講者陣容",
        inLanguage: "zh-Hant-TW",
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#event` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: people.length,
          itemListElement: people.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: `${site.url}/speakers/${p.slug}`,
          })),
        },
      }}
    />
  );
}

/* 歷屆回顧頁：CollectionPage + 各屆 Event。
   歷屆是已結束的實體活動，Google 靠 startDate/endDate 判定已結束，
   狀態仍是 EventScheduled（沒有「已完成」這個 eventStatus，取消才用 EventCancelled）。
   startDate 只給到年份：editions 的 dateLabel 是給人看的中文字串
   （「2025年10月1日（三）－10月2日（四）　09:00－17:10」），
   硬解析成 ISO 8601 會在括號與全形空白上出錯，寧可只給年份這個確定為真的值。 */
export function ReviewJsonLd({
  pastEditions,
}: {
  pastEditions: {
    no: number;
    year: number;
    venue: string;
    venueAddress?: string;
  }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${site.url}/review#collection`,
        url: `${site.url}/review`,
        name: "歷屆回顧",
        inLanguage: "zh-Hant-TW",
        isPartOf: { "@id": `${site.url}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: pastEditions.length,
          itemListElement: pastEditions.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Event",
              name: `${e.year} 第${e.no}屆台灣新創投資年會`,
              startDate: String(e.year),
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              organizer: { "@id": `${site.url}/#organization` },
              location: {
                "@type": "Place",
                name: e.venue,
                address: e.venueAddress
                  ? {
                      "@type": "PostalAddress",
                      streetAddress: e.venueAddress,
                      addressLocality: "臺北市",
                      addressCountry: "TW",
                    }
                  : {
                      "@type": "PostalAddress",
                      addressLocality: "臺北市",
                      addressCountry: "TW",
                    },
              },
            },
          })),
        },
      }}
    />
  );
}

/** 講者頁：Person */
export function PersonJsonLd({
  name,
  nameEn,
  title,
  org,
  slug,
  bio,
  photo,
}: {
  name: string;
  nameEn?: string;
  title: string;
  org: string;
  slug: string;
  bio: string;
  photo: string;
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${site.url}/speakers/${slug}#person`,
        name,
        ...(nameEn ? { alternateName: nameEn } : {}),
        jobTitle: title,
        worksFor: { "@type": "Organization", name: org },
        description: truncateAtSentence(bio, 300),
        image: `${site.url}${photo}`,
        url: `${site.url}/speakers/${slug}`,
        performerIn: { "@id": `${site.url}/#event` },
      }}
    />
  );
}
