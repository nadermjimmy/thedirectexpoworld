import type { Meeting } from "@immersive/shared";

// Same-origin in production (NestJS serves this app); proxied in dev via vite.
const BASE = "";

export async function listMeetings(): Promise<Meeting[]> {
  const res = await fetch(`${BASE}/meetings`);
  if (!res.ok) throw new Error(`Failed to load meetings (${res.status})`);
  return res.json();
}

export async function createMeeting(input: {
  title: string;
  startTime: string;
  attendees: string[];
}): Promise<Meeting> {
  const res = await fetch(`${BASE}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create meeting (${res.status})`);
  return res.json();
}

export async function deleteMeeting(id: string): Promise<void> {
  const res = await fetch(`${BASE}/meetings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete meeting (${res.status})`);
}
