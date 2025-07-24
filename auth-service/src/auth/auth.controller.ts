import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IUser, IUserDecorator } from './auth.interfaces';
import { Public, User } from 'src/decorators/customize';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async handleLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = (await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    )) as IUser;

    if (!user) throw new UnauthorizedException();
    return this.authService.login(user, response);
  }

  @Get('account')
  async handleGetAccount(@User() user: IUserDecorator) {
    return this.authService.getAccount(user);
  }

  @Public()
  @Post('register')
  async handleRegister(@Body() dto: RegisterDto) {
    // Call user service
  }

  @Public()
  @Get('refresh')
  async handleRefresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('logout')
  async handleLogout(
    @User() user: IUserDecorator,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }
}
