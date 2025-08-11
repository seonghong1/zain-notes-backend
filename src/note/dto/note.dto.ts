import {
  IsString,
  Length,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Note } from '../entities/note.entity';

export class NoteDto {
  constructor(note: Note) {
    this.id = note.id;
    this.title = note.title;
    this.content = note.content;
    this.createdAt = note.createdAt;
    this.updatedAt = note.updatedAt;
  }

  @IsNumber()
  id: number;

  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
