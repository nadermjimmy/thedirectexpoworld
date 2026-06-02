import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
} from "@nestjs/common";
import { MeetingsService } from "./meetings.service";
import { CreateMeetingDto } from "./meetings.dto";

@Controller("meetings")
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  create(@Body() dto: CreateMeetingDto) {
    return this.meetingsService.create(dto);
  }

  @Get()
  findAll() {
    return this.meetingsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const meeting = await this.meetingsService.findOne(id);
    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }
    return meeting;
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const deleted = await this.meetingsService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }
    return { deleted: true };
  }
}
