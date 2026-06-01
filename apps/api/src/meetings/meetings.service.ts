import { Injectable } from "@nestjs/common";
import { CreateMeetingDto } from "./meetings.dto";

export interface Meeting {
  id: string;
  title: string;
  meetLink: string;
  startTime: string;
  endTime?: string;
  attendees: string[];
}

@Injectable()
export class MeetingsService {
  private meetings = new Map<string, Meeting>();

  async create(dto: CreateMeetingDto): Promise<Meeting> {
    const id = crypto.randomUUID();
    const meeting: Meeting = {
      id,
      title: dto.title,
      meetLink: `https://meet.google.com/${id.slice(0, 3)}-${id.slice(3, 7)}-${id.slice(7, 10)}`,
      startTime: dto.startTime,
      endTime: dto.endTime,
      attendees: dto.attendees,
    };
    this.meetings.set(id, meeting);
    return meeting;
  }

  async findAll(): Promise<Meeting[]> {
    return Array.from(this.meetings.values());
  }

  async findOne(id: string): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }

  async remove(id: string): Promise<boolean> {
    return this.meetings.delete(id);
  }
}
