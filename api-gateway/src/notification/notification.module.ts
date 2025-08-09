import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationProvider } from "src/client/notification-client.provider";

@Module({
  controllers: [NotificationController],
  providers: [NotificationProvider],
})
export class NotificationModule {}
