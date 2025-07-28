import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './notes.entity';
import { NoteService } from './notes.service';
import { NoteController } from './notes.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), RedisModule],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NotesModule {}
