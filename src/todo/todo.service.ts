import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TodoDto } from './dto/todo.dto';
import { OpenaiService } from '../openai/openai.service';
import { getUtcStartAndEndDates } from 'src/common/data.util';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private openaiService: OpenaiService,
  ) {}

  async findAll(
    userId: number,
    query: { startDate: string; endDate: string },
  ): Promise<TodoDto[]> {
    const whereCondition: any = {
      isDeleted: false,
      userId,
    };

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    whereCondition.createdAt = Between(startDate, endDate);

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

  async generateTodoSuggestions(
    userId: number,
    context?: string,
  ): Promise<string> {
    // 사용자의 기존 할 일들을 가져와서 컨텍스트로 활용
    const recentTodos = await this.todoRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'desc' },
      take: 5,
    });

    const contextText = context || '일반적인 할 일';
    const recentTodoText =
      recentTodos.length > 0
        ? `최근 할 일들: ${recentTodos.map((t) => t.content).join(', ')}`
        : '';

    const fullContext = `${contextText}. ${recentTodoText}`;

    return this.openaiService.generateTodoSuggestion(fullContext);
  }
}
