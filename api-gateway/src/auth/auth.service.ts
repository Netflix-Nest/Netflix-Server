import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { Response } from "express";
import ms, { StringValue } from "ms";
import { lastValueFrom } from "rxjs";
import { ILogin, IUser, IUserDecorator } from "src/interfaces/auth.interfaces";

@Injectable()
export class AuthService {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authClient: ClientProxy,
    private configService: ConfigService
  ) {}

  async login(user: IUser, response: Response) {
    const data = (await lastValueFrom(
      this.authClient.send("auth-login", user)
    )) as ILogin;
    response.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      maxAge: ms(
        this.configService.get<StringValue>("JWT_REFRESH_EXPIRE") ?? "1d"
      ),
    });
    return data;
  }

  async refresh(refreshToken: string, response: Response) {
    const data = (await lastValueFrom(
      this.authClient.send("auth-refresh", refreshToken)
    )) as ILogin;
    response.clearCookie("refresh_token");
    response.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      maxAge: ms(
        this.configService.get<StringValue>("JWT_REFRESH_EXPIRE") ?? "1d"
      ),
    });
    return data;
  }

  async logout(user: IUserDecorator, response: Response) {
    this.authClient.emit("logout", user);
    response.clearCookie("refresh_token");
    return "ok";
  }
}
