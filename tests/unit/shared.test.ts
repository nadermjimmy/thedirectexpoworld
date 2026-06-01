import { describe, it, expect } from "vitest";
import { MeetingSchema } from "@immersive/shared";

describe("MeetingSchema", () => {
  it("validates a correct meeting object", () => {
    const meeting = {
      id: "abc-123",
      title: "Standup",
      meetLink: "https://meet.google.com/abc-defg-hij",
      startTime: "2026-06-01T15:00:00Z",
      attendees: ["alice@example.com"],
    };
    expect(MeetingSchema.parse(meeting)).toEqual(meeting);
  });

  it("rejects an invalid meeting link", () => {
    const bad = {
      id: "abc-123",
      title: "Standup",
      meetLink: "not-a-url",
      startTime: "2026-06-01T15:00:00Z",
      attendees: [],
    };
    expect(() => MeetingSchema.parse(bad)).toThrow();
  });
});
