export class CreateMeetingDto {
  title!: string;
  startTime!: string;
  endTime?: string;
  attendees!: string[];
}
