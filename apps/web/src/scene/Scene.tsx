import { OrbitControls, ContactShadows, useTexture, Text } from "@react-three/drei";
import { DEVELOPERS } from "./developers";
import { CurvedBooth } from "./CurvedBooth";
import {
  EntrancePortal,
  FeaturePlaza,
  InformationDesk,
  VipLounge,
  NetworkingLounge,
  CoffeeCorner,
} from "./Amenities";
import { Plant, Crowd } from "./props";
import logoUrl from "../assets/images/TDE_header.png";

// ----- Organic layout: 30 equal booths grouped into scattered curved islands -----
// Each island is a small ring of booths opening OUTWARD, so visitors circulate
// around it. Islands sit at varied distances/angles around a central hero feature,
// leaving generous, irregular networking voids between clusters (no grid).
type Island = { c: [number, number]; n: number; r: number; a0: number };
const ISLANDS: Island[] = [
  { c: [-4.5, 12], n: 7, r: 4.6, a0: 0.3 }, // front-left, large
  { c: [10.7, 9], n: 6, r: 4.0, a0: 0.9 }, // front-right
  { c: [14.1, -5], n: 6, r: 4.0, a0: 1.7 }, // right
  { c: [-13.2, -5], n: 6, r: 4.0, a0: 2.4 }, // left
  { c: [0, -13], n: 5, r: 3.7, a0: 0.0 }, // back-centre
];

const BOOTHS = (() => {
  const out: { dev: (typeof DEVELOPERS)[number]; position: [number, number, number]; rotationY: number }[] = [];
  let i = 0;
  for (const isl of ISLANDS) {
    for (let k = 0; k < isl.n; k++) {
      const a = isl.a0 + (k / isl.n) * Math.PI * 2;
      const x = isl.c[0] + Math.cos(a) * isl.r;
      const z = isl.c[1] + Math.sin(a) * isl.r;
      out.push({
        dev: DEVELOPERS[i++],
        position: [x, 0, z],
        rotationY: Math.atan2(Math.cos(a), Math.sin(a)), // opening faces away from island centre
      });
    }
  }
  return out;
})();

const FLOOR_W = 50;
const FLOOR_D = 54;
const WALL_H = 6;
const BACK_WALL_H = 10; // taller backdrop to carry the logo + tagline

// Curved gold pathway inlays on the marble (suggest circulation routes).
const PATHS: { r: number; a0: number; len: number }[] = [
  { r: 7.5, a0: 0.2, len: Math.PI * 1.5 },
  { r: 12, a0: 1.6, len: Math.PI * 1.1 },
  { r: 17.5, a0: 3.2, len: Math.PI * 1.3 },
  { r: 9.5, a0: 4.2, len: Math.PI * 0.8 },
];

function Hall() {
  const logo = useTexture(logoUrl);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]} receiveShadow>
        <planeGeometry args={[FLOOR_W, FLOOR_D]} />
        <meshStandardMaterial color="#dad4c8" roughness={0.3} metalness={0.04} />
      </mesh>

      {/* curved pathway inlays */}
      {PATHS.map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[p.r, p.r + 0.55, 64, 1, p.a0, p.len]} />
          <meshStandardMaterial color="#cdb887" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {/* side walls */}
      <mesh position={[-FLOOR_W / 2, WALL_H / 2, 1]} receiveShadow>
        <boxGeometry args={[0.5, WALL_H, FLOOR_D]} />
        <meshStandardMaterial color="#624a31" roughness={0.75} />
      </mesh>
      <mesh position={[FLOOR_W / 2, WALL_H / 2, 1]} receiveShadow>
        <boxGeometry args={[0.5, WALL_H, FLOOR_D]} />
        <meshStandardMaterial color="#624a31" roughness={0.75} />
      </mesh>

      {/* tall back wall of the hall */}
      <mesh position={[0, BACK_WALL_H / 2, -FLOOR_D / 2 + 1.5]} receiveShadow>
        <boxGeometry args={[FLOOR_W, BACK_WALL_H, 0.5]} />
        <meshStandardMaterial color="#6f5236" roughness={0.75} />
      </mesh>
      {/* big branded logo wall: white signage panel + logo + tagline */}
      <group position={[0, 4.0, -FLOOR_D / 2 + 1.78]}>
        <mesh>
          <planeGeometry args={[15, 8]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {/* gold trim border (sits just behind the white panel) */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[15.5, 8.5]} />
          <meshBasicMaterial color="#c8a24b" toneMapped={false} />
        </mesh>
        {/* logo (transparent PNG over the white panel) */}
        <mesh position={[0, 0.7, 0.04]}>
          <planeGeometry args={[12, 6.2]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>
        <Text
          position={[0, -2.9, 0.05]}
          fontSize={0.72}
          color="#1a2b4a"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.16}
        >
          CONNECT   •   EXPLORE  • INVEST
        </Text>
      </group>
    </group>
  );
}

