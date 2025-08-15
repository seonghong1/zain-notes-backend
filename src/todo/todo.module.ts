import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), OpenaiModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
