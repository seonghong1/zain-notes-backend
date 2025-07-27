import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { RefreshStrategy } from './strategies/refresh.strategy';
// import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' }, // AccessToken
    }),
  ],
  //   providers: [AuthService, JwtStrategy, RefreshStrategy],
  //   controllers: [AuthController],
})
export class AuthModule {}
