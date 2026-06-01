import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { MeetingsModule } from "./meetings/meetings.module";

@Module({
  imports: [
    MeetingsModule,
    // Serve the built immersive web app (apps/web/dist) as static files.
    // Resolved from repo root so it works locally and on Railway.
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "apps", "web", "dist"),
      exclude: ["/meetings{*path}", "/health"],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
