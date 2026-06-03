import { useMemo } from "react";
import {
  RigidBody,
  CuboidCollider,
  CylinderCollider,
} from "@react-three/rapier";
import {
  BOOTHS,
  BOOTH_R,
  BOOTH_H,
  BOOTH_GAP,
  BOOTH_DESK_W,
  BOOTH_DESK_D,
  BOOTH_DESK_Z,
  FLOOR_W,
  FLOOR_D,
  FLOOR_CENTER_Z,
  WALL_H,
  WALL_THICKNESS,
  FEATURE_PLAZA,
  INFORMATION_DESK,
  VIP_LOUNGE,
  ENTRANCE_PORTAL,
  NETWORKING_LOUNGES,
  COFFEE_CORNERS,
} from "../scene/layout";

/**
 * Toggle to true to render every static collider as a translucent green box.
 * Invaluable while tuning collision geometry against the visuals.
 */
const DEBUG_COLLIDERS = false;

type Vec3 = [number, number, number];

/* -------------------------------------------------------------------------- */
/*  WallCollider                                                              */
/* -------------------------------------------------------------------------- */

export interface WallColliderProps {
  /** World position of the wall centre. */
  position: Vec3;
  /** Full size [width, height, depth] of the wall slab. */
  size: Vec3;
  /** Optional yaw rotation (radians) for angled walls. */
  rotationY?: number;
}

/**
 * A single static wall segment. Wraps one {@link CuboidCollider} in a fixed
 * {@link RigidBody}. Used for the hall shell, the branded back wall and the
 * invisible perimeter that keeps visitors inside the exhibition.
 */
export function WallCollider({ position, size, rotationY = 0 }: WallColliderProps) {
  const half: Vec3 = [size[0] / 2, size[1] / 2, size[2] / 2];
  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={[0, rotationY, 0]}>
      <CuboidCollider args={half} />
      {DEBUG_COLLIDERS && (
        <mesh>
          <boxGeometry args={size} />
          <meshBasicMaterial color="#23d18b" wireframe transparent opacity={0.4} />
        </mesh>
      )}
    </RigidBody>
  );
}

/* -------------------------------------------------------------------------- */
/*  BoothCollider                                                             */
/* -------------------------------------------------------------------------- */

export interface BoothColliderProps {
  position: Vec3;
  rotationY?: number;
  /** How many cuboid segments approximate the curved C-wall. */
  segments?: number;
}

/**
 * Collision shell for one curved developer booth.
 *
 * The visual booth is a hollow cylinder wall open toward +Z. We approximate
 * that curve with a ring of thin cuboid segments (cheap and tunnel-proof for a
 * walking player) plus one cuboid for the reception desk at the opening. All
 * shapes live in a single fixed {@link RigidBody}, so 30 booths cost only 30
 * rigid bodies regardless of segment count.
 */
export function BoothCollider({ position, rotationY = 0, segments = 6 }: BoothColliderProps) {
  const wallSegments = useMemo(() => {
    const arcStart = Math.PI / 2 + BOOTH_GAP / 2; // matches CurvedBooth cylinder geometry
    const arcLength = Math.PI * 2 - BOOTH_GAP;
    const segArc = arcLength / segments;
    const thickness = 0.18;
    // Slight overlap so neighbouring segments leave no seam to slip through.
    const tangentHalf = BOOTH_R * Math.tan(segArc / 2) * 1.08;

    return Array.from({ length: segments }, (_, i) => {
      const theta = arcStart + (i + 0.5) * segArc;
      const pos: Vec3 = [Math.cos(theta) * BOOTH_R, BOOTH_H / 2, Math.sin(theta) * BOOTH_R];
      // Orient the box so its thin axis points radially outward.
      const rot: Vec3 = [0, Math.PI / 2 - theta, 0];
      const args: Vec3 = [tangentHalf, BOOTH_H / 2, thickness];
      return { pos, rot, args };
    });
  }, [segments]);

  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={[0, rotationY, 0]}>
      {/* curved back/side wall, approximated as tangent cuboid segments */}
      {wallSegments.map((s, i) => (
        <CuboidCollider key={i} args={s.args} position={s.pos} rotation={s.rot} />
      ))}
      {/* reception desk at the booth opening */}
      <CuboidCollider
        args={[BOOTH_DESK_W / 2, 0.46, BOOTH_DESK_D / 2]}
        position={[0, 0.46, BOOTH_DESK_Z]}
      />
      {DEBUG_COLLIDERS &&
        wallSegments.map((s, i) => (
          <mesh key={`d${i}`} position={s.pos} rotation={s.rot}>
            <boxGeometry args={[s.args[0] * 2, s.args[1] * 2, s.args[2] * 2]} />
            <meshBasicMaterial color="#23d18b" wireframe transparent opacity={0.5} />
          </mesh>
        ))}
    </RigidBody>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reusable amenity blockers                                                 */
/* -------------------------------------------------------------------------- */

/** A solid cylindrical mass (planters, round desks, lounge clusters, bars). */
function CylinderBlocker({
  position,
  radius,
  height,
}: {
  position: Vec3;
  radius: number;
  height: number;
}) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CylinderCollider args={[height / 2, radius]} position={[0, height / 2, 0]} />
      {DEBUG_COLLIDERS && (
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry args={[radius, radius, height, 20]} />
          <meshBasicMaterial color="#23d18b" wireframe transparent opacity={0.4} />
        </mesh>
      )}
    </RigidBody>
  );
}

