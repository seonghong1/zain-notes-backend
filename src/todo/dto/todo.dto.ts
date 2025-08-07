import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Todo } from '../entities/todo.entity';

export class TodoDto {
  constructor(todo: Todo) {
    this.id = todo.id;
    this.userId = todo.userId;
    this.content = todo.content;
    this.isDone = todo.isDone;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
    this.deletedAt = todo.deletedAt;
    this.isDeleted = todo.isDeleted;
  }

  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  isDone: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  deletedAt: Date;

  @IsBoolean()
  isDeleted: boolean;
}
