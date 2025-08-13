import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from './dto/user.dtd';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signin')
  login(@Body() userData: LoginUserDto): Promise<LoginUserDto> {
    // 실제로 jwt 토큰 발급 필요
    return this.userService.login(userData);
  }

  @Post('/signup')
  signup(@Body() userData: CreateUserDto): Promise<UserDto> {
    return this.userService.create(userData);
  }
}
