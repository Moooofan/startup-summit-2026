"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as THREE from "three";
import type { Group, BufferGeometry } from "three";

/* ==========================================================================
   OrbitGlass — 破碎的立體玻璃手鐲（WebGL / react-three-fiber）
   厚實、不規律的「圓弧長方體」碎塊，散在 2–3 層深度上、仍組成圓。
   全部碎塊合併成一個 mesh（單一 transmission buffer → 省效能），
   套 drei MeshTransmissionMaterial 做真折射 + 色散，並以 Bloom 讓邊緣發光。
   虹彩由自帶的 <Lightformer> 現場打光反射而來（不拉外部 HDRI，完全離線）。
   ========================================================================== */

// 好幾條「細長彎條」：長弧、徑向窄、薄、粗細不一，分佈在幾個半徑帶層疊（呼應 split_circle.jpg 右側）
const N = 10; // 主環條數（減少 → 稀疏）
const SKIP = new Set([3, 7]); // 兩個破口
const SEED = 7; // 亂數種子（換數字換一組排列）
const R_OUT = 2.05; // 主環外緣半徑
const R_IN = 1.82; // 主環內緣半徑 → 內外緣都對齊成乾淨環帶

// 由外而內的同心破環：前兩層填補「外側與中心之間」的空隙；後幾層越靠中心 z 越高 → 往上飽滿的圓頂
const BANDS: { r: number; count: number; z: number }[] = [
  { r: 1.52, count: 8, z: 0.04 },
  { r: 1.15, count: 6, z: 0.1 },
  { r: 0.78, count: 8, z: 0.24 },
  { r: 0.56, count: 6, z: 0.42 },
  { r: 0.36, count: 5, z: 0.56 },
  { r: 0.18, count: 3, z: 0.68 },
];

// 每條的漸層色停（淺色 KV 光軌調）；不同條配不同色對 → 每塊顏色不一
const CPAIRS: [string, string][] = [
  ["#dcf4ff", "#a9c0ff"],
  ["#b3d3ff", "#d3ccff"],
  ["#e4dbff", "#ffcbe6"],
  ["#ffe6cd", "#ffcbdd"],
  ["#cef2ff", "#c2c8ff"],
  ["#e8e1ff", "#c7dcff"],
  ["#ffdcf1", "#cde0ff"],
];

// 傾斜（上下鏡射）
const TILT: [number, number, number] = [-1.02, 0, 0.4];
// 3 個速度區段：外環、中間層、中心圓頂各自不同轉速（rad/s）
const SPIN_OUTER = 0.055;
const SPIN_MID = 0.095;
const SPIN_DOME = 0.15;

// 玻璃材質參數（三群組共用一組值，但各自一份實例 → 各自的 transmission buffer）
// 參考 pmndrs「inter-epoxy-resin」的環氧樹脂配方（ior 1.5 / roughness≈0 / 高色散 / body 染色），
// 換成本站藍色調；並刻意「降低透明度」：transmission 調低 + 縮短 attenuationDistance 且上藍色
// → 厚處吸光染藍，讀起來像有實體的染色玻璃，而非全透明薄殼。
const MATERIAL_PROPS = {
  transmission: 0.94, // 提高透明度（保留 resin 質感靠 ior/色散，不靠壓低透明度）
  thickness: 0.9, // ↑ 0.6（更厚 → 折射更明顯）
  roughness: 0.08,
  ior: 1.5, // resin
  chromaticAberration: 0.85, // ↑ 0.4（樹脂邊緣色散，藍調不過度）
  anisotropicBlur: 0.1,
  distortion: 0.2,
  distortionScale: 0.28,
  temporalDistortion: 0,
  samples: 3, // 保持效能預算（先前使用者抱怨捲動卡 → 別調高）
  resolution: 144, // 同上，維持 144
  backsideThickness: 0.3,
  color: "#e3e9ff", // 微冷白 body tint
  attenuationColor: "#4c68d4", // brand-lift 藍 → 厚處淡淡染藍
  attenuationDistance: 8, // 拉長 → 吸收變弱 → 更通透（僅厚處帶一點藍）
};

// 種子亂數（mulberry32）→ 排列可重現、好微調
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sectorShape(inner: number, outer: number, a0: number, a1: number) {
  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(a0) * outer, Math.sin(a0) * outer);
  shape.absarc(0, 0, outer, a0, a1, false);
  shape.lineTo(Math.cos(a1) * inner, Math.sin(a1) * inner);
  shape.absarc(0, 0, inner, a1, a0, true);
  shape.closePath();
  return shape;
}

// 把一片弧塊繞自身重心傾斜/擺動 + 推到指定深度層 → 不規律、有層次
function placePiece(geo: BufferGeometry, theta: number, rmid: number, zoff: number, tilt: number, wobble: number) {
  const cx = Math.cos(theta) * rmid;
  const cy = Math.sin(theta) * rmid;
  const axis = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0); // 徑向軸
  const m = new THREE.Matrix4()
    .multiply(new THREE.Matrix4().makeTranslation(cx, cy, 0))
    .multiply(new THREE.Matrix4().makeRotationAxis(axis, tilt)) // 沿徑向傾出平面
    .multiply(new THREE.Matrix4().makeRotationZ(wobble)) // 平面內擺動
    .multiply(new THREE.Matrix4().makeTranslation(-cx, -cy, 0));
  geo.applyMatrix4(m);
  geo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, zoff)); // 深度層
}

