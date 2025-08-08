import { Body, Controller, Get, Post } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteDto } from './dto/note.dto';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  getNotes(): Promise<NoteDto[]> {
    const notes = this.noteService.findAll();

    return notes;
  }

  @Post('/')
  createNote(@Body() noteData: CreateNoteDto): Promise<number> {
    return this.noteService.create(noteData);
  }
}
