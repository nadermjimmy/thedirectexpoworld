import { Text, useTexture } from "@react-three/drei";
import { CurvedSofa, RoundTable, Armchair, Plant, Person } from "./props";
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
  return (
    <group position={position}>
      {/* pillars */}
      {[-8, 8].map((x) => (
        <mesh key={x} position={[x, 2.6, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.7, 5.2, 24]} />
          <meshStandardMaterial color={CREAM} roughness={0.7} />
        </mesh>
      ))}
      {/* top beam */}
      <mesh position={[0, 5, 0]} castShadow>
        <boxGeometry args={[17.4, 1.3, 1.1]} />
        <meshStandardMaterial color={CREAM} roughness={0.7} />
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

/** Central hero attraction: a landscaped planter with a gold totem sculpture,
 *  a curved media screen and ring seating. */
export function FeaturePlaza({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* raised planter bed */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.4, 3.5, 0.5, 48]} />
        <meshStandardMaterial color={CREAM} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[3.0, 3.0, 0.06, 48]} />
        <meshStandardMaterial color="#3f7d4a" roughness={1} />
      </mesh>
      {/* gold totem sculpture (stacked tapering rings) */}
      {[
        [0, 0.9, 1.1],
        [0, 1.9, 0.8],
        [0, 2.7, 0.5],
        [0, 3.3, 0.28],
      ].map(([_, y, r], i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[r * 0.7, r, 0.9, 24]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} emissive={GOLD} emissiveIntensity={0.18} />
        </mesh>
      ))}
      {/* greenery around the totem */}
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const a = (k / 6) * Math.PI * 2;
        return <Plant key={k} position={[Math.cos(a) * 2.2, 0.5, Math.sin(a) * 2.2]} scale={0.9} />;
      })}
      {/* curved media screen behind */}
      <mesh position={[0, 2.4, -3.9]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[3.9, 3.9, 2.6, 40, 1, true, Math.PI * 0.72, Math.PI * 0.56]} />
        <meshStandardMaterial color="#1d3a52" emissive="#2a5a86" emissiveIntensity={0.5} side={2} toneMapped={false} />
      </mesh>
      {/* ring bench */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.3, 0.28, 12, 48, Math.PI * 1.4]} />
        <meshStandardMaterial color="#d8cdb6" roughness={0.85} />
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
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 1.1, 40, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color={CREAM} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.13, 0]} castShadow>
        <cylinderGeometry args={[2.0, 2.0, 0.08, 40, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} />
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
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial color="#c9ba9e" roughness={0.7} />
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
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 1.1, 32]} />
        <meshStandardMaterial color={CREAM} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.12, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.07, 32]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} />
      </mesh>
      {/* espresso machine */}
      <mesh position={[0.3, 1.32, -0.2]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.35]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* stools */}
      {[0.6, 1.8, 3.0].map((a, i) => (
        <group key={i} position={[Math.cos(a) * 1.7, 0, Math.sin(a) * 1.7]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
            <meshStandardMaterial color="#d8cdb6" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.27, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.55, 10]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.5} />
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
