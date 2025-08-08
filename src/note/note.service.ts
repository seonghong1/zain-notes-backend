import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from './entities/note.entity';
import { NoteDto } from './dto/note.dto';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async findAll(): Promise<NoteDto[]> {
    const notes = await this.noteRepository.find();
    return notes.map((note: Note) => new NoteDto(note));
  }

  async create(noteData: CreateNoteDto): Promise<number> {
    const result = await this.noteRepository.insert(noteData);
    return result.identifiers[0].id; // 삽입된 레코드의 ID 반환
  }
}
