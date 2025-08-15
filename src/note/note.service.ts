import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Note } from './entities/note.entity';
import { NoteDto } from './dto/note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private openaiService: OpenaiService,
  ) {}

  async findAll(
    userId: number,
    query: { startDate: string; endDate: string },
  ): Promise<NoteDto[]> {
    // 서버 환경 정보 체크
    console.log('=== Server Environment Check ===');
    console.log('Server timezone offset:', new Date().getTimezoneOffset());
    console.log('Server current time:', new Date().toString());
    console.log('Server current time ISO:', new Date().toISOString());
    console.log(
      'Server timezone:',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    console.log('Node.js version:', process.version);
    console.log('Platform:', process.platform);
    console.log('================================');

    const whereCondition: any = {
      isDeleted: false,
      userId,
    };

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    console.log('startDate : ', startDate, 'endDate : ', endDate);

    whereCondition.createdAt = Between(startDate, endDate);

    const notes = await this.noteRepository.find({
      where: whereCondition,
      order: { id: 'desc' },
    });

    // DB 쿼리 결과 체크
    console.log('=== Database Query Result ===');
    console.log('Query result count:', notes.length);
    if (notes.length > 0) {
      console.log('First note createdAt:', notes[0].createdAt);
      console.log(
        'First note createdAt ISO:',
        notes[0].createdAt.toISOString(),
      );
      console.log(
        'First note createdAt toString:',
        notes[0].createdAt.toString(),
      );
    }
    console.log('=============================');

    return notes.map((note: Note) => new NoteDto(note));
  }

  async findById(userId: number, id: number): Promise<NoteDto> {
    const note = await this.noteRepository.findOne({ where: { id, userId } });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return new NoteDto(note);
  }

  async create(noteData: CreateNoteDto, userId: number): Promise<NoteDto> {
    const data = {
      userId,
      title: noteData.title,
      content: noteData.content,
    };

    const note = this.noteRepository.create(data);
    const result = await this.noteRepository.save(note);
    console.log('result : ', result);
    return new NoteDto(result);
  }

  async update(
    id: number,
    noteData: UpdateNoteDto,
    userId: number,
  ): Promise<NoteDto> {
    const note = await this.noteRepository.findOne({ where: { id, userId } });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    note.title = noteData.title;
    note.content = noteData.content;

    const result = await this.noteRepository.save(note);
    return new NoteDto(result);
  }

  async delete(id: number, userId: number): Promise<number> {
    const note = await this.noteRepository.findOne({ where: { id, userId } });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    await this.noteRepository.softDelete(id);
    return id;
  }

  async summarizeAndOrganizeNote(id: number, userId: number): Promise<string> {
    const note = await this.noteRepository.findOne({ where: { id, userId } });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.openaiService.summarizeAndOrganizeNote(note.content);
  }
}
