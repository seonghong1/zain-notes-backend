import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from './notes.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  findAll(): Promise<Note[]> {
    return this.noteRepository.find();
  }
}
