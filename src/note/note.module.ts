import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), OpenaiModule],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
