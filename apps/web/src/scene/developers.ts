// 30 developer booths for THE DIRECT EXPO floor. Layout is computed in
// Scene.tsx, so this file is the roster plus the rich profile content shown in
// the floating booth panel. Accent colours are generated on a golden-angle hue
// spread so every booth is easy to tell apart, and all profile content is
// derived deterministically from the index (no randomness → stable SSR/builds).

export interface DeveloperProject {
  name: string;
  type: string;
  status: string;
}

export interface DeveloperGalleryImage {
  /** Project / render label shown on the tile. */
  label: string;
  /** CSS gradient used as the render thumbnail (no external assets needed). */
  gradient: string;
}

export interface Developer {
  id: string;
  name: string;
  tagline: string;
  color: string;
  /** Monogram shown in the panel logo badge. */
  monogram: string;
  description: string;
  location: string;
  projects: DeveloperProject[];
  gallery: DeveloperGalleryImage[];
  contact: string;
  phone: string;
  website: string;
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

const LOCATIONS = [
  "Downtown Dubai", "Dubai Marina", "Palm Jumeirah", "Business Bay",
  "Dubai Hills Estate", "Jumeirah Village Circle", "Dubai Creek Harbour",
  "Mohammed Bin Rashid City", "Yas Island, Abu Dhabi", "Saadiyat Island",
  "Al Reem Island", "Emirates Hills",
];

const PROJECT_PREFIX = [
  "Marina", "Azure", "Crest", "Royal", "Bay", "Park", "Sky", "Grand",
  "Coral", "Aurora", "Serene", "Opal", "Riviera", "Cascade", "Vista", "Celeste",
];
const PROJECT_SUFFIX = [
  "Residences", "Towers", "Villas", "Heights", "Gardens", "Mansions",
  "Suites", "Quarter", "Boulevard", "Collection",
];
const PROJECT_TYPE = [
  "Waterfront apartments", "Signature villas", "Branded residences",
  "Penthouse collection", "Townhouse community", "Mixed-use district",
];
const PROJECT_STATUS = ["Ready to move", "Off-plan", "Launching soon", "Under construction"];

const slug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const monogram = (name: string) => {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

function buildProjects(i: number): DeveloperProject[] {
  return Array.from({ length: 3 }, (_, k) => {
    const idx = i * 3 + k;
    const name = `${PROJECT_PREFIX[(idx * 7) % PROJECT_PREFIX.length]} ${
      PROJECT_SUFFIX[(idx * 3 + 1) % PROJECT_SUFFIX.length]
    }`;
    return {
      name,
      type: PROJECT_TYPE[(idx + i) % PROJECT_TYPE.length],
      status: PROJECT_STATUS[(idx * 2 + k) % PROJECT_STATUS.length],
    };
  });
}

function buildGallery(projects: DeveloperProject[], hue: number): DeveloperGalleryImage[] {
  // Four luxury "render" tiles: layered gradients tinted around the brand hue,
  // suggesting sky + skyline without shipping any image assets.
  const tints = [0, 18, -22, 40];
  return tints.map((d, k) => {
    const h = (hue + d + 360) % 360;
    return {
      label: projects[k % projects.length].name,
      gradient: `linear-gradient(160deg, hsl(${h} 45% 22%) 0%, hsl(${h} 55% 38%) 52%, hsl(${(h + 24) % 360} 70% 62%) 100%)`,
    };
  });
}

export const DEVELOPERS: Developer[] = NAMES.map((name, i) => {
  const hue = Math.round((i * 137.508) % 360);
  const color = `hsl(${hue}, 55%, 56%)`;
  const location = LOCATIONS[i % LOCATIONS.length];
  const tagline = TAGLINES[i % TAGLINES.length];
  const projects = buildProjects(i);
  const id = slug(name);
  const handle = id.replace(/-/g, "");
  return {
    id,
    name,
    tagline,
    color,
    monogram: monogram(name),
    location,
    description:
      `${name} is an award-winning developer renowned for ${tagline.toLowerCase()} across the UAE. ` +
      `Anchored in ${location}, the studio blends visionary architecture with handcrafted interiors to ` +
      `deliver landmark addresses and sound, long-term investments.`,
    projects,
    gallery: buildGallery(projects, hue),
    contact: `sales@${handle}.ae`,
    phone: `+971 4 ${String(300 + (i * 17) % 700).padStart(3, "0")} ${String(1000 + (i * 137) % 9000)}`,
    website: `www.${handle}.ae`,
  };
});

export const FIRST_DEVELOPER = DEVELOPERS[0];

export function getDeveloper(id: string): Developer {
  return DEVELOPERS.find((d) => d.id === id) ?? FIRST_DEVELOPER;
}
