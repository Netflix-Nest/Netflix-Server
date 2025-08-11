import { Module } from "@nestjs/common";
import { AuthClientProvider } from "src/client/auth-client.provider";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./passport/local.strategy";
import { JwtStrategy } from "./passport/jwt.strategy";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { NotificationClientProvider } from "src/client/notification-client.provider";

@Module({
	imports: [ConfigModule],
	controllers: [AuthController],
	providers: [
		AuthClientProvider,
		LocalStrategy,
		JwtStrategy,
		AuthService,
		NotificationClientProvider,
	],
	exports: [],
})
export class AuthModule {}
