// 30 developer booths for THE DIRECT EXPO floor. Layout is a fixed 6×5 grid
// computed in Scene.tsx, so this file is just the roster. Accent colours are
// generated on a golden-angle hue spread so every booth is easy to tell apart.

export interface Developer {
  id: string;
  name: string;
  tagline: string;
  color: string;
  contact: string;
}

const NAMES = [
  "EMAAR", "DAMAC", "NAKHEEL", "MERAAS", "SOBHA", "ALDAR",
  "BINGHATTI", "AZIZI", "DANUBE", "ELLINGTON", "DUBAI PROPERTIES", "WASL",
  "DEYAAR", "UNION PROPERTIES", "OMNIYAT", "SELECT GROUP", "MAG", "SAMANA",
  "REPORTAGE", "ARADA", "BLOOM", "IMKAN", "EAGLE HILLS", "MODON",
  "TIGER GROUP", "OBJECT 1", "TOWNX", "NSHAMA", "EXPO CITY", "PALMA",
];

const TAGLINES = [
  "Premium Communities", "Luxury Living", "Waterfront Living", "Urban Destinations",
  "Crafted Homes", "Branded Residences", "Smart Investments", "Design-Led Homes",
];

const slug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const DEVELOPERS: Developer[] = NAMES.map((name, i) => ({
  id: slug(name),
  name,
  tagline: TAGLINES[i % TAGLINES.length],
  // golden-angle hue spread keeps 30 accents visually distinct
  color: `hsl(${Math.round((i * 137.508) % 360)}, 55%, 56%)`,
  contact: `sales@${slug(name).replace(/-/g, "")}.ae`,
}));

export const FIRST_DEVELOPER = DEVELOPERS[0];

export function getDeveloper(id: string): Developer {
  return DEVELOPERS.find((d) => d.id === id) ?? FIRST_DEVELOPER;
}