// 沿弧長把兩色漸層烤進頂點色（放在 placePiece 之前，用尚未傾斜的 XY 角度計算）
function applyVertexGradient(geo: BufferGeometry, mid: number, span: number, aHex: string, bHex: string) {
  const pos = geo.attributes.position;
  const n = pos.count;
  const arr = new Float32Array(n * 3);
  const ca = new THREE.Color(aHex);
  const cb = new THREE.Color(bHex);
  const tmp = new THREE.Color();
  const half = span / 2;
  for (let v = 0; v < n; v++) {
    let ang = Math.atan2(pos.getY(v), pos.getX(v)) - mid;
    ang = Math.atan2(Math.sin(ang), Math.cos(ang)); // 收斂到 [-π,π]
    let t = (ang + half) / span;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    tmp.copy(ca).lerp(cb, t);
    arr[v * 3] = tmp.r;
    arr[v * 3 + 1] = tmp.g;
    arr[v * 3 + 2] = tmp.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
}

type GroupKey = "outer" | "mid" | "dome";
type PieceSpec = {
  group: GroupKey;
  mid: number;
  rmid: number;
  rt: number;
  span: number;
  depth: number;
  z: number;
  tilt: number;
  wobble: number;
  ca: string;
  cb: string;
};

// 只算「參數」（吃亂數、極便宜）—— 亂數消耗順序與原同步版逐項一致 → 幾何結果不變。
// 真正貴的一步（擠出＋倒角＋三角化＋烤頂點色）延到 specToGeometry，於 Ring 內分幀進行。
function computeSpecs(): PieceSpec[] {
  const rand = makeRng(SEED * 1013904223);
  const lerp = (a: number, b: number) => a + (b - a) * rand();
  const specs: PieceSpec[] = [];

  // 主環 → outer 群組：內外緣都對齊、幾乎共面、近乎不傾斜 → 切齊、不穿出
  for (let i = 0; i < N; i++) {
    if (SKIP.has(i)) continue;
    const mid = (i / N) * Math.PI * 2 + lerp(-0.05, 0.05); // 角度抖動收小 → 不擠到鄰塊
    const router = R_OUT + lerp(-0.012, 0.012);
    const rinner = R_IN + lerp(-0.012, 0.012);
    const rt = router - rinner;
    const rmid = (router + rinner) / 2;
    const depth = lerp(0.18, 0.26);
    const span = lerp(12, 28) * (Math.PI / 180); // 弧長縮短（< 36° pitch）→ 外環不再重疊
    const z = lerp(-0.025, 0.025);
    const tilt = lerp(-0.025, 0.025);
    const wobble = lerp(-0.03, 0.03);
    const [ca, cb] = CPAIRS[Math.floor(rand() * CPAIRS.length)];
    specs.push({ group: "outer", mid, rmid, rt, span, depth, z, tilt, wobble, ca, cb });
  }

  // 同心破環：r>=1 歸 mid 群組（外側與中心之間），其餘歸 dome 群組（中心圓頂，越內越高）
  for (const band of BANDS) {
    const group: GroupKey = band.r >= 1 ? "mid" : "dome";
    for (let k = 0; k < band.count; k++) {
      const mid = (k / band.count) * Math.PI * 2 + lerp(-0.18, 0.18);
      const router = band.r + lerp(-0.02, 0.02);
      const w = rand();
      const rt = 0.03 + 0.07 * w;
      const depth = 0.12 + 0.1 * w;
      const span = lerp(16, 44) * (Math.PI / 180);
      const z = band.z + lerp(-0.03, 0.03);
      const tilt = lerp(-0.06, 0.06);
      const wobble = lerp(-0.06, 0.06);
      const [ca, cb] = CPAIRS[Math.floor(rand() * CPAIRS.length)];
      specs.push({ group, mid, rmid: router - rt / 2, rt, span, depth, z, tilt, wobble, ca, cb });
    }
  }
  return specs;
}

// 單塊玻璃的貴步驟 → 分幀呼叫（每幀只做幾塊，之間讓出主執行緒）
function specToGeometry(s: PieceSpec): BufferGeometry {
  const shape = sectorShape(s.rmid - s.rt / 2, s.rmid + s.rt / 2, s.mid - s.span / 2, s.mid + s.span / 2);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: s.depth,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    // 進場凍格主因是這段同步造幾何的頂點量：bevelSegments 2→1、curveSegments 20→10
    // → 頂點數約砍半、build 時間大減；弧塊小，斜角與弧線的視覺差幾乎看不出（不動塊數 → 密度不變）
    bevelSegments: 1,
    curveSegments: 10,
  });
  geo.translate(0, 0, -s.depth / 2);
  applyVertexGradient(geo, s.mid, s.span, s.ca, s.cb);
  placePiece(geo, s.mid, s.rmid, s.z, s.tilt, s.wobble);
  return geo;
}

