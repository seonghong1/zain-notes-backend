import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TodoDto } from './dto/todo.dto';
import { getUtcStartAndEndDates } from 'src/common/data.util';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(userId: number, query?: { date?: string }): Promise<TodoDto[]> {
    const whereCondition: any = {
      isDeleted: false,
      userId,
    };

    if (query?.date) {
      const timestamp = Number(query.date);
      const { startDate, endDate } = getUtcStartAndEndDates(timestamp);

      whereCondition.createdAt = Between(startDate, endDate);
    }

    const todos = await this.todoRepository.find({
      where: whereCondition,
      order: { id: 'desc' },
    });

    return todos.map((todo) => new TodoDto(todo));
  }

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<TodoDto> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
    });

    const savedTodo = await this.todoRepository.save(todo);

    return new TodoDto(savedTodo);
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: number,
  ): Promise<TodoDto> {
    const todo = await this.todoRepository.findOne({ where: { id, userId } });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.content = updateTodoDto.content;
    todo.isDone = updateTodoDto.isDone;

    const updatedTodo = await this.todoRepository.save(todo);

    return new TodoDto(updatedTodo);
  }

  async remove(id: number, userId: number): Promise<TodoDto> {
    const todo = await this.todoRepository.findOne({ where: { id, userId } });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.isDeleted = true;
    todo.deletedAt = new Date();

    const updatedTodo = await this.todoRepository.save(todo);

    return new TodoDto(updatedTodo);
  }
}
