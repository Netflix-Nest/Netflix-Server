import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserTokenDto } from './dto/update-user.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterUser } from './user.interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get-user-by-email')
  async getUserByEmail(@Payload() email: string) {
    return this.userService.findByEmail(email);
  }

  @MessagePattern('register-user')
  async registerUser(@Payload() registerDto: CreateUserDto) {
    return this.userService.registerUser(registerDto);
  }

  @MessagePattern('update-user-token')
  async updateUserToken(@Payload() payload: UpdateUserTokenDto) {
    return this.userService.updateUserToken(
      payload.refreshToken,
      payload.userId,
    );
  }

  @EventPattern('remove-token')
  async removeToken(@Payload() id: number) {
    return this.userService.removeToken(id);
  }

  @MessagePattern('get-user-by-token')
  async getUserByToken(@Payload() refreshToken: string) {
    return this.userService.getUserByToken(refreshToken);
  }

  @MessagePattern('find-users')
  async findAll(
    @Payload()
    {
      currentPage,
      limit,
      qs,
    }: {
      currentPage: number;
      limit: number;
      qs: string;
    },
  ) {
    return this.userService.findAll(currentPage, limit, qs);
  }

  @MessagePattern('find-user')
  async findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('update-user')
  async update(
    @Payload()
    { id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto },
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @MessagePattern('delete-user')
  async delete(@Payload() id: number) {
    return this.userService.remove(id);
  }
}
