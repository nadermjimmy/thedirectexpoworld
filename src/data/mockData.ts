import { Developer, RepStatus } from "@/types";

const REP_AVATARS = [
  "https://api.dicebear.com/9.x/personas/svg?seed=Felix",
  "https://api.dicebear.com/9.x/personas/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/personas/svg?seed=Brian",
  "https://api.dicebear.com/9.x/personas/svg?seed=Sophia",
  "https://api.dicebear.com/9.x/personas/svg?seed=James",
  "https://api.dicebear.com/9.x/personas/svg?seed=Luna",
  "https://api.dicebear.com/9.x/personas/svg?seed=Max",
  "https://api.dicebear.com/9.x/personas/svg?seed=Lily",
  "https://api.dicebear.com/9.x/personas/svg?seed=Oscar",
  "https://api.dicebear.com/9.x/personas/svg?seed=Mia",
];

const DEVELOPER_NAMES = [
  "Emaar Properties",
  "DAMAC Group",
  "Sobha Realty",
  "Nakheel",
  "Meraas",
  "Dubai Properties",
  "Azizi Developments",
  "Danube Properties",
  "Binghatti Developers",
  "Ellington Properties",
  "Omniyat",
  "Select Group",
  "Samana Developers",
  "Tiger Group",
  "Vincitore Realty",
  "Reportage Properties",
  "Bloom Holding",
  "Aldar Properties",
  "Eagle Hills",
  "Arada",
  "Majid Al Futtaim",
  "Meydan Group",
  "ICD Brookfield",
  "RAK Properties",
  "Union Properties",
  "Deyaar Development",
  "Palma Holding",
  "Al Habtoor Group",
  "IRTH Group",
  "Object 1",
];

const TAGLINES = [
  "Redefining luxury living",
  "Building dreams, crafting lifestyles",
  "Where vision meets reality",
  "Elevated waterfront living",
  "Creating destinations",
  "Your life, your way",
  "Affordable luxury for all",
  "Value-driven development",
  "Iconic architecture reimagined",
  "Boutique living, refined",
  "Exceptional by design",
  "Premium urban communities",
  "Smart living solutions",
  "Bold visions, quality homes",
  "Italian-inspired elegance",
  "Global living standards",
  "Sustainable communities",
  "Master-planned excellence",
  "Inspiring destinations",
  "Creating communities with soul",
  "Shaping the future",
  "Racing ahead in luxury",
  "Landmark developments",
  "Northern Emirates premier",
  "Pioneering real estate",
  "Building tomorrow today",
  "Luxury hospitality living",
  "Distinctly remarkable",
  "Innovation in living",
  "Contemporary urban design",
];

const PROJECT_DESCRIPTIONS = [
  "A stunning collection of premium residences featuring panoramic views, world-class amenities, and direct beach access. Each unit is meticulously designed with floor-to-ceiling windows and premium Italian marble finishes.",
  "An exclusive tower offering a blend of comfort and sophistication. Residents enjoy infinity pools, private gardens, a state-of-the-art fitness center, and concierge services.",
  "A master-planned community with lush green landscapes, cycling tracks, retail boulevards, and a vibrant town center. Spacious villas and apartments for families.",
  "Waterfront living at its finest with private marina berths, floating restaurants, and a promenade stretching along the coastline. Premium 2-4 bedroom apartments.",
  "An urban oasis featuring rooftop gardens, smart home technology, co-working spaces, and a curated retail experience at ground level.",
];

const PRICING_OPTIONS = [
  "Starting from AED 1.2M | 1BR from AED 1.2M | 2BR from AED 2.1M | 3BR from AED 3.5M",
  "Starting from AED 850K | Studios from AED 850K | 1BR from AED 1.4M | 2BR from AED 2.3M",
  "Starting from AED 2.5M | 3BR Villas from AED 2.5M | 4BR from AED 4.2M | 5BR from AED 6.8M",
  "Starting from AED 1.8M | 1BR from AED 1.8M | 2BR from AED 3.2M | Penthouses from AED 12M",
  "Starting from AED 650K | Studios from AED 650K | 1BR from AED 980K | 2BR from AED 1.5M",
];

const REP_FIRST_NAMES = [
  "Ahmed", "Sara", "Mohammed", "Fatima", "Omar",
  "Layla", "Hassan", "Noor", "Khalid", "Amina",
  "Youssef", "Dana", "Tariq", "Hana", "Rashid",
  "Mariam", "Ali", "Reem", "Saeed", "Lina",
  "Faisal", "Aisha", "Ibrahim", "Salma", "Hamad",
  "Noura", "Zayed", "Maha", "Sultan", "Dina",
  "Waleed", "Huda", "Nasser", "Jana", "Majed",
  "Rana", "Fahad", "Yasmin", "Sami", "Ghada",
  "Adel", "Lamia", "Badr", "Rania", "Jaber",
  "Sheikha", "Mansour", "Dalal", "Turki", "Asma",
  "Nawaf", "Lubna", "Khaled", "Samira", "Abdulla",
  "Wafa", "Bader", "Hessa", "Mishaal", "Rawda",
];

function getStatus(index: number): RepStatus {
  if (index % 5 === 0) return "in-meeting";
  if (index % 7 === 0) return "offline";
  return "available";
}

export function generateMockDevelopers(): Developer[] {
  return DEVELOPER_NAMES.map((name, i) => ({
    id: `dev-${i + 1}`,
    name,
    logo: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0066ff,0088cc,00aaff,3344ff`,
    tagline: TAGLINES[i],
    boothNumber: i + 1,
    content: {
      images: [
        `https://picsum.photos/seed/dev${i}a/800/500`,
        `https://picsum.photos/seed/dev${i}b/800/500`,
        `https://picsum.photos/seed/dev${i}c/800/500`,
      ],
      description: PROJECT_DESCRIPTIONS[i % PROJECT_DESCRIPTIONS.length],
      brochureUrl: "#",
      videoUrl: "#",
      pricing: PRICING_OPTIONS[i % PRICING_OPTIONS.length],
    },
    reps: [
      {
        id: `rep-${i * 2 + 1}`,
        name: REP_FIRST_NAMES[i * 2],
        avatar: REP_AVATARS[i % REP_AVATARS.length],
        meetLink: `https://meet.google.com/mock-${i * 2 + 1}`,
        status: getStatus(i * 2),
        manualOverride: false,
      },
      {
        id: `rep-${i * 2 + 2}`,
        name: REP_FIRST_NAMES[i * 2 + 1],
        avatar: REP_AVATARS[(i + 1) % REP_AVATARS.length],
        meetLink: `https://meet.google.com/mock-${i * 2 + 2}`,
        status: getStatus(i * 2 + 1),
        manualOverride: false,
      },
    ],
  }));
}
