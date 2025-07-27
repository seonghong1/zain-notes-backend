import { IsString, Length, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;
}
