import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import helvetikerBold from "../assets/fonts/helvetiker_bold.typeface.json";

/**
 * Shared brand identity for the central monument (logo plaque + platform
 * lettering) so everything reads as one premium, cohesive material family.
 */
export const BRAND = {
  ORANGE: "#D9822B", // plaque / accents
  CREAM: "#f4ede1", // raised lettering
  DARK: "#272320", // polished pedestal / platform top
} as const;

// Parsed once at module load (helvetiker_bold is small, ~60 KB) and reused for
// every TextGeometry — no per-instance font parsing.
const FONT = new FontLoader().parse(
  helvetikerBold as unknown as Parameters<FontLoader["parse"]>[0],
);

/** Build a centred, lightly-bevelled extruded text geometry. Cheap; memoise per text. */
export function makeText3D(
  text: string,
  { size = 0.8, depth = 0.16, bevel = 0.015 }: { size?: number; depth?: number; bevel?: number } = {},
): TextGeometry {
  const geo = new TextGeometry(text, {
    font: FONT,
    size,
    depth,
    curveSegments: 6, // keep glyph tessellation modest for FPS
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}
