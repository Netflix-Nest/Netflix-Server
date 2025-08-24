import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Res,
  UnauthorizedException,
  Req,
  Param,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { LoginDto } from "@netflix-clone/types";
import { AuthService } from "./auth.service";
import { Public, User } from "src/common/decorators/customize";
import { IUser, IUserDecorator } from "src/interfaces/auth.interfaces";
import { Request, Response } from "express";
import { lastValueFrom } from "rxjs";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authClient: ClientProxy,
    private authService: AuthService
  ) {}

  @Public()
  @Post("login")
  async handleLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = (await lastValueFrom(
      this.authClient.send("validate-user", {
        email: loginDto.email,
        password: loginDto.password,
      })
    )) as IUser;

    if (!user) throw new UnauthorizedException();
    return this.authService.login(user, response);
  }

  @Get("account")
  async handleGetAccount(@User() user: IUserDecorator) {
    return lastValueFrom(this.authClient.send("get-account", user));
  }

  @Public()
  @Get("refresh")
  async handleRefresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies["refresh_token"];
    return this.authService.refresh(refreshToken, response);
  }

  @Post("logout")
  async handleLogout(
    @User() user: IUserDecorator,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logout(user, response);
  }

  @Get("permissions")
  getPermissions(role: string) {
    return lastValueFrom(this.authClient.send("findOneRole", role));
  }

  @Public()
  @Post("verify-account/:id")
  verifyAccount(@Param("id") id: number) {
    return this.authService.verifyAccount(id);
  }

  @Public()
  @Get("active-account")
  activeAccount(@Query("token") token: string) {
    console.log(token);
    return lastValueFrom(this.authClient.send("active-account", token));
  }

  @Public()
  @Post("reset-password/:id")
  resetPasswordReq(@Param("id") id: number) {
    return this.authService.resetPasswordReq(id);
  }

  @Public()
  @Post("reset-password")
  resetPassword(
    @Body()
    {
      token,
      password,
      confirmPassword,
    }: {
      token: string;
      password: string;
      confirmPassword: string;
    }
  ) {
    if (password !== confirmPassword) {
      throw new BadRequestException("Password is not match !");
    }
    return lastValueFrom(
      this.authClient.send("reset-password", {
        token,
        password,
      })
    );
  }
}
