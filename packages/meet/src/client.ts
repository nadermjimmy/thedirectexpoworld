import type { Meeting } from "@immersive/shared";

export class MeetClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createMeeting(title: string, attendees: string[]): Promise<Meeting> {
    const res = await fetch(`${this.baseUrl}/meetings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, attendees }),
    });
    return res.json() as Promise<Meeting>;
  }

  async listMeetings(): Promise<Meeting[]> {
    const res = await fetch(`${this.baseUrl}/meetings`);
    return res.json() as Promise<Meeting[]>;
  }
}
