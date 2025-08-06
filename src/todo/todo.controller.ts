import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoDto } from './dto/todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Promise<TodoDto> {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(): Promise<TodoDto[]> {
    return this.todoService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoDto> {
    console.log('called');
    return this.todoService.update(Number(id), updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<TodoDto> {
    return this.todoService.remove(Number(id));
  }
}
