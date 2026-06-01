import { z } from "zod";

export const MeetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  meetLink: z.string().url(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  attendees: z.array(z.string().email()),
});

export type Meeting = z.infer<typeof MeetingSchema>;
