import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class UpdateTodoDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  content: string;

  @IsBoolean()
  isDone: boolean;

  @IsBoolean()
  isDeleted: boolean;
}
