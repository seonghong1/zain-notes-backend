import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigModule 임포트
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역적으로 사용 가능하게 설정
      envFilePath: '.env', // .env 파일 경로 지정 (기본값)
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule을 가져옵니다.
      inject: [ConfigService], // ConfigService를 주입합니다.
      useFactory: (configService: ConfigService) => ({
        // useFactory로 비동기 설정
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: true, // 개발 환경에서만 true
        ssl: {
          rejectUnauthorized: false, // 개발 환경용
        },
        entities: [__dirname + '/**/*.entity.{js,ts}'],
      }),
    }),

    UsersModule,
    NotesModule,
    AuthModule,
  ],
})
export class AppModule {}
