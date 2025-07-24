import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compare } from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async validateUser(email: string, pass: string) {
    console.log('>>> validate');
    const user = await lastValueFrom(
      this.userClient.send('get-user-by-email', email),
    );
    console.log('>>> call success:', user);
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
