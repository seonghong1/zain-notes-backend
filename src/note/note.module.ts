import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), RedisModule],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