function mergeGroup(arr: BufferGeometry[]): BufferGeometry {
  const m = mergeGeometries(arr, false);
  arr.forEach((g) => g.dispose());
  m.computeVertexNormals();
  return m;
}

// 一個速度群組：自轉、自己一份玻璃材質
function GlassGroup({
  geometry,
  speed,
  bg,
}: {
  geometry: BufferGeometry;
  speed: number;
  bg: THREE.Color;
}) {
  const spin = useRef<Group>(null);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.z += dt * speed;
  });
  return (
    <group ref={spin}>
      <mesh geometry={geometry}>
        <MeshTransmissionMaterial vertexColors backside background={bg} {...MATERIAL_PROPS} />
      </mesh>
    </group>
  );
}

type Groups = { outer: BufferGeometry; mid: BufferGeometry; dome: BufferGeometry };

function Ring({ onReady }: { onReady?: () => void }) {
  const [groups, setGroups] = useState<Groups | null>(null);
  // 玻璃折射看到的底色：拉亮成藍調 → 玻璃本體更淺、更通透
  const bg = useMemo(() => new THREE.Color("#a9c1ea"), []);

  // 分幀建構：把 ~44 塊玻璃拆成每幀幾塊，之間讓出主執行緒 → 進場不再一次性凍格。
  // computeSpecs 保留原亂數順序 → 幾何與同步版完全一致（純效能重構，外觀不變）。
  useEffect(() => {
    let cancelled = false;
    const specs = computeSpecs();
    const buckets: Record<GroupKey, BufferGeometry[]> = { outer: [], mid: [], dome: [] };
    let idx = 0;
    const CHUNK = 6; // 掛載時進場動畫已收尾、無需為它讓幀 → 一次多做幾塊，玻璃盤更快建好
    let raf = 0;
    const step = () => {
      if (cancelled) return;
      const end = Math.min(idx + CHUNK, specs.length);
      for (; idx < end; idx++) {
        const s = specs[idx];
        buckets[s.group].push(specToGeometry(s));
      }
      if (idx < specs.length) {
        raf = requestAnimationFrame(step);
        return;
      }
      setGroups({
        outer: mergeGroup(buckets.outer),
        mid: mergeGroup(buckets.mid),
        dome: mergeGroup(buckets.dome),
      });
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      // 尚未合併的殘塊在此釋放；已合併者由 GlassGroup 卸載時各自 dispose
      [...buckets.outer, ...buckets.mid, ...buckets.dome].forEach((g) => g.dispose());
    };
  }, []);

  const frames = useRef(0);
  useFrame(() => {
    // 幾何就緒後，等畫出第一格才通知 ready → 淡入時不會露出空畫布
    if (!groups) return;
    frames.current += 1;
    if (frames.current === 2) onReady?.();
  });

  if (!groups) return null;
  return (
    <group rotation={TILT}>
      <GlassGroup geometry={groups.outer} speed={SPIN_OUTER} bg={bg} />
      <GlassGroup geometry={groups.mid} speed={SPIN_MID} bg={bg} />
      <GlassGroup geometry={groups.dome} speed={SPIN_DOME} bg={bg} />
    </group>
  );
}

function Lights() {
  return (
    <Environment resolution={128} frames={1}>
      {/* 淺色、airy 的環境光：亮白主光 + 淡藍/青/紫虹彩，取自 KV 光軌色 */}
      <Lightformer form="ring" intensity={3.4} color="#d6f4ff" position={[0, 3.5, -4]} scale={7} />
      <Lightformer form="rect" intensity={4.2} color="#9cc6ff" position={[-5, 1, -2]} scale={[3, 7, 1]} />
      <Lightformer form="rect" intensity={3.6} color="#b4adff" position={[5, -1.5, -2]} scale={[3, 7, 1]} />
      <Lightformer form="rect" intensity={2.6} color="#ffd3a8" position={[0, -4, -3]} scale={6} />
      <Lightformer form="rect" intensity={6} color="#ffffff" position={[1, 4, 4]} scale={5} />
      <Lightformer form="circle" intensity={3} color="#e7ecff" position={[-3, -3, 3]} scale={3.5} />
    </Environment>
  );
}

export default function OrbitGlass({
  onReady,
  active = true,
}: {
  onReady?: () => void;
  /** false → 暫停 render loop（例如捲離 Hero）→ 不再吃 GPU，其餘區塊捲動才順 */
  active?: boolean;
}) {
  return (
    <Canvas
      aria-hidden
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
      camera={{ position: [0, 0, 10.4], fov: 30 }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMappingExposure = 1.35; // 提亮，整體更淺
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <Ring onReady={onReady} />
      <Lights />
      {/* 不用 EffectComposer/Bloom：套後製會讓整個 canvas 方形輸出成不透明 → 玻璃盤周圍出現方塊色差；
          移除後 canvas 恢復透明（只剩玻璃盤），也順帶再省效能。玻璃亮邊由 Lightformer 提供。 */}
    </Canvas>
  );
}
