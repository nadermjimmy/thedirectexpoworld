import { describe, it, expect } from "vitest";
import { MeetingSchema } from "@immersive/shared";

describe("Meetings API contract", () => {
  it("validates a meeting with a Google Meet link", () => {
    const meeting = {
      id: "23e9f6c9-2fd2-4ce8-aef9-cc51365de150",
      title: "Team Standup",
      meetLink: "https://meet.google.com/abc-defg-hij",
      startTime: "2026-06-02T15:00:00Z",
      attendees: ["nader@byitcorp.com"],
    };
    const result = MeetingSchema.parse(meeting);
    expect(result.meetLink).toContain("meet.google.com");
    expect(result.attendees).toHaveLength(1);
  });

  it("allows optional endTime", () => {
    const meeting = {
      id: "abc-123",
      title: "Sprint Review",
      meetLink: "https://meet.google.com/xyz-uvwx-rst",
      startTime: "2026-06-02T15:00:00Z",
      endTime: "2026-06-02T16:00:00Z",
      attendees: ["nader@byitcorp.com", "team@byitcorp.com"],
    };
    const result = MeetingSchema.parse(meeting);
    expect(result.endTime).toBe("2026-06-02T16:00:00Z");
    expect(result.attendees).toHaveLength(2);
  });

  it("rejects invalid attendee email", () => {
    const bad = {
      id: "abc-123",
      title: "Bad Meeting",
      meetLink: "https://meet.google.com/abc-defg-hij",
      startTime: "2026-06-02T15:00:00Z",
      attendees: ["not-an-email"],
    };
    expect(() => MeetingSchema.parse(bad)).toThrow();
  });
});
