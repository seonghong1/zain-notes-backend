import { IsString, Length, IsOptional, IsNumber } from 'class-validator';

export class UpdateNoteDto {
  @IsNumber()
  id: number;

  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;
}
