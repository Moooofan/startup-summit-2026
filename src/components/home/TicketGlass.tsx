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
   故用淺藍 background 當折射底（別移除，否則變黑）。玻璃板隨時間緩慢擺動 → 反光低頻掃過。
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

  // 折射底色（淺藍，貼近圓環藍調但淺一點 → 玻璃感 + 疊字可讀）
  const bg = useMemo(() => new THREE.Color(featured ? "#ccd8f2" : "#d6e0f6"), [featured]);
  const bodyColor = featured ? "#eef2ff" : "#f3f6ff";
  const attColor = featured ? "#9aa9e6" : "#b3c0ee";

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
      {/* 藍色調、對比較強的光片 → 玻璃面上有清楚的高光帶（掃過即成低頻反光） */}
      <Lightformer form="rect" intensity={5} color="#ffffff" position={[0, 2.5, 3]} scale={[5, 1.6, 1]} />
      <Lightformer form="rect" intensity={3} color="#9cc6ff" position={[-3.5, 1, 2]} scale={[2, 5, 1]} />
      <Lightformer form="rect" intensity={3} color="#b4adff" position={[3.5, -1, 2]} scale={[2, 5, 1]} />
      <Lightformer form="ring" intensity={2.6} color="#d6f4ff" position={[0, 0, -5]} scale={6} />
      <Lightformer form="circle" intensity={2} color="#e7ecff" position={[-2, -2.5, 3]} scale={3} />
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
        gl.toneMappingExposure = 1.25;
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <Slab featured={featured} onReady={onReady} animate={animate} />
      <Lights />
    </Canvas>
  );
}
