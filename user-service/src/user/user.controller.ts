import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
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
  async registerUser(@Payload() registerDto: RegisterUser) {
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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() qs: string,
  ) {
    return this.userService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
