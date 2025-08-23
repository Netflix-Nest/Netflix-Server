import { Module } from "@nestjs/common";
import { PermissionController } from "./permission.controller";
import { AuthClientProvider } from "src/client/auth-client.provider";

@Module({
  controllers: [PermissionController],
  providers: [AuthClientProvider],
})
export class PermissionModule {}
