import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

import { Note } from './entities/note.entity';
import { NoteDto } from './dto/note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async findAll(userId: number, query?: { date?: string }): Promise<NoteDto[]> {
    const whereCondition: any = {
      isDeleted: false,
      userId,
    };

    if (query?.date) {
      const startDate = new Date(query.date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(query.date);
      endDate.setHours(23, 59, 59, 999);

      whereCondition.createdAt = Raw(
        (alias) =>
          `${alias} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' BETWEEN :startDate AND :endDate`,
        { startDate, endDate },
      );
    }

    const notes = await this.noteRepository.find({
      where: whereCondition,
      order: { id: 'desc' },
    });

    return notes.map((note: Note) => new NoteDto(note));
  }

  async findById(userId: number, id: number): Promise<NoteDto> {
    console.log(id);
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
}
