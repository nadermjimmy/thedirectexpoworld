import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MeetingsModule } from "./meetings/meetings.module";

@Module({
  imports: [MeetingsModule],
  controllers: [AppController],
})
export class AppModule {}
