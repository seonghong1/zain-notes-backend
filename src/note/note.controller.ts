import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteDto } from './dto/note.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from 'src/auth/user.decorator';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  findAll(
    @User('sub') userId: number,
    @Query('date') date?: string,
  ): Promise<NoteDto[]> {
    const notes = this.noteService.findAll(userId, { date });
    return notes;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findById(
    @User('sub') userId: number,
    @Param('id') id: number,
  ): Promise<NoteDto> {
    return this.noteService.findById(userId, id);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  create(
    @Body() noteData: CreateNoteDto,
    @User('sub') userId: number,
  ): Promise<NoteDto> {
    return this.noteService.create(noteData, userId);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: number,
    @Body() noteData: UpdateNoteDto,
    @User('sub') userId: number,
  ): Promise<NoteDto> {
    return this.noteService.update(id, noteData, userId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  delete(
    @Param('id') id: number,
    @User('sub') userId: number,
  ): Promise<number> {
    return this.noteService.delete(id, userId);
  }
}
