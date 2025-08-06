import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<TodoDto[]> {
    const todos = await this.todoRepository.find({
      where: { isDeleted: false },
      order: { id: 'asc' },
    });
    return todos.map((todo) => new TodoDto(todo));
  }

  async create(createTodoDto: CreateTodoDto): Promise<TodoDto> {
    const todo = this.todoRepository.create(createTodoDto);
    const savedTodo = await this.todoRepository.save(todo);

    return new TodoDto(savedTodo);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoDto> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.content = updateTodoDto.content;
    todo.isDone = updateTodoDto.isDone;

    const updatedTodo = await this.todoRepository.save(todo);
    console.log(updatedTodo);

    return new TodoDto(updatedTodo);
  }

  async remove(id: number): Promise<TodoDto> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.isDeleted = true;
    todo.deletedAt = new Date();

    const updatedTodo = await this.todoRepository.save(todo);

    return new TodoDto(updatedTodo);
  }
}
