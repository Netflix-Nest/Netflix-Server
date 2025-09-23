import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ChangePassDto, CreateUserDto } from "@netflix-clone/types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "src/common/decorators/customize";
import { lastValueFrom } from "rxjs";
import { CacheInterceptor } from "src/common/interceptors/cache.interceptor";

@Controller("user")
export class UserController {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy
  ) {}

  @Public()
  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return lastValueFrom(this.userClient.send("register-user", createUserDto));
  }

  @Get("search")
  searchUsername(@Query("u") username: string) {
    if (!username || username.trim().length === 0) {
      return [];
    }
    return lastValueFrom(this.userClient.send("search-username", username));
  }

  @Get()
  findAll(
    @Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string
  ) {
    if (!currentPage) currentPage = 1;
    if (!limit) limit = 5;
    return lastValueFrom(
      this.userClient.send("find-users", { currentPage, limit, qs })
    );
  }

  @Get(":id")
  @UseInterceptors(CacheInterceptor)
  findOne(@Param("id") id: number) {
    return lastValueFrom(this.userClient.send("find-user", id));
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return lastValueFrom(
      this.userClient.send("update-user", { id, updateUserDto })
    );
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return lastValueFrom(this.userClient.send("delete-user", id));
  }

  @Patch("change-pass/:id")
  changePass(@Param("id") id: number, @Body() changePassDto: ChangePassDto) {
    return lastValueFrom(
      this.userClient.send("change-pass", { changePassDto, id })
    );
  }
}
