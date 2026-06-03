import { DEVELOPERS } from "./developers";

/**
 * Single source of truth for the exhibition floor plan.
 *
 * Both the visual scene (Scene.tsx) and the physics colliders
 * (physics/*) read these values so visuals and collision geometry can
 * never drift apart. Change a dimension here and both update together.
 */

// ----- Hall shell dimensions -----
export const FLOOR_W = 50; // x extent of the marble floor
export const FLOOR_D = 54; // z extent of the marble floor
export const FLOOR_CENTER_Z = 1; // floor plane is offset +1 on z (see Scene)
export const WALL_H = 6; // side-wall height
export const BACK_WALL_H = 10; // taller branded back wall
export const WALL_THICKNESS = 0.5; // matches the wall box geometry

// ----- Booth geometry (mirrors CurvedBooth.tsx) -----
export const BOOTH_R = 1.95; // curved C-wall radius
export const BOOTH_H = 2.6; // C-wall height
export const BOOTH_GAP = 1.35; // front opening angle (radians), centred on +Z
export const BOOTH_DESK_W = 2.2; // reception desk width
export const BOOTH_DESK_D = 0.5; // reception desk depth
export const BOOTH_DESK_Z = 1.35; // reception desk forward offset

// ----- Organic island layout: 30 equal booths in scattered curved islands -----
export type Island = { c: [number, number]; n: number; r: number; a0: number };

export const ISLANDS: Island[] = [
  { c: [-4.5, 12], n: 7, r: 4.6, a0: 0.3 }, // front-left, large
  { c: [10.7, 9], n: 6, r: 4.0, a0: 0.9 }, // front-right
  { c: [14.1, -5], n: 6, r: 4.0, a0: 1.7 }, // right
  { c: [-13.2, -5], n: 6, r: 4.0, a0: 2.4 }, // left
  { c: [0, -13], n: 5, r: 3.7, a0: 0.0 }, // back-centre
];

export type BoothPlacement = {
  dev: (typeof DEVELOPERS)[number];
  position: [number, number, number];
  rotationY: number;
};

/** Deterministic placement of all 30 booths around their islands. */
export const BOOTHS: BoothPlacement[] = (() => {
  const out: BoothPlacement[] = [];
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

/** Static furniture / amenity placements that also need collision. Kept here
 *  so the collider layer stays a pure data-driven mirror of Scene.tsx. */
export type AmenityPlacement = {
  position: [number, number, number];
  rotationY?: number;
};

export const FEATURE_PLAZA: AmenityPlacement = { position: [0, 0, 0] };
export const INFORMATION_DESK: AmenityPlacement = { position: [-5, 0, 18], rotationY: 0.15 };
export const VIP_LOUNGE: AmenityPlacement = { position: [18, 0, 15], rotationY: -Math.PI / 7 };
export const ENTRANCE_PORTAL: AmenityPlacement = { position: [0, 0, 23] };

export const NETWORKING_LOUNGES: AmenityPlacement[] = [
  { position: [7.5, 0, 1.5], rotationY: -0.7 },
  { position: [-7.5, 0, 4], rotationY: 2.2 },
  { position: [4, 0, -7.5], rotationY: 0.4 },
];

export const COFFEE_CORNERS: AmenityPlacement[] = [
  { position: [3, 0, 6.5] },
  { position: [-6.5, 0, -9] },
];
