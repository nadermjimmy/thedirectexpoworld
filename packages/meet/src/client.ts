import type { Meeting } from "@immersive/shared";

export interface MeetConfig {
  composioApiKey?: string;
  apiBaseUrl?: string;
}

export class MeetClient {
  private apiBaseUrl: string;
  private headers: Record<string, string>;

  constructor(config: MeetConfig = {}) {
    this.apiBaseUrl =
      config.apiBaseUrl ?? process.env.MEET_API_URL ?? "http://localhost:3001";
    this.headers = {
      "Content-Type": "application/json",
    };
    if (config.composioApiKey ?? process.env.COMPOSIO_API_KEY) {
      this.headers["X-API-Key"] =
        config.composioApiKey ?? process.env.COMPOSIO_API_KEY!;
    }
  }

  async createMeeting(params: {
    title: string;
    startTime: string;
    endTime?: string;
    attendees: string[];
  }): Promise<Meeting> {
    const res = await fetch(`${this.apiBaseUrl}/meetings`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`Create meeting failed: ${res.status} ${await res.text()}`);
    }
    return res.json() as Promise<Meeting>;
  }

  async listMeetings(): Promise<Meeting[]> {
    const res = await fetch(`${this.apiBaseUrl}/meetings`, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error(`List meetings failed: ${res.status} ${await res.text()}`);
    }
    return res.json() as Promise<Meeting[]>;
  }

  async getMeeting(id: string): Promise<Meeting> {
    const res = await fetch(`${this.apiBaseUrl}/meetings/${encodeURIComponent(id)}`, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error(`Get meeting failed: ${res.status} ${await res.text()}`);
    }
    return res.json() as Promise<Meeting>;
  }

  async deleteMeeting(id: string): Promise<void> {
    const res = await fetch(`${this.apiBaseUrl}/meetings/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error(`Delete meeting failed: ${res.status} ${await res.text()}`);
    }
  }
}
