"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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
  ["#bfeaff", "#6a86ff"],
  ["#7fb2ff", "#b4adff"],
  ["#c9b8ff", "#ff9ecb"],
  ["#ffd3a8", "#ff9ec2"],
  ["#a6e8ff", "#8f9bff"],
  ["#d7cafe", "#8fb8ff"],
  ["#ffc0e6", "#9ec8ff"],
];

// 傾斜（上下鏡射）
const TILT: [number, number, number] = [-1.02, 0, 0.4];
// 3 個速度區段：外環、中間層、中心圓頂各自不同轉速（rad/s）
const SPIN_OUTER = 0.055;
const SPIN_MID = 0.095;
const SPIN_DOME = 0.15;

// 玻璃材質參數（三群組共用一組值，但各自一份實例 → 各自的 transmission buffer）
const MATERIAL_PROPS = {
  transmission: 0.96,
  thickness: 0.6,
  roughness: 0.045,
  ior: 1.3,
  chromaticAberration: 0.4,
  anisotropicBlur: 0.1,
  distortion: 0.18,
  distortionScale: 0.3,
  temporalDistortion: 0,
  samples: 3,
  resolution: 144,
  backsideThickness: 0.2,
  color: "#ffffff",
  attenuationColor: "#ffffff",
  attenuationDistance: 12,
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

// 產生 3 個速度群組的幾何：outer（主環）/ mid（外側與中心之間）/ dome（中心圓頂）
function buildGroups(): { outer: BufferGeometry; mid: BufferGeometry; dome: BufferGeometry } {
  const rand = makeRng(SEED * 1013904223);
  const lerp = (a: number, b: number) => a + (b - a) * rand();
  const outerParts: BufferGeometry[] = [];
  const midParts: BufferGeometry[] = [];
  const domeParts: BufferGeometry[] = [];

  const addPiece = (
    arr: BufferGeometry[],
    mid: number,
    rmid: number,
    rt: number,
    span: number,
    depth: number,
    z: number,
    tilt: number,
    wobble: number
  ) => {
    const shape = sectorShape(rmid - rt / 2, rmid + rt / 2, mid - span / 2, mid + span / 2);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 2,
      curveSegments: 20,
    });
    geo.translate(0, 0, -depth / 2);
    const [ca, cb] = CPAIRS[Math.floor(rand() * CPAIRS.length)];
    applyVertexGradient(geo, mid, span, ca, cb);
    placePiece(geo, mid, rmid, z, tilt, wobble);
    arr.push(geo);
  };

  // 主環 → outer 群組：內外緣都對齊、幾乎共面、近乎不傾斜 → 切齊、不穿出
  for (let i = 0; i < N; i++) {
    if (SKIP.has(i)) continue;
    const mid = (i / N) * Math.PI * 2 + lerp(-0.1, 0.1);
    const router = R_OUT + lerp(-0.012, 0.012);
    const rinner = R_IN + lerp(-0.012, 0.012);
    const rt = router - rinner;
    const rmid = (router + rinner) / 2;
    const depth = lerp(0.18, 0.26);
    const span = lerp(14, 38) * (Math.PI / 180);
    const z = lerp(-0.025, 0.025);
    addPiece(outerParts, mid, rmid, rt, span, depth, z, lerp(-0.025, 0.025), lerp(-0.03, 0.03));
  }

  // 同心破環：r>=1 歸 mid 群組（外側與中心之間），其餘歸 dome 群組（中心圓頂，越內越高）
  for (const band of BANDS) {
    const arr = band.r >= 1 ? midParts : domeParts;
    for (let k = 0; k < band.count; k++) {
      const mid = (k / band.count) * Math.PI * 2 + lerp(-0.18, 0.18);
      const router = band.r + lerp(-0.02, 0.02);
      const w = rand();
      const rt = 0.03 + 0.07 * w;
      const depth = 0.12 + 0.1 * w;
      const span = lerp(16, 44) * (Math.PI / 180);
      const z = band.z + lerp(-0.03, 0.03);
      addPiece(arr, mid, router - rt / 2, rt, span, depth, z, lerp(-0.06, 0.06), lerp(-0.06, 0.06));
    }
  }

  const build = (arr: BufferGeometry[]) => {
    const m = mergeGeometries(arr, false);
    arr.forEach((g) => g.dispose());
    m.computeVertexNormals();
    return m;
  };
  return { outer: build(outerParts), mid: build(midParts), dome: build(domeParts) };
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

function Ring({ onReady }: { onReady?: () => void }) {
  const groups = useMemo(buildGroups, []);
  // 玻璃折射看到的底色：拉亮成藍調 → 玻璃本體更淺、更通透
  const bg = useMemo(() => new THREE.Color("#243357"), []);
  const frames = useRef(0);
  useFrame(() => {
    // 等畫出第一格後才通知就緒 → 淡入時不會露出空畫布
    frames.current += 1;
    if (frames.current === 2) onReady?.();
  });

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
      {/* Bloom：讓玻璃亮邊發光。門檻放低 → 更多亮部泛光、更 airy */}
      <EffectComposer multisampling={2}>
        <Bloom
          mipmapBlur
          intensity={0.85}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.3}
          radius={0.75}
        />
      </EffectComposer>
    </Canvas>
  );
}
