"use client";

import { useRef } from "react";
import { useExpoStore } from "@/store/useExpoStore";
import { Developer } from "@/types";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const COLS = 6;
const BOOTH_WIDTH = 5;
const BOOTH_DEPTH = 4;
const GAP_X = 3;
const GAP_Z = 4;

function Booth({
  developer,
  position,
}: {
  developer: Developer;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Group>(null);
  const selectDeveloper = useExpoStore((s) => s.selectDeveloper);

  const hasAvailable = developer.reps.some((r) => r.status === "available");
  const allBusy = developer.reps.every((r) => r.status === "in-meeting");

  const accentColor = hasAvailable ? "#10b981" : allBusy ? "#ef4444" : "#9ca3af";

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        selectDeveloper(developer);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {/* Base platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[BOOTH_WIDTH, 0.1, BOOTH_DEPTH]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Main booth structure */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[BOOTH_WIDTH - 0.4, 2.4, BOOTH_DEPTH - 0.4]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>

      {/* Glass front */}
      <mesh position={[0, 1.25, BOOTH_DEPTH / 2 - 0.15]} castShadow>
        <boxGeometry args={[BOOTH_WIDTH - 0.6, 2, 0.05]} />
        <meshStandardMaterial
          color="#dbeafe"
          transparent
          opacity={0.3}
          roughness={0}
          metalness={0.5}
        />
      </mesh>

      {/* Accent strip on top */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[BOOTH_WIDTH - 0.2, 0.1, BOOTH_DEPTH - 0.2]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Side pillars */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (BOOTH_WIDTH / 2 - 0.15), 1.25, BOOTH_DEPTH / 2 - 0.15]}
          castShadow
        >
          <boxGeometry args={[0.15, 2.5, 0.15]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.2} />
        </mesh>
      ))}

      {/* Booth number indicator */}
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.4]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      <Text
        position={[0, 2.7, 0.25]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`#${developer.boothNumber}`}
      </Text>

      {/* Developer name label */}
      <Text
        position={[0, 0.3, BOOTH_DEPTH / 2 + 0.3]}
        fontSize={0.28}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
        maxWidth={BOOTH_WIDTH - 0.5}
      >
        {developer.name}
      </Text>

      {/* Status dots for reps */}
      {developer.reps.map((rep, i) => {
        const dotColor =
          rep.status === "available"
            ? "#10b981"
            : rep.status === "in-meeting"
              ? "#ef4444"
              : "#9ca3af";
        return (
          <mesh key={rep.id} position={[-0.4 + i * 0.8, 2.95, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={dotColor}
              emissive={dotColor}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Floor() {
  const totalWidth = COLS * (BOOTH_WIDTH + GAP_X) + GAP_X + 10;
  const totalDepth = Math.ceil(30 / COLS) * (BOOTH_DEPTH + GAP_Z) + GAP_Z + 10;

  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[totalWidth / 2 - 5, -0.01, totalDepth / 2 - 5]} receiveShadow>
        <planeGeometry args={[totalWidth + 20, totalDepth + 20]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Hallway strips */}
      {Array.from({ length: COLS + 1 }).map((_, i) => (
        <mesh
          key={`h-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[i * (BOOTH_WIDTH + GAP_X) - GAP_X / 2 + BOOTH_WIDTH / 2, 0.01, totalDepth / 2 - 5]}
          receiveShadow
        >
          <planeGeometry args={[GAP_X - 0.5, totalDepth + 10]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}
    </group>
  );
}

export default function ExpoHall() {
  const developers = useExpoStore((s) => s.developers);

  return (
    <group>
      <Floor />
      {developers.map((dev, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = col * (BOOTH_WIDTH + GAP_X);
        const z = row * (BOOTH_DEPTH + GAP_Z);
        return <Booth key={dev.id} developer={dev} position={[x, 0, z]} />;
      })}
    </group>
  );
}
