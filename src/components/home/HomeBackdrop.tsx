/**
 * 首頁第一屏（Hero）專屬背景層 —— 滿版的歷屆活動照。
 *
 * 只出現在 Hero：本元件由 Hero 以 absolute inset-0 掛在其內，捲到第二屏時隨 Hero 捲走 →
 * 之後回歸全站的 SiteBackdrop（KV 線構圖）。
 *
 * ## 2026/9 業主：改滿版，且第一屏不要主視覺
 *
 * 舊版是「左半照片 + 右緣一條斜線分割」，照片只佔畫面約六成寬，右半露出 SiteBackdrop 的
 * KV 線構圖（更早之前那條分割還是撕紙鋸齒，也已移除）。現在照片鋪滿整屏，
 * 並且**不透明**，等於把第一屏的 KV 整個蓋掉。
 *
 * 這裡有一個關鍵改動：**LAYER_OPACITY 拿掉了**。舊版整層是 0.6 半透明，
 * 靠「透出下方 KV」與線構圖合成 —— 那正是現在不要的效果。要蓋住 KV，這一層就必須不透明；
 * 半透明的照片疊在線構圖上永遠會透出線條，調到 0.9 也還看得見。
 * 所以照片改為滿版滿透明度，壓暗與統一色改由下方 SCRIM 與 TINT 負責。
 *
 * **別把 opacity 加回來**：那會讓 KV 的斜筆與弧帶重新浮上來，等於改回舊版。
 * 覺得照片太搶，調 SCRIM_* 或 TINT_OPACITY，不要調整層透明度。
 *
 * 形狀：不再有遮罩形狀，就是一張 object-cover 的滿版圖。SVG 與 polygon 遮罩一併移除 ——
 * 沒有斜線要切之後，用 next/image 比手刻 SVG <image> 更好：會走圖片最佳化與 srcset，
 * 首屏這張是 LCP 元素，priority 讓它排進 preload。
 *
 * 頂端刻意淡出（見 SCRIM 的 from-bg）：導覽列是半透明的（未捲動時是 from-bg/90 → transparent），
 * 照片若一路以原亮度鋪到 y=0 會透到 header 後面，看起來像背景長到標題列上。
 *
 * 可讀性：Hero 另有兩層遮罩疊在本層之上（手機 z-[6] 的垂直漸層、桌機 z-[7] 的左側漸層），
 * 文字對比的實測值記在那兩處的註解裡。動本檔的壓暗值時要連那兩層一起看。
 */

import Image from "next/image";

/* 首頁第一屏的底圖。2026/9 業主指定固定為第三屆主講照。
   換圖只改這裡；輪播版本（五張淡入淡出）已隨滿版改版一併移除 ——
   滿版之後照片是第一屏的主體，換圖時的跳動比左半小圖明顯得多。 */
const PHOTO = "/review/third-edition-keynote-hofeipeng.jpg";

/* 統一色：把雜色照片染進 KV 的深靛色系，讓第一屏與其他頁的底色仍是同一支藍。
   滿版之後它的份量比舊版重（舊版只作用在左半的六成寬），所以由 0.26 降到 0.22 ——
   同樣的 alpha 鋪滿整屏會比只鋪一角看起來更重。 */
const TINT = "#020867";
const TINT_OPACITY = 0.22;

/* 壓暗漸層。舊版這件事由「整層 0.6 透明度」順便完成，滿版不透明之後必須自己來。
   由上而下：頂端貼齊導覽列（實色）→ 中段留給照片 → 底端再收回實色接住下一區塊。
   左右向另有 Hero 的 z-[7] 那層負責文字區，這裡只管垂直向。 */
const SCRIM = "linear-gradient(to bottom, rgb(5 10 43 / 0.92) 0%, rgb(5 10 43 / 0.45) 26%, rgb(5 10 43 / 0.42) 62%, rgb(5 10 43 / 0.96) 100%)";

export function HomeBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* 滿版照片。sizes="100vw" —— 它就是整個視窗寬，不是某個欄位裡的圖。
          brightness 略降：深色版裡照片本來就是第一屏最亮的東西，
          不壓一階會在深靛底上打出一塊「亮洞」。saturate 降低則是為了讓 TINT 染得上色。 */}
      <Image
        src={PHOTO}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ filter: "saturate(0.8) brightness(0.92)" }}
      />

      {/* 統一色 */}
      <div className="absolute inset-0" style={{ backgroundColor: TINT, opacity: TINT_OPACITY }} />

      {/* 垂直壓暗 */}
      <div className="absolute inset-0" style={{ backgroundImage: SCRIM }} />
    </div>
  );
}
