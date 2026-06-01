export type RepStatus = "available" | "in-meeting" | "offline";

export interface SalesRep {
  id: string;
  name: string;
  avatar: string;
  meetLink: string;
  status: RepStatus;
  manualOverride: boolean;
}

export interface BoothContent {
  images: string[];
  description: string;
  brochureUrl: string;
  videoUrl: string;
  pricing: string;
}

export interface Developer {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  boothNumber: number;
  content: BoothContent;
  reps: [SalesRep, SalesRep];
}

export interface Visitor {
  name: string;
  email: string;
}

export interface WaitlistEntry {
  visitorEmail: string;
  developerId: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  message: string;
  developerId: string;
  timestamp: number;
  read: boolean;
}
