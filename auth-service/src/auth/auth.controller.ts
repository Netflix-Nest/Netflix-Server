import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser, IUserDecorator } from './auth.interfaces';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('validate-user')
  async validateUser(@Payload() { email, password }) {
    return this.authService.validateUser(email, password);
  }

  @MessagePattern('auth-login')
  async handleLogin(@Payload() user: IUser) {
    return this.authService.login(user);
  }

  @MessagePattern('get-account')
  async getAccount(@Payload() user: IUserDecorator) {
    return this.authService.getAccount(user);
  }

  @MessagePattern('auth-refresh')
  async refresh(@Payload() refreshToken: string) {
    return this.authService.processNewToken(refreshToken);
  }

  @EventPattern('logout')
  async logout(@Payload() user: IUserDecorator) {
    return this.authService.logout(user);
  }
}
