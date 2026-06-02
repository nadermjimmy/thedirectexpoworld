import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Html } from "@react-three/drei";
import type { Mesh, Group } from "three";

export interface BoothData {
  id: string;
  label: string;
  color: string;
  position: [number, number, number];
}

export function Booth({
  data,
  active,
  onSelect,
}: {
  data: BoothData;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (active ? 0.8 : 0.25);
    }
    const targetScale = active ? 1.35 : hovered ? 1.12 : 1;
    if (groupRef.current) {
      groupRef.current.scale.lerp(
        { x: targetScale, y: targetScale, z: targetScale } as never,
        0.12,
      );
    }
  });

  return (
    <group position={data.position}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <group
          ref={groupRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(data.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
        >
          <RoundedBox ref={meshRef} args={[1, 1, 1]} radius={0.12} smoothness={4}>
            <meshStandardMaterial
              color={data.color}
              emissive={data.color}
              emissiveIntensity={active ? 0.7 : hovered ? 0.45 : 0.25}
              metalness={0.3}
              roughness={0.4}
            />
          </RoundedBox>
          <Html position={[0, -0.95, 0]} center distanceFactor={8} zIndexRange={[10, 0]}>
            <div className="booth-label" style={{ borderColor: data.color }}>
              {data.label}
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
}
