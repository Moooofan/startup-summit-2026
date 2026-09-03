"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  RoundedBox,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import type { Mesh } from "three";

/* ==========================================================================
   TicketGlass — 報名頁票卡背後的「真玻璃板」（WebGL / react-three-fiber）
   參考 pmndrs「inter-epoxy-resin」：用 drei MeshTransmissionMaterial 做真折射 + 色散，
   由自帶的 <Lightformer> 現場打光（完全離線，不拉外部 HDRI）。
   材質對齊首頁玻璃圓環（OrbitGlass）：亮面 resin（低 roughness、ior 1.5、色散）
   + 藍色折射底 background → 通透玻璃感（非霧面奶白）。WebGL 透射看不到 DOM，
   故用 background 當折射底（別移除，否則變黑）；深色版該值已改成深藍量體，
   理由見 Slab 內的註解。玻璃板隨時間緩慢擺動 → 反光低頻掃過。
   ========================================================================== */

// 亮面藍調樹脂（比霧面版更清透，貼近圓環質感）
const MATERIAL_PROPS = {
  transmission: 0.98,
  thickness: 0.8,
  roughness: 0.09, // 亮面 → 清透玻璃（非奶白霧面）
  ior: 1.5, // resin
  chromaticAberration: 0.5, // 樹脂邊緣色散
  anisotropicBlur: 0.4,
  distortion: 0.14,
  distortionScale: 0.25,
  temporalDistortion: 0,
  samples: 4,
  resolution: 192,
  backsideThickness: 0.2,
  attenuationDistance: 12, // 拉長 → 幾乎不染色 → 更通透
};

function Slab({
  featured,
  onReady,
  animate,
}: {
  featured: boolean;
  onReady?: () => void;
  animate: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const { viewport } = useThree();
  const frames = useRef(0);

  // 折射底色 —— 這是「透過玻璃看到的世界」，不是卡片底色。
  // 淺色版用淺藍（#ccd8f2）配白霧底；深色版照抄的話票卡會變成兩塊發亮的白板，
  // 而卡片上的文字現在是白的 → 直接讀不到。改成主視覺的深藍量體，
  // 玻璃仍有折射與色散，但整體壓在背景之下、讓白字浮上來。
  const bg = useMemo(() => new THREE.Color(featured ? "#152a6e" : "#101f52"), [featured]);
  const bodyColor = featured ? "#dcefff" : "#e6efff";
  const attColor = featured ? "#2b5cff" : "#3b62d8";

  const w = viewport.width;
  const h = viewport.height;
  const depth = Math.min(w, h) * 0.35;
  const radius = Math.min(w, h) * 0.06;

  useFrame((state) => {
    if (mesh.current && animate) {
      const t = state.clock.elapsedTime;
      // 極低頻擺動 → 靜態環境的反光緩慢掃過玻璃面（不影響上層 HTML 文字）
      mesh.current.rotation.y = Math.sin(t * 0.35) * 0.05;
      mesh.current.rotation.x = Math.cos(t * 0.27) * 0.04;
    }
    if (frames.current < 3) {
      frames.current += 1;
      if (frames.current === 2) onReady?.();
    }
  });

  return (
    <RoundedBox
      ref={mesh}
      args={[w * 0.94, h * 0.9, depth]}
      radius={radius}
      smoothness={4}
      steps={1}
    >
      <MeshTransmissionMaterial
        backside
        background={bg}
        color={bodyColor}
        attenuationColor={attColor}
        {...MATERIAL_PROPS}
      />
    </RoundedBox>
  );
}

function Lights() {
  return (
    <Environment resolution={64} frames={1}>
      {/* 光片改吃主視覺的青與電光藍。深色版把主光拉強（5 → 5.6）：
          底色壓深之後，玻璃面全靠這幾道高光帶顯形，光一弱票卡就變成一塊死板。 */}
      <Lightformer form="rect" intensity={5.6} color="#ffffff" position={[0, 2.5, 3]} scale={[5, 1.6, 1]} />
      <Lightformer form="rect" intensity={3.2} color="#8cf5ff" position={[-3.5, 1, 2]} scale={[2, 5, 1]} />
      <Lightformer form="rect" intensity={3.2} color="#a58cf5" position={[3.5, -1, 2]} scale={[2, 5, 1]} />
      <Lightformer form="ring" intensity={2.8} color="#5f8cff" position={[0, 0, -5]} scale={6} />
      <Lightformer form="circle" intensity={2} color="#d6f7ff" position={[-2, -2.5, 3]} scale={3} />
    </Environment>
  );
}

export default function TicketGlass({
  featured = false,
  onReady,
  animate = true,
}: {
  featured?: boolean;
  onReady?: () => void;
  animate?: boolean;
}) {
  return (
    <Canvas
      aria-hidden
      orthographic
      frameloop={animate ? "always" : "demand"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], zoom: 100 }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMappingExposure = 1.15; // 深底上曝光過高會讓票卡泛白、吃掉白字
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <Slab featured={featured} onReady={onReady} animate={animate} />
      <Lights />
    </Canvas>
  );
}
