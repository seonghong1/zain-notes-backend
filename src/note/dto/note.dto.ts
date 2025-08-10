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

    this.convertedCreatedAt = this.convertToKoreanTime(note.createdAt);
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

  @IsDate()
  convertedCreatedAt: string;

  private convertToKoreanTime(date: Date): string {
    const koreanDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const year = koreanDate.getFullYear();
    const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
    const day = String(koreanDate.getDate()).padStart(2, '0');
    const hours = String(koreanDate.getHours()).padStart(2, '0');
    const minutes = String(koreanDate.getMinutes()).padStart(2, '0');
    const seconds = String(koreanDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
