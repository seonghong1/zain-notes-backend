import { Controller, Get } from '@nestjs/common';
import { NoteService } from './notes.service';
import { Note } from './notes.entity';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  getTest(): Promise<Note[]> {
    return this.noteService.findAll();
  }
}

// import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
// import { NotesService } from './notes.service';
// import { Note } from './note.entity';

// @Controller('notes') // 👈 이 prefix가 API URL에 반영됨
// export class NotesController {
//   constructor(private readonly notesService: NotesService) {}

//   @Get()
//   findAll(): Promise<Note[]> {
//     return this.notesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.notesService.findOne(Number(id));
//   }

//   @Post()
//   create(@Body() noteData: Partial<Note>) {
//     return this.notesService.create(noteData);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: string) {
//     return this.notesService.delete(Number(id));
//   }
// }
