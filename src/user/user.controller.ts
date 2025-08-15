import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dtd';
import { Public } from 'src/auth/constants';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup')
  signup(@Body() userData: CreateUserDto): Promise<UserDto> {
    return this.userService.create(userData);
  }
}