/* -------------------------------------------------------------------------- */
/*  HallBoundaries                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The exhibition shell: a ground plane to stand on plus four perimeter walls
 * (taller than any visitor) that fully enclose the floor so the player can
 * never leave the exhibition area — including the open entrance side, which
 * has no visual wall but still gets an invisible boundary.
 */
export function HallBoundaries() {
  const minZ = FLOOR_CENTER_Z - FLOOR_D / 2;
  const maxZ = FLOOR_CENTER_Z + FLOOR_D / 2;
  const halfW = FLOOR_W / 2;
  const boundaryH = 12; // well above eye height
  const t = WALL_THICKNESS;

  return (
    <group>
      {/* ground — thin slab just below floor level so the capsule rests on y≈0 */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[halfW, 0.5, FLOOR_D / 2]} position={[0, -0.5, FLOOR_CENTER_Z]} />
      </RigidBody>

      {/* left / right perimeter walls */}
      <WallCollider position={[-halfW, boundaryH / 2, FLOOR_CENTER_Z]} size={[t, boundaryH, FLOOR_D]} />
      <WallCollider position={[halfW, boundaryH / 2, FLOOR_CENTER_Z]} size={[t, boundaryH, FLOOR_D]} />

      {/* back wall + front (entrance) boundary */}
      <WallCollider position={[0, boundaryH / 2, minZ]} size={[FLOOR_W, boundaryH, t]} />
      <WallCollider position={[0, boundaryH / 2, maxZ]} size={[FLOOR_W, boundaryH, t]} />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  ExhibitionColliders — composes the whole static physics world             */
/* -------------------------------------------------------------------------- */

/**
 * Every static collider in the exhibition, assembled from the shared layout
 * data so it stays a faithful mirror of the visual scene. Drop this once
 * inside <Physics> alongside the visuals.
 */
export function ExhibitionColliders() {
  return (
    <group>
      <HallBoundaries />

      {/* 30 developer booths */}
      {BOOTHS.map(({ dev, position, rotationY }) => (
        <BoothCollider key={dev.id} position={position} rotationY={rotationY} />
      ))}

      {/* central hero feature: planter + totem mass */}
      <CylinderBlocker position={FEATURE_PLAZA.position} radius={3.5} height={3.6} />

      {/* information desk (half-cylinder reads fine as a full disc blocker) */}
      <CylinderBlocker position={INFORMATION_DESK.position} radius={1.95} height={1.2} />

      {/* VIP lounge seating cluster */}
      <CylinderBlocker position={VIP_LOUNGE.position} radius={1.8} height={1.0} />

      {/* entrance portal pillars (the beam above is over head height) */}
      <RigidBody type="fixed" colliders={false} position={ENTRANCE_PORTAL.position}>
        <CylinderCollider args={[2.6, 0.7]} position={[-8, 2.6, 0]} />
        <CylinderCollider args={[2.6, 0.7]} position={[8, 2.6, 0]} />
        {/* branded hero sign panel, offset left */}
        <CuboidCollider args={[2.7, 1.7, 0.2]} position={[-4.8, 2.6, -0.1]} />
      </RigidBody>

      {/* networking lounges (sofa + table clusters) */}
      {NETWORKING_LOUNGES.map((l, i) => (
        <CylinderBlocker key={`net${i}`} position={l.position} radius={1.15} height={0.9} />
      ))}

      {/* coffee corners (round bars) */}
      {COFFEE_CORNERS.map((c, i) => (
        <CylinderBlocker key={`cof${i}`} position={c.position} radius={1.2} height={1.2} />
      ))}
    </group>
  );
}
