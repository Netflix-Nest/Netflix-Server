import { Module } from "@nestjs/common";
import { AuthClientProvider } from "src/client/auth-client.provider";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./passport/local.strategy";
import { JwtStrategy } from "./passport/jwt.strategy";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthClientProvider, LocalStrategy, JwtStrategy, AuthService],
  exports: [],
})
export class AuthModule {}
