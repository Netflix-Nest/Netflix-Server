import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { AuthClientProvider } from "src/client/auth-client.provider";

@Module({
  controllers: [RoleController],
  providers: [AuthClientProvider],
})
export class RoleModule {}
