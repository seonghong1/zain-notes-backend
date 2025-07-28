import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signin')
  login(@Body() userData: LoginUserDto): Promise<LoginUserDto> {
    // 실제로 jwt 토큰 발급 필요
    return this.userService.login(userData);
  }
}
