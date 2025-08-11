import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationClientProvider } from "src/client/notification-client.provider";

@Module({
	controllers: [NotificationController],
	providers: [NotificationClientProvider],
})
export class NotificationModule {}
