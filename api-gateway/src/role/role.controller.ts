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
import { CreateRoleDto } from "@netflix-clone/types";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("role")
export class RoleController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return lastValueFrom(this.authClient.send("createRole", createRoleDto));
  }

  // @Get()
  // findAll() {
  //   return this.roleService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roleService.findOne(+id);
  // }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.authClient.send("updateRole", { id, ...updateRoleDto });
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleService.remove(+id);
  // }
}
