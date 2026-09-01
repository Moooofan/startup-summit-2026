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
        image: [`${site.url}/kv/kv-full.png`],
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
           且 rich result 只會挑最低價顯示（NT$1,500）造成誤導。以 1 人價當代表價最貼近檢索意圖。 */
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
        description: bio.slice(0, 300),
        image: `${site.url}${photo}`,
        url: `${site.url}/speakers/${slug}`,
        performerIn: { "@id": `${site.url}/#event` },
      }}
    />
  );
}
