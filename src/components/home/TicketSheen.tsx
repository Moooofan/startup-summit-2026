"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { ShaderMaterial } from "three";

/* ==========================================================================
   TicketSheen — 報名頁的「低頻率反光」玻璃質感（WebGL / 自寫 shader）
   不拉外部貼圖、不用 drei transmission（省效能、可離線）：
   一張全螢幕四邊形 + 片段著色器算出：
     mode="frame" → 圓角矩形「邊框帶」上兩個緩慢繞行的高光 → 卡片周圍低頻反光
     mode="fill"  → 斜向緩慢掃過的光澤條 → 按鈕／說明面板的反光質感
   顏色維持 KV 藍調（uColor）。尊重 prefers-reduced-motion（animate=false 時凍結）。
   ========================================================================== */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0); // 直接寫 clip space → 永遠滿版、與相機無關
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec3  uColor;
  uniform float uMode;      // 0 = frame, 1 = fill
  uniform float uIntensity;
  uniform float uRadius;

  // 圓角矩形有號距離場
  float sdRound(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= aspect;                 // x ∈ [-aspect, aspect]，y ∈ [-1, 1]
    vec2 b = vec2(aspect, 1.0);
    vec3 white = vec3(1.0);

    if (uMode < 0.5) {
      // ---- frame：卡片周圍的邊框反光 ----
      float d = sdRound(p, b - 0.05, uRadius);      // 內縮一點，邊框帶落在卡片邊緣
      float band = smoothstep(0.085, 0.0, abs(d));  // d≈0 的一圈（收窄 → 更細的玻璃邊）
      float a = atan(p.y, p.x);
      // 兩個相對的高光，緩慢繞行（~28s 一圈）→ 低頻；exponent 拉高 → 掃過感更明確
      float h1 = pow(max(0.0, cos(a - uTime * 0.22)), 9.0);
      float h2 = pow(max(0.0, cos(a - uTime * 0.22 - 3.14159)), 9.0);
      float glint = (h1 + h2) * band;
      vec3 col = mix(uColor, white, clamp(glint, 0.0, 1.0));
      float alpha = uIntensity * (band * 0.26 + glint * 1.0);
      gl_FragColor = vec4(col, alpha);
    } else {
      // ---- fill：整面斜向緩慢光澤 ----
      float inside = smoothstep(0.0, -0.03, sdRound(p, b - 0.02, uRadius));
      float phase = (p.x + p.y * 0.6) * 0.22 - uTime * 0.06;
      float sweep = smoothstep(0.55, 0.0, abs(fract(phase) - 0.5)); // 緩慢移動的亮帶
      float top = smoothstep(-0.2, 1.0, p.y) * 0.18;                // 上緣多一點光
      vec3 col = mix(uColor, white, sweep);
      float alpha = uIntensity * inside * (0.12 + sweep * 0.55 + top);
      gl_FragColor = vec4(col, alpha);
    }
  }
`;

function Plane({
  mode,
  color,
  intensity,
  radius,
}: {
  mode: "frame" | "fill";
  color: string;
  intensity: number;
  radius: number;
}) {
  const mat = useRef<ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uColor: { value: new THREE.Color(color) },
      uMode: { value: mode === "fill" ? 1 : 0 },
      uIntensity: { value: intensity },
      uRadius: { value: radius },
    }),
    [color, mode, intensity, radius]
  );

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function TicketSheen({
  mode = "frame",
  color = "#6a86ff",
  intensity = 1,
  radius = 0.2,
  animate = true,
}: {
  mode?: "frame" | "fill";
  color?: string;
  intensity?: number;
  radius?: number;
  animate?: boolean;
}) {
  return (
    <Canvas
      aria-hidden
      frameloop={animate ? "always" : "demand"}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Plane mode={mode} color={color} intensity={intensity} radius={radius} />
    </Canvas>
  );
}
