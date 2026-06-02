import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class AppController {
  @Get()
  health() {
    return { status: "ok", service: "immersive-app", time: new Date().toISOString() };
  }
}
