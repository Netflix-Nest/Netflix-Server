import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("permission")
export class PermissionController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return lastValueFrom(
      this.authClient.send("createPermission", createPermissionDto)
    );
  }

  // @Get()
  // findAll() {
  //   return lastValueFrom(this.authClient.send());
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return lastValueFrom(this.authClient.send());
  // }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return lastValueFrom(
      this.authClient.send("updatePermission", { id, ...updatePermissionDto })
    );
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return lastValueFrom(this.authClient.send());
  // }
}
