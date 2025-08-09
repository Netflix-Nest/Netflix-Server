import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("notification")
export class NotificationController {
  constructor(
    @Inject("NOTIFICATION_SERVICE")
    private readonly notificationClient: ClientProxy
  ) {}
  @Post("welcome")
  welcome(@Body() { email, name }: { email: string; name: string }) {
    return this.notificationClient.send("send-welcome", { email, name });
  }
}
