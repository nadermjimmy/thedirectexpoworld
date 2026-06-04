import { useMemo } from "react";
import { Text, useTexture, ContactShadows } from "@react-three/drei";
import { CurvedSofa, RoundTable, Armchair, Plant, Person } from "./props";
import { ByitLogo } from "./ByitLogo";
import { BRAND, makeText3D } from "./brand3d";
import { usePbrMaterial } from "../materials/pbr";
import logoUrl from "../assets/images/TDE_header.png";

const CREAM = "#efe7d8";
const WOOD = "#6f4f32";
const GOLD = "#c8a24b";

/** Large branded entrance portal: two curved pillars, a logo beam and a hero
 *  branding screen — the luxury "gateway" at the front of the hall. */
export function EntrancePortal({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const logo = useTexture(logoUrl);
  const wood = usePbrMaterial("wood", { repeat: [2, 4], color: CREAM });
  const beamWood = usePbrMaterial("wood", { repeat: [8, 1], color: CREAM });
  return (
    <group position={position}>
      {/* pillars (wood) */}
      {[-8, 8].map((x) => (
        <mesh key={x} position={[x, 2.6, 0]} castShadow material={wood}>
          <cylinderGeometry args={[0.6, 0.7, 5.2, 24]} />
        </mesh>
      ))}
      {/* top beam (wood) */}
      <mesh position={[0, 5, 0]} castShadow material={beamWood}>
        <boxGeometry args={[17.4, 1.3, 1.1]} />
      </mesh>
      <mesh position={[0, 4.32, 0]}>
        <boxGeometry args={[17.4, 0.08, 1.12]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {/* logo on the beam, facing the visitor (+Z) — dark logo on the cream beam */}
      <mesh position={[0, 5, 0.58]}>
        <planeGeometry args={[4.3, 2.4]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>

      {/* hero branding screen, offset left so the centre stays an open walkway */}
      <group position={[-4.8, 0, -0.1]}>
        {/* white sign panel so the dark logo reads */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <boxGeometry args={[5.4, 3.4, 0.2]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh position={[0, 2.7, 0.12]}>
          <planeGeometry args={[4.7, 2.6]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.7, 0.12]}>
          <planeGeometry args={[5.1, 0.7]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.4} toneMapped={false} />
        </mesh>
      </group>
      <Plant position={[7, 0, 1]} scale={1.4} />
      <Plant position={[-9, 0, 1]} scale={1.4} />
    </group>
  );
}

/** Central hero attraction: a premium circular platform carrying the tilted,
 *  rotating 3D Byit logo monument, branded "BYIT" (front) / "EXPO" (back) on the
 *  platform edge, lit by a focal spotlight, with a curved media screen behind. */
export function FeaturePlaza({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const planterWood = usePbrMaterial("wood", { repeat: [10, 1], color: CREAM });
  const benchCarpet = usePbrMaterial("carpet", { repeat: [10, 1], color: "#d8cdb6" });

  // Platform edge lettering — extruded once, same brand family as the logo.
  const byitText = useMemo(() => makeText3D("BYIT", { size: 0.62, depth: 0.12 }), []);
  const expoText = useMemo(() => makeText3D("EXPO", { size: 0.62, depth: 0.12 }), []);

  const TOP_Y = 0.62; // platform top surface

  return (
    <group position={position}>
      {/* plinth drum (wood) */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow material={planterWood}>
        <cylinderGeometry args={[3.4, 3.5, 0.5, 48]} />
      </mesh>
      {/* premium polished dark top cap — reads as a monument base + takes the
          logo's contact shadow cleanly */}
      <mesh position={[0, 0.56, 0]} receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 0.14, 64]} />
        <meshStandardMaterial color={BRAND.DARK} roughness={0.28} metalness={0.35} envMapIntensity={1.3} />
      </mesh>
      {/* glowing orange rim — luxury showroom cue */}
      <mesh position={[0, TOP_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.0, 0.045, 14, 80]} />
        <meshStandardMaterial color={BRAND.ORANGE} emissive={BRAND.ORANGE} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>

      {/* platform branding mounted on the edge, facing outward */}
      <mesh geometry={byitText} position={[0, TOP_Y + 0.33, 2.78]} castShadow>
        <meshStandardMaterial color={BRAND.CREAM} roughness={0.34} metalness={0.12} envMapIntensity={1.1} />
      </mesh>
      <mesh geometry={expoText} position={[0, TOP_Y + 0.33, -2.78]} rotation={[0, Math.PI, 0]} castShadow>
        <meshStandardMaterial color={BRAND.CREAM} roughness={0.34} metalness={0.12} envMapIntensity={1.1} />
      </mesh>

      {/* hero: the tilted, slowly-rotating Byit logo monument on the platform */}
      <ByitLogo position={[0, TOP_Y, 0]} />

      {/* focal spotlight from above — strong, soft pool on the monument */}
      <spotLight
        position={[0, 13, 1.2]}
        angle={0.42}
        penumbra={0.85}
        intensity={260}
        distance={34}
        decay={2}
        color="#fff4e6"
      />

      {/* enhanced, premium contact shadow of the monument onto the platform */}
      <ContactShadows
        position={[0, TOP_Y + 0.015, 0]}
        scale={7}
        blur={2.2}
        far={4.5}
        opacity={0.6}
        resolution={256}
        color="#120c06"
      />

      {/* curved media screen behind */}
      <mesh position={[0, 2.4, -3.9]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[3.9, 3.9, 2.6, 40, 1, true, Math.PI * 0.72, Math.PI * 0.56]} />
        <meshStandardMaterial color="#1d3a52" emissive="#2a5a86" emissiveIntensity={0.5} side={2} toneMapped={false} />
      </mesh>
      {/* ring bench (carpet) */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow material={benchCarpet}>
        <torusGeometry args={[4.3, 0.28, 12, 48, Math.PI * 1.4]} />
      </mesh>
    </group>
  );
}

/** Central curved information desk with a standing logo sign. */
export function InformationDesk({
  position = [0, 0, 0],
  rotationY = 0,
}: {
  position?: [number, number, number];
  rotationY?: number;
}) {
  const logo = useTexture(logoUrl);
  const deskWood = usePbrMaterial("wood", { repeat: [6, 2], color: CREAM });
  const deskTopWood = usePbrMaterial("wood", { repeat: [6, 1], color: WOOD, roughness: 0.5 });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow material={deskWood}>
        <cylinderGeometry args={[1.9, 1.9, 1.1, 40, 1, false, Math.PI, Math.PI]} />
      </mesh>
      <mesh position={[0, 1.13, 0]} castShadow material={deskTopWood}>
        <cylinderGeometry args={[2.0, 2.0, 0.08, 40, 1, false, Math.PI, Math.PI]} />
      </mesh>
      {/* white sign panel + logo so the dark mark stays legible */}
      <mesh position={[0, 2.0, -0.2]}>
        <planeGeometry args={[2.7, 1.55]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.0, -0.18]}>
        <planeGeometry args={[2.4, 1.34]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      <Text position={[0, 0.55, 1.0]} fontSize={0.24} color="#5a4a32" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        INFORMATION
      </Text>
      <Person position={[-0.6, 0, -0.4]} color="#3a4a63" seed={1} />
      <Person position={[0.7, 0, -0.4]} color="#5a4636" seed={4} />
    </group>
  );
}

/** Curved VIP lounge. */
export function VipLounge({
  position = [0, 0, 0],
  rotationY = 0,
}: {
  position?: [number, number, number];
  rotationY?: number;
}) {
  const loungeCarpet = usePbrMaterial("carpet", { repeat: [6, 6], color: "#c9ba9e" });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={loungeCarpet}>
        <circleGeometry args={[3.4, 48]} />
      </mesh>
      <CurvedSofa position={[0, 0, -0.6]} radius={2.1} arc={Math.PI * 1.25} rotationY={-Math.PI * 0.12} color="#d8cdb6" />
      <RoundTable position={[-0.8, 0, 0.5]} radius={0.45} />
      <RoundTable position={[1.2, 0, 0.4]} radius={0.4} />
      <Armchair position={[1.9, 0, 1.3]} rotationY={Math.PI} />
      <Plant position={[-2.8, 0, 1.3]} scale={1.2} />
      <Plant position={[2.8, 0, -0.4]} scale={1.1} />
      <Text position={[0, 1.8, -1.8]} fontSize={0.36} color="#8a7a58" anchorX="center" anchorY="middle" letterSpacing={0.14}>
        VIP LOUNGE
      </Text>
    </group>
  );
}

/** Open networking seating cluster for the walkways. */
export function NetworkingLounge({
  position = [0, 0, 0],
  rotationY = 0,
}: {
  position?: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <CurvedSofa position={[0, 0, -0.5]} radius={1.2} arc={Math.PI} color="#ded3bc" />
      <RoundTable position={[0, 0, 0.2]} radius={0.42} />
      <Armchair position={[1.0, 0, 0.9]} rotationY={Math.PI} />
      <Plant position={[-1.5, 0, 0.6]} scale={0.95} />
    </group>
  );
}

/** A small coffee corner: round bar, stools, machine and a plant. */
export function CoffeeCorner({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const barWood = usePbrMaterial("wood", { repeat: [4, 3], color: CREAM });
  const barTopWood = usePbrMaterial("wood", { repeat: [3, 3], color: WOOD, roughness: 0.5 });
  const machineMetal = usePbrMaterial("metal", { repeat: [1, 1], color: "#2a2a2a", roughness: 0.4, envMapIntensity: 1 });
  const stoolCarpet = usePbrMaterial("carpet", { repeat: [1, 1], color: "#d8cdb6" });
  const stoolLeg = usePbrMaterial("metal", { repeat: [1, 1], color: "#2a2a2a", roughness: 0.5, envMapIntensity: 1 });
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow material={barWood}>
        <cylinderGeometry args={[1.1, 1.1, 1.1, 32]} />
      </mesh>
      <mesh position={[0, 1.12, 0]} castShadow material={barTopWood}>
        <cylinderGeometry args={[1.2, 1.2, 0.07, 32]} />
      </mesh>
      {/* espresso machine (metal) */}
      <mesh position={[0.3, 1.32, -0.2]} castShadow material={machineMetal}>
        <boxGeometry args={[0.4, 0.3, 0.35]} />
      </mesh>
      {/* stools */}
      {[0.6, 1.8, 3.0].map((a, i) => (
        <group key={i} position={[Math.cos(a) * 1.7, 0, Math.sin(a) * 1.7]}>
          <mesh position={[0, 0.55, 0]} castShadow material={stoolCarpet}>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
          </mesh>
          <mesh position={[0, 0.27, 0]} material={stoolLeg}>
            <cylinderGeometry args={[0.05, 0.05, 0.55, 10]} />
          </mesh>
        </group>
      ))}
      <Plant position={[-1.5, 0, 1.0]} scale={0.9} />
      <Text position={[0, 1.7, 0]} fontSize={0.22} color="#7a6a48" anchorX="center" anchorY="middle" letterSpacing={0.1}>
        COFFEE
      </Text>
    </group>
  );
}
