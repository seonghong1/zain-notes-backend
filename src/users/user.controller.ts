import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  createUser(@Body() userData: CreateUserDto): Promise<number> {
    return this.userService.create(userData);
  }

  @Post('/signin')
  login(@Body() userData: LoginUserDto): Promise<LoginUserDto> {
    // 실제로 jwt 토큰 발급 필요
    return this.userService.login(userData);
  }
}