export function Scene({
  activeDeveloper,
  onSelectDeveloper,
}: {
  activeDeveloper: string;
  onSelectDeveloper: (id: string) => void;
}) {
  return (
    <>
      <color attach="background" args={["#171209"]} />
      <fog attach="fog" args={["#171209", 50, 90]} />

      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#fff3e0", "#2a2016", 0.45]} />
      <directionalLight position={[10, 22, 18]} intensity={1.0} />
      <pointLight position={[-12, 8, -4]} intensity={34} color="#ffe7c2" distance={48} decay={2} />
      <pointLight position={[12, 8, -2]} intensity={34} color="#ffe7c2" distance={48} decay={2} />
      <pointLight position={[0, 8, 12]} intensity={30} color="#ffe7c2" distance={48} decay={2} />

      <Hall />

      {/* 30 developer booths, scattered in curved islands */}
      {BOOTHS.map(({ dev, position, rotationY }) => (
        <group key={dev.id} position={position} rotation={[0, rotationY, 0]}>
          <CurvedBooth
            dev={dev}
            active={activeDeveloper === dev.id}
            onSelect={onSelectDeveloper}
          />
        </group>
      ))}

      {/* central hero attraction */}
      <FeaturePlaza position={[0, 0, 0]} />

      {/* branded entrance + circulation amenities */}
      <EntrancePortal position={[0, 0, 23]} />
      <InformationDesk position={[-5, 0, 18]} rotationY={0.15} />
      <VipLounge position={[18, 0, 15]} rotationY={-Math.PI / 7} />

      {/* lounges & coffee corners tucked into the gaps between clusters */}
      <NetworkingLounge position={[7.5, 0, 1.5]} rotationY={-0.7} />
      <NetworkingLounge position={[-7.5, 0, 4]} rotationY={2.2} />
      <NetworkingLounge position={[4, 0, -7.5]} rotationY={0.4} />
      <CoffeeCorner position={[3, 0, 6.5]} />
      <CoffeeCorner position={[-6.5, 0, -9]} />

      {/* landscaping clusters in open space */}
      <Plant position={[-9.5, 0, 1]} scale={1.3} />
      <Plant position={[9.5, 0, -8]} scale={1.3} />
      <Plant position={[-2, 0, -8.5]} scale={1.2} />
      <Plant position={[6.5, 0, 14]} scale={1.3} />

      {/* visitors throughout the walkways */}
      <Crowd around={[0, 0, 6]} count={6} spread={3.5} color="#46506b" />
      <Crowd around={[-8, 0, 8]} count={4} spread={2.6} color="#5a4636" />
      <Crowd around={[8, 0, 3]} count={5} spread={3} color="#3f4a5e" />
      <Crowd around={[-4, 0, -3]} count={4} spread={2.4} color="#534434" />
      <Crowd around={[5, 0, -4]} count={4} spread={2.6} color="#46506b" />
      <Crowd around={[0, 0, 16]} count={5} spread={3.4} color="#4a4030" />

      <ContactShadows position={[0, 0.02, 1]} opacity={0.4} scale={56} blur={2.6} far={10} resolution={1024} />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        target={[0, 1, 0]}
        minPolarAngle={Math.PI / 9}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={16}
        maxDistance={66}
      />
    </>
  );
}
