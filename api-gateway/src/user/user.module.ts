import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserClientProvider } from "src/client/user-client.provider";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UserClientProvider, UserService],
  exports: [],
})
export class UserModule {}
