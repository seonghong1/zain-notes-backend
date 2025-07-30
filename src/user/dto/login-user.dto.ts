import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Length(1, 255)
  email: string;

  @IsString()
  @Length(1, 255)
  password: string;
}
