export class UserDto {
  id: number;
  nickname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  constructor(user: Partial<UserDto>) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.isDeleted = user.isDeleted;
  }
}
