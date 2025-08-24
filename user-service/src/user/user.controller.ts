import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '@netflix-clone/types';
import { UpdateUserDto, UpdateUserTokenDto } from './dto/update-user.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get-user-by-email')
  getUserByEmail(@Payload() email: string) {
    return this.userService.findByEmail(email);
  }

  @MessagePattern('register-user')
  registerUser(@Payload() registerDto: CreateUserDto) {
    return this.userService.registerUser(registerDto);
  }

  @MessagePattern('update-user-token')
  updateUserToken(@Payload() payload: UpdateUserTokenDto) {
    return this.userService.updateUserToken(
      payload.refreshToken,
      payload.userId,
    );
  }

  @MessagePattern('find-user-by-ids')
  findByIds(@Payload() ids: number[]) {
    return this.userService.findByIds(ids);
  }

  @EventPattern('remove-token')
  removeToken(@Payload() id: number) {
    return this.userService.removeToken(id);
  }

  @MessagePattern('get-user-by-token')
  getUserByToken(@Payload() refreshToken: string) {
    return this.userService.getUserByToken(refreshToken);
  }

  @MessagePattern('find-users')
  findAll(
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
  findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('update-user')
  update(
    @Payload()
    { id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto },
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @MessagePattern('delete-user')
  delete(@Payload() id: number) {
    return this.userService.remove(id);
  }

  @MessagePattern('search-username')
  searchUsername(@Payload() username: string) {
    return this.userService.searchUsername(username);
  }
}
