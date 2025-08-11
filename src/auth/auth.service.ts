import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis'; // Import Redis

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private redisClient: Redis, // Ensure correct token is used
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne(email, pass);
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    // Store the refreshToken in Redis
    await this.redisClient.set(
      `refreshToken:${user.id}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60,
    ); // 7 days expiration

    const storedRefreshToken = await this.redisClient.get(
      `refreshToken:${user.id}`,
    );


    return { accessToken, refreshToken };
  }
}
