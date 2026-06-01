import { OrbitControls, ContactShadows, Stars } from "@react-three/drei";
import { Booth, type BoothData } from "./Booth";

export const BOOTHS: BoothData[] = [
  { id: "keynote", label: "Keynote Hall", color: "#6366f1", position: [-2.6, 1, 0] },
  { id: "demos", label: "Live Demos", color: "#ec4899", position: [0, 1, -1.4] },
  { id: "lounge", label: "Networking", color: "#14b8a6", position: [2.6, 1, 0] },
];

export function Scene({
  activeBooth,
  onSelectBooth,
}: {
  activeBooth: string;
  onSelectBooth: (id: string) => void;
}) {
  return (
    <>
      <color attach="background" args={["#0b1020"]} />
      <fog attach="fog" args={["#0b1020", 8, 20]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={30} color="#6366f1" />

      <Stars radius={60} depth={40} count={2500} factor={4} fade speed={1} />

      {BOOTHS.map((booth) => (
        <Booth
          key={booth.id}
          data={booth}
          active={activeBooth === booth.id}
          onSelect={onSelectBooth}
        />
      ))}

      <ContactShadows
        position={[0, -0.2, 0]}
        opacity={0.5}
        scale={14}
        blur={2.4}
        far={5}
      />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={4}
        maxDistance={12}
      />
    </>
  );
}
