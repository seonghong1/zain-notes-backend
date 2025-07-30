import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from './entities/note.entity';
import { NoteDto } from './dto/note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import Redis from 'ioredis';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
  ) {}

  async findAll(): Promise<NoteDto[]> {
    await this.testRedisConnection();
    const notes = await this.noteRepository.find();
    console.log(notes);
    return notes.map((note: Note) => new NoteDto(note));
  }

  async create(noteData: CreateNoteDto): Promise<number> {
    const result = await this.noteRepository.insert(noteData);
    return result.identifiers[0].id; // 삽입된 레코드의 ID 반환
  }

  async testRedisConnection() {
    try {
      await this.redisClient.set('test-key', 'test-value');
      const value = await this.redisClient.get('test-key');
      console.log(`Redis 연결 성공! 값: ${value}`);
    } catch (error) {
      console.error('Redis 연결 실패:', error);
    }
  }
}
