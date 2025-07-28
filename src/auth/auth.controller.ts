import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      body.email,
      body.password,
    );

    // Set-Cookie 헤더에 토큰 설정
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    }); // 15분
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7일

    res.send({ message: 'Login successful' });
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
