import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser, IUserDecorator, TokenType } from './auth.interfaces';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('validate-user')
  validateUser(@Payload() { email, password }) {
    return this.authService.validateUser(email, password);
  }

  @MessagePattern('auth-login')
  handleLogin(@Payload() user: IUser) {
    return this.authService.login(user);
  }

  @MessagePattern('get-account')
  getAccount(@Payload() user: IUserDecorator) {
    return this.authService.getAccount(user);
  }

  @MessagePattern('auth-refresh')
  refresh(@Payload() refreshToken: string) {
    return this.authService.processNewToken(refreshToken);
  }

  @EventPattern('logout')
  logout(@Payload() user: IUserDecorator) {
    return this.authService.logout(user);
  }

  @MessagePattern('verify-account')
  verifyAccount(@Payload() id: number) {
    return this.authService.genAuthToken(id, TokenType.VERIFY_ACCOUNT);
  }

  @MessagePattern('active-account')
  ativeAccount(@Payload() token: string) {
    return this.authService.activeAccount(token);
  }

  @MessagePattern('gen-token-reset-pass')
  genTokenResetPass(@Payload() id: number) {
    return this.authService.genAuthToken(id, TokenType.RESET_PASSWORD);
  }

  @MessagePattern('reset-password')
  resetPassword(
    @Payload()
    { token, password }: { token: string; password: string },
  ) {
    return this.authService.resetPassword(token, password);
  }
}
